// src/runtime/command-palette.jsx
import React, { useEffect, useState } from 'react';
import EventBus from './event-bus.js';

// Minimal Command Palette: toggled with Ctrl+K, emits command:run events.
export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');

  useEffect(() => {
    function onKey(e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const unsub = EventBus.on('command:run', ({ payload }) => {
      // If other parts emit command:run, we show a notification
      EventBus.emit('notify', `Command executed: ${payload}`);
    });
    return unsub;
  }, []);

  function run() {
    if (!value) return;
    EventBus.emit('command:run', value);
    setValue('');
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className="command-palette" role="dialog" aria-label="Command palette">
      <input
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type a command and press Run..."
        style={{ padding: 8 }}
      />
      <button onClick={run}>Run</button>
    </div>
  );
}
