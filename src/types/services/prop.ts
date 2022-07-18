import type { BCMSProp, BCMSPropValue } from '@becomes/cms-sdk/types';
import type { BCMSPropValueExtended } from '../models';

export interface BCMSPropService {
  toPropValueExtended(data: {
    prop: BCMSProp;
    value?: BCMSPropValue | BCMSPropValueExtended;
    lang: string;
  }): Promise<BCMSPropValueExtended | null>;
  fromPropValueExtended(data: {
    extended: BCMSPropValueExtended;
  }): BCMSPropValue;
  checker: {
    register(validate: () => boolean): () => void;
    validate(): boolean;
  };
}
