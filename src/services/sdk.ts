import { BCMS } from '@becomes/cms-sdk';

export const sdk = BCMS({
  cms: {
    origin: window.dev ? 'http://localhost:1280' : '',
  },
  storage: {
    prfx: 'bcms',
  },
});
