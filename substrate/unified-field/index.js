// Unified field stub
export const supportedProtocols = ['identity','timestamp','shallow-hash'];

export function syncFieldToTarget(target, protocol='identity'){
  return { target, protocol, syncedAt: new Date().toISOString() };
}
