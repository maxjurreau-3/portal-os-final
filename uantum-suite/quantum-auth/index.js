/**
 * substrate/quantum-suite/quantum-auth/index.js
 * Minimal sign/verify helpers (stub).
 *
 * Interfaces are intentionally small: sign(payload, opts) and verify(payload, signature).
 */

export function sign(payload, opts = {}) {
  // deterministic-ish stub signature
  const sig = `qsig:${Buffer.from(JSON.stringify(payload)).toString('base64').slice(0, 24)}:${Date.now()}`;
  return { signature: sig, method: opts.method || 'stub' };
}

export function verify(payload, signature) {
  if (!signature || typeof signature !== 'string') return false;
  return signature.startsWith('qsig:');
}

export default { sign, verify };
