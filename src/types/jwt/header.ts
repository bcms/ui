export enum JWTEncryptionAlg {
  HMACSHA256 = 'HS256',
  HMACSHA512 = 'HS512',
}

export type JWTHeader = {
  type: string;
  alg: JWTEncryptionAlg;
};
