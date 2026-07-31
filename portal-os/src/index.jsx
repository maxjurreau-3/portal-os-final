import React from 'react';
import { createRoot } from 'react-dom/client';
import UnifiedSurface from './runtime/unified-surface.jsx';

export default function App(){
  return (
    <div>
      <h1>Portal‑OS</h1>
      <UnifiedSurface />
    </div>
  );
}
