import type {
  BCMSProp,
  BCMSPropValue,
  BCMSSocketSyncChangeStringDelta,
} from '@becomes/cms-sdk/types';
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
  pathStrToArr(path: string): Array<string | number>;
  getValueFromPath<Value = unknown>(
    obj: any,
    path: Array<string | number>
  ): Value;
  mutateValue: {
    any(obj: any, path: Array<string | number>, value: any): void;
    string(
      obj: any,
      path: Array<string | number>,
      diff: BCMSSocketSyncChangeStringDelta[]
    ): void;
  };
}
