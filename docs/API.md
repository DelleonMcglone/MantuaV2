# Mantua API Documentation

## Overview

Mantua provides RESTful API endpoints for blockchain data exploration and DeFi operations.

## Base URL

```
https://your-app-url.replit.app/api
```

## Authentication

Most endpoints require wallet connection. Include the wallet address in requests where applicable.

## Endpoints

### Users

#### Create User
```http
POST /api/users
```

**Request Body:**
```json
{
  "walletAddress": "0x...",
  "name": "User Name"
}
```

**Response:**
```json
{
  "id": 1,
  "walletAddress": "0x...",
  "name": "User Name",
  "createdAt": "2025-01-20T18:30:00Z"
}
```

#### Get User by Wallet
```http
GET /api/users/wallet/{walletAddress}
```

**Response:**
```json
{
  "id": 1,
  "walletAddress": "0x...",
  "name": "User Name",
  "createdAt": "2025-01-20T18:30:00Z"
}
```

### Swap Operations

#### Execute Swap
```http
POST /api/swap
```

**Request Body:**
```json
{
  "fromToken": "ETH",
  "toToken": "USDC",
  "amount": "0.01",
  "slippage": 3,
  "hook": "mevProtection"
}
```

### Liquidity Operations

#### Add Liquidity
```http
POST /api/liquidity/add
```

**Request Body:**
```json
{
  "token1": "ETH",
  "token2": "USDC",
  "amount1": "0.01",
  "amount2": "10",
  "feeTier": "3000",
  "hook": "dynamicFee"
}
```

#### Remove Liquidity
```http
POST /api/liquidity/remove
```

**Request Body:**
```json
{
  "positionId": "123",
  "percentage": 50
}
```

### Position Management

#### Get Positions
```http
GET /api/positions?wallet={walletAddress}
```

**Response:**
```json
{
  "positions": [
    {
      "id": "123",
      "pair": "ETH/USDC",
      "liquidity": "1000000",
      "fees": "0.05",
      "hook": "dynamicFee"
    }
  ]
}
```

## Error Responses

All endpoints return appropriate HTTP status codes with error details:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

## Rate Limiting

- 100 requests per minute per IP
- 1000 requests per hour per wallet

## Webhooks

Configure webhooks to receive real-time updates about:
- Transaction confirmations
- Position changes
- Fee collections

## SDK Usage

```typescript
import { MantuaClient } from '@mantua/sdk';

const client = new MantuaClient({
  apiKey: 'your-api-key',
  network: 'base-sepolia'
});

// Execute swap
const swap = await client.swap({
  fromToken: 'ETH',
  toToken: 'USDC',
  amount: '0.01'
});
```