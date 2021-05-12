import { BCMSModalServiceItemInputDefaults } from '../../../services';

export interface BCMSAddUpdateDirModalOutputData {
  name: string;
}
export interface BCMSAddUpdateDirModalInputData
  extends BCMSModalServiceItemInputDefaults<BCMSAddUpdateDirModalOutputData> {
  name?: string;
  mode: 'add' | 'update';
  takenNames: string[];
}
