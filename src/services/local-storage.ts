export type LocalStorageServicePrototype = {
  get<T>(key: string): T;
  set(key: string, value: string): void;
  remove(key: string): void;
  clear();
}

function localStorageService(): LocalStorageServicePrototype {
  const prfx = 'bcms';
  return {
    get(key) {
      const value = localStorage.getItem(`${prfx}${key}`);
      if (value) {
        try {
          return JSON.parse(value);
        } catch (error) {
          return value;
        }
      }
      return undefined;
    },
    set(key, value) {
      if (typeof value === 'object') {
        localStorage.setItem(`${prfx}${key}`, JSON.stringify(value));
      } else {
        localStorage.setItem(`${prfx}${key}`, value);
      }
    },
    remove(key) {
      localStorage.removeItem(`${prfx}${key}`);
    },
    clear() {
      const l = JSON.parse(JSON.stringify(localStorage));
      for (const key in l) {
        if (key.startsWith(prfx)) {
          localStorage.removeItem(key);
        }
      }
    },
  };
}

export const LocalStorageService = localStorageService();
