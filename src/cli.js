/**
 * CLI interface for the Ticket Queue System
 */
import { TicketQueue } from './core/TicketQueue.js';

class TicketQueueCLI {
  constructor() {
    // Initialize with only 2 seats for demo
    this.queue = new TicketQueue(2);
  }

  /**
   * Display menu and handle user input
   */
  async start() {
    console.log('\n🏟️  Welcome to Live Match Ticket Queue System 🏟️\n');
    console.log('This demo shows a queue with only 2 seats available.\n');

    // Demo: Add users to the queue
    console.log('Step 1: Adding users to the queue...\n');

    this.queue.join('Alice');
    this.queue.join('Bob');
    this.queue.join('Charlie');

    console.log('---\n');

    // Alice completes booking
    console.log('Step 2: Alice completes their booking...\n');
    this.queue.completeBooking(1);

    console.log('---\n');

    // Bob completes booking (last seat)
    console.log('Step 3: Bob completes their booking (last seat)...\n');
    this.queue.completeBooking(2);

    console.log('---\n');

    // Try to add more users after sold out
    console.log('Step 4: Trying to add more users after sold out...\n');
    this.queue.join('David');
    this.queue.join('Eve');
  }
}

// Run the CLI if this file is executed directly
const cli = new TicketQueueCLI();
cli.start();
