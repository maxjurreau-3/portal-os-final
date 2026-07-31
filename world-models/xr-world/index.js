// Guided Link: world-models/xr-world/index.js
// XR World model: binds XR scenes to substrate primitives:
// - Coherence overlay: ensure scene coherence field exists / updated
// - Awareness visualization: produce awareness samples for scenes
// - Unified Field binding: produce canonical scene snapshots

export async function buildXrWorldSnapshot(opts = {}) {
  const mods = {};
  try { mods.xr = await import('@umbrella/xr-engine'); } catch (e) { mods.xr = null; }
  try { mods.coherence = await import('@umbrella/coherence-engine'); } catch (e) { mods.coherence = null; }
  try { mods.awareness = await import('@umbrella/awareness-generator'); } catch (e) { mods.awareness = null; }
  try { mods.unified = await import('@umbrella/unified-field'); } catch (e) { mods.unified = null; }

  if (!mods.xr) throw new Error('xr engine not available');

  const scenes = typeof mods.xr.listScenes === 'function' ? mods.xr.listScenes() : [];
  const world = [];

  for (const s of scenes) {
    const entry = { scene: s, coherence: null, awareness: null, unified: null };

    // Coherence overlay: create/update field for scene
    try {
      if (mods.coherence && typeof mods.coherence.registerSimOperators === 'function') {
        mods.coherence.registerSimOperators();
        entry.coherence = await mods.coherence.runOperator('sim:coherence', { targetId: s.id, payload: s });
      } else if (mods.coherence && typeof mods.coherence.createField === 'function') {
        entry.coherence = mods.coherence.createField(`xr:${s.id}`, { payload: s });
      }
    } catch (e) {
      entry.coherenceError = String(e);
    }

    // Awareness visualization: generate awareness sample for scene
    try {
      if (mods.awareness && typeof mods.awareness.generateAwarenessForTarget === 'function') {
        const { stream, sample } = mods.awareness.generateAwarenessForTarget(s.id, { context: 'xr-scene' });
        entry.awareness = { stream, sample };
      }
    } catch (e) {
      entry.awarenessError = String(e);
    }

    // Unified field binding: sync canonical scene snapshot
    try {
      if (mods.unified && typeof mods.unified.syncFieldToTarget === 'function') {
        entry.unified = mods.unified.syncFieldToTarget({ scene: s, coherence: entry.coherence }, opts.protocol || 'shallow-hash');
      }
    } catch (e) {
      entry.unifiedError = String(e);
    }

    world.push(entry);
  }

  return { createdAt: new Date().toISOString(), count: world.length, world };
}

export default { buildXrWorldSnapshot };
