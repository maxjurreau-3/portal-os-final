import React, { useState } from 'react';

/**
 * WorldModelsPanel
 * - Dynamic client-side inspector for the world-model modules you added.
 * - Buttons map to dynamic imports and call the build functions.
 *
 * Usage: import and render inside UnifiedSurface or any runtime UI.
 */

const ACTIONS = [
  {
    id: 'sim',
    label: 'Build SIM World Snapshot',
    importPath: '@umbrella/sim-world',
    fn: 'buildSimWorldSnapshot'
  },
  {
    id: 'xr',
    label: 'Build XR World Snapshot',
    importPath: '@umbrella/xr-world',
    fn: 'buildXrWorldSnapshot'
  },
  {
    id: 'identity',
    label: 'Build Identity World Snapshot',
    importPath: '@umbrella/identity-physics-world',
    fn: 'buildIdentityWorldSnapshot'
  },
  {
    id: 'quantum',
    label: 'Build Quantum World Snapshot',
    importPath: '@umbrella/quantum-world',
    fn: 'buildQuantumWorldSnapshot'
  },
  {
    id: 'architect',
    label: 'Build Architectural Digest',
    importPath: '@umbrella/meta-architect',
    fn: 'buildArchitecturalDigest'
  }
];

export default function WorldModelsPanel() {
  const [loading, setLoading] = useState(null);
  const [output, setOutput] = useState('');
  const [lastAction, setLastAction] = useState(null);

  async function runAction(action) {
    setLoading(action.id);
    setLastAction(action.id);
    setOutput('');
    try {
      // Dynamic import — safe in browser build; will fail gracefully if module not bundled
      const mod = await import(/* @vite-ignore */ action.importPath);
      if (!mod || typeof mod[action.fn] !== 'function') {
        throw new Error(`Module loaded but function "${action.fn}" not found`);
      }
      const res = await Promise.resolve(mod[action.fn]());
      setOutput(JSON.stringify(res, null, 2));
    } catch (err) {
      // Present a helpful error message rather than raw stack
      const msg = err && err.message ? err.message : String(err);
      setOutput(`Error running ${action.label}:\n${msg}\n\n(If this says "Cannot find module", the world-model package may not be bundled into the client; consider using a server-side /functions endpoint.)`);
    } finally {
      setLoading(null);
    }
  }

  function clear() {
    setOutput('');
    setLastAction(null);
  }

  function copyOutput() {
    if (!output) return;
    navigator.clipboard?.writeText(output).catch(() => {});
  }

  return (
    <div style={{
      border: '1px solid rgba(0,0,0,0.08)',
      padding: 12,
      borderRadius: 6,
      background: 'var(--surface-2, #fafafa)',
      maxWidth: 980,
      margin: '8px 0'
    }}>
      <h3 style={{ margin: '0 0 8px 0' }}>World‑Models Panel</h3>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
        {ACTIONS.map(a => (
          <button
            key={a.id}
            onClick={() => runAction(a)}
            disabled={loading !== null}
            style={{
              padding: '8px 10px',
              borderRadius: 6,
              border: '1px solid rgba(0,0,0,0.06)',
              background: loading === a.id ? '#eef' : '#fff',
              cursor: 'pointer'
            }}
            title={a.importPath + ' → ' + a.fn}
          >
            {loading === a.id ? 'Running…' : a.label}
          </button>
        ))}
        <button onClick={clear} style={{ padding: '8px 10px', borderRadius: 6 }}>Clear</button>
        <button onClick={copyOutput} style={{ padding: '8px 10px', borderRadius: 6 }} disabled={!output}>Copy JSON</button>
      </div>

      <div style={{
        fontFamily: 'monospace',
        fontSize: 12,
        whiteSpace: 'pre-wrap',
        background: 'rgba(0,0,0,0.03)',
        padding: 10,
        borderRadius: 6,
        minHeight: 80,
        maxHeight: 420,
        overflow: 'auto'
      }}>
        {output || (lastAction ? 'No output yet — click a button to run the action.' : 'Run a world-model action to see the result here.')}
      </div>

      <div style={{ marginTop: 8, fontSize: 12, color: 'rgba(0,0,0,0.6)' }}>
        Note: dynamic imports may fail in the browser if a module is server-only. If you see "Cannot find module", ask me to add a server-side debug endpoint.
      </div>
    </div>
  );
}
