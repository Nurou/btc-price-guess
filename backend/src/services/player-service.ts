import { pool } from '../db';
import { Player } from '../types';

const DEFAULT_SCORE = 0;

export async function getOrCreatePlayer(playerId: string): Promise<Player> {
  let result = await pool.query<Player>('SELECT * FROM players WHERE id = $1', [playerId]);

  if (result.rows.length === 0) {
    result = await pool.query<Player>('INSERT INTO players (id) VALUES ($1) RETURNING id', [playerId]);
  }

  return result.rows[0];
}

export async function getPlayerScore(playerId: string): Promise<number> {
  const scoreResult = await pool.query<{ score: string }>(
    `SELECT 
        SUM(
          CASE 
            WHEN outcome = 'correct' THEN 1
            WHEN outcome = 'incorrect' THEN -1
            ELSE 0
          END
        ) AS score
       FROM guesses
       WHERE player_id = $1`,
    [playerId]
  );

  const score = parseInt(scoreResult.rows[0].score) || DEFAULT_SCORE;

  return score;
}
