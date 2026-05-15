# Agentic Gateway

> The payment layer for the agentic web.

Agentic Gateway is an open infrastructure protocol that lets AI agents pay micro-fees to access websites — and lets site owners monetize agent traffic they currently give away for free.

Built on Base. Powered by the x402 payment standard. Free and open source during open beta.

---

## The Problem

AI agents browse the web constantly — scraping content, pulling data, reading pages.

Site owners get nothing. Agents get blocked.

HTTP 402 (Payment Required) has existed since 1991 but was never implemented. We're building the first real version of it, on Base.

---

## The Solution

Agentic Gateway implements HTTP 402 as a real payment protocol on Base.

1. Agent sends a request to a site
2. Site returns `402 Payment Required` with price and owner wallet
3. Agent pays in USDC on Base
4. Facilitator verifies the payment onchain — no trust required
5. Facilitator issues a signed JWT access token
6. Agent retries the request and gets full access

All of this happens in seconds. No subscriptions. No API keys. Pay per request.

---

## How It Works

```
Agent Request
     │
          ▼
          Site returns 402 + { price, wallet, domain }
               │
                    ▼
                    Agent pays USDC on Base → owner wallet directly
                         │
                              ▼
                              Agent submits txHash + domain → Agentic Gateway Facilitator
                                   │
                                        ▼
                                        Facilitator reads Base RPC → verifies Transfer log onchain
                                             │
                                                  ▼
                                                  Facilitator issues signed JWT access token
                                                       │
                                                            ▼
                                                            Agent retries request with token → gets full content
```

---

## For Site Owners

- Add one script tag to your site
- Set your own price (minimum $0.10 USDC recommended)
- Register your domain and wallet in the registry
- Start earning from every agent that accesses your content
- Payments go directly to your wallet — no middleman

```html
<script src="https://agenticgateway.onrender.com/embed.js"
        data-price="0.10"
        data-wallet="0xYourWallet">
</script>
```

**Register your domain:**

```bash
curl -X POST https://agenticgateway.onrender.com/registry \
  -H "Content-Type: application/json" \
  -d '{"domain": "yoursite.com", "price": "0.10", "owner": "0xYourWallet"}'
```

---

## For Agent Developers

Detect 402 responses, pay USDC on Base, get access. Simple.

```typescript
import { AgenticGateway } from '@agenticgateway/sdk'

const agent = new AgenticGateway({
      wallet: '0xYourAgentWallet',
      privateKey: process.env.AGENT_KEY,
      network: 'base'
})

// Automatically handles 402 detection, payment, and retry
const response = await agent.fetch('https://example.com/data')
console.log(response.data)
```

**Manual flow:**

```bash
# 1. Try to access a site
curl https://example.com/data
# Returns 402 + payment details

# 2. Pay USDC on Base to the owner wallet

# 3. Submit txHash to facilitator
curl -X POST https://agenticgateway.onrender.com/verify \
  -H "Content-Type: application/json" \
  -d '{"txHash": "0x...", "domain": "example.com"}'
# Returns { "token": "eyJ..." }

# 4. Retry with token
curl https://example.com/data \
  -H "Authorization: Bearer eyJ..."
```

---

## API Reference

### POST /verify

Verify a USDC payment and receive an access token.

**Request:**
```json
{
    "txHash": "0x...",
    "domain": "example.com"
}
```

**Response:**
```json
{
    "token": "eyJhbGciOiJIUzI1NiJ9..."
}
```

**Errors:**
```json
{ "error": "Invalid payment" }
{ "error": "Domain not registered" }
{ "error": "Transaction already used" }
```

---

### POST /registry

Register a domain with a price and owner wallet.

**Request:**
```json
{
    "domain": "example.com",
    "price": "0.10",
    "owner": "0xYourWallet"
}
```

**Response:**
```json
{
    "success": true,
    "domain": "example.com"
}
```

---

### GET /registry/:domain

Get price and owner info for a registered domain.

**Response:**
```json
{
    "domain": "example.com",
    "price": "0.10",
    "owner": "0xYourWallet"
}
```

---

## Stack

- **Network:** Base (Mainnet)
- **Payment Token:** USDC
- **Payment Standard:** x402
- **Backend:** Node.js + Express + TypeScript
- **Onchain Reads:** viem
- **Auth Tokens:** JWT
- **Hosting:** Render

---

## Self Hosting

```bash
git clone https://github.com/Hamxxer33/agenticgateway
cd agenticgateway
npm install
cp .env.example .env
# Fill in your JWT_SECRET
npm run build
npm start
```

**.env.example:**
```
JWT_SECRET=
PORT=3000
BASE_RPC_URL=https://mainnet.base.org
```

---

## Roadmap

- [x] Facilitator API (verify payment + issue JWT)
- [x] Domain registry (in-memory)
- [ ] Site embed script
- [ ] Agent SDK (@agenticgateway/sdk)
- [ ] Persistent registry (Postgres / onchain)
- [ ] Dashboard for site owners
- [ ] Onchain registry contract (Base)
- [ ] $AGATE token + fee governance

---

## Protocol Fee

**0% during open beta.**

Agentic Gateway is free and open source. Payments go directly from agent wallets to site owner wallets. No middleman, no cut.

A protocol fee switch is reserved for future governance via $AGATE token. The community will decide if and when it activates.

---

## Contributing

PRs welcome. Open an issue first for major changes.

---

## Community

- X: [@agenticgateway](https://x.com/agenticgateway)
- Telegram: [t.me/agenticgateway](https://t.me/agenticgateway)
- Built on [Base](https://base.org) · Powered by [x402](https://x402.org)

---

## License

MIT
