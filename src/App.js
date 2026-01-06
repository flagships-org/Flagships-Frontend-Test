import React from "react";
import "./style.css";
import { AssetSidebar } from './AssetSidebar.tsx';
const now = Date.now();

export default function App() {
  return (
    <div>
      <h1>Hello StackBlitz!</h1>
      <div style={{ display: 'flex', height: 500 }}>
      <AssetSidebar assets={[]}  onSelect={(x) => console.log(x)}/>
      </div>
    </div>
  );
}
