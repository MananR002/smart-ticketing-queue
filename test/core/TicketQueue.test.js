import { describe, it } from 'node:test';
import assert from 'node:assert';
import { TicketQueue } from '../../src/core/TicketQueue.js';

describe('TicketQueue', () => {
  describe('Basic FIFO Queue', () => {
    it('should add users to the queue in FIFO order', () => {
      const queue = new TicketQueue();

      const user1 = queue.join('Alice');
      const user2 = queue.join('Bob');
      const user3 = queue.join('Charlie');

      assert.strictEqual(queue.size, 3);
      assert.strictEqual(user1.name, 'Alice');
      assert.strictEqual(user2.name, 'Bob');
      assert.strictEqual(user3.name, 'Charlie');
    });

    it('should grant booking window to first user in queue', () => {
      const queue = new TicketQueue();

      queue.join('Alice');
      queue.join('Bob');

      assert.strictEqual(queue.activeWindows.size, 1);
      assert.ok(queue.activeWindows.has(1)); // Alice has ID 1
    });

    it('should complete booking and grant window to next user', () => {
      const queue = new TicketQueue();

      queue.join('Alice');
      queue.join('Bob');

      queue.completeBooking(1); // Alice completes

      assert.strictEqual(queue.size, 1);
      assert.strictEqual(queue.activeWindows.size, 1);
      assert.ok(queue.activeWindows.has(2)); // Bob now has window
    });
  });

  describe('Limited Seats', () => {
    it('should initialize with fixed number of seats', () => {
      const queue = new TicketQueue(5);

      assert.strictEqual(queue.totalSeats, 5);
      assert.strictEqual(queue.availableSeats, 5);
    });

    it('should reduce available seats when booking completes', () => {
      const queue = new TicketQueue(5);

      queue.join('Alice');
      queue.completeBooking(1);

      assert.strictEqual(queue.availableSeats, 4);
    });

    it('should not allow negative available seats', () => {
      const queue = new TicketQueue(1);

      queue.join('Alice');
      queue.completeBooking(1);

      assert.strictEqual(queue.availableSeats, 0);
    });
  });

  describe('Sold Out', () => {
    it('should mark as sold out when all seats are taken', () => {
      const queue = new TicketQueue(1);

      queue.join('Alice');
      queue.completeBooking(1);

      assert.strictEqual(queue.isSoldOut, true);
    });

    it('should reject new users when sold out', () => {
      const queue = new TicketQueue(1);

      queue.join('Alice');
      queue.completeBooking(1);

      const result = queue.join('Bob');

      assert.strictEqual(result, null);
    });

    it('should close all active windows when sold out', () => {
      const queue = new TicketQueue(1);

      queue.join('Alice');
      queue.join('Bob');
      queue.completeBooking(1); // Alice completes, triggers sold out

      assert.strictEqual(queue.activeWindows.size, 0);
      assert.strictEqual(queue.queue[0].status, 'expired'); // Bob expired
    });
  });

  describe('Booking Window Expiry', () => {
    it('should accept custom expiry time', () => {
      const queue = new TicketQueue(Infinity, 5000);

      assert.strictEqual(queue.bookingExpiryMs, 5000);
    });

    it('should remove expired user from queue', (done) => {
      const queue = new TicketQueue(Infinity, 100);

      queue.join('Alice');
      queue.join('Bob');

      // Wait for expiry
      setTimeout(() => {
        assert.strictEqual(queue.size, 1); // Bob should remain
        assert.strictEqual(queue.queue[0].name, 'Bob');
        done();
      }, 200);
    });

    it('should grant window to next user after expiry', (done) => {
      const queue = new TicketQueue(Infinity, 100);

      queue.join('Alice');
      queue.join('Bob');

      setTimeout(() => {
        assert.ok(queue.activeWindows.has(2)); // Bob has window now
        done();
      }, 200);
    });
  });

  describe('Queue Position Info', () => {
    it('should track queue size correctly', () => {
      const queue = new TicketQueue();

      assert.strictEqual(queue.size, 0);
      assert.strictEqual(queue.isEmpty, true);

      queue.join('Alice');

      assert.strictEqual(queue.size, 1);
      assert.strictEqual(queue.isEmpty, false);
    });

    it('should calculate position correctly', () => {
      const queue = new TicketQueue();

      queue.join('Alice');
      queue.join('Bob');

      // Bob is at position 2, 1 user ahead
      const position = queue.size;
      const ahead = position - 1;

      assert.strictEqual(position, 2);
      assert.strictEqual(ahead, 1);
    });
  });
});
