/**
 * substrate/unified-field/field-protocols.js
 * Small set of pluggable "protocol" transforms for field objects.
 */

export const supportedProtocols = ['identity', 'timestamp', 'shallow-hash'];

export function applyProtocol(obj, protocol) {
  switch (protocol) {
    case 'identity':
      return { ...obj };
    case 'timestamp':
      return { ...obj, transformedAt: new Date().toISOString() };
    case 'shallow-hash':
      // naive shallow hash demonstration
      return { ...obj, hash: String(Object.keys(obj).length) + ':' + Date.now() };
    default:
      throw new Error('unknown protocol');
  }
}

export default { supportedProtocols, applyProtocol };
