import React,{ useEffect, useMemo, useState } from 'react';

type AssetKind = 'pdf' | 'note' | 'news';

export type Asset = {
  id: string;
  title: string;
  kind: AssetKind;
  updatedAtMs: number;
  tags?: string[];
  description?: string;
};

type AssetSidebarProps = {
  assets: Asset[];
  selectedId?: string;
  onSelect: (id: string) => void;
};

function minutesAgo(updatedAtMs: number): string {
  const mins = Math.round((Date.now() - updatedAtMs) / 60000);
  if (mins <= 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  return `${hours}h ago`;
}

const ITEMS_PER_PAGE = 10;

export function AssetSidebar(props: AssetSidebarProps) {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<'recent' | 'title' | 'tags'>('recent');
  const [onlyPinned, setOnlyPinned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  // persisted pinned state
  const [pinnedIds, setPinnedIds] = useState<Record<string, boolean>>(() => {
    const raw = localStorage.getItem('flagships.pins');
    return raw ? JSON.parse(raw) : {};
  });

  // keep a "visible list" in state so we can simulate a tiny delay while typing
  const [visibleAssets, setVisibleAssets] = useState<Asset[]>(props.assets);

  useEffect(() => {
    // "loading" effect when assets prop changes
    setLoading(true);
    setTimeout(() => setLoading(false), 200);
  }, [props.assets]);

  useEffect(() => {
    // persist pins
    localStorage.setItem('flagships.pins', JSON.stringify(pinnedIds));
  }, [pinnedIds]);

  useEffect(() => {
    const q = query.trim();

    // simulate a tiny delay so the UI doesn't feel "jumpy"
    setLoading(true);
    const timeoutId = setTimeout(() => {
      let next = props.assets;

      if (onlyPinned) {
        next = next.filter((a) => pinnedIds[a.id]);
      }

      if (q) {
        next = next.filter((a) => {
          if (sort === 'tags') {
            // Search by tags when Tags sort is selected
            return (a.tags || []).some((tag) =>
              tag.toLowerCase().includes(q.toLowerCase())
            );
          }
          // Search by title for Recent and Title sorts
          return a.title.toLowerCase().includes(q.toLowerCase());
        });
      }

      setVisibleAssets(next);
      setLoading(false);
    }, 150);

    return () => clearTimeout(timeoutId);
  }, [query, onlyPinned, sort]); // intentionally minimal deps

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [query, onlyPinned, sort]);

  const sorted = useMemo(() => {
    const sortFn = (a: Asset, b: Asset) => {
      // Pinned items always come first
      const aPinned = pinnedIds[a.id] ? 1 : 0;
      const bPinned = pinnedIds[b.id] ? 1 : 0;
      if (aPinned !== bPinned) return bPinned - aPinned;

      // Then apply the selected sort
      if (sort === 'title') {
        return a.title.localeCompare(b.title);
      }
      if (sort === 'tags') {
        const aTag = (a.tags || [])[0] || '';
        const bTag = (b.tags || [])[0] || '';
        return aTag.localeCompare(bTag);
      }
      return b.updatedAtMs - a.updatedAtMs;
    };
    return [...visibleAssets].sort(sortFn);
  }, [visibleAssets, sort, pinnedIds]);

  const displayedAssets = sorted.slice(0, visibleCount);
  const hasMore = visibleCount < sorted.length;

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  };

  return (
    <aside style={{ width: 320, borderRight: '1px solid #eee', padding: 12 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input
          value={query}
          placeholder="Search assets…"
          onChange={(e) => setQuery((e.target as HTMLInputElement).value)}
          style={{
            flex: 1,
            padding: '8px 10px',
            border: '1px solid #ddd',
            borderRadius: 8,
          }}
        />
        <select
          value={sort}
          onChange={(e) => setSort((e.target as HTMLSelectElement).value as any)}
          style={{ padding: 8, borderRadius: 8, border: '1px solid #ddd' }}
        >
          <option value="recent">Recent</option>
          <option value="title">Title</option>
          <option value="tags">Tags</option>
        </select>
      </div>

      <label style={{ display: 'flex', gap: 8, marginTop: 10, userSelect: 'none' }}>
        <input
          type="checkbox"
          checked={onlyPinned}
          onChange={() => setOnlyPinned(!onlyPinned)}
        />
        Pinned only
      </label>

      <div style={{ marginTop: 10, fontSize: 12, color: '#666' }}>
        {loading ? 'Loading…' : `${sorted.length} assets`}
      </div>

      <div style={{ marginTop: 10, maxHeight: 'calc(100vh - 120px)', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {displayedAssets.map((asset, idx) => {
          const isSelected = props.selectedId === asset.id;
          const isPinned = !!pinnedIds[asset.id];

          return (
            <div
              key={idx}
              onClick={() => props.onSelect(asset.id)}
              style={{
                padding: 10,
                borderRadius: 10,
                cursor: 'pointer',
                background: isSelected ? '#e8f4fc' : '#fff',
                border: isSelected ? '1px solid #4a90d9' : '1px solid #eee',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {asset.title}
                  </div>
                  <div style={{ fontSize: 12, color: '#666' }}>
                    {asset.kind} • {minutesAgo(asset.updatedAtMs)}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      setPinnedIds({ ...pinnedIds, [asset.id]: !isPinned });
                    }}
                    style={{
                      opacity: isPinned ? 1 : 0.3,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    title={isPinned ? 'Unpin' : 'Pin'}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="black"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M16 4V2H8v2H2v2h2l1.5 9H6v2h5v5l1 1 1-1v-5h5v-2h-.5L19 6h2V4h-5zm.5 9h-9L6.2 6h11.6l-1.3 7z" />
                    </svg>
                  </span>

                  </div>
              </div>
              {asset.tags && asset.tags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
                  {asset.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: 11,
                        color: '#666',
                        background: '#f0f0f0',
                        padding: '2px 6px',
                        borderRadius: 4,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        {hasMore && (
          <button
            onClick={handleShowMore}
            style={{
              padding: '10px 16px',
              marginTop: 4,
              border: '1px solid #ddd',
              borderRadius: 8,
              background: '#f9f9f9',
              cursor: 'pointer',
              fontSize: 13,
            }}
          >
            Show More ({sorted.length - visibleCount} remaining)
          </button>
        )}
      </div>
    </aside>
  );
}