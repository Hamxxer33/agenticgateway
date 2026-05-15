export interface AgenticGatewayConfig {
  privateKey: string;
  facilitator?: string;
  network?: 'base';
}

export interface PaymentWallResponse {
  price: string;
  wallet: string;
  domain: string;
  facilitator: string;
}

export interface VerifyResponse {
  token: string;
  error?: string;
}
