import type { Role } from './role';

export type JWTPayload = {
  jti: string;
  iss: string;
  iat: number;
  exp: number;
  userId: string;
  roles: Role[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  customPool: any;
};
