// Coherence engine stub
export function listFields(){
  return [];
}

export function createField(name, data){
  return { name, data, createdAt: new Date().toISOString() };
}
