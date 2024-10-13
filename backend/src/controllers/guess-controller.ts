import { Request, Response } from 'express';
import * as guessService from '../services/guess-service';
import * as priceService from '../services/price-service';
import { Guess, GuessRequest, Outcome } from '../types';
import { io } from '..';

const GUESS_RESOLUTION_THRESHOLD_SECONDS = 60;
const activeResolutions = new Set<number>();

export const submitGuess = async (req: Request<{}, {}, GuessRequest>, res: Response) => {
  const { direction, playerId, priceAtGuess } = req.body;

  if (!playerId) {
    return res.status(400).json({ error: 'Player ID is required' });
  }

  if (priceAtGuess === undefined || priceAtGuess === null) {
    return res.status(400).json({ error: 'Price at guess is required' });
  }

  try {
    const guess = await guessService.submitGuess({
      playerId,
      direction,
      priceAtGuess,
    });
    res.json(guess);

    // start guess resolution
    startGuessResolution(guess);
  } catch (error) {
    console.error('Error recording guess:', error);
    res.status(500).json({ error: 'Error recording guess' });
  }
};

export const getPreviousGuess = async (req: Request, res: Response) => {
  const player_id = req.query.player_id as string;

  if (!player_id) {
    return res.status(400).json({ error: 'Valid player ID is required as a query parameter' });
  }

  try {
    const guess = await guessService.getPreviousGuess(player_id);

    if (!guess) {
      return res.json({ guess: null });
    }

    const guessHasBeenResolved = guess.outcome !== 'pending';
    if (guessHasBeenResolved) {
      return res.json({
        guess,
      });
    }

    if (!activeResolutions.has(guess.id)) {
      startGuessResolution(guess);
    }

    return res.json({
      guess,
    });
  } catch (error) {
    console.error('Error fetching unresolved guess:', error);
    res.status(500).json({ error: 'Error fetching unresolved guess' });
  }
};

function startGuessResolution(guess: Guess) {
  console.log('Starting guess resolution for guess:', guess);
  activeResolutions.add(guess.id);

  setTimeout(async () => {
    try {
      const result = await resolveGuess(guess);
      if (result.guess.outcome !== 'pending') {
        io.to(guess.player_id.toString()).emit('guessResolved', result);
        activeResolutions.delete(guess.id);
      } else {
        // guess is still pending, try again
        startGuessResolution(guess);
      }
    } catch (error) {
      console.error('Error resolving guess:', error);
      activeResolutions.delete(guess.id);
    }
  }, GUESS_RESOLUTION_THRESHOLD_SECONDS * 1000);
}

async function resolveGuess(previousGuess: Guess): Promise<{ guess: Guess; message?: string }> {
  const priceAtGuess = parseFloat(previousGuess.price_at_guess);
  const currentBtcPrice = await priceService.fetchBtcPrice();

  const roundedPriceAtGuess = Math.round(priceAtGuess * 100) / 100;
  const roundedCurrentPrice = Math.round(currentBtcPrice * 100) / 100;

  // no price change, do not resolve yet
  if (roundedCurrentPrice === roundedPriceAtGuess) {
    return {
      guess: previousGuess,
    };
  }

  const priceHasIncreased = roundedCurrentPrice > roundedPriceAtGuess;
  const playerGuessedIncrease = previousGuess.direction === 'up';
  const playerGuessedCorrectly = playerGuessedIncrease === priceHasIncreased;
  const outcome: Outcome = playerGuessedCorrectly ? 'correct' : 'incorrect';

  const updatedGuess = await guessService.updateGuessOutcome(previousGuess.id, outcome);

  return {
    guess: updatedGuess,
    message: `Price changed from $${roundedPriceAtGuess} to $${roundedCurrentPrice}. Your guess was ${outcome}.`,
  };
}
