import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FeedScreen } from './src/screens/FeedScreen';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <FeedScreen />
    </QueryClientProvider>
  );
}
