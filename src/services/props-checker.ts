import * as uuid from 'uuid';
import type { BCMSPropsCheckerServicePrototype } from '../types';

export function BCMSPropsCheckerService(): BCMSPropsCheckerServicePrototype {
  const checkers: Array<{
    id: string;
    checker: () => boolean;
  }> = [];
  return {
    register(checker) {
      const id = uuid.v4();
      checkers.push({ id, checker });
      return () => {
        for (let i = 0; i < checkers.length; i++) {
          if (checkers[i].id === id) {
            checkers.splice(i, 1);
            break;
          }
        }
      };
    },
    check() {
      let isOk = true;
      for (let i = 0; i < checkers.length; i++) {
        if (!checkers[i].checker()) {
          isOk = false;
        }
      }
      return isOk;
    },
  };
}
