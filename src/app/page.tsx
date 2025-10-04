// app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <section className="mx-auto max-w-4xl text-center py-16 md:py-24">
      <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">
        The Collector
      </h1>

      <p className="mt-4 text-base md:text-lg opacity-80">
        A community-governed art collection on Base. Join early curators, vote on acquisitions,
        and help build a transparent cultural treasury.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="https://forms.gle/7LvoD4iZoHSDbQgt7"
          className="rounded-2xl px-6 py-3 text-base font-medium bg-white text-black hover:opacity-90 w-full sm:w-auto text-center"
          target="_blank"
          rel="noopener noreferrer"
        >
          Join Allowlist
        </Link>

        <Link
          href="https://discord.gg/Pts2DU73Sr"
          className="rounded-2xl px-6 py-3 text-base font-medium ring-1 ring-white/20 hover:bg-white/10 w-full sm:w-auto text-center"
          target="_blank"
          rel="noopener noreferrer"
        >
          Join Discord
        </Link>
      </div>
    </section>
  );
}
