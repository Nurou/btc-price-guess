import { useQuery } from '@tanstack/react-query';
import { BACKEND_URL } from '../shared';

const fetchPlayerScore = async (playerId: number | undefined) => {
  const response = await fetch(`${BACKEND_URL}/api/player/score?id=${playerId}`);
  if (!response.ok || response.status !== 200) throw new Error('Failed to fetch player score');
  const data: number = await response.json();
  return data;
};

export const useGetPlayerScore = (playerId: number | undefined) => {
  return useQuery({
    queryKey: ['playerScore', playerId],
    queryFn: () => fetchPlayerScore(playerId),
    enabled: !!playerId,
  });
};
