/**
 * TicketQueue - Core FIFO queue for managing ticket booking access
 * Maintains users in memory and grants booking windows when users reach the front
 */
import { BookingWindow } from '../models/BookingWindow.js';
import { User } from '../models/User.js';

export class TicketQueue {
  constructor(totalSeats = Infinity, bookingExpiryMs = 10000) {
    this.queue = []; // Array of User objects
    this.activeWindows = new Map(); // userId -> BookingWindow
    this.userIdCounter = 1;
    this.totalSeats = totalSeats;
    this.availableSeats = totalSeats;
    this.isSoldOut = false;
    this.bookingExpiryMs = bookingExpiryMs;
  }

  /**
   * Add a user to the end of the queue
   * @param {string} userName - Name of the user joining
   * @returns {User|null} The created user object or null if sold out
   */
  join(userName) {
    if (this.isSoldOut) {
      console.log(`❌ Sorry ${userName}, tickets are sold out!`);
      return null;
    }

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
    if (this.queue.length === 0 || this.isSoldOut) return;

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
    const window = new BookingWindow(user, this.bookingExpiryMs, (expiredUser) => {
      this._handleBookingExpiry(expiredUser);
    });
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

    // Reduce available seats (ensure it doesn't go below 0)
    this.availableSeats = Math.max(0, this.availableSeats - 1);

    // Remove user from queue
    const index = this.queue.findIndex(u => u.id === userId);
    if (index !== -1) {
      const user = this.queue.splice(index, 1)[0];
      console.log(`✅ ${user.name} completed their booking.`);
    }

    // Check if sold out
    if (this.availableSeats <= 0) {
      this._handleSoldOut();
      return;
    }

    this.printQueueState();
    // Check if next user should get booking window
    this._checkFrontOfQueue();
  }

  /**
   * Handle sold out scenario - close all active windows and notify waiting users
   * @private
   */
  _handleSoldOut() {
    this.isSoldOut = true;
    this.availableSeats = 0;

    // Close all active booking windows first
    for (const [userId, window] of this.activeWindows) {
      window.user.status = 'expired';
      console.log(`❌ Booking window closed for ${window.user.name} - tickets sold out`);
    }
    this.activeWindows.clear();

    // Mark all waiting users as expired
    for (const user of this.queue) {
      if (user.status === 'waiting') {
        user.status = 'expired';
      }
    }

    console.log('\n🚫 TICKETS SOLD OUT! 🚫');
    console.log('No more seats available. All pending bookings have been cancelled.\n');

    this.printQueueState();
  }

  /**
   * Handle booking window expiry
   * @private
   */
  _handleBookingExpiry(expiredUser) {
    if (this.isSoldOut) return;

    const window = this.activeWindows.get(expiredUser.id);
    if (!window) return;

    this.activeWindows.delete(expiredUser.id);

    const index = this.queue.findIndex(u => u.id === expiredUser.id);
    if (index !== -1) {
      const user = this.queue.splice(index, 1)[0];
      user.status = 'expired';
      console.log(`⏳ Booking window expired for ${user.name}. Removing from queue.`);
    }

    this.printQueueState();
    this._checkFrontOfQueue();
  }

  /**
   * Print current queue state
   */
  printQueueState() {
    console.log('\n📊 Current Queue State:');
    console.log('='.repeat(50));

    if (this.isSoldOut) {
      console.log('🚫 SOLD OUT - No more tickets available');
    } else {
      console.log(`🎟️  Available Seats: ${this.availableSeats}/${this.totalSeats}`);
    }

    if (this.queue.length === 0) {
      console.log('\nQueue is empty');
    } else {
      console.log('\nQueue:');
      this.queue.forEach((user, index) => {
        const position = index + 1;
        let status;
        if (user.status === 'in_booking') status = '🎫 BOOKING';
        else if (user.status === 'expired') status = '❌ EXPIRED';
        else status = '⏳ WAITING';
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
