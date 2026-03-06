import { describe, it } from 'node:test';
import assert from 'node:assert';
import { User } from '../../src/models/User.js';

describe('User Model', () => {
  it('should create a user with correct properties', () => {
    const user = new User(1, 'Alice');

    assert.strictEqual(user.id, 1);
    assert.strictEqual(user.name, 'Alice');
    assert.strictEqual(user.status, 'waiting');
    assert.ok(user.joinedAt instanceof Date);
  });

  it('should have unique joinedAt timestamps', () => {
    const user1 = new User(1, 'Alice');
    const user2 = new User(2, 'Bob');

    assert.notStrictEqual(user1.joinedAt, user2.joinedAt);
  });

  it('should return correct string representation', () => {
    const user = new User(1, 'Alice');
    assert.strictEqual(user.toString(), 'User(1: Alice)');
  });
});
