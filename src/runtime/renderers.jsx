// src/runtime/renderers.jsx
import React from 'react';
import simModule, * as simAliases from '../modules/sim/index.js';
import xrModule, * as xrAliases from '../modules/xr/index.js';
import identityModule, * as identityAliases from '../modules/identity-physics/index.js';
import operatorsModule, * as operatorsAliases from '../modules/operators/index.js';
import gamesModule, * as gamesAliases from '../modules/games/index.js';

// Build renderer objects for UnifiedSurface and export named render functions.
// Each module is expected to export:
// - a `renderer` object (id, title, description, content: JSX)
// - alias exports (e.g., simCreateSpace, operatorsOpRun, etc.)

function buildRenderer(id, moduleDefault, aliases) {
  const base = (moduleDefault && moduleDefault.renderer) ? moduleDefault.renderer : {};
  const renderer = {
    id,
    title: base.title || `${id.toUpperCase()} Module`,
    description: base.description || `Renderer for ${id}`,
    // Provide content that calls an appropriate alias if available.
    content: base.content || (
      <div className={`module-renderer module-${id}`} data-module={id}>
        <h3>{base.title || `${id.toUpperCase()} Module`}</h3>
        <p>{base.description || `Renderer for ${id}`}</p>
        <div>
          {/* Try to call a primary alias function if present (best-effort) */}
          <button
            onClick={() => {
              // pick a plausible alias function from the alias exports to demonstrate integration
              const candidateKeys = Object.keys(aliases).filter((k) => k.toLowerCase().includes(id));
              if (candidateKeys.length > 0 && typeof aliases[candidateKeys[0]] === 'function') {
                try { aliases[candidateKeys[0]](); } catch (e) { /* no-op */ }
              }
            }}
          >
            Run primary action
          </button>
        </div>
      </div>
    )
  };
  return { ...base, ...renderer };
}

export function getAllRenderers() {
  return [
    buildRenderer('sim', simModule, simAliases),
    buildRenderer('xr', xrModule, xrAliases),
    buildRenderer('identity-physics', identityModule, identityAliases),
    buildRenderer('operators', operatorsModule, operatorsAliases),
    buildRenderer('games', gamesModule, gamesAliases)
  ];
}

// Named render functions required by UnifiedSurface
export function renderSimModule() {
  return buildRenderer('sim', simModule, simAliases);
}
export function renderXrModule() {
  return buildRenderer('xr', xrModule, xrAliases);
}
export function renderIdentityModule() {
  return buildRenderer('identity-physics', identityModule, identityAliases);
}
export function renderOperatorsModule() {
  return buildRenderer('operators', operatorsModule, operatorsAliases);
}
export function renderGamesModule() {
  return buildRenderer('games', gamesModule, gamesAliases);
}

export default {
  getAllRenderers,
  renderSimModule,
  renderXrModule,
  renderIdentityModule,
  renderOperatorsModule,
  renderGamesModule
};
