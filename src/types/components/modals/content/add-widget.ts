import type { BCMSWidget } from '@becomes/cms-sdk/types';
import { BCMSModalInputDefaults } from '../../../services';

export interface BCMSContentEditorAddWidgetModalOutputData {
  widget: BCMSWidget;
}
export interface BCMSContentEditorAddWidgetModalInputData
  extends BCMSModalInputDefaults<BCMSContentEditorAddWidgetModalOutputData> {
  allowedIds?: string[];
}
