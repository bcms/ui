import type { JWTPayload } from './payload';
import type { JWTHeader } from './header';

export type JWT = {
  header: JWTHeader;
  payload: JWTPayload;
  signature: string;
};
