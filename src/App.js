import React, { useState, useMemo } from "react";
import "./style.css";
import { AssetSidebar } from './AssetSidebar.tsx';
import { AssetReviewer } from './components/AssetReviewer.tsx';
import { mockAssets } from './mockAssets.ts';

export default function App() {
  const [selectedId, setSelectedId] = useState(null);
  const selectedAsset = useMemo(
    () => mockAssets.find(a => a.id === selectedId),
    [selectedId]
  );

  return (
    <div>
      <h1>Hello StackBlitz!</h1>
      <div style={{ display: 'flex'}}>
        <AssetSidebar assets={mockAssets} selectedId={selectedId} onSelect={setSelectedId}/>
        <AssetReviewer selectedAsset={selectedAsset} />
      </div>
    </div>
  );
}
