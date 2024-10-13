import express from 'express';
import { submitGuess, getPreviousGuess } from '../controllers/guess-controller';

const guessRouter = express.Router();

guessRouter.get('/previous', getPreviousGuess);
guessRouter.post('/', submitGuess);

export { guessRouter };
