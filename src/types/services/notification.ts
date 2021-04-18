export type BCMSNotificationMessageType =
  | 'info'
  | 'error'
  | 'success'
  | 'warning';

export interface BCMSNotificationServicePrototype {
  register(
    handler: (type: BCMSNotificationMessageType, content: string) => void
  ): string;
  unregister(id: string): void;
  info(content: string): void;
  warning(content: string): void;
  success(content: string): void;
  error(content: string): void;
  push(type: BCMSNotificationMessageType, content: string): void;
}