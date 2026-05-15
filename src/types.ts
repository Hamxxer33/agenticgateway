export interface DomainRegistry {
  domain: string;
  price: string; // USDC amount as string for precision
  owner: string; // wallet address
}

export interface VerifyRequest {
  txHash: string;
  domain: string;
}

export interface JWTPayload {
  domain: string;
  issuedAt: number;
}