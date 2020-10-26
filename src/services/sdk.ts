import { BCMS } from '@becomes/cms-sdk';

window.dev = '__DEV__' as any;
window.dev = (window.dev as any) === 'true' ? true : false;

export const sdk = BCMS({
  cms: {
    origin: window.dev ? 'http://localhost:1280' : '',
  },
  storage: {
    prfx: 'bcms',
  },
});
