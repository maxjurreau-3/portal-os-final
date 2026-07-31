// src/runtime/event-bus.js
// Simple in-memory EventBus (pub/sub) used across runtime and modules.

const listeners = new Map();

export function on(eventName, handler) {
  if (!listeners.has(eventName)) listeners.set(eventName, new Set());
  listeners.get(eventName).add(handler);
  return () => off(eventName, handler);
}

export function off(eventName, handler) {
  if (!listeners.has(eventName)) return;
  listeners.get(eventName).delete(handler);
  if (listeners.get(eventName).size === 0) listeners.delete(eventName);
}

export function emit(eventName, payload = undefined) {
  const set = listeners.get(eventName);
  if (!set) return;
  // Call handlers asynchronously but without blocking emitter
  set.forEach((h) => {
    try {
      // Provide a consistent event envelope
      Promise.resolve().then(() => h({ type: eventName, payload, timestamp: Date.now() }));
    } catch (err) {
      // Swallow to avoid interrupting other handlers
      // In a real app, log to a debugging sink
    }
  });
}

export default {
  on,
  off,
  emit
};
