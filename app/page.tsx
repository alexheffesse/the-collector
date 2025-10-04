export default function Home() {
  const link = (href: string, label: string) => (
    <a
      href={href}
      style={{
        display: 'block',
        padding: '12px 16px',
        margin: '8px 0',
        border: '1px solid #ddd',
        borderRadius: 8,
        textDecoration: 'none',
        color: '#111'
      }}
    >
      {label}
    </a>
  );

  return (
    <main style={{padding: 24, fontFamily: 'system-ui, sans-serif'}}>
      <h1 style={{marginBottom: 8}}>The Collector</h1>
      <p style={{marginTop: 0, color: '#555'}}>
        Base (testnet) scaffold — choose a section:
      </p>
      {link('/collection', 'Collection')}
      {link('/vote', 'Vote')}
      {link('/rewards', 'Rewards')}
      {link('/mini', 'Mini App Entry')}
      {link('/ok', 'OK (sanity page)')}
    </main>
  );
}
