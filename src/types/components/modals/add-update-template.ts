import { BCMSModalInputDefaults } from '../../services';

export interface BCMSAddUpdateTemplateModalOutputData {
  label: string;
  desc: string;
}
export interface BCMSAddUpdateTemplateModalInputData
  extends BCMSModalInputDefaults<BCMSAddUpdateTemplateModalOutputData> {
  label?: string;
  desc?: string;
  templateNames: string[];
  mode: 'add' | 'update';
}
