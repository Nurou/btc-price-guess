DROP TABLE IF EXISTS players CASCADE;
DROP TABLE IF EXISTS guesses CASCADE;
DROP TYPE IF EXISTS guess_direction CASCADE;
DROP TYPE IF EXISTS guess_outcome CASCADE;


CREATE TYPE guess_direction AS ENUM ('up', 'down');
CREATE TYPE guess_outcome AS ENUM ('correct', 'incorrect', 'pending');

CREATE TABLE players (
  id SERIAL PRIMARY KEY
);

CREATE TABLE guesses (
  id SERIAL PRIMARY KEY,
  player_id INTEGER REFERENCES players(id),
  price_at_guess NUMERIC NOT NULL,
  direction guess_direction NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  outcome guess_outcome DEFAULT 'pending'
);
