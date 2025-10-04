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

  // Award “Connected” the first time you connect on this wallet
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
  }, [isConnect]()
