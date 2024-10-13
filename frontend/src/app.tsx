import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Game } from './Game';
import { Toaster } from './components/ui/toaster';
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Game />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
