import { BCMSModalServiceItemInputDefaults } from '../../services';

export interface BCMSAddUpdateWidgetModalOutputData {
  name: string;
  desc: string;
  previewImage: string;
}
export interface BCMSAddUpdateWidgetModalInputData
  extends BCMSModalServiceItemInputDefaults<BCMSAddUpdateWidgetModalOutputData> {
  name?: string;
  desc?: string;
  previewImage?: string;
}
