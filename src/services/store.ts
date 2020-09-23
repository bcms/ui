import { writable } from 'svelte/store';
import * as uuid from 'uuid';
import type { Writable } from 'svelte/store';

export interface StoreServicePrototype {
  create(name: string, value: any);
  update(name: string, value: any);
  subscribe(name: string, handler: (value: any) => Promise<void>): () => void;
}

function storeService(store: {
  [key: string]: {
    w: Writable<any>;
    unsub: () => void;
    subs: Array<{
      id: string;
      handler: (value: any) => Promise<void>;
    }>;
  };
}): StoreServicePrototype {
  return {
    create(name, value) {
      if (!store[name]) {
        store[name] = {
          w: writable(value),
          unsub: () => {},
          subs: [],
        };
        store[name].unsub = store[name].w.subscribe(async (value) => {
          store[name].subs.forEach(async (e) => {
            await e.handler(value);
          });
        });
      }
    },
    update(name, value) {
      if (!store[name]) {
        throw Error(`Store with name "${name}" does not exist.`);
      }
      store[name].w.update((e) => (e = value));
    },
    subscribe(name, handler) {
      if (!store[name]) {
        throw Error(`Store with name "${name}" does not exist.`);
      }
      const id = uuid.v4();
      store[name].subs.push({
        id,
        handler,
      });
      return () => {
        if (store[name]) {
          store[name].subs = store[name].subs.filter((e) => e.id !== id);
        }
      };
    },
  };
}

export const StoreService = storeService({});
StoreService.create('path', '');
StoreService.create('templates', []);
