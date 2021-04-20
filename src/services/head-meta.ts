import { BCMSHeadMetaServicePrototype } from '../types';

export function BCMSHeadMetaService() {
  const self: BCMSHeadMetaServicePrototype = {
    set(options) {
      if (options.title) {
        document.title = `${options.title} | BCMS`;
      }
    },
  };
  return self;
}
