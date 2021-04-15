import { BCMSHeadMetaServicePrototype } from '@/types';

function headMetaService() {
  const self: BCMSHeadMetaServicePrototype = {
    set(options) {
      if (options.title) {
        document.title = `${options.title} | BCMS`;
      }
    },
  };
  return self;
}

export const BCMSHeadMetaService = headMetaService();
