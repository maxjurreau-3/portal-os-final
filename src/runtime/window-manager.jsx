// src/runtime/window-manager.jsx
import React, { useState, useEffect } from 'react';
import EventBus from './event-bus.js';

// Window object shape: { id, title, module, content }

function Window({ win, zIndex, onClose, onFocus }) {
  return (
    <div
      className="window"
      role="dialog"
      aria-label={win.title}
      style={{ zIndex, position: 'fixed', right: 24 + (zIndex - 1000) * 8, bottom: 80 + (zIndex - 1000) * 8 }}
      onClick={() => onFocus(win.id)}
    >
      <div className="window-title">
        <span>{win.title}</span>
        <button
          aria-label="Close window"
          onClick={(e) => {
            e.stopPropagation();
            onClose(win.id);
          }}
        >
          ✕
        </button>
      </div>
      <div className="window-content">{win.content}</div>
    </div>
  );
}

export default function WindowManager() {
  const [windows, setWindows] = useState([]);

  useEffect(() => {
    // Open window event: payload is a window object
    const unsubOpen = EventBus.on('open:window', ({ payload }) => {
      if (!payload || !payload.id) return;
      setWindows((prev) => [...prev, payload]);
    });

    // Close window event (optional)
    const unsubClose = EventBus.on('close:window', ({ payload }) => {
      if (!payload || !payload.id) return;
      setWindows((prev) => prev.filter((w) => w.id !== payload.id));
    });

    return () => {
      unsubOpen();
      unsubClose();
    };
  }, []);

  function closeWindow(id) {
    setWindows((prev) => prev.filter((w) => w.id !== id));
    EventBus.emit('window:closed', { id });
  }

  function focusWindow(id) {
    setWindows((prev) => {
      const found = prev.find((w) => w.id === id);
      if (!found) return prev;
      const others = prev.filter((w) => w.id !== id);
      const next = [...others, found];
      return next;
    });
    EventBus.emit('window:focused', { id });
  }

  return (
    <div className="window-manager" aria-live="polite">
      {windows.map((w, i) => (
        <Window key={w.id} win={w} zIndex={1000 + i} onClose={closeWindow} onFocus={focusWindow} />
      ))}
    </div>
  );
}
