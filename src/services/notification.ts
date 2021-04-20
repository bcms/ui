import {
  BCMSNotificationMessageType,
  BCMSNotificationServicePrototype,
} from '../types';
import * as uuid from 'uuid';

export function BCMSNotificationService(): BCMSNotificationServicePrototype {
  const handlers: Array<{
    id: string;
    handler(type: BCMSNotificationMessageType, content: string): void;
  }> = [];
  return {
    register(handler) {
      const id = uuid.v4();
      handlers.push({ id, handler });
      return () => {
        for (let i = 0; i < handlers.length; i++) {
          if (handlers[i].id === id) {
            handlers.splice(i, 1);
            break;
          }
        }
      };
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
}
