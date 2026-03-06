/**
 * Main entry point for the Live Match Ticket Queue System
 */
export { TicketQueue } from './core/TicketQueue.js';
export { User, BookingWindow } from './models/index.js';

// If run directly, start the CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  await import('./cli.js');
}
