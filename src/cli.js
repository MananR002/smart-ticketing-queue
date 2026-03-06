/**
 * CLI interface for the Ticket Queue System
 */
import { TicketQueue } from './core/TicketQueue.js';

class TicketQueueCLI {
  constructor() {
    // Initialize with 3 seats and 10-second booking expiry window
    this.queue = new TicketQueue(3, 10000);
  }

  /**
   * Display menu and handle user input
   */
  async start() {
    console.log('\n🏟️  Welcome to Live Match Ticket Queue System 🏟️\n');
    console.log('This demo shows a 10-second booking window expiry.\n');

    // Demo: Add users to the queue
    console.log('Step 1: Adding users to the queue...\n');

    this.queue.join('Alice');
    this.queue.join('Bob');
    this.queue.join('Charlie');

    console.log('---\n');

    // Alice completes booking quickly
    console.log('Step 2: Alice completes their booking...\n');
    this.queue.completeBooking(1);

    console.log('---\n');

    // Wait to let Bob's booking window expire
    console.log('Step 3: Waiting for Bob\'s booking window to expire...\n');
    await new Promise(resolve => setTimeout(resolve, 12000));

    console.log('---\n');

    // Charlie should now have the booking window
    console.log('Step 4: Charlie completes their booking...\n');
    this.queue.completeBooking(3);

    console.log('---\n');

    // Add more users
    console.log('Step 5: Adding more users...\n');
    this.queue.join('David');
    this.queue.join('Eve');
  }
}

// Run the CLI if this file is executed directly
const cli = new TicketQueueCLI();
cli.start();
