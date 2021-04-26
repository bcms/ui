import { BCMSModalServiceItemInputDefaults } from '../../services';

export interface BCMSAddUpdateTemplateModalOutputData {
  label: string;
  desc: string;
}
export interface BCMSAddUpdateTemplateModalInputData
  extends BCMSModalServiceItemInputDefaults<BCMSAddUpdateTemplateModalOutputData> {
  label?: string;
  desc?: string;
  templateNames: string[];
  mode: 'add' | 'update';
}
