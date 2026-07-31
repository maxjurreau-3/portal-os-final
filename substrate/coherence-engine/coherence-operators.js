/**
 * substrate/coherence-engine/coherence-operators.js
 * Minimal operator registry and executor used by the coherence-engine stub.
 */

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
  // Support sync or async operator functions
  return await Promise.resolve().then(() => fn(...args));
}

export function listOperators() {
  return Array.from(_operators.keys());
}

export default { registerOperator, runOperator, listOperators };
