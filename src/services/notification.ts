import * as uuid from 'uuid';
import type { NotificationMessageType } from '../types';

// export const popup = {
//   info: (content: string) => {},
//   success: (content: string) => {},
//   error: (content: string) => {},
//   hide: () => {},
//   remove: (id: string) => {},
//   push: (type: NotificationMessageType, content: string) => {},
// };

export interface NotificationServicePrototype {
  register(
    handler: (type: NotificationMessageType, content: string) => void
  ): string;
  unregister(id: string): void;
  info(content: string): void;
  warning(content: string): void;
  success(content: string): void;
  error(content: string): void;
  push(type: NotificationMessageType, content: string): void;
}

function notificationService() {
  const handlers: Array<{
    id: string;
    handler(type: NotificationMessageType, content: string): void;
  }> = [];
  const self: NotificationServicePrototype = {
    register(handler) {
      const id = uuid.v4();
      handlers.push({ id, handler });
      return id;
    },
    unregister(id) {
      for (let i = 0; i < handlers.length; i++) {
        if (handlers[i].id === id) {
          handlers.splice(i, 1);
          break;
        }
      }
    },
    push(type, content) {
      handlers.forEach((e) => {
        e.handler(type, content);
      });
    },
    info(content) {
      handlers.forEach((e) => {
        e.handler('info', content);
      });
    },
    error(content) {
      handlers.forEach((e) => {
        e.handler('error', content);
      });
    },
    warning(content) {
      handlers.forEach((e) => {
        e.handler('warning', content);
      });
    },
    success(content) {
      handlers.forEach((e) => {
        e.handler('success', content);
      });
    },
  };
  return self;
}

export const NotificationService = notificationService();
