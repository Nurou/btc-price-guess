export type Player = {
  id: number;
};

export type Outcome = 'correct' | 'incorrect' | 'pending';
export type Direction = 'up' | 'down';

export type Guess = {
  id: number;
  player_id: number;
  direction: Direction;
  created_at: Date;
  price_at_guess: string;
  outcome: Outcome;
};

export type GuessRequest = {
  direction: Direction;
  playerId: number;
  priceAtGuess: number;
};

export type GuessResolutionResult = {
  resolved: boolean;
  message?: string;
  correct?: boolean;
};
