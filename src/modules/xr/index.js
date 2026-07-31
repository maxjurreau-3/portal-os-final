// src/modules/xr/index.js
import React from 'react';
import EventBus from '../../runtime/event-bus.js';
import { uid, nowISO } from '../shared/utils.js';

const scenes = new Map();

export function createScene(meta = {}) {
  const id = uid('xr-');
  const scene = { id, createdAt: nowISO(), meta };
  scenes.set(id, scene);
  EventBus.emit('xr:sceneCreated', { id, meta });
  return scene;
}

export function listScenes() {
  return Array.from(scenes.values());
}

export function getScene(id) {
  return scenes.get(id) || null;
}

// Alias exports
export const xrCreateScene = createScene;
export const xrListScenes = listScenes;
export const xrGetScene = getScene;

export const renderer = {
  id: 'xr',
  title: 'XR Engine',
  description: 'XR scenes and viewers.',
  content: React.createElement(
    'div',
    null,
    React.createElement('p', null, 'XR engine active.'),
    React.createElement(
      'button',
      {
        onClick: () => {
          const s = createScene({ createdBy: 'renderer' });
          EventBus.emit('notify', `XR scene ${s.id} created`);
        }
      },
      'Create XR Scene'
    )
  )
};

export default { renderer };
