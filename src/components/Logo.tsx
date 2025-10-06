// src/components/Logo.tsx
import * as React from 'react';

type LogoProps = {
  size?: 'sm' | 'md' | 'lg';
  showSymbol?: boolean; // set to true once we drop your SVG icon in
};

export default function Logo({ size = 'md', showSymbol = false }: LogoProps) {
  const sizeClass =
    size === 'sm' ? 'text-xl' :
    size === 'lg' ? 'text-3xl md:text-4xl' :
    'text-2xl';

  // TODO: Replace with your actual SVG icon when ready
  const Symbol = (
    <div
      aria-hidden
      className="h-6 w-6 rounded-[6px] bg-white/0"
    />
  );

  return (
    <div className="flex items-center gap-2">
      {showSymbol && Symbol}
      <span className={`font-semibold leading-none tracking-[-0.01em] ${sizeClass}`}>
        The&nbsp;Collector
      </span>
    </div>
  );
}
