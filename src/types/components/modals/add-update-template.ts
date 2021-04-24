import { BCMSModalServiceItemInputDefaults } from '../../services';

export interface BCMSAddUpdateTemplateModalOutputData {
  name: string;
  desc: string;
}
export interface BCMSAddUpdateTemplateModalInputData
  extends BCMSModalServiceItemInputDefaults<BCMSAddUpdateTemplateModalOutputData> {
  name?: string;
  desc?: string;
}
