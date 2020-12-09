import * as uuid from 'uuid';

export interface PropsCheckerServicePrototype {
  register(checker: () => boolean): () => void;
  check(): boolean;
}

function propsCheckerService() {
  const checkers: Array<{
    id: string;
    checker: () => boolean;
  }> = [];
  const self: PropsCheckerServicePrototype = {
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
      for (const i in checkers) {
        if (!checkers[i].checker()) {
          isOk = false;
        }
      }
      if (isOk) {
        return true;
      }
      return false;
    },
  };
  return self;
}

export const PropsCheckerService = propsCheckerService();
