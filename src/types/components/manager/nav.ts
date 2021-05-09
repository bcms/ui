import type { BCMSRoleName } from '@becomes/cms-sdk/types';

export interface BCMSManagerNavItemType {
  name: string;
  link: string;
  selected: boolean;

  onClick?: (event: Event, item: BCMSManagerNavItemType) => void;
  role?: BCMSRoleName;
}
