import { useQuery } from '@tanstack/react-query';
import { BACKEND_URL } from '../shared';
import { BTCPrice } from '../model';

const fetchCurrentPrice = async () => {
  const response = await fetch(`${BACKEND_URL}/api/btc-price`);
  if (!response.ok || response.status !== 200) throw new Error('Failed to fetch current price');
  const data: BTCPrice = await response.json();
  return data.price;
};

export const useGetCurrentBtcPrice = () => {
  return useQuery({
    queryKey: ['currentPrice'],
    queryFn: fetchCurrentPrice,
    retry: 3, // retry 3 times
  });
};
