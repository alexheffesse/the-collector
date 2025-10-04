// src/lib/wagmi.ts
import { createConfig, http } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { walletConnect, coinbaseWallet } from 'wagmi/connectors'; // ← add coinbaseWallet

const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID!;
if (!projectId) {
  console.warn('Missing NEXT_PUBLIC_WC_PROJECT_ID');
}

export const wagmiConfig = createConfig({
  chains: [baseSepolia],
  connectors: [
    // Shows Coinbase Wallet option directly
    coinbaseWallet({
      appName: 'The Collector',
      preference: 'all', // allows both Smart Wallet + classic Coinbase Wallet
    }),
    // Keeps generic WC modal for other wallets
    walletConnect({
      projectId,
      showQrModal: true,
    }),
  ],
  transports: {
    [baseSepolia.id]: http('https://sepolia.base.org'),
  },
});
