// src/runtime/dock.jsx
import React from 'react';
import EventBus from './event-bus.js';
import { renderSimModule, renderXrModule, renderIdentityModule, renderOperatorsModule, renderGamesModule } from './renderers.jsx';

// Dock provides quick-launch buttons for module renderers and focuses existing windows when appropriate.
export default function Dock() {
  function openModule(rendererFn) {
    try {
      const renderer = rendererFn();
      const win = {
        id: `${renderer.id}-${Date.now()}`,
        title: renderer.title,
        module: renderer.id,
        content: renderer.content
      };
      EventBus.emit('open:window', win);
    } catch (e) {
      EventBus.emit('notify', `Failed to open module: ${e.message}`);
    }
  }

  return (
    <nav className="dock" aria-label="Dock">
      <button onClick={() => openModule(renderSimModule)}>SIM</button>
      <button onClick={() => openModule(renderXrModule)}>XR</button>
      <button onClick={() => openModule(renderIdentityModule)}>Identity</button>
      <button onClick={() => openModule(renderOperatorsModule)}>Operators</button>
      <button onClick={() => openModule(renderGamesModule)}>Games</button>
    </nav>
  );
}
