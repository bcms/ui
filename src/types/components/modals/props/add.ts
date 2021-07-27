import { BCMSProp } from '@becomes/cms-sdk/types';
import { BCMSModalInputDefaults } from '../../../services';

export type BCMSAddPropModalOutputData = BCMSProp;
export interface BCMSAddPropModalInputData
  extends BCMSModalInputDefaults<BCMSAddPropModalOutputData> {
  takenPropNames: string[];
}