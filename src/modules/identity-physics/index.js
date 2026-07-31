// src/modules/identity-physics/index.js
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
  content: (
    <div>
      <p>Identity engine.</p>
      <button
        onClick={() => {
          const i = defineIdentity({ role: 'agent' });
          activateIdentity(i.id);
        }}
      >
        Define & Activate Identity
      </button>
    </div>
  )
};

export default { renderer };
