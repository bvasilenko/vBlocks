import React, { useState, useEffect, useMemo } from 'react';
import { registry } from '@booga/vblocks';

// ---------------------------------------------------------------------------
// Registry-driven: every block comes from @booga/vblocks' exported `registry`.
// Add a block to the package -> it appears here automatically, no demo edit.
// ---------------------------------------------------------------------------
let seed = 1;
function realImages(v) {
  if (typeof v === 'string') {
    const m = v.match(/placehold\.co\/(\d+)x(\d+)/);
    return m ? `https://picsum.photos/seed/vb${seed++}/${m[1]}/${m[2]}` : v;
  }
  if (Array.isArray(v)) return v.map(realImages);
  if (v && typeof v === 'object') {
    const o = {};
    for (const k of Object.keys(v)) o[k] = realImages(v[k]);
    return o;
  }
  return v;
}

const ENTRIES = Object.entries(registry).map(([id, meta]) => {
  const [category, variant] = id.split('/');
  return {
    id,
    slug: id.replace('/', '-'),
    category,
    variant,
    Component: meta.component,
    content: realImages(meta.default),
  };
});

const CATEGORIES = [...new Set(ENTRIES.map((e) => e.category))];
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export function App() {
  const [dark, setDark] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  const shown = useMemo(
    () => (filter === 'all' ? ENTRIES : ENTRIES.filter((e) => e.category === filter)),
    [filter],
  );

  const jump = (slug) => {
    document.getElementById('block-' + slug)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header ------------------------------------------------------------ */}
      <header className="sticky top-0 z-30 flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-border bg-card px-6 py-3">
        <div className="flex items-baseline gap-3">
          <span className="text-base font-bold tracking-tight">@booga/vblocks</span>
          <span className="text-xs text-muted-foreground">
            {shown.length}
            {filter === 'all' ? '' : ' of ' + ENTRIES.length} blocks · {CATEGORIES.length} categories
          </span>
        </div>
        <div className="flex flex-1 flex-wrap items-center gap-1.5">
          <Chip active={filter === 'all'} onClick={() => setFilter('all')}>All</Chip>
          {CATEGORIES.map((c) => (
            <Chip key={c} active={filter === c} onClick={() => setFilter(c)}>{cap(c)}</Chip>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setDark((d) => !d)}
          aria-pressed={dark}
          className="shrink-0 rounded-md border border-border px-3 py-1 text-xs font-semibold hover:bg-accent"
        >
          {dark ? '☾ Dark' : '☀ Light'}
        </button>
      </header>

      <div className="mx-auto flex max-w-[1400px] gap-0">
        {/* TOC sidebar ---------------------------------------------------- */}
        <nav className="sticky top-[57px] hidden h-[calc(100vh-57px)] w-60 shrink-0 overflow-y-auto border-r border-border bg-card px-3 py-4 lg:block">
          {CATEGORIES.filter((c) => filter === 'all' || c === filter).map((c) => (
            <div key={c} className="mb-3">
              <div className="px-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                {cap(c)}
              </div>
              {ENTRIES.filter((e) => e.category === c).map((e) => (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => jump(e.slug)}
                  className="block w-full rounded px-2 py-1 text-left text-sm hover:bg-accent hover:text-accent-foreground"
                >
                  {e.variant}
                </button>
              ))}
            </div>
          ))}
        </nav>

        {/* Block stream --------------------------------------------------- */}
        <main className="min-w-0 flex-1">
          {shown.map((e) => (
            <section key={e.id} id={'block-' + e.slug} className="scroll-mt-[57px]">
              <div className="flex items-center gap-2 border-b border-border bg-card px-6 py-2">
                <code className="text-xs font-semibold">{e.id}</code>
                <span className="rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                  {e.variant}
                </span>
              </div>
              <div className="border-b-8 border-border">
                <e.Component content={e.content} />
              </div>
            </section>
          ))}
        </main>
      </div>
    </div>
  );
}

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={
        'rounded-full px-2.5 py-1 text-xs font-medium transition-colors ' +
        (active
          ? 'bg-primary text-primary-foreground'
          : 'border border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground')
      }
    >
      {children}
    </button>
  );
}
