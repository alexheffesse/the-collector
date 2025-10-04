// src/components/Providers.tsx
'use client';

import { WagmiProvider } from 'wagmi';
import { wagmiConfig } from 'src/lib/wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { baseSepolia } from 'viem/chains';

const queryClient = new QueryClient();
const wcProjectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID as string;

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          chain={baseSepolia}
          walletConnectProjectId={wcProjectId}
        >
          {children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
