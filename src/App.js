import React, { useState } from "react";
import "./style.css";
import { AssetSidebar } from './AssetSidebar.tsx';

const MOCK_ASSETS = [
  {
    id: "1",
    title: "Tesla Q3 Earnings Report",
    kind: "pdf",
    updatedAtMs: Date.now() - 1000 * 60 * 5, // 5 mins ago
    tags: ["Earnings", "EV"],
  },
  {
    id: "2",
    title: "Nvidia AI Chip Architecture",
    kind: "note",
    updatedAtMs: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
    tags: ["AI", "Hardware"],
  },
  {
    id: "3",
    title: "Macro Trends 2025",
    kind: "news",
    updatedAtMs: Date.now() - 1000 * 60 * 60 * 24 * 2, // 2 days ago
    tags: ["Economy"],
  }
];


export default function App() {
  // 2. ADD THIS LINE so 'selectedId' exists!
  const [selectedId, setSelectedId] = useState(null);

  return (
    <div style={{ padding: 20 }}>
      <h1>Dev Environment</h1>
      <div style={{ display: 'flex', height: 600, border: '1px solid #ccc' }}>
        
        <AssetSidebar 
          assets={MOCK_ASSETS} 
          selectedId={selectedId}
          onSelect={(id) => {
            console.log("Selected:", id);
            setSelectedId(id);
          }}
        />

        <div style={{ padding: 20, flex: 1, background: '#f9f9f9' }}>
          <h3>Main Content Area</h3>
          <p>Select an item from the sidebar to see it active.</p>
          <p>Current Selection ID: <strong>{selectedId || "None"}</strong></p>
        </div>
      </div>
    </div>
  );
}