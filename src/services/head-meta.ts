import { BCMSHeadMetaServicePrototype } from '../types';

export function BCMSHeadMetaService(): BCMSHeadMetaServicePrototype {
  return {
    set(options) {
      if (options.title) {
        document.title = `${options.title} | BCMS`;
      }
    },
  };
}
