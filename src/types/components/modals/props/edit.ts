import { BCMSProp } from '@becomes/cms-sdk/types';
import { BCMSModalServiceItemInputDefaults } from '../../../services';

export interface BCMSEditPropModalOutputData {
  prop: BCMSProp;
}
export interface BCMSEditPropModalInputData
  extends BCMSModalServiceItemInputDefaults<BCMSEditPropModalOutputData> {
  prop: BCMSProp;
  takenPropNames: string[];
}
