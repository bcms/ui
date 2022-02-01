import { BCMSUser, BCMSUserPolicy } from '@becomes/cms-sdk/types';
import { BCMSModalInputDefaults } from '../../../services';

export interface BCMSViewUserModalOutputData {
  policy: BCMSUserPolicy;
}
export interface BCMSViewUserModalInputData
  extends BCMSModalInputDefaults<BCMSViewUserModalOutputData> {
  user: BCMSUser;
}
