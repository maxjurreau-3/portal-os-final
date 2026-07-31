// src/runtime/notifications.jsx
import React, { useEffect, useState } from 'react';
import EventBus from './event-bus.js';

export default function Notifications() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const unsub = EventBus.on('notify', ({ payload }) => {
      const id = `n-${Date.now()}`;
      setMessages((m) => [...m, { id, text: String(payload) }]);
      // Auto-dismiss after 5s
      setTimeout(() => {
        setMessages((m) => m.filter((x) => x.id !== id));
      }, 5000);
    });
    return unsub;
  }, []);

  if (messages.length === 0) return null;

  return (
    <div className="notifications" aria-live="polite">
      {messages.map((msg) => (
        <div key={msg.id} className="notification">
          {msg.text}
        </div>
      ))}
    </div>
  );
}
