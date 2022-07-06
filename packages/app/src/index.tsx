import { cryptoWaitReady } from '@polkadot/util-crypto';
import React from 'react';
import { createRoot } from 'react-dom/client';

import Root from './Root';

const rootId = 'root';
const rootElement = document.getElementById(rootId);

if (!rootElement) {
  throw new Error(`Unable to find element with id '${rootId}'`);
}

const root = createRoot(rootElement);

if (
  !window.location.hash.startsWith('#/attester') &&
  !window.location.hash.startsWith('#/claimer')
) {
  window.location.hash = '#/claimer';
}

cryptoWaitReady().then(() => root.render(<Root />));
