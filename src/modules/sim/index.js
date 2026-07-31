// src/modules/sim/index.js
import React from 'react';
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

// Renderer object for SIM (use createElement to avoid JSX in .js)
export const renderer = {
  id: 'sim',
  title: 'SIM Core',
  description: 'Simulation architecture and cognitive space.',
  content: React.createElement(
    'div',
    null,
    React.createElement('p', null, 'SIM engine ready.'),
    React.createElement(
      'button',
      {
        onClick: () => {
          try {
            const s = createSimSpace({ createdBy: 'renderer' });
            activateSpace(s.id);
            EventBus.emit('notify', `Space created and activated: ${s.id}`);
          } catch (e) {
            EventBus.emit('notify', `SIM action failed: ${e.message}`);
          }
        }
      },
      'Create & Activate Space'
    )
  )
};

export default { renderer };
