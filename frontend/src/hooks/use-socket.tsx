import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { socket } from '../socket';
import { Guess } from '../model';
import { useToast } from './use-toast';

export function useSocket(playerId: number | undefined) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    if (!playerId) return;

    socket.emit('joinGame', playerId.toString());

    function onConnect() {
      console.log('Socket connected successfully');
    }

    function onDisconnect() {
      console.log('Socket disconnected');
    }

    function onGuessResolved(data: { guess: Guess; message: string }) {
      toast({
        title: `Guess resolved!`,
        description: data.message,
        variant: data.guess.outcome === 'correct' ? 'default' : 'destructive',
      });
      queryClient.resetQueries();
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('guessResolved', onGuessResolved);

    return () => {
      console.log('Cleaning up socket listeners');
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('guessResolved', onGuessResolved);
    };
  }, [playerId, queryClient, toast]);
}
