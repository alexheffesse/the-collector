'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import WalletWrapper from 'src/components/WalletWrapper';

type Option = {
  id: string;
  label: string;        // e.g., "Artist — Work (Year)"
  note?: string;        // short blurb
  link?: string;        // optional Notion/provenance link
};

// ---- Configure your poll here ----
const POLL_ID = 'collector-q1-discovery';
const OPTIONS: Option[] = [
  { id: 'opt-1', label: 'Artist One — Untitled (2020)', link: 'https://www.notion.so' },
  { id: 'opt-2', label: 'Artist Two — Study for Grid (2018)', link: 'https://www.notion.so' },
  { id: 'opt-3', label: 'Artist Three — Monochrome Variation (2023)', link: 'https://www.notion.so' },
];
// ----------------------------------

const tallyStorageKey = (pollId: string) => `collector_poll_${pollId}_tally`;
const voterStorageKey  = (pollId: string, addr: string) => `collector_poll_${pollId}_voter_${addr.toLowerCase()}`;

type Tally = Record<string, number>; // optionId -> votes

export default function Page() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const [tally, setTally] = useState<Tally>({});
  const [hasVoted, setHasVoted] = useState(false);
  const [choice, setChoice] = useState<string>('');

  // Load existing (local) tally on mount
  useEffect(() => {
    const saved = localStorage.getItem(tallyStorageKey(POLL_ID));
    if (saved) setTally(JSON.parse(saved));
  }, []);

  // Check if this wallet has voted (local-only)
  useEffect(() => {
    if (isConnected && address) {
      const voted = !!localStorage.getItem(voterStorageKey(POLL_ID, address));
      setHasVoted(voted);
    } else {
      setHasVoted(false);
    }
  }, [isConnected, address]);

  const totalVotes = useMemo(
    () => Object.values(tally).reduce((a, b) => a + b, 0),
    [tally]
  );

  const submitVote = () => {
    if (!isConnected || !address) return;
    if (!choice)
