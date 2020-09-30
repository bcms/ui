import { writable } from 'svelte/store';
import * as uuid from 'uuid';
import type { Writable } from 'svelte/store';
import { sdk } from './sdk';
import { SocketEventData, SocketEventName } from '@becomes/cms-sdk';

interface SocketEventDataUpdate {
  name: 'entry' | 'group' | 'template' | 'widget';
  ids: string[];
}
interface SocketEvent {
  data: SocketEventData;
  updates?: SocketEventDataUpdate[];
}

export interface StoreServicePrototype {
  create(name: string, value: any): void;
  update(name: string, value: any): void;
  subscribe(name: string, handler: (value: any) => Promise<void>): () => void;
  runUpdates(updates: SocketEventDataUpdate[]): void;
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
    runUpdates(updates) {
      if (updates) {
        updates.forEach(async (update) => {
          if (update.ids.length > 0) {
            if (update.name === 'entry') {
            } else {
              StoreService.update(update.name, await sdk[update.name].getAll());
            }
          }
        });
      }
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
StoreService.create('apiKey', []);
StoreService.create('media', []);
StoreService.create('entry', []);

sdk.socket.subscribe(SocketEventName.TEMPLATE, async (event: SocketEvent) => {
  if (event.data.source !== sdk.socket.id()) {
    StoreService.update('template', await sdk.template.getAll());
    StoreService.runUpdates(event.updates);
  }
});
sdk.socket.subscribe(SocketEventName.GROUP, async (event: SocketEvent) => {
  if (event.data.source !== sdk.socket.id()) {
    StoreService.update('group', await sdk.group.getAll());
    StoreService.runUpdates(event.updates);
  }
});
sdk.socket.subscribe(SocketEventName.WIDGET, async (event: SocketEvent) => {
  if (event.data.source !== sdk.socket.id()) {
    StoreService.update('widget', await sdk.widget.getAll());
  }
});
sdk.socket.subscribe(SocketEventName.LANGUAGE, async (event: SocketEvent) => {
  if (event.data.source !== sdk.socket.id()) {
    StoreService.update('language', await sdk.language.getAll());
  }
});
sdk.socket.subscribe(SocketEventName.USER, async (event: SocketEvent) => {
  if (event.data.source !== sdk.socket.id()) {
    StoreService.update('user', await sdk.user.getAll());
  }
});
sdk.socket.subscribe(SocketEventName.API_KEY, async (event: SocketEvent) => {
  if (event.data.source !== sdk.socket.id()) {
    StoreService.update('apiKey', await sdk.apiKey.getAll());
  }
});
sdk.socket.subscribe(SocketEventName.MEDIA, async (event: SocketEvent) => {
  if (event.data.source !== sdk.socket.id()) {
    StoreService.update('media', await sdk.media.getAllAggregated());
  }
});
sdk.socket.subscribe(SocketEventName.ENTRY, async (event: SocketEvent) => {
  if (event.data.source !== sdk.socket.id()) {
    StoreService.update(
      'entry',
      await sdk.entry.getAllLite(event.data.entry.additional.templateId)
    );
  }
});
