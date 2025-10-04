export default function Home() {
  const Link = (href: string, label: string) => (
    <a
      href={href}
      className="rounded border px-3 py-1 text-sm hover:bg-gray-50 inline-block mr-2 mb-2"
    >
      {label}
    </a>
  );

  return (
    <main className="p-6 font-sans">
      <h1 className="text-2xl font-semibold mb-2">The Collector</h1>
      <p className="text-gray-600 mb-4">Base (testnet) scaffold — choose a section:</p>
      {Link('/collection','Collection')}
      {Link('/vote','Vote')}
      {Link('/rewards','Rewards')}
      {Link('/mini','Mini App Entry')}
      {Link('/ok','OK (sanity)')}
    </main>
  );
}
