import { BCMSModalServiceItemInputDefaults } from '../../services';

export interface BCMSAddUpdateGroupModalOutputData {
  label: string;
  desc: string;
}
export interface BCMSAddUpdateGroupModalInputData
  extends BCMSModalServiceItemInputDefaults<BCMSAddUpdateGroupModalOutputData> {
  label?: string;
  desc?: string;
  groupNames: string[];
  mode: 'add' | 'update';
}
