import { sendUSDC } from './payment';
import { AgenticGatewayConfig, PaymentWallResponse, VerifyResponse } from './types';

export class AgenticGateway {
  facilitator: string;
  tokenCache: Map<string, string>;
  privateKey: string;

  constructor(config: AgenticGatewayConfig) {
    this.privateKey = config.privateKey;
    this.facilitator = config.facilitator || 'https://agenticgateway.xyz';
    this.tokenCache = new Map();
  }

  async fetch(url: string, options: RequestInit = {}): Promise<Response> {
    const response = await fetch(url, options);

    if (response.status !== 402) {
      return response;
    }

    const body = await response.json();
    const paymentInfo = body as PaymentWallResponse;
    const txHash = await sendUSDC(this.privateKey, paymentInfo.wallet, paymentInfo.price);

    await new Promise((resolve) => setTimeout(resolve, 5000));

    const verifyResponse = await fetch(
      this.facilitator.replace(/\/$/, '') + '/verify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ txHash, domain: paymentInfo.domain }),
      }
    );

    const verifyBody = (await verifyResponse.json()) as VerifyResponse;
    if (!verifyResponse.ok || !verifyBody.token) {
      throw new Error(verifyBody.error || 'Failed to verify payment');
    }

    this.tokenCache.set(paymentInfo.domain, verifyBody.token);

    const retryHeaders = new Headers(options.headers || undefined);
    retryHeaders.set('Authorization', 'Bearer ' + verifyBody.token);

    const retryResponse = await fetch(url, {
      ...options,
      headers: retryHeaders,
    });

    if (retryResponse.status === 200 && this.tokenCache.has(paymentInfo.domain)) {
      return retryResponse;
    }

    return retryResponse;
  }
}
