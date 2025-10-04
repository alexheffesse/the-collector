'use client';

import { useAccount } from 'wagmi';
import WalletWrapper from 'src/components/WalletWrapper';

export default function Page() {
  const { address, isConnected } = useAccount();

  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="text-2xl font-semibold">Mini App Entry</h1>
      <p className="text-gray-600 mt-1">Testnet: Base Sepolia (Chain ID 84532)</p>

      <div className="mt-6">
        {!isConnected ? (
          <WalletWrapper className="w-full" text="Connect to continue" />
        ) : (
          <div className="rounded border p-4">
            <p className="text-sm text-gray-700">Connected:</p>
            <code className="break-all">{address}</code>
          </div>
        )}
      </div>
    </main>
  );
}
