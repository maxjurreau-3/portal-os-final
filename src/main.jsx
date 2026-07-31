import React from 'react';
import UnifiedSurface, {
  renderSimModule,
  renderXrModule,
  renderIdentityModule,
  renderOperatorsModule,
  renderGamesModule
} from './runtime/unified-surface.jsx';
import Shell from './runtime/shell.jsx';

export default function App() {
  return (
    <Shell>
      <UnifiedSurface
        renderSimModule={renderSimModule}
        renderXrModule={renderXrModule}
        renderIdentityModule={renderIdentityModule}
        renderOperatorsModule={renderOperatorsModule}
        renderGamesModule={renderGamesModule}
      />
    </Shell>
  );
}
