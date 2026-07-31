// Guided Link: engines/games/index.js
// Games engine: when starting a session, create coherence field, generate awareness, sync unified field, and sign save.

let coherence, awareness, unified, quantumSigning;
try {
  coherence = await import('@umbrella/coherence-engine');
  awareness = await import('@umbrella/awareness-generator');
  unified = await import('@umbrella/unified-field');
  quantumSigning = await import('@umbrella/quantum-signing');
} catch (err) {
  coherence = awareness = unified = quantumSigning = null;
}

const _sessions = new Map();

export async function startSession(meta = {}) {
  const id = `game-${Date.now()}`;
  const session = { id, meta, startedAt: new Date().toISOString() };
  _sessions.set(id, session);

  // Create substrate coherence representation (best-effort)
  try {
    if (coherence && typeof coherence.createField === 'function') {
      const field = coherence.createField(`game:${id}`, { sessionMeta: meta });
      session.coherenceFieldId = field.id || `field:game:${id}`;
    } else if (coherence && typeof coherence.registerSimOperators === 'function') {
      // register operators and run sim:coherence if available
      coherence.registerSimOperators();
      const res = await coherence.runOperator('sim:coherence', { targetId: id, payload: { sessionMeta: meta } });
      session.coherenceFieldId = res.id || `field:game:${id}`;
    }
  } catch (err) {
    // non-fatal: attach warning
    session.coherenceError = String(err);
  }

  // Generate an initial awareness sample for NPCs / world
  try {
    if (awareness && typeof awareness.generateAwarenessForTarget === 'function') {
      const { stream, sample } = awareness.generateAwarenessForTarget(id, { context: 'game:start' });
      session.awarenessStreamId = stream.id;
      session.awarenessSample = sample;
    }
  } catch (err) {
    session.awarenessError = String(err);
  }

  // Sync a unified-field snapshot for the session state
  try {
    if (unified && typeof unified.syncFieldToTarget === 'function') {
      const payload = { id, meta, coherenceFieldId: session.coherenceFieldId };
      session.unifiedSnapshot = unified.syncFieldToTarget(payload, 'timestamp');
    }
  } catch (err) {
    session.unifiedError = String(err);
  }

  // Create a signed save for the initial session state
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
