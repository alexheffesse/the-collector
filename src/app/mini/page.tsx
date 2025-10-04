'use client';

import { useEffect, useState } from 'react';
import { useAccount, useChainId, useChains, useSwitchChain } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';

export default function NetworkGuard() {
  const { isConnected } = useAccount();
  const chainId = useChainId();                     // current chain id
  const chains = useChains();                       // array of configured chains
  const { switchChain } = useSwitchChain();         // chain switcher
  const [message, setMessage] = useState<string>('');

  const current = chains.find((c) => c.id === chainId);
  const onBaseSepolia = chainId === baseSepolia.id;

  useEffect(() => {
    if (!isConnected) {
      setMessage('Not connected');
      return;
    }
    setMessage(onBaseSepolia ? 'On Base Sepolia' : `On ${current?.name ?? 'Unknown'} — switch recommended`);
  }, [isConnected, onBaseSepolia, current]);

  if (!isConnected) {
    return (
      <div className="rounded border px-3 py-2 text-sm">
        Network: Not connected
      </div>
    );
  }

  return (
    <div className="rounded border px-3 py-2 text-sm flex items-center gap-3">
      <span>Network: {message}</span>
      {!onBaseSepolia && switchChain && (
        <button
          className="rounded border px-2 py-1 text-xs"
          onClick={() => switchChain({ chainId: baseSepolia.id })}
        >
          Switch to Base Sepolia
        </button>
      )}
    </div>
  );
}
