// Guided Link: engines/operators/index.js
// Operators engine: adds substrate console functions that call into substrate packages.

import { opRegister as _opRegister, opRun as _opRun, opList as _opList } from './index-legacy.js'; // retain local registry if present (see below)

// If this package is used in workspace, prefer substrate imports:
let coherence, awareness, unified, quantumAuth, quantumVerify;
try {
  coherence = await import('@umbrella/coherence-engine');
  awareness = await import('@umbrella/awareness-generator');
  unified = await import('@umbrella/unified-field');
  quantumAuth = await import('@umbrella/quantum-auth');
  quantumVerify = await import('@umbrella/quantum-verification');
} catch (err) {
  // fallback to no-op — functions below will throw if substrate not available
  // This supports running in environments where workspaces aren't linked yet.
  coherence = null;
  awareness = null;
  unified = null;
  quantumAuth = null;
  quantumVerify = null;
}

/* --- existing registry wrapper (keeping compatibility) --- */
const _registry = new Map();

export function opRegister(name, fn) {
  if (typeof name !== 'string' || typeof fn !== 'function') throw new Error('invalid args');
  _registry.set(name, fn);
  return { name, registeredAt: new Date().toISOString() };
}

export function opRun(name, ...args) {
  const fn = _registry.get(name);
  if (!fn) throw new Error('operator not found');
  return fn(...args);
}

export function opList() {
  return Array.from(_registry.keys());
}

/* --- Substrate console methods --- */

/**
 * runCoherence(targetId)
 * - Runs sim:coherence operator in the substrate for the specified target.
 */
export async function runCoherence(targetId, payload = {}) {
  if (!coherence || typeof coherence.runOperator !== 'function') {
    throw new Error('coherence engine not available');
  }
  // Ensure SIM operators registered
  if (typeof coherence.registerSimOperators === 'function') coherence.registerSimOperators();
  return await coherence.runOperator('sim:coherence', { targetId, payload });
}

/**
 * generateAwareness(targetId)
 * - Calls substrate awareness generator for a target.
 */
export async function generateAwareness(targetId, meta = {}) {
  if (!awareness || typeof awareness.generateAwarenessForTarget !== 'function') {
    throw new Error('awareness generator not available');
  }
  return awareness.generateAwarenessForTarget(targetId, meta);
}

/**
 * inspectUnifiedField(targetFieldId)
 * - Uses the substrate unified-field operator to transform and inspect canonical data.
 */
export async function inspectUnifiedField(fieldId, protocol = 'timestamp') {
  if (!coherence || typeof coherence.getField !== 'function') {
    throw new Error('coherence engine not available');
  }
  if (!unified || typeof unified.syncFieldToTarget !== 'function') {
    throw new Error('unified-field not available');
  }
  const field = coherence.getField(fieldId);
  if (!field) throw new Error('field not found');
  return unified.syncFieldToTarget(field.payload || {}, protocol);
}

/**
 * verifyQuantumIdentity(targetId)
 * - Uses quantum verification primitives to validate an identity (best-effort).
 */
export async function verifyQuantumIdentity(signature, payload) {
  if (!quantumVerify || typeof quantumVerify.verifySignature !== 'function') {
    throw new Error('quantum verification not available');
  }
  return quantumVerify.verifySignature(signature, payload);
}

export default { opRegister, opRun, opList, runCoherence, generateAwareness, inspectUnifiedField, verifyQuantumIdentity };
