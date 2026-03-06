# Live Match Ticket Queue

A Node.js CLI library for managing live match ticket booking with a FIFO queue system. This library simulates real-world ticket booking platforms like BookMyShow, where users join a waiting queue and are granted booking windows when they reach the front.

## Features

- **FIFO Queue System**: Users join the queue in order and are served first-come-first-served
- **Limited Seats**: Configure a fixed number of available seats
- **Booking Windows**: Users at the front get a time-limited booking window
- **Auto-Expiry**: Booking windows automatically expire if users don't complete booking in time
- **Sold Out Handling**: System stops accepting new users when all seats are sold
- **Position Tracking**: Users can see their position and how many are ahead of them
- **In-Memory Storage**: Fast, lightweight queue management

## Installation

```bash
npm install
```

## Usage

### Basic Usage

```javascript
import { TicketQueue } from 'live-match-ticket-queue';

// Create a queue with 10 seats and 30-second booking windows
const queue = new TicketQueue(10, 30000);

// Users join the queue
queue.join('Alice');
queue.join('Bob');
queue.join('Charlie');

// When a user completes their booking
queue.completeBooking(1); // Alice's user ID
```

### Constructor Options

```javascript
const queue = new TicketQueue(totalSeats, bookingExpiryMs);
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `totalSeats` | number | `Infinity` | Total number of available seats |
| `bookingExpiryMs` | number | `10000` | Booking window expiry time in milliseconds |

### API Reference

#### `queue.join(userName)`
Adds a user to the queue.

**Returns:** `User` object or `null` if sold out

**Output:**
- ✅ User joined confirmation
- 📍 Position in queue
- 👥 Users ahead count

#### `queue.completeBooking(userId)`
Marks a booking as complete and grants window to next user.

**Parameters:**
- `userId` (number): The ID of the user completing their booking

#### `queue.size`
Get the current number of users in queue.

#### `queue.isEmpty`
Check if the queue is empty.

#### `queue.isSoldOut`
Check if all seats have been sold.

#### `queue.availableSeats`
Get the number of remaining available seats.

## How It Works

1. **Users Join**: When users join, they get a position number and see how many are ahead
2. **Booking Window**: The user at position 1 automatically gets a booking window
3. **Complete or Expire**: 
   - If they complete booking → seat count reduces, next user gets window
   - If window expires → user is removed, next user gets window
4. **Sold Out**: When all seats are booked, no new users can join

## Example Scenarios

### Scenario 1: Normal Flow
```javascript
const queue = new TicketQueue(3, 10000); // 3 seats, 10s expiry

queue.join('Alice');   // Position 1, gets booking window immediately
queue.join('Bob');     // Position 2, waiting
queue.join('Charlie'); // Position 3, waiting

queue.completeBooking(1); // Alice done, Bob gets window
queue.completeBooking(2); // Bob done, Charlie gets window
queue.completeBooking(3); // Charlie done, SOLD OUT!
```

### Scenario 2: Booking Window Expiry
```javascript
const queue = new TicketQueue(2, 5000); // 2 seats, 5s expiry

queue.join('Alice'); // Gets window
queue.join('Bob');   // Waiting

// Alice doesn't complete in 5 seconds...
// → Alice removed, Bob automatically gets window
```

### Scenario 3: Sold Out
```javascript
const queue = new TicketQueue(1); // Only 1 seat

queue.join('Alice');
queue.join('Bob'); // Waiting

queue.completeBooking(1); // Alice books last seat
// → SOLD OUT! Bob's window closes, no new users can join

queue.join('Charlie'); // ❌ Sorry Charlie, tickets are sold out!
```

## Running the Demo

```bash
npm start
```

This runs an interactive demo showing:
- Users joining the queue
- Booking windows being granted
- Window expiry handling
- Sold out scenario

## Running Tests

```bash
npm test
```

Tests cover:
- User model creation
- Booking window lifecycle
- FIFO queue behavior
- Seat management
- Sold out scenarios
- Booking window expiry

## Project Structure

```
src/
├── models/
│   ├── User.js          # User model
│   ├── BookingWindow.js # Booking window with expiry timer
│   └── index.js         # Model exports
├── core/
│   ├── TicketQueue.js   # Main queue logic
│   └── index.js         # Core exports
├── cli.js               # CLI demo
└── index.js             # Main entry point

test/
├── models/
│   ├── User.test.js
│   └── BookingWindow.test.js
└── core/
    └── TicketQueue.test.js
```

## License

MIT
