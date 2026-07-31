/**
 * substrate/awareness-generator/awareness-stream.js
 * Produces placeholder awareness samples for development.
 */

export function createRawSample(stream) {
  return {
    streamId: stream.id,
    timestamp: new Date().toISOString(),
    vector: {},
    meta: { source: 'awareness-generator', streamOpts: stream.opts || {} }
  };
}

export default { createRawSample };
