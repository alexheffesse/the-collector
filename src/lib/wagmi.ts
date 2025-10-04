// src/lib/wagmi.ts
import { createConfig, http } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { walletConnect } from 'wagmi/connectors';

const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID!;
if (!projectId) {
  console.warn('Missing NEXT_PUBLIC_WC_PROJECT_ID');
}

export const wagmiConfig = createConfig({
  chains: [baseSepolia],
  connectors: [
    walletConnect({
      projectId,
      // enable QR modal for desktop
      showQrModal: true,
    }),
  ],
  transports: {
    [baseSepolia.id]: http('https://sepolia.base.org'),
  },
});
