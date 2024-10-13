export interface Player {
  id: number;
}

export type Outcome = 'correct' | 'incorrect' | 'pending';

export interface Guess {
  id: number;
  player_id: number;
  price_at_guess: string;
  direction: 'up' | 'down';
  created_at: Date;
  resolved_at: Date | null;
  outcome: Outcome;
}

export interface BTCPrice {
  price: number;
}
