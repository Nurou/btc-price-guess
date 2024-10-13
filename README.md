# BTC Price Guessing Game

This project is a Proof of Concept (PoC) for a simple game where players can guess whether the Bitcoin (BTC) price will go up or down. Players earn points for correct guesses and lose points for incorrect guesses.

## Features

- Real-time BTC price display
- Guess resolution through a Websocket
- Score tracking
- Timed guessing system
- Persistent scores

### How it works

- Players are assigned a random ID upon first visit, which is stored in local storage and the `Players' table. If no user exists, one is created and returned.
- The app displays the current Bitcoin (BTC) price, fetched from the Coindesk API through the Node backend.
- Players can guess whether the BTC price will go up or down.
- After making a guess, players must wait for their previous guess to be resolved prior to making a new one. A guess is resolved when 60 seconds since the player's guess have lapsed and the price has changed.
- The Node.js server resolves the player's guess and emits an event when done.
- Guesses are resolved by comparing guess price with current price and the user's guess direction.
- Players earn points for correct guesses and lose points for incorrect ones.
- Scores are persistently stored in the database and updated after each resolved guess.
- The db schema can be inspected in the `backend/dump.sql` file.

### How to improve

- Add integration tests both on the client and server.
- There is no user authentication and player IDs are randomly generated between 0 and 1000. This would not work in a real app as anyone can access another player's data by simply passing an existing player ID in the client-side request.
- Resolutions attempts should begin 60 seconds after a guess submission is made — this is currently not implemented.
- Types are not shared between backend and frontend. This could be mitigated by exporting the model types from the backend.
- The Node.js server is not fully typesafe as the SQL queries rely on unreliable typings. This could be mitigated by deriving the types from the DB schema or using an ORM that does that.
- Fetch requests could do with a wrapper to handle various HTTP status code.
- Error handling on both client and server side should be more robust.
- Make the UI prettier.

## Tech Stack

- Frontend: React, TypeScript, Vite
- Backend: Node.js, Express, TypeScript
- Database: PostgreSQL

## Setup and Running

### Prerequisites

- Node.js
- Docker

### Backend Setup

1. Navigate to the backend directory:

   ```
   cd backend
   ```

2. Install dependencies:

   ```
   pnpm i
   ```

3. Set up the database:

Navigate to the backend directory and:

- Add a `.env` file like so

```
PORT=5125
DB_USER='postgres'
DB_HOST='localhost'
DB_NAME=epilot
DB_PASSWORD='postgres'
DB_PORT=5432
```

The run:

```
pnpm init-db
```

4. Start the backend server:

Navigate to the backend directory and run:

```
pnpm dev
```

### Frontend Setup

1. Navigate to the frontend directory:

   ```
   cd frontend
   ```

2. Create a `.env` file in the frontend directory with the following content:

   ```
   VITE_BACKEND_URL=http://localhost:5125
   VITE_BACKEND_WS_URL=ws://localhost:5125
   ```

   Replace the URL with your actual backend URL if different.

3. Install dependencies:

   ```
   pnpm i
   ```

4. Start the frontend development server:

   ```
   pnpm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Deployment

The db is deployed on railway. The frontend and backend on render/
