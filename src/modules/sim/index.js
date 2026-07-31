// src/modules/sim/index.js
import EventBus from '../../runtime/event-bus.js';
import { opRun } from '../operators/index.js';
import { uid, nowISO } from '../shared/utils.js';

// Storage for simulation spaces
const spaces = new Map();
let activeSpaceId = null;

export function createSimSpace(meta = {}) {
  const id = uid('space-');
  const space = { id, createdAt: nowISO(), meta };
  spaces.set(id, space);
  EventBus.emit('sim:spaceCreated', { id, meta });
  return space;
}

export function listSpaces() {
  return Array.from(spaces.values());
}

export function getActiveSpace() {
  return activeSpaceId ? spaces.get(activeSpaceId) : null;
}

export function activateSpace(id) {
  if (!spaces.has(id)) throw new Error('Space not found');
  activeSpaceId = id;
  EventBus.emit('sim:spaceActivated', { id });
  return getActiveSpace();
}

export function runOperatorInActive(opName, ...args) {
  const active = getActiveSpace();
  if (!active) throw new Error('No active space');
  // Call operator engine
  const result = opRun(opName, ...args);
  EventBus.emit('sim:operatorRun', { spaceId: active.id, opName, result });
  return result;
}

// Alias exports required by renderers.jsx
export const simCreateSpace = createSimSpace;
export const simListSpaces = listSpaces;
export const simGetActiveSpace = getActiveSpace;
export const simSwitchSpace = activateSpace;
export const simRunOperatorInActive = runOperatorInActive;

// Renderer object for SIM
export const renderer = {
  id: 'sim',
  title: 'SIM Core',
  description: 'Simulation architecture and cognitive space.',
  content: (
    <div>
      <p>SIM engine ready.</p>
      <button
        onClick={() => {
          const s = createSimSpace({ createdBy: 'renderer' });
          activateSpace(s.id);
        }}
      >
        Create & Activate Space
      </button>
    </div>
  )
};

export default { renderer };
