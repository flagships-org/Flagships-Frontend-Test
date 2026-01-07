import {React, useState, useEffect} from "react";
import "./style.css";
import { AssetSidebar } from './AssetSidebar.tsx';
const now = Date.now();

const DUMMY_ASSETS = [
  { id: '1', title: 'Q3 Financial Report.pdf', kind: 'pdf', updatedAtMs: Date.now() - 1000 * 60 * 5, tags: ['finance'] },
  { id: '2', title: 'Meeting Notes - Aug', kind: 'note', updatedAtMs: Date.now() - 1000 * 60 * 60 * 2, tags: ['meeting', 'team'] },
  { id: '3', title: 'Competitor Analysis', kind: 'news', updatedAtMs: Date.now() - 1000 * 60 * 60 * 24, tags: ['strategy'] },
  { id: '4', title: 'Project Alpha Specs', kind: 'pdf', updatedAtMs: Date.now() - 1000 * 60 * 60 * 24 * 3, tags: ['specs'] },
  { id: '5', title: 'Design Assets', kind: 'note', updatedAtMs: Date.now() - 1000 * 60 * 60 * 24 * 7,tags: ['specs'] },
  { id: '6', title: 'Engineering Onboarding', kind: 'note', updatedAtMs: Date.now() - 1000 * 60 * 30, tags: ['hr', 'onboarding'] },
  { id: '7', title: 'TechCrunch: AI Startups', kind: 'news', updatedAtMs: Date.now() - 1000 * 60 * 60 * 48, tags: ['market', 'ai'] },
  { id: '8', title: 'Untitled Document', kind: 'pdf', updatedAtMs: Date.now() - 1000 * 60 * 60 * 24 * 14, tags: [] },
  { id: '9', title: 'Very Long Title That Might Break The Layout If We Are Not Careful About CSS Overflow Rules', kind: 'note', updatedAtMs: Date.now() - 1000 * 60 * 60 * 5, tags: ['test'] }, // Long title test
  { id: '10', title: 'Urgent: Server Logs', kind: 'pdf', updatedAtMs: Date.now() - 1000 * 30, tags: ['devops', 'urgent'] }, 
];

function AssetDetails({ asset }) {
  return (
    <div>
      <h1 style={{ marginTop: 0 }}>{asset.title}</h1>

      <div style={{ color: '#666', marginBottom: 12 }}>
        {asset.kind} • last updated {new Date(asset.updatedAtMs).toLocaleString()}
      </div>

      {asset.tags && asset.tags.length > 0 && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {asset.tags.map(tag => (
            <span
              key={tag}
              style={{
                fontSize: 12,
                padding: '4px 8px',
                background: '#f1f1f1',
                borderRadius: 12,
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}


export default function App() {
  const [selectedId, setSelectedId] = useState(() => {
    const raw = localStorage.getItem('flagships.selectedAsset');
    return raw ? JSON.parse(raw) : undefined;
  });

  useEffect(() => {
  if (selectedId) {
    localStorage.setItem(
      'flagships.selectedAsset',
      JSON.stringify(selectedId)
    );
  }
}, [selectedId]);
  const selectedAsset = DUMMY_ASSETS.find(asset => asset.id === selectedId);
  return (
    <div>
      <h1>Hello StackBlitz!</h1>
      <div style={{ display: 'flex', height: 500, gap: "20px"}}>
        <AssetSidebar assets={DUMMY_ASSETS}  selectedId={selectedId} onSelect={setSelectedId}/>
        {selectedAsset ? (
              <AssetDetails asset={selectedAsset} />
            ) : (
              <div style={{ color: '#888' }}>
                Select an asset
              </div>
        )}
      </div>
    </div>
  );
}
