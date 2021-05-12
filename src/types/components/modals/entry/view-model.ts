import { BCMSModalServiceItemInputDefaults } from '../../../services';

export type BCMSViewEntryModelModalOutputData = void;
export interface BCMSViewEntryModelModalInputData
  extends BCMSModalServiceItemInputDefaults<BCMSViewEntryModelModalOutputData> {
  templateId: string;
  entryId: string;
}
