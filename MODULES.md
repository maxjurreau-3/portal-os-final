# MODULES

Each module lives in src/modules/<name>/index.js and must export:

- Engine functions (createSimSpace, listSpaces, getActiveSpace, activateSpace, runOperatorInActive) for SIM, or equivalently named functions for other engines.
- Alias exports used by renderers.jsx (e.g., simCreateSpace).
- A renderer object: { id, title, description, content: <JSX /> }.

Modules must emit events on the EventBus for lifecycle actions (see RUNTIME.md).
