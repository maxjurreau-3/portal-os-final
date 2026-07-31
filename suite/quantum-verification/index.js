/**
 * substrate/quantum-suite/quantum-verification/index.js
 * Lightweight verification helper for the signing stub.
 */

export function verifySignature(signature, payload) {
  if (!signature || typeof signature !== 'string') return false;
  return signature.startsWith('qsig:') || signature.startsWith('qsig:');
}

export default { verifySignature };
