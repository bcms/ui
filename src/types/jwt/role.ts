import type { Permission } from './permission';

export enum RoleName {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export type Role = {
  name: RoleName;
  permissions: Permission[];
};
