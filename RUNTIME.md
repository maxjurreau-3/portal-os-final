# RUNTIME

Runtime components are under src/runtime.

- event-bus.js: global EventBus.
- unified-surface.jsx: loads renderers and provides named render functions.
- renderers.jsx: composes renderer objects for all modules.
- shell.jsx: top-level shell that composes WindowManager, Dock, Notifications, CommandPalette.
- window-manager.jsx: opens/closes windows supplied as objects.
- dock.jsx: quick launcher for modules.
- notifications.jsx: ephemeral messages surfaced from EventBus.
