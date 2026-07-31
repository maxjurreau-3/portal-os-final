// src/runtime/shell.jsx
import React from 'react';
import WindowManager from './window-manager.jsx';
import Dock from './dock.jsx';
import Notifications from './notifications.jsx';
import CommandPalette from './command-palette.jsx';

// Shell composes the runtime UI pieces. Children typically include UnifiedSurface.
export default function Shell({ children }) {
  return (
    <div className="portal-shell" role="application" aria-label="Portal OS Shell">
      <div className="shell-main">{children}</div>
      {/* UI layers that overlay the main content */}
      <WindowManager />
      <Dock />
      <Notifications />
      <CommandPalette />
    </div>
  );
}
