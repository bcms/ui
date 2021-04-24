import { BCMSModalServiceItemInputDefaults } from '../../services';

export interface BCMSAddUpdateGroupModalOutputData {
  name: string;
  desc: string;
}
export interface BCMSAddUpdateGroupModalInputData
  extends BCMSModalServiceItemInputDefaults<BCMSAddUpdateGroupModalOutputData> {
  name?: string;
  desc?: string;
}
