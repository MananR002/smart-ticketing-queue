/**
 * CLI interface for the Ticket Queue System
 */
import { TicketQueue } from './core/TicketQueue.js';

class TicketQueueCLI {
  constructor() {
    this.queue = new TicketQueue();
  }

  /**
   * Display menu and handle user input
   */
  async start() {
    console.log('\n🏟️  Welcome to Live Match Ticket Queue System 🏟️\n');
    
    // Demo: Add some users to the queue
    console.log('Demo: Adding users to the queue...\n');
    
    this.queue.join('Alice');
    this.queue.join('Bob');
    this.queue.join('Charlie');
    
    console.log('---\n');
    
    // Simulate Bob completing their booking
    console.log('Demo: Bob completes their booking...\n');
    this.queue.completeBooking(2);
    
    console.log('---\n');
    
    // Add more users
    console.log('Demo: Adding more users...\n');
    this.queue.join('David');
    this.queue.join('Eve');
  }
}

// Run the CLI if this file is executed directly
const cli = new TicketQueueCLI();
cli.start();
