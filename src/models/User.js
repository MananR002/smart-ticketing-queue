/**
 * User model representing a person waiting in the ticket queue
 */
export class User {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.joinedAt = new Date();
    this.status = 'waiting'; // waiting, in_booking, completed, expired
  }

  toString() {
    return `User(${this.id}: ${this.name})`;
  }
}
