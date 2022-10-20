import type { BCMSEntity } from '@becomes/cms-sdk/types';

export interface BCMSFeature extends BCMSEntity {
  name: string;
  available: string;
  description?: string;
}
