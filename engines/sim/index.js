// Sim engine stub
export function listSpaces(){
  return [{ id: 'space-1', name: 'Demo Space', meta: {} }];
}

export function runTick(spaceId, delta=16){
  return { spaceId, delta, updatedAt: Date.now() };
}
