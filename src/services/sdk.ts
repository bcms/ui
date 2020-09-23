import { BCMS } from '@becomes/cms-sdk';

export const sdk = BCMS({
  cms: {
    origin: 'http://localhost:1280',
  },
  storage: {
    prfx: 'bcms',
  },
});
