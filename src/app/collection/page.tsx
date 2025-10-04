'use client';

type Artwork = {
  id: string;
  title: string;
  artist: string;
  year?: string;
  status: 'Owned' | 'Candidate';
  provenanceUrl?: string; // can be a Notion link for now
};

const ARTWORKS: Artwork[] = [
  {
    id: 'a1',
    title: 'Untitled (Placeholder #1)',
    artist: 'Artist One',
    year: '2020',
    status: 'Candidate',
    provenanceUrl: 'https://www.notion.so', // replace later
  },
  {
    id: 'a2',
    title: 'Study for Grid',
    artist: 'Artist Two',
    year: '2018',
    status: 'Owned',
    provenanceUrl: 'https://www.notion.so',
  },
  {
    id: 'a3',
    title: 'Monochrome Variation',
    artist: 'Artist Three',
    year: '2023',
    status: 'Candidate',
    provenanceUrl: 'https://www.notion.so',
  },
];

export default function Page() {
  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-2xl font-semibold mb-2">Collection</h1>
      <p className="text-gray-600 mb-6">
        Placeholder list. We’ll later sync this from Notion and onchain provenance.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ARTWORKS.map((art) => (
          <article
            key={art.id}
            className="rounded-xl border p-4 hover:shadow-sm transition"
          >
            <header className="mb-2">
              <h2 className="font-semibold leading-tight">{art.title}</h2>
              <p className="text-sm text-gray-600">
                {art.artist} {art.year ? `· ${art.year}` : ''}
              </p>
            </header>

            <div className="mt-3 flex items-center justify-between">
              <span
                className={`text-xs px-2 py-1 rounded ${
                  art.status === 'Owned'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-blue-100 text-blue-700'
                }`}
              >
                {art.status}
              </span>

              {art.provenanceUrl && (
                <a
                  href={art.provenanceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs underline hover:opacity-80"
                >
                  Provenance
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
