/**
 * TicketQueue - Core FIFO queue for managing ticket booking access
 * Maintains users in memory and grants booking windows when users reach the front
 */
import { BookingWindow } from '../models/BookingWindow.js';
import { User } from '../models/User.js';

export class TicketQueue {
  constructor() {
    this.queue = []; // Array of User objects
    this.activeWindows = new Map(); // userId -> BookingWindow
    this.userIdCounter = 1;
  }

  /**
   * Add a user to the end of the queue
   * @param {string} userName - Name of the user joining
   * @returns {User} The created user object
   */
  join(userName) {
    const user = new User(this.userIdCounter++, userName);
    this.queue.push(user);
    console.log(`✅ ${userName} joined the queue.`);
    this.printQueueState();
    this._checkFrontOfQueue();
    return user;
  }

  /**
   * Grant booking window to user at front of queue if not already granted
   * @private
   */
  _checkFrontOfQueue() {
    if (this.queue.length === 0) return;

    const frontUser = this.queue[0];
    if (frontUser.status === 'waiting' && !this.activeWindows.has(frontUser.id)) {
      this._grantBookingWindow(frontUser);
    }
  }

  /**
   * Grant a booking window to a user
   * @private
   */
  _grantBookingWindow(user) {
    user.status = 'in_booking';
    const window = new BookingWindow(user);
    this.activeWindows.set(user.id, window);
    console.log(`🎫 Booking window granted to ${user.name}!`);
  }

  /**
   * Complete booking and remove user from queue
   * @param {number} userId - ID of the user completing their booking
   */
  completeBooking(userId) {
    const window = this.activeWindows.get(userId);
    if (!window) {
      console.log(`⚠️ No active booking window found for user ${userId}`);
      return;
    }

    window.close();
    this.activeWindows.delete(userId);

    // Remove user from queue
    const index = this.queue.findIndex(u => u.id === userId);
    if (index !== -1) {
      const user = this.queue.splice(index, 1)[0];
      console.log(`✅ ${user.name} completed their booking.`);
    }

    this.printQueueState();
    // Check if next user should get booking window
    this._checkFrontOfQueue();
  }

  /**
   * Print current queue state
   */
  printQueueState() {
    console.log('\n📊 Current Queue State:');
    console.log('='.repeat(50));

    if (this.queue.length === 0) {
      console.log('Queue is empty');
    } else {
      this.queue.forEach((user, index) => {
        const position = index + 1;
        const status = user.status === 'in_booking' ? '🎫 BOOKING' : '⏳ WAITING';
        console.log(`  ${position}. ${user.name} [${status}]`);
      });
    }

    console.log(`\nTotal in queue: ${this.queue.length}`);
    console.log(`Active booking windows: ${this.activeWindows.size}`);
    console.log('='.repeat(50) + '\n');
  }

  /**
   * Get current queue size
   */
  get size() {
    return this.queue.length;
  }

  /**
   * Check if queue is empty
   */
  get isEmpty() {
    return this.queue.length === 0;
  }
}
