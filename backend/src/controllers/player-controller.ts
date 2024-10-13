import { Request, Response } from 'express';
import * as playerService from '../services/player-service';
import { Server, Socket } from 'socket.io';

export const getOrCreatePlayer = async (req: Request, res: Response) => {
  const playerId = req.query.id as string;

  if (!playerId) {
    return res.status(400).json({ error: 'Valid player ID is required as a query parameter' });
  }

  try {
    const player = await playerService.getOrCreatePlayer(playerId);
    res.json(player);
  } catch (error) {
    console.error('Error fetching or creating player:', error);
    res.status(500).json({ error: `Error fetching or creating player: ${error}` });
  }
};

export async function getPlayerScore(req: Request, res: Response) {
  const playerId = req.query.id as string;

  if (!playerId) {
    return res.status(400).json({ error: 'Valid player ID is required as a query parameter' });
  }

  try {
    const score = await playerService.getPlayerScore(playerId);
    res.json(score);
  } catch (error) {
    console.error('Error fetching player score:', error);
    res.status(500).json({ error: `Error fetching player score: ${error}` });
  }
}
