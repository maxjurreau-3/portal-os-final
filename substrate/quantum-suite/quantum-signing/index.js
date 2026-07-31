/**
 * substrate/quantum-suite/quantum-signing/index.js
 * Simple signature creation helper (stub).
 */

export function createSignature(data, opts = {}) {
  return { signature: `qsig:${Buffer.from(JSON.stringify(data)).toString('base64').slice(0, 20)}:${Date.now()}`, alg: opts.alg || 'stub' };
}

export default { createSignature };
