# Quantum World Model

Maps quantum identities and signing/verification into the world models layer.

APIs:
- buildQuantumWorldSnapshot(opts) -> { createdAt, count, world[] }
- verifyQuantumIdentity(signature, payload) -> boolean | { error }
