import type { BCMSSocketSyncChangeEvent } from '@becomes/cms-sdk/types';

export interface BCMSEntrySyncUserPointerElements {
  root: HTMLDivElement;
  cursor: HTMLDivElement;
  name: HTMLDivElement;
}

export interface BCMSEntrySyncUser {
  uid: string;
  color: string;
  name: string;
  mouse: [number, number];
  _handlers: Array<(user: BCMSEntrySyncUser) => void>;
  pointerElements: BCMSEntrySyncUserPointerElements;
  onUpdate(handler: (user: BCMSEntrySyncUser) => void): void;
  destroy(): void;
}

export interface BCMSEntrySync {
  scroll: {
    y: {
      curr: number;
      last: number;
    };
  };
  mouse: {
    pos: {
      curr: [number, number];
      last: [number, number];
    };
    click: {
      left: boolean;
    };
  };
  users: { [id: string]: BCMSEntrySyncUser };
  sync(): Promise<void>;
  unsync(): Promise<void>;
  createUsers(): Promise<BCMSEntrySyncUser[]>;
  createUser(connId: string): Promise<BCMSEntrySyncUser>;
  createUserPointer(user: BCMSEntrySyncUser): BCMSEntrySyncUserPointerElements;
  onChange(handler: (data: BCMSSocketSyncChangeEvent) => void): void;
}
