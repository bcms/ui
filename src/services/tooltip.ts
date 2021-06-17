import type { BCMSTooltipServicePrototype } from '../types';

export function BCMSTooltipService(): BCMSTooltipServicePrototype {
  return {
    show() {
      throw new Error('Assertion error');
    },
    hide() {
      throw new Error('Assertion error');
    },
  };
}
