/**
 * substrate/coherence-engine/coherence-field.js
 * Lightweight in-memory field registry used by the coherence-engine stub.
 */

const _fields = new Map();

export function createFieldRecord(name, opts = {}) {
  if (typeof name !== 'string' || name.length === 0) {
    throw new TypeError('name (string) is required to create a field');
  }
  const id = `field:${name}:${Date.now()}`;
  const rec = { id, name, opts, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  _fields.set(id, rec);
  return rec;
}

export function getFieldRecord(id) {
  if (!id) return null;
  return _fields.get(id) || null;
}

export function listFieldRecords() {
  return Array.from(_fields.values());
}

export default { createFieldRecord, getFieldRecord, listFieldRecords };
