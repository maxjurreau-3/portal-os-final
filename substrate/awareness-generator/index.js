/**
 * substrate/awareness-generator/index.js
 * Simple awareness stream generator stub.
 *
 * Exports:
 * - createAwarenessStream(opts) -> stream object
 * - nextSample(stream) -> sample object
 */

import { createRawSample } from './awareness-stream.js';

export function createAwarenessStream(opts = {}) {
  return { id: `aw-${Date.now()}`, createdAt: new Date().toISOString(), opts };
}

export function nextSample(stream) {
  if (!stream || !stream.id) throw new TypeError('stream required');
  return createRawSample(stream);
}

export default { createAwarenessStream, nextSample };
