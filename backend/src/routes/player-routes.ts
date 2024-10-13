import express from 'express';
import { getOrCreatePlayer, getPlayerScore } from '../controllers/player-controller';

const playerRouter = express.Router();

playerRouter.get('/', getOrCreatePlayer);
playerRouter.get('/score', getPlayerScore);

export { playerRouter };
