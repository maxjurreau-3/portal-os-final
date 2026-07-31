// Guided Link: substrate/awareness-generator/index.js
// Awareness generator public surface (adds convenience binding for targets)

import { createRawSample } from './awareness-stream.js';

export function createAwarenessStream(opts = {}) {
  return { id: `aw-${Date.now()}`, createdAt: new Date().toISOString(), opts };
}

export function nextSample(stream) {
  if (!stream || !stream.id) throw new TypeError('stream required');
  return createRawSample(stream);
}

export function generateAwarenessForTarget(targetId, meta = {}) {
  if (!targetId) throw new TypeError('targetId required');
  const stream = createAwarenessStream({ targetId, meta });
  const sample = createRawSample(stream);
  sample.meta = { ...sample.meta, ...meta, targetId };
  return { stream, sample };
}

export default { createAwarenessStream, nextSample, generateAwarenessForTarget };
