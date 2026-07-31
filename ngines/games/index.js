// Guided Link: engines/games/index.js
// Games engine: when starting a session, create coherence field, generate awareness, sync unified field,
// and sign save. Uses dynamic imports to avoid top-level await and to gracefully degrade.

const _sessions = new Map();

async function _loadSubstrate() {
  const mods = {};
  try { mods.coherence = await import('@umbrella/coherence-engine'); } catch (e) { mods.coherence = null; }
  try { mods.awareness = await import('@umbrella/awareness-generator'); } catch (e) { mods.awareness = null; }
  try { mods.unified = await import('@umbrella/unified-field'); } catch (e) { mods.unified = null; }
  try { mods.quantumSigning = await import('@umbrella/quantum-signing'); } catch (e) { mods.quantumSigning = null; }
  return mods;
}

export async function startSession(meta = {}) {
  const id = `game-${Date.now()}`;
  const session = { id, meta, startedAt: new Date().toISOString() };
  _sessions.set(id, session);

  const { coherence, awareness, unified, quantumSigning } = await _loadSubstrate();

  // Coherence
  try {
    if (coherence && typeof coherence.createField === 'function') {
      const field = coherence.createField(`game:${id}`, { sessionMeta: meta });
      session.coherenceFieldId = field.id || `field:game:${id}`;
    } else if (coherence && typeof coherence.registerSimOperators === 'function') {
      coherence.registerSimOperators();
      const res = await coherence.runOperator('sim:coherence', { targetId: id, payload: { sessionMeta: meta } });
      session.coherenceFieldId = res.id || `field:game:${id}`;
    }
  } catch (err) {
    session.coherenceError = String(err);
  }

  // Awareness
  try {
    if (awareness && typeof awareness.generateAwarenessForTarget === 'function') {
      const { stream, sample } = awareness.generateAwarenessForTarget(id, { context: 'game:start' });
      session.awarenessStreamId = stream.id;
      session.awarenessSample = sample;
    }
  } catch (err) {
    session.awarenessError = String(err);
  }

  // Unified field snapshot
  try {
    if (unified && typeof unified.syncFieldToTarget === 'function') {
      const payload = { id, meta, coherenceFieldId: session.coherenceFieldId };
      session.unifiedSnapshot = unified.syncFieldToTarget(payload, 'timestamp');
    }
  } catch (err) {
    session.unifiedError = String(err);
  }

  // Signed save
  try {
    if (quantumSigning && typeof quantumSigning.createSignature === 'function') {
      const signature = quantumSigning.createSignature({ id, meta, ts: Date.now() }, { alg: 'stub' });
      session.saveSignature = signature;
    }
  } catch (err) {
    session.signError = String(err);
  }

  return session;
}

export function listSessions() {
  return Array.from(_sessions.values());
}

export default { startSession, listSessions };
