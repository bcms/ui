import { BCMS } from '@becomes/cms-sdk';

export const sdk = BCMS({
  cms: {
    origin: '',
  },
  storage: {
    prfx: 'bcms',
  },
});

(window as any).sdk = sdk;
