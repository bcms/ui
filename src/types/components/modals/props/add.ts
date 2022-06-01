import type { BCMSProp } from '@becomes/cms-sdk/types';
import type { BCMSModalInputDefaults } from '../../../services';

export type BCMSAddPropModalOutputData = BCMSProp;
export interface BCMSAddPropModalInputData
  extends BCMSModalInputDefaults<BCMSAddPropModalOutputData> {
  takenPropNames: string[];
}
