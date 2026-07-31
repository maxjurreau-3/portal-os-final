/**
 * substrate/unified-field/index.js
 * Small helpers for encoding/decoding canonical field objects and applying protocols.
 */

import { applyProtocol, supportedProtocols } from './field-protocols.js';

export function encodeField(obj) {
  try {
    return JSON.stringify(obj);
  } catch {
    return null;
  }
}

export function decodeField(str) {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}

export function transformField(obj, protocol = 'identity') {
  if (!supportedProtocols.includes(protocol)) {
    throw new Error(`unsupported protocol: ${protocol}`);
  }
  return applyProtocol(obj, protocol);
}

export default { encodeField, decodeField, transformField };
