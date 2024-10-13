import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BACKEND_URL } from '../shared';
import { Guess, Player } from '../model';

const submitGuess = async ({
  playerId,
  direction,
  priceAtGuess,
}: {
  playerId: Player['id'];
  direction: Guess['direction'];
  priceAtGuess: number | undefined;
}) => {
  const response = await fetch(`${BACKEND_URL}/api/guess`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ playerId, direction, priceAtGuess }),
  });
  if (!response.ok || response.status !== 200) throw new Error('Failed to submit guess');
  return response.json();
};

export const useSubmitGuess = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitGuess,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['previous-guess'] });
    },
  });
};
