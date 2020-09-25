import { writable } from 'svelte/store';
import * as uuid from 'uuid';
import type { Writable } from 'svelte/store';
import { sdk } from './sdk';
import { SocketEventData, SocketEventName } from '@becomes/cms-sdk';

export interface StoreServicePrototype {
  create(name: string, value: any): void;
  update(name: string, value: any): void;
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
      if (typeof value === 'function') {
        store[name].w.update((e) => {
          return value(e);
        });
      } else {
        store[name].w.update((e) => (e = value));
      }
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
StoreService.create('template', []);
StoreService.create('group', []);
StoreService.create('widget', []);
StoreService.create('language', []);
StoreService.create('user', []);

sdk.socket.subscribe(
  SocketEventName.TEMPLATE,
  async (data: SocketEventData) => {
    if (data.source !== sdk.socket.id()) {
      StoreService.update('template', await sdk.template.getAll());
    }
  }
);
sdk.socket.subscribe(SocketEventName.GROUP, async (data: SocketEventData) => {
  if (data.source !== sdk.socket.id()) {
    StoreService.update('group', await sdk.group.getAll());
  }
});
sdk.socket.subscribe(SocketEventName.WIDGET, async (data: SocketEventData) => {
  if (data.source !== sdk.socket.id()) {
    StoreService.update('widget', await sdk.widget.getAll());
  }
});
sdk.socket.subscribe(
  SocketEventName.LANGUAGE,
  async (data: SocketEventData) => {
    if (data.source !== sdk.socket.id()) {
      StoreService.update('language', await sdk.language.getAll());
    }
  }
);
sdk.socket.subscribe(SocketEventName.USER, async (data: SocketEventData) => {
  if (data.source !== sdk.socket.id()) {
    StoreService.update('user', await sdk.user.getAll());
  }
});
