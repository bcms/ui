import type { UppyFile } from '@uppy/core';
import { BCMSModalInputDefaults } from '../../../services';

export interface BCMSUploadMediaModalOutputData {
  files: UppyFile[];
}
export type BCMSUploadMediaModalInputData =
  BCMSModalInputDefaults<BCMSUploadMediaModalOutputData>;
