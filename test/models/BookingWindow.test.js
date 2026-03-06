import { describe, it } from 'node:test';
import assert from 'node:assert';
import { BookingWindow } from '../../src/models/BookingWindow.js';
import { User } from '../../src/models/User.js';

describe('BookingWindow Model', () => {
  it('should create a booking window with correct properties', () => {
    const user = new User(1, 'Alice');
    const window = new BookingWindow(user, 10000, null);

    assert.strictEqual(window.user, user);
    assert.strictEqual(window.status, 'active');
    assert.strictEqual(window.expiryMs, 10000);
    assert.ok(window.grantedAt instanceof Date);
  });

  it('should close booking window and mark user as completed', () => {
    const user = new User(1, 'Alice');
    user.status = 'in_booking';
    const window = new BookingWindow(user, 10000, null);

    window.close();

    assert.strictEqual(window.status, 'closed');
    assert.strictEqual(user.status, 'completed');
  });

  it('should expire booking window and mark user as expired', () => {
    const user = new User(1, 'Alice');
    user.status = 'in_booking';
    const window = new BookingWindow(user, 10000, null);

    window.expire();

    assert.strictEqual(window.status, 'expired');
    assert.strictEqual(user.status, 'expired');
  });

  it('should call onExpire callback when expired', () => {
    const user = new User(1, 'Alice');
    user.status = 'in_booking';
    let callbackCalled = false;
    let callbackUser = null;

    const window = new BookingWindow(user, 10000, (expiredUser) => {
      callbackCalled = true;
      callbackUser = expiredUser;
    });

    window.expire();

    assert.strictEqual(callbackCalled, true);
    assert.strictEqual(callbackUser, user);
  });

  it('should return correct string representation', () => {
    const user = new User(1, 'Alice');
    const window = new BookingWindow(user, 10000, null);

    assert.strictEqual(window.toString(), 'BookingWindow for Alice [active]');
  });
});
