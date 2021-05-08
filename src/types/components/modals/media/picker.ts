import type { BCMSMedia } from '@becomes/cms-sdk/types';
import { BCMSModalServiceItemInputDefaults } from '../../../services';

export interface BCMSMediaPickerModalOutputData {
  media: BCMSMedia;
}
export interface BCMSMediaPickerModalInputData
  extends BCMSModalServiceItemInputDefaults<BCMSMediaPickerModalOutputData> {
  media?: BCMSMedia;
}
