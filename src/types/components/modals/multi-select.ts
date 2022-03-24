import { BCMSModalInputDefaults } from '../../services';
import { BCMSMultiSelectItem } from '../input';

export interface BCMSMultiSelectModalOutputData {
  items: BCMSMultiSelectItem[];
}
export interface BCMSMultiSelectModalInputData
  extends BCMSModalInputDefaults<BCMSMultiSelectModalOutputData> {
  items: BCMSMultiSelectItem[];
  onlyOne?: boolean;
}
