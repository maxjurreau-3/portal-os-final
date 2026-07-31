// src/modules/games/index.js
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
  content: (
    <div>
      <p>Games engine.</p>
      <button onClick={() => startGameSession({ from: 'renderer' })}>Start Game Session</button>
    </div>
  )
};

export default { renderer };
