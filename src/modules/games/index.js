// src/modules/games/index.js
import React from 'react';
import EventBus from '../../runtime/event-bus.js';
import { uid, nowISO } from '../shared/utils.js';

const sessions = new Map();

export function startGameSession(meta = {}) {
  const id = uid('game-');
  const session = { id, startedAt: nowISO(), meta };
  sessions.set(id, session);
  EventBus.emit('game:sessionStarted', { id, meta });
  return session;
}

export function listGameSessions() {
  return Array.from(sessions.values());
}

// Alias exports
export const gamesStartSession = startGameSession;
export const gamesListSessions = listGameSessions;

export const renderer = {
  id: 'games',
  title: 'Games Engine',
  description: 'Game sessions and logic.',
  content: React.createElement(
    'div',
    null,
    React.createElement('p', null, 'Games engine.'),
    React.createElement(
      'button',
      {
        onClick: () => {
          const s = startGameSession({ from: 'renderer' });
          EventBus.emit('notify', `Game session started: ${s.id}`);
        }
      },
      'Start Game Session'
    )
  )
};

export default { renderer };
