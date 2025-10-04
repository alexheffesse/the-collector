'use client';

import { useEffect, useState } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import WalletWrapper from 'src/components/WalletWrapper';
import NetworkGuard from 'src/components/NetworkGuard';

type Badges = { connected?: boolean; voted?: boolean };

const XP_KEY_BASE = 'collector_xp_';
const BADGES_KEY_BASE = 'collector_badges_';

function keyParts(addr?: string) {
  const suffix = addr ? addr.toLowerCase() : 'anon';
  return {
    xpKey: `${XP_KEY_BASE}${suffix}`,
    badgesKey: `${BADGES_KEY_BASE}${suffix}`,
  };
}

export default function RewardsPage() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const [xp, setXp] = useState<number>(0);
  const [badges, setBadges] = useState<Badges>({});

  // load on address change
  useEffect(() => {
    const { xpKey, badgesKey } = keyParts(address);
    const savedXp = localStorage.getItem(xpKey);
    const savedBadges = localStorage.getItem(badgesKey);
    setXp(savedXp ? Number(savedXp) : 0);
    setBadges(savedBadges ? JSON.parse(savedBadges) : {});
  }, [address]);

  function save(nextXp: number, nextBadges: Badges) {
    const { xpKey, badgesKey } = keyParts(address);
    localStorage.setItem(xpKey, String(nextXp));
    localStorage.setItem(badgesKey, JSON.stringify(nextBadges));
  }

  // first connect => +10 XP and Connected badge
  useEffect(() => {
    if (!isConnected) return;
    if (!badges.connected) {
      const nextBadges = { ...badges, connected: true };
      const nextXp = xp + 10;
      setBadges(nextBadges);
      setXp(nextXp);
      save(nextXp, nextBadges);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);

  // voted on /vote => +20 XP and Voted badge
  useEffect(() => {
    if (!isConnected || !address) return;
    const POLL_ID = 'collector-q1-discovery';
    const voterKey = `collector_poll_${POLL_ID}_voter_${address.toLowerCase()}`;
    const hasVoted = !!localStorage.getItem(voterKey);
    if (hasVoted && !badges.voted) {
      const nextBadges = { ...badges, voted: true };
      const nextXp = xp + 20;
      setBadges(nextBadges);
      setXp(nextXp);
      save(nextXp, nextBadges);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, address]);

  function resetLocal() {
    const { xpKey, badgesKey } = keyParts(address);
    localStorage.removeItem(xpKey);
    localStorage.removeItem(badgesKey);
    setXp(0);
    setBadges({});
  }

  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="text-2xl font-semibold">Rewards</h1>
      <p className="text-gray-600 mt-1">Non-financial 'Collector XP' and badges.</p>

      {/* Network status + switch helper */}
      <div className="mt-3 mb-3">
        <NetworkGuard />
      </div>

      {/* Connect / Disconnect block */}
      <div className="mt-2 mb-4 flex items-center gap-3">
        {!isConnected ? (
          <WalletWrapper className="w-[280px] max-w-full" text="Connect wallet" />
        ) : (
          <>
            <span className="text-sm text-gray-700 break-all">
              Connected: <code>{address}</code>
            </span>
            <button
              onClick={() => disconnect()}
              className="rounded border px-3 py-1 text-sm"
            >
              Disconnect
            </button>
          </>
        )}
      </div>

      <div className="mt-2 rounded border p-4">
        <div className="text-sm text-gray-700">Wallet</div>
        <div className="text-sm break-all">{isConnected ? address : 'Not connected'}</div>
      </div>

      <section className="mt-4 rounded border p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">Collector XP</h2>
          <div className="text-lg font-semibold">{xp}</div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Demo values: +10 for first connect, +20 for first vote.
        </p>
      </section>

      <section className="mt-4 rounded border p-4">
        <h2 className="font-medium mb-2">Badges</h2>
        <div className="flex flex-wrap gap-2">
          <span className={`inline-block rounded-full px-3 py-1 text-xs border ${badges.connected ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
            Connected {badges.connected ? '✓' : '–'}
          </span>
          <span className={`inline-block rounded-full px-3 py-1 text-xs border ${badges.voted ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
            Voted {badges.voted ? '✓' : '–'}
          </span>
        </div>
      </section>

      <div className="mt-4">
        <button
          onClick={resetLocal}
          className="rounded border px-3 py-1 text-sm"
        >
          Reset local rewards
        </button>
      </div>

      <p className="text-xs text-gray-500 mt-4">
        Demo only: stored locally in your browser. Later we’ll bind this to on-chain or a minimal backend.
      </p>
    </main>
  );
}
