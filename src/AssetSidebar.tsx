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
  const [sort, setSort] = useState<'recent' | 'title'>('recent');
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
  }, []); // intentionally simple

  useEffect(() => {
    const q = query.trim();

    // simulate a tiny delay so the UI doesn't feel "jumpy"
    setLoading(true);
    setTimeout(() => {
      let next = props.assets;

      if (onlyPinned) {
        next = next.filter((a) => pinnedIds[a.id]);
      }

      if (q) {
        next = next.filter((a) => {
          return (
            a.title.includes(q) ||
            (a.tags || []).join(',').includes(q)
          );
        });
      }

      setVisibleAssets(next);
      setLoading(false);
    }, 150);
  }, [query, onlyPinned, sort]); // intentionally minimal deps

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [query, onlyPinned, sort]);

  const sorted = useMemo(() => {
    if (sort === 'title') {
      return visibleAssets.sort((a, b) => a.title.localeCompare(b.title));
    }
    return visibleAssets.sort((a, b) => b.updatedAtMs - a.updatedAtMs);
  }, [visibleAssets, sort]);

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
                      fontSize: 16,
                      opacity: isPinned ? 1 : 0.35,
                      cursor: 'pointer',
                    }}
                    title={isPinned ? 'Unpin' : 'Pin'}
                  >
                    ★
                  </span>

                  <span style={{ fontSize: 12, color: '#999' }}>
                    {asset.tags && asset.tags.length ? asset.tags[0] : ''}
                  </span>
                </div>
              </div>

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