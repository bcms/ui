import { BCMSProp } from '@becomes/cms-sdk/types';
import { BCMSModalServiceItemInputDefaults } from '../../../services';

export type BCMSAddPropModalOutputData = BCMSProp;
export interface BCMSAddPropModalInputData
  extends BCMSModalServiceItemInputDefaults<BCMSAddPropModalOutputData> {
  takenPropNames: string[];
}
