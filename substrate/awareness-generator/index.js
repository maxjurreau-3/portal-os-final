// Awareness generator stub
export function createAwarenessStream(opts = {}){
  return { id: `stream-${Date.now()}`, opts };
}

export function nextSample(stream){
  return { stream: stream.id || null, sampleAt: new Date().toISOString(), snapshot: {} };
}
