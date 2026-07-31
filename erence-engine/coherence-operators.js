// Guided Link: substrate/coherence-engine/coherence-operators.js
// Coherence operator registry + SIM-specific operator implementations.
//
// Operators included:
// - sim:coherence           → apply coherence rules to a target (create/update coherence field)
// - sim:awareness          → generate awareness samples for a target
// - sim:unified-sync      → sync a target into the unified field (transform/store)
//
// These operators are intentionally simple and call into sibling substrate modules:
// - ../coherence-field.js
// - ../../awareness-generator/index.js
// - ../../unified-field/index.js

import { createFieldRecord, getFieldRecord } from './coherence-field.js';
import { createRawSample } from '../awareness-generator/awareness-stream.js';
import { applyProtocol } from '../unified-field/field-protocols.js';

const _operators = new Map();

export function registerOperator(name, fn) {
  if (typeof name !== 'string' || typeof fn !== 'function') {
    throw new TypeError('registerOperator expects (string, function)');
  }
  _operators.set(name, fn);
  return { name, registeredAt: new Date().toISOString() };
}

export async function runOperator(name, ...args) {
  const fn = _operators.get(name);
  if (!fn) throw new Error(`operator "${name}" not found`);
  return await Promise.resolve().then(() => fn(...args));
}

export function listOperators() {
  return Array.from(_operators.keys());
}

/* ----- SIM-specific operator implementations ----- */

/**
 * Operator: sim:coherence
 * - Ensures a coherence field exists for a target and applies a simple merge/update.
 * Usage: runOperator('sim:coherence', { targetId, payload })
 */
function _op_sim_coherence({ targetId, payload = {} } = {}) {
  if (!targetId) throw new TypeError('targetId required');
  // Create or update a simple field record keyed by targetId
  const id = `field:sim:${targetId}`;
  const existing = getFieldRecord(id);
  if (existing) {
    existing.updatedAt = new Date().toISOString();
    existing.payload = { ...existing.payload, ...payload };
    return existing;
  }
  const rec = createFieldRecord(`sim:${targetId}`, { targetId, payload });
  // We want a stable id for target-based lookup, so override with explicit id
  rec.id = id;
  return rec;
}

/**
 * Operator: sim:awareness
 * - Produce an awareness sample for the given target using awareness-stream primitives.
 * Usage: runOperator('sim:awareness', { targetId, meta })
 */
function _op_sim_awareness({ targetId, meta = {} } = {}) {
  if (!targetId) throw new TypeError('targetId required');
  const stream = { id: `aw:${targetId}`, createdAt: new Date().toISOString(), opts: { targetId } };
  const sample = createRawSample(stream);
  sample.meta = { ...sample.meta, ...meta, targetId };
  return sample;
}

/**
 * Operator: sim:unified-sync
 * - Apply a simple unified-field protocol transform to the target's coherence payload.
 * Usage: runOperator('sim:unified-sync', { fieldId, protocol })
 */
function _op_sim_unified_sync({ fieldId, protocol = 'timestamp' } = {}) {
  if (!fieldId) throw new TypeError('fieldId required');
  const field = getFieldRecord(fieldId);
  if (!field) throw new Error('field not found');
  const transformed = applyProtocol(field.payload || {}, protocol);
  // Return the transformed canonical object (no persistence here — higher-level code may persist)
  return { fieldId, protocol, transformed, transformedAt: new Date().toISOString() };
}

/**
 * Register the default SIM operators into the registry.
 */
export function registerSimOperators() {
  registerOperator('sim:coherence', _op_sim_coherence);
  registerOperator('sim:awareness', _op_sim_awareness);
  registerOperator('sim:unified-sync', _op_sim_unified_sync);
  return ['sim:coherence', 'sim:awareness', 'sim:unified-sync'];
}

export default { registerOperator, runOperator, listOperators, registerSimOperators };
