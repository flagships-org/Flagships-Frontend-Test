import React from "react";
import "./style.css";
import { AssetSidebar } from './AssetSidebar.tsx';
import { mockAssets } from './mockAssets.ts';

export default function App() {
  return (
    <div>
      <h1>Hello StackBlitz!</h1>
      <div style={{ display: 'flex'}}>
      <AssetSidebar assets={mockAssets}  onSelect={(x) => console.log(x)}/>
      </div>
    </div>
  );
}
