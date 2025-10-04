'use client';

import { useEffect, useMemo, useState } from 'react';
import { ConnectButton } from '@coinbase/onchainkit';
import { useAccount } from 'wagmi';

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
  const [tally, setTally] = useState<Tally>({});
  const [hasVoted, setHasVoted] = useState(false);
  const [choice, setChoice] = useState<string>('');

  // Load existing (local) tally & my vote on mount
  useEffect(() => {
    const saved = localStorage.getItem(tallyStorageKey(POLL_ID));
    if (saved) setTally(JSON.parse(saved));
  }, []);
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
    if (!choice) return;

    // enforce one vote per wallet (client-side only)
    const voterKey = voterStorageKey(POLL_ID, address);
    if (localStorage.getItem(voterKey)) {
      alert('You already voted in this poll on this device.');
      return;
    }

    const next: Tally = { ...tally, [choice]: (tally[choice] || 0) + 1 };
    setTally(next);
    localStorage.setItem(tallyStorageKey(POLL_ID), JSON.stringify(next));
    localStorage.setItem(voterKey, '1');
    setHasVoted(true);
  };

  // Dev/testing helper: clear local vote
  const resetMyVote = () => {
    if (!address) return;
    const voterKey = voterStorageKey(POLL_ID, address);
    const myChoice = choice || ''; // not tracked post-vote; this is just to let you re-vote in demos
    localStorage.removeItem(voterKey);
    setHasVoted(false);
    if (myChoice && tally[myChoice]) {
      const next = { ...tally, [myChoice]: Math.max(0, (tally[myChoice] || 1) - 1) };
      setTally(next);
      localStorage.setItem(tallyStorageKey(POLL_ID), JSON.stringify(next));
    }
  };

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-semibold">Discovery Poll</h1>
      <p className="text-gray-600 mt-1">
        One vote per wallet (local-only demo). Final on-chain vote comes later.
      </p>

      <div className="mt-4 mb-6">
        <ConnectButton />
      </div>

      {!isConnected && (
        <p className="text-sm text-gray-600 mb-6">
          Connect a wallet to vote.
        </p>
      )}

      <section className="space-y-3">
        {OPTIONS.map((opt) => {
          const count = tally[opt.id] || 0;
          const pct = totalVotes ? Math.round((count / totalVotes) * 100) : 0;
        return (
          <article key={opt.id} className="rounded-xl border p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="radio"
                name="discovery"
                value={opt.id}
                className="mt-1"
                disabled={!isConnected || hasVoted}
                onChange={() => setChoice(opt.id)}
              />
              <div className="flex-1">
                <div className="font-medium">{opt.label}</div>
                {opt.note && <div className="text-sm text-gray-600">{opt.note}</div>}
                {opt.link && (
                  <a
                    href={opt.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs underline text-gray-700"
                  >
                    Provenance / Notion
                  </a>
                )}
                <div className="mt-2 h-2 w-full rounded bg-gray-100">
                  <div
                    className="h-2 rounded bg-indigo-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="mt-1 text-xs text-gray-600">
                  {count} vote{count === 1 ? '' : 's'} {totalVotes ? `(${pct}%)` : ''}
                </div>
              </div>
            </label>
          </article>
        );
        })}
      </section>

      <div className="mt-6 flex gap-3">
        <button
          onClick={submitVote}
          disabled={!isConnected || hasVoted || !choice}
          className="rounded bg-black text-white px-4 py-2 disabled:opacity-50"
        >
          Submit vote
        </button>

        {/* dev/testing helper */}
        <button
          onClick={resetMyVote}
          disabled={!isConnected}
          className="rounded border px-4 py-2 text-sm"
          title="Local-only reset for demos"
        >
          Reset my local vote
        </button>
      </div>

      <p className="text-xs text-gray-500 mt-4">
        Demo note: votes and tallies are stored in your browser only (localStorage).
        In production we’ll store votes on-chain (snapshot-style off-chain + on-chain final, or fully on-chain).
      </p>
    </main>
  );
}
