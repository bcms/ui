import type { JWTPayload } from './payload';
import type { JWTHeader } from './header';

export interface JWT {
  header: JWTHeader;
  payload: JWTPayload;
  signature: string;
}
