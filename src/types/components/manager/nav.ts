import type { BCMSRoleName } from '@becomes/cms-sdk/types';

export interface BCMSManagerNavItemType {
  name: string;
  link: string;
  selected: boolean;
  role?: BCMSRoleName;
}
