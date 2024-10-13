import { pool } from '../db';
import { Direction, Guess, Outcome, Player } from '../types';

async function getHasUnresolvedPreviousGuess(playerId: number): Promise<boolean> {
  const result = await pool.query<{ count: string }>(
    "SELECT COUNT(*) FROM guesses WHERE player_id = $1 AND outcome = 'pending'",
    [playerId]
  );
  return parseInt(result.rows[0].count) > 0;
}

export async function submitGuess({
  direction,
  playerId,
  priceAtGuess,
}: {
  direction: Direction;
  playerId: Player['id'];
  priceAtGuess: number;
}): Promise<Guess> {
  const hasUnresolvedPreviousGuess = await getHasUnresolvedPreviousGuess(playerId);

  if (hasUnresolvedPreviousGuess) {
    throw new Error('You have an unresolved guess. Please wait for it to be resolved before making a new guess.');
  }

  const result = await pool.query<Guess>(
    'INSERT INTO guesses (player_id, direction, created_at, price_at_guess) VALUES ($1, $2, $3, $4) RETURNING *',
    [playerId, direction, new Date(), priceAtGuess]
  );

  return result.rows[0];
}

export async function getPreviousGuess(player_id: string): Promise<Guess | null> {
  const previousGuessResult = await pool.query<Guess>(
    'SELECT * FROM guesses WHERE player_id = $1 ORDER BY created_at DESC LIMIT 1',
    [player_id]
  );

  if (!previousGuessResult.rows.length || !previousGuessResult.rows[0].price_at_guess) {
    return null;
  }

  const previousGuess = previousGuessResult.rows[0];

  return previousGuess;
}

export async function updateGuessOutcome(guessId: number, outcome: Outcome): Promise<Guess> {
  const result = await pool.query<Guess>('UPDATE guesses SET outcome = $1 WHERE id = $2 RETURNING *', [
    outcome,
    guessId,
  ]);

  return result.rows[0];
}
