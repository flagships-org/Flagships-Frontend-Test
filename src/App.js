import React from "react";
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


export default function App() {
  return (
    <div>
      <h1>Hello StackBlitz!</h1>
      <div style={{ display: 'flex', height: 500 }}>
      <AssetSidebar assets={DUMMY_ASSETS}  onSelect={(x) => console.log(x)}/>
      </div>
    </div>
  );
}
