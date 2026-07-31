// src/runtime/unified-surface.jsx
import React, { useMemo } from 'react';
import {
  getAllRenderers,
  renderSimModule,
  renderXrModule,
  renderIdentityModule,
  renderOperatorsModule,
  renderGamesModule
} from './renderers.jsx';

// UnifiedSurface: gallery of renderer objects and programmatic render functions.
// Exposes the named render functions required by the briefing.

export default function UnifiedSurface() {
  const renderers = useMemo(() => getAllRenderers(), []);

  return (
    <div className="unified-surface">
      <header className="us-header" role="banner">
        <h1>Portal‑OS‑v3</h1>
        <p className="muted">UnifiedSurface — module renderer gallery</p>
      </header>

      <main className="us-main" role="main">
        <section className="renderer-list" aria-label="Module renderers">
          {renderers.map((r) => (
            <article key={r.id} className="renderer-card" data-module={r.id}>
              <div className="renderer-meta">
                <strong>{r.title}</strong>
                <p>{r.description}</p>
              </div>
              <div className="renderer-content">{r.content}</div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

// Re-export the named renderer functions so other parts of the runtime (Dock, Shell) can import them.
export { renderSimModule, renderXrModule, renderIdentityModule, renderOperatorsModule, renderGamesModule };
