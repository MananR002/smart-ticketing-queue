/**
 * BookingWindow represents access granted to a user when they reach the front of the queue
 */
export class BookingWindow {
  constructor(user, expiryMs, onExpire) {
    this.user = user;
    this.grantedAt = new Date();
    this.status = 'active'; // active, closed, expired
    this.expiryMs = expiryMs;
    this._onExpire = onExpire;
    this._expiryTimer = null;

    this._startExpiryTimer();
  }

  _startExpiryTimer() {
    if (this.expiryMs === null || this.expiryMs === undefined) return;

    this._expiryTimer = setTimeout(() => {
      if (this.status === 'active') {
        this.expire();
      }
    }, this.expiryMs);
  }

  expire() {
    if (this.status !== 'active') return;

    this.status = 'expired';
    this.user.status = 'expired';
    this._clearExpiryTimer();

    if (this._onExpire) {
      this._onExpire(this.user);
    }
  }

  close() {
    if (this.status !== 'active') return;

    this.status = 'closed';
    this.user.status = 'completed';
    this._clearExpiryTimer();
  }

  _clearExpiryTimer() {
    if (this._expiryTimer) {
      clearTimeout(this._expiryTimer);
      this._expiryTimer = null;
    }
  }

  toString() {
    return `BookingWindow for ${this.user.name} [${this.status}]`;
  }
}
