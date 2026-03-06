/**
 * BookingWindow represents access granted to a user when they reach the front of the queue
 */
export class BookingWindow {
  constructor(user) {
    this.user = user;
    this.grantedAt = new Date();
    this.status = 'active'; // active, closed
  }

  close() {
    this.status = 'closed';
    this.user.status = 'completed';
  }

  toString() {
    return `BookingWindow for ${this.user.name} [${this.status}]`;
  }
}
