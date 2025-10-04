'use client';

import { useEffect, useState } from 'react';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';

export default function NetworkGuard() {
  const { isConnected } = useAccount();
  const chainId = useChainId();                 // current connected chain id (undefined if not connected)
  const { switchChain } = useSwitchChain();     // chain switcher
  const [message, setMessage] = useState<string>('Not connected');

  const onBaseSepolia = chainId === baseSepolia.id;
  const currentName = onBaseSepolia
    ? 'Base Sepolia'
    : (typeof chainId === 'number' ? `Chain ${chainId}` : 'Unknown');

  useEffect(() => {
    if (!isConnected) {
      setMessage('Not connected');
      return;
    }
    setMessage(onBaseSepolia ? 'On Base Sepolia' : `On ${currentName} — switch recommended`);
  }, [isConnected, onBaseSepolia, currentName]);

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
