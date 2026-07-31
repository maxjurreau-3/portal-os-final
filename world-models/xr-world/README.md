# XR World Model

Binds XR engine scenes to substrate primitives:

- Coherence overlay: maps scene state into coherence fields
- Awareness visualization: generates awareness samples for scenes (for NPCs/observers)
- Unified field binding: creates canonical scene snapshots

API:
- buildXrWorldSnapshot(opts) -> { createdAt, count, world[] }
