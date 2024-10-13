import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGetOrInsertPlayer } from './hooks/use-get-or-insert-player';
import { useGetCurrentBtcPrice } from './hooks/use-get-current-btc-price';
import { useGetPreviousGuess } from './hooks/use-get-previous-guess';
import { useSubmitGuess } from './hooks/use-submit-guess';
import { Bitcoin, TrendingUp, TrendingDown, TriangleAlert } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { UseQueryResult } from '@tanstack/react-query';
import { Skeleton } from './components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from './components/ui/alert';
import { Guess } from './model';
import { useGetPlayerScore } from './hooks/use-get-player-score';
import { useSocket } from './hooks/use-socket';

const BtcPrice = ({ result }: { result: UseQueryResult<number, Error> }) => {
  const { data: price, isPending } = result;
  return (
    <div className='text-2xl font-semibold text-center space-y-2'>
      <p className='text-muted-foreground'>Latest BTC Price</p>
      {isPending ? <Skeleton className='w-full h-10' /> : <p className='text-4xl text-primary'>${price?.toFixed(2)}</p>}
    </div>
  );
};

const SubmitGuessSection = ({ handleSubmitGuess }: { handleSubmitGuess: (direction: 'up' | 'down') => void }) => {
  return (
    <section className='space-y-4'>
      <p className='text-xl text-center font-medium text-secondary-foreground'>Will the price go up or down?</p>
      <div className='flex justify-center gap-4'>
        <Button
          variant='outline'
          size='lg'
          onClick={() => handleSubmitGuess('up')}
          className='p-8 text-lg font-semibold hover:bg-green-100 hover:text-green-700 transition-colors duration-300'
        >
          <TrendingUp className='mr-2 h-6 w-6' />
          Up
        </Button>
        <Button
          variant='outline'
          size='lg'
          onClick={() => handleSubmitGuess('down')}
          className='p-8 text-lg font-semibold hover:bg-red-100 hover:text-red-700 transition-colors duration-300'
        >
          <TrendingDown className='mr-2 h-6 w-6' />
          Down
        </Button>
      </div>
    </section>
  );
};

const PlayerScore = ({ playerId }: { playerId: number | undefined }) => {
  const playerScoreResult = useGetPlayerScore(playerId);

  return (
    <>
      {playerScoreResult.isPending ? (
        <Skeleton className='w-full h-10' />
      ) : (
        <p className='text-3xl font-bold text-center w-full'>
          Total Score: <span className='text-primary'>{playerScoreResult.data}</span>
        </p>
      )}
    </>
  );
};

const UnresolvedGuessSection = (
  previousGuessResult: UseQueryResult<{
    guess: Guess;
  } | null>
) => {
  const previousGuessData = previousGuessResult.data;

  if (previousGuessResult.isError) {
    return (
      <Alert variant='destructive' className='max-w-md'>
        <TriangleAlert className='h-4 w-4' />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          There was an error fetching the unresolved guess. Please try again later. Error:{' '}
          {previousGuessResult.error.message}
        </AlertDescription>
      </Alert>
    );
  }

  if (previousGuessResult.isPending) {
    return <Skeleton className='w-full h-10' />;
  }

  const previousGuess = previousGuessData?.guess;
  const priceAtGuess = parseFloat(previousGuess?.price_at_guess || '0');

  return (
    <>
      <div className='text-lg text-center space-y-2'>
        <p>Resolving your previous guess...</p>
        {previousGuess?.outcome === 'pending' ? (
          <p className='text-xs font-medium text-secondary-foreground'>
            Your previous guess will resolve once 60 seconds has lapsed since you made the guess and the price moves.
          </p>
        ) : null}
      </div>
      <div className='flex flex-col items-center gap-2 justify-center text-xl text-center text-secondary-foreground space-y-2'>
        <p>You guessed</p>
        <Badge className='p-4'>
          <p className='text-xl font-bold'>{previousGuess?.direction.toUpperCase()}</p>
        </Badge>
        <p>
          from <span className='font-bold'>${priceAtGuess.toFixed(2)}</span>
        </p>
      </div>
    </>
  );
};

export const Game: React.FC = () => {
  const btcPriceResult = useGetCurrentBtcPrice();
  const playerResult = useGetOrInsertPlayer();
  const previousGuessResult = useGetPreviousGuess(playerResult.data?.id);
  const { mutate: submitGuess } = useSubmitGuess();

  useSocket(playerResult.data?.id);

  const handleSubmitGuess = (direction: 'up' | 'down') => {
    if (!playerResult.data?.id) return;

    submitGuess({
      playerId: playerResult.data?.id,
      direction,
      priceAtGuess: btcPriceResult.data,
    });
  };

  // Don't render anything else if BTC price or player is not available
  if (playerResult.isError) {
    return (
      <div className='grid place-items-center h-screen mx-auto'>
        <Alert variant='destructive' className='max-w-md'>
          <TriangleAlert className='h-4 w-4' />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            There was an error fetching the player. Please try again later. Error: {playerResult.error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (btcPriceResult.isError) {
    return (
      <div className='grid place-items-center h-screen mx-auto'>
        <Alert variant='destructive' className='max-w-md'>
          <TriangleAlert className='h-4 w-4' />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            There was an error fetching the latest BTC price. Please try again later. Error:{' '}
            {btcPriceResult.error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // can submit when there is no guess or previous guess is resolved
  const previousGuess = previousGuessResult.data?.guess;
  const canSubmitGuess = !previousGuess || previousGuess.outcome !== 'pending';

  return (
    <div className='flex flex-col gap-8 items-center justify-center min-h-screen p-8'>
      <div className='flex flex-col items-center justify-center space-y-2'>
        <Bitcoin size={84} className='text-yellow-500 animate-pulse' />
        <h1 className='text-5xl font-bold text-center bg-clip-text'>Price Expert</h1>
      </div>
      <Card className='w-[450px] p-8 shadow-lg hover:shadow-xl transition-shadow duration-300'>
        <CardContent className='space-y-6'>
          <BtcPrice result={btcPriceResult} />
          {canSubmitGuess ? (
            <SubmitGuessSection handleSubmitGuess={handleSubmitGuess} />
          ) : (
            <UnresolvedGuessSection {...previousGuessResult} />
          )}
        </CardContent>
        <CardFooter>
          <PlayerScore playerId={playerResult.data?.id} />
        </CardFooter>
      </Card>
    </div>
  );
};
