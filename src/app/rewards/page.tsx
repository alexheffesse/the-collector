'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

const XP_KEY_BASE = 'collector_xp_';
const BADGES_KEY_BASE = 'collector_badges_';

type Badges = {
  connected?: boolean;
  voted?: boolean;
};

function getKeys(addr?: string) {
  const keySuffix = addr ? addr.toLowerCase() : 'anon';
  return {
    xpKey: `${XP_KEY_BASE}${keySuffix}`,
    badgesKey: `${BADGES_KEY_BASE}${keySuffix}`,
  };
}

export default function RewardsPage() {
  const { address, isConnected } = useAccount();
  const [xp, setXp] = useState<number>(0);
  const [badges, setBadges] = useState<Badges>({});

  // Load XP & badges when address changes
  useEffect(() => {
    const { xpKey, badgesKey } = getKeys(address);
    const savedXp = localStorage.getItem(xpKey);
    const savedBadges = localStorage.getItem(badgesKey);
    setXp(savedXp ? Number(savedXp) : 0);
    setBadges(savedBadges ? JSON.parse(savedBadges) : {});
  }, [address]);

  // Helper to persist
  const save = (nextXp: number, nextBadges: Badges) => {
    const { xpKey, badgesKey } = getKeys(address);
    localStorage.setItem(xpKey, String(nextXp));
    localStorage.setItem(badgesKey, JSON.stringify(nextBadges));
  };

  // Demo: award “Connected” badge + 10 XP the first time you land connected
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

  // Demo: detect “Voted” based on the simple poll’s localStorage
  useEffect(() => {
    if (!isConnected || !address) return;
    // This must match the POLL_ID from /vote
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

  const resetLocal = () => {
    const { xpKey, badgesKey } = getKeys(address);
    localStorage.removeItem(xpKey);
    localStorage.removeItem(badgesKey);
    setXp(0);
    setBadges({});
  };

  const Badge = ({ active, label }: { active?: boolean; label: string }) => (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs mr-2 mb-2 border ${
        active ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200'
      }`}
    >
      {label} {active ? '✓' : '–'}
    </span>
  );

  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="text-2xl font-semibold">Rewards</h1>
      <p className="text-gray-600 mt-1">Non-financial “Collector XP” and badges.</p>

      <div className="mt-4 rounded border p-4">
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
        <div>
          <Badge active={badges.connected} label="Connected" />
          <Badge active={badges.voted} label="Voted" />
        </div>
      </section>

      <div className="mt-4">
        <button
          onClick={resetLocal}
          className="rounded border px-3 py-1 text-sm"
          title="Clear local demo data"
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
