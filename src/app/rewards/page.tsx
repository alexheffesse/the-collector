'use client';

import { useEffect, useState } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import WalletWrapper from 'src/components/WalletWrapper';

const XP_KEY_BASE = 'collector_xp_';
const BADGES_KEY_BASE = 'collector_badges_';

type Badges = { connected?: boolean; voted?: boolean };

function getKeys(addr?: string) {
  const keySuffix = addr ? addr.toLowerCase() : 'anon';
  return {
    xpKey: `${XP_KEY_BASE}${keySuffix}`,
    badgesKey: `${BADGES_KEY_BASE}${keySuffix}`,
  };
}

// Use a simple function component (avoids any JSX parsing weirdness)
function Badge({ active, label }: { active?: boolean; label: string }) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs mr-2 mb-2 border ${
        active
          ? 'bg-green-100 text-green-800 border-green-200'
          : 'bg-gray-100 text-gray-600 border-gray-200'
      }`}
    >
      {label} {active ? '✓' : '–'}
    </span>
  );
}

export default function RewardsPage() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

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

  // Persist helper
  const save = (nextXp: number, nextBadges: Badges) => {
    const { xpKey, badgesKey } = getKeys(address);
    localStorage.setItem(xpKey, String(nextXp));
    localStorage.setItem(badgesKey, JSON.stringify(nextBadges));
  };

  // Award "Connected" the first time you connect on this wallet
  useEffect((

          className="rounded border px-3 py-1 text-sm"
          title="Clear local d

