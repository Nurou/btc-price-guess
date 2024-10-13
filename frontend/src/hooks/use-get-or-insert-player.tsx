import { useQuery } from '@tanstack/react-query';
import { BACKEND_URL } from '../shared';
import { Player } from '../model';

/**
 * Generates a random player ID between 1 and 10000.
 * For PoC purposes, this is sufficient.
 */
const generateRandomPlayerId = () => {
  return Math.floor(Math.random() * 10000) + 1;
};

const getOrInsertPlayer = async (): Promise<Player> => {
  const storedPlayerId = localStorage.getItem('playerId');

  if (storedPlayerId) {
    const response = await fetch(`${BACKEND_URL}/api/player?id=${storedPlayerId}`);
    if (response.ok && response.status === 200) {
      const player: Player = await response.json();
      return player;
    }
  }

  // If no stored player ID or fetching failed, create a new player
  const newPlayerId = generateRandomPlayerId();
  const response = await fetch(`${BACKEND_URL}/api/player?id=${newPlayerId}`);
  if (!response.ok || response.status !== 200) throw new Error('Failed to get or create the player');
  const player: Player = await response.json();
  localStorage.setItem('playerId', player.id.toString());
  return player;
};

export const useGetOrInsertPlayer = () => {
  return useQuery({
    queryKey: ['player'],
    queryFn: getOrInsertPlayer,
    retry: 3,
  });
};
