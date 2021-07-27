import { BCMSProp } from '@becomes/cms-sdk/types';
import { BCMSModalInputDefaults } from '../../../services';

export interface BCMSEditPropModalOutputData {
  prop: BCMSProp;
}
export interface BCMSEditPropModalInputData
  extends BCMSModalInputDefaults<BCMSEditPropModalOutputData> {
  prop: BCMSProp;
  takenPropNames: string[];
}
