import type { UppyFile } from '@uppy/core';
import { BCMSModalServiceItemInputDefaults } from '../../../services';

export interface BCMSUploadMediaModalOutputData {
  files: UppyFile[];
}
export type BCMSUploadMediaModalInputData =
  BCMSModalServiceItemInputDefaults<BCMSUploadMediaModalOutputData>;
