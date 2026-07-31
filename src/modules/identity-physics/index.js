// src/modules/identity-physics/index.js
import React from 'react';
import EventBus from '../../runtime/event-bus.js';
import { uid, nowISO } from '../shared/utils.js';

const identities = new Map();

export function defineIdentity(meta = {}) {
  const id = uid('id-');
  const identity = { id, createdAt: nowISO(), meta };
  identities.set(id, identity);
  EventBus.emit('identity:defined', { id, meta });
  return identity;
}

export function activateIdentity(id) {
  if (!identities.has(id)) throw new Error('Identity not found');
  EventBus.emit('identity:activated', { id });
  return identities.get(id);
}

// Alias exports
export const identityDefine = defineIdentity;
export const identityActivate = activateIdentity;

export const renderer = {
  id: 'identity-physics',
  title: 'Identity Physics',
  description: 'Defines and activates identity physics for agents.',
  content: React.createElement(
    'div',
    null,
    React.createElement('p', null, 'Identity engine.'),
    React.createElement(
      'button',
      {
        onClick: () => {
          try {
            const i = defineIdentity({ role: 'agent' });
            activateIdentity(i.id);
            EventBus.emit('notify', `Identity defined and activated: ${i.id}`);
          } catch (e) {
            EventBus.emit('notify', `Identity error: ${e.message}`);
          }
        }
      },
      'Define & Activate Identity'
    )
  )
};

export default { renderer };
