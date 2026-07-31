# ARCHITECTURE

This document describes the high-level architecture of Portal‑OS‑v3.

- UnifiedSurface: central UI that loads renderer objects from modules.
- EventBus: global pub/sub facilitating loose coupling between engines and UI.
- Modules: each engine lives under src/modules and exports engine functions, alias names, and a renderer object.
- Runtime: components (Shell, WindowManager, Dock, Notifications, Command Palette) that orchestrate windows and UI.

Refer to MODULES.md and RUNTIME.md for details.
