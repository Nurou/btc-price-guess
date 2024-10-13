import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { BACKEND_URL } from '../shared';
import { Guess } from '../model';

const REFRESH_INTERVAL_MS = 10000;

const fetchPreviousGuess = async (playerId: number | undefined): Promise<{ guess: Guess } | null> => {
  if (!playerId) return null;
  const response = await fetch(`${BACKEND_URL}/api/guess/previous?player_id=${playerId}`);
  if (!response.ok || response.status !== 200) throw new Error('Failed to fetch previous guess');
  const data = await response.json();
  if (!data.guess) return null;

  return {
    guess: data.guess,
  };
};

export const useGetPreviousGuess = (
  playerId: number | undefined
): UseQueryResult<{
  guess: Guess;
} | null> => {
  return useQuery<{ guess: Guess } | null>({
    queryKey: ['previous-guess', playerId],
    queryFn: () => fetchPreviousGuess(playerId),
    enabled: !!playerId,
    refetchInterval: REFRESH_INTERVAL_MS,
  });
};
