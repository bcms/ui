import { BCMSModalServiceItemInputDefaults } from '../../services';

export type BCMSConfirmModalOutputData = void;
export interface BCMSConfirmModalInputData
  extends BCMSModalServiceItemInputDefaults<BCMSConfirmModalOutputData> {
  body: string;
  prompt?: string;
}
