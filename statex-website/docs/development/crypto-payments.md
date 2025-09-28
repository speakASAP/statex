# Cryptocurrency Payment Integration

## 🎯 Overview

This document outlines the comprehensive cryptocurrency payment system for Statex, enabling clients to pay for services using various cryptocurrencies while maintaining compliance with EU regulations and providing secure, transparent transactions. The system is built on our **Fastify** backend with **PostgreSQL + Prisma** database and integrated with our multi-gateway payment stack.

## 🔗 Related Documentation

- [Technology Stack](technology.md) - Complete technology decisions and cost analysis
- [Architecture](architecture.md) - System architecture overview
- [Backend Documentation](backend.md) - Fastify API implementation details
- [Frontend Documentation](frontend.md) - Next.js 14+ payment integration
- [Client Portal](client-portal.md) - User management and payment dashboard
- [EU Compliance](eu-compliance.md) - Legal and regulatory requirements
- [Testing](testing.md) - Vitest testing framework
- [Monitoring System](monitoring-system.md) - Sentry error tracking
- [Scheduled Tasks](scheduled-tasks.md) - BullMQ payment processing
- [Development Plan](../../development-plan.md) - Complete project plan

## 💰 **Payment Stack Integration**

### **Multi-Gateway Payment System**
```typescript
// Payment gateway hierarchy aligned with our technology stack
const PAYMENT_GATEWAY_HIERARCHY = {
  primary: {
    name: 'Stripe',
    type: 'traditional',
    priority: 1,
    features: ['cards', 'sepa', 'ideal', 'bancontact'],
    eu_compliance: true,
    cost: '2.9% + €0.25 per transaction'
  },
  
  alternative: {
    name: 'PayPal',
    type: 'traditional',
    priority: 2,
    features: ['paypal_balance', 'cards', 'bank_transfer'],
    eu_compliance: true,
    cost: '3.4% + €0.35 per transaction'
  },
  
  crypto_primary: {
    name: 'Coinbase Commerce',
    type: 'cryptocurrency',
    priority: 3,
    supported_currencies: ['BTC', 'ETH', 'LTC', 'BCH', 'USDC', 'DAI'],
    cost: '1% per transaction',
    eu_compliance: true
  },
  
  crypto_selfhosted: {
    name: 'BTCPay Server',
    type: 'self_hosted_crypto',
    priority: 4,
    supported_currencies: ['BTC', 'LTC', 'ETH', 'XMR', '100+ others'],
    cost: '0% (only network fees)',
    privacy_focused: true,
    setup_complexity: 'high'
  },
  
  eu_specific: {
    name: 'Comgate',
    type: 'traditional',
    priority: 5,
    region: 'czech_republic_eu',
    features: ['bank_transfer', 'cards', 'local_payments'],
    cost: '1.9% + CZK 2.50 per transaction'
  }
};
```

## 🏗 **Fastify Backend Implementation**

### **Cryptocurrency Payment Routes**
```typescript
// routes/payments/crypto.ts - Fastify crypto payment routes
import { FastifyPluginAsync } from 'fastify';
import { cryptoPaymentService } from '../../services/cryptoPaymentService';
import { authPlugin } from '../../plugins/auth';

const cryptoPaymentRoutes: FastifyPluginAsync = async (fastify) => {
  await fastify.register(authPlugin);

  // Create cryptocurrency payment
  fastify.post('/crypto/create', {
    schema: {
      body: {
        type: 'object',
        required: ['amount', 'currency', 'gateway'],
        properties: {
          amount: { type: 'number', minimum: 0.01 },
          currency: { type: 'string', enum: ['EUR', 'USD', 'CZK'] },
          gateway: { type: 'string', enum: ['coinbase', 'btcpay'] },
          cryptoCurrency: { type: 'string', enum: ['BTC', 'ETH', 'LTC', 'BCH', 'USDC', 'DAI', 'XMR'] },
          serviceType: { type: 'string', enum: ['prototype', 'consulting', 'development'] }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            paymentId: { type: 'string' },
            paymentUrl: { type: 'string' },
            qrCode: { type: 'string' },
            address: { type: 'string' },
            amount: { type: 'string' },
            expiresAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  }, async (request, reply) => {
    const { amount, currency, gateway, cryptoCurrency, serviceType } = request.body;
    const userId = request.user.id;

    try {
      const payment = await cryptoPaymentService.createPayment({
        amount,
        currency,
        gateway,
        cryptoCurrency,
        serviceType,
        userId
      });

      return {
        success: true,
        paymentId: payment.id,
        paymentUrl: payment.hostedUrl,
        qrCode: payment.qrCode,
        address: payment.address,
        amount: payment.cryptoAmount,
        expiresAt: payment.expiresAt
      };
    } catch (error) {
      fastify.log.error('Crypto payment creation failed:', error);
      reply.status(500).send({
        success: false,
        error: 'Failed to create cryptocurrency payment'
      });
    }
  });

  // Verify cryptocurrency payment
  fastify.post('/crypto/verify/:paymentId', {
    schema: {
      params: {
        type: 'object',
        properties: {
          paymentId: { type: 'string' }
        },
        required: ['paymentId']
      }
    }
  }, async (request, reply) => {
    const { paymentId } = request.params;
    const userId = request.user.id;

    try {
      const verification = await cryptoPaymentService.verifyPayment({
        paymentId,
        userId
      });

      return {
        success: true,
        status: verification.status,
        confirmations: verification.confirmations,
        transactionHash: verification.transactionHash,
        completedAt: verification.completedAt
      };
    } catch (error) {
      fastify.log.error('Crypto payment verification failed:', error);
      reply.status(500).send({
        success: false,
        error: 'Failed to verify cryptocurrency payment'
      });
    }
  });

  // Webhook handling for payment updates
  fastify.post('/crypto/webhook/:gateway', {
    schema: {
      params: {
        type: 'object',
        properties: {
          gateway: { type: 'string', enum: ['coinbase', 'btcpay'] }
        },
        required: ['gateway']
      }
    }
  }, async (request, reply) => {
    const { gateway } = request.params;
    const payload = request.body;

    try {
      await cryptoPaymentService.handleWebhook(gateway, payload, request.headers);
      
      return { success: true, processed: true };
    } catch (error) {
      fastify.log.error(`${gateway} webhook processing failed:`, error);
      reply.status(500).send({
        success: false,
        error: 'Webhook processing failed'
      });
    }
  });
};

export default cryptoPaymentRoutes;
```

### **PostgreSQL Database Schema with Prisma**
```sql
-- Cryptocurrency payments table
CREATE TABLE crypto_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- User and Service Information
    user_id UUID REFERENCES users(id) NOT NULL,
    service_type service_type_enum NOT NULL,
    
    -- Payment Details
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) NOT NULL, -- EUR, USD, CZK
    crypto_currency VARCHAR(10) NOT NULL, -- BTC, ETH, etc.
    crypto_amount VARCHAR(50) NOT NULL, -- Exact crypto amount as string
    
    -- Gateway Information
    gateway crypto_gateway_enum NOT NULL,
    external_id VARCHAR(255), -- Gateway's payment ID
    
    -- Crypto-specific Details
    wallet_address VARCHAR(255),
    payment_address VARCHAR(255), -- Specific address for this payment
    qr_code_data TEXT, -- QR code content
    network VARCHAR(50), -- Bitcoin, Ethereum, Polygon, etc.
    
    -- Payment Status and Tracking
    status crypto_payment_status_enum DEFAULT 'PENDING',
    transaction_hash VARCHAR(255),
    confirmations INTEGER DEFAULT 0,
    required_confirmations INTEGER DEFAULT 1,
    
    -- Timing
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP,
    paid_at TIMESTAMP,
    confirmed_at TIMESTAMP,
    
    -- Webhook and Processing
    webhook_data JSONB,
    gateway_response JSONB,
    error_message TEXT,
    
    -- BullMQ Job Tracking
    verification_job_id VARCHAR(255),
    notification_job_id VARCHAR(255),
    
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE crypto_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Payment Relationship
    payment_id UUID REFERENCES crypto_payments(id) NOT NULL,
    
    -- Transaction Details
    transaction_hash VARCHAR(255) NOT NULL,
    from_address VARCHAR(255),
    to_address VARCHAR(255) NOT NULL,
    amount VARCHAR(50) NOT NULL, -- Crypto amount as string
    network VARCHAR(50) NOT NULL,
    
    -- Blockchain Information
    block_height INTEGER,
    block_hash VARCHAR(255),
    confirmations INTEGER DEFAULT 0,
    gas_used DECIMAL(20,0),
    gas_price DECIMAL(20,0),
    
    -- Status and Timing
    status transaction_status_enum DEFAULT 'PENDING',
    detected_at TIMESTAMP DEFAULT NOW(),
    confirmed_at TIMESTAMP,
    
    -- Raw blockchain data
    raw_transaction_data JSONB,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Enums for crypto payments
CREATE TYPE crypto_gateway_enum AS ENUM ('coinbase', 'btcpay', 'manual');
CREATE TYPE crypto_payment_status_enum AS ENUM ('PENDING', 'PAID', 'CONFIRMED', 'COMPLETED', 'EXPIRED', 'FAILED');
CREATE TYPE transaction_status_enum AS ENUM ('PENDING', 'CONFIRMED', 'FAILED');
CREATE TYPE service_type_enum AS ENUM ('prototype', 'consulting', 'development', 'support');
```

## 💎 **Supported Cryptocurrencies**

### **Primary Cryptocurrencies (Tier 1)**
```typescript
const PRIMARY_CRYPTO_CURRENCIES = {
  bitcoin: {
    symbol: 'BTC',
    name: 'Bitcoin',
    network: 'Bitcoin',
    decimals: 8,
    min_payment: 0.001, // BTC (~€30-50 depending on price)
    avg_confirmation_time: '10-60 minutes',
    required_confirmations: 1,
    security_level: 'highest',
    adoption_rate: 'highest',
    gateway_support: ['coinbase', 'btcpay']
  },
  ethereum: {
    symbol: 'ETH',
    name: 'Ethereum',
    network: 'Ethereum',
    decimals: 18,
    min_payment: 0.01, // ETH (~€20-40 depending on price)
    avg_confirmation_time: '2-5 minutes',
    required_confirmations: 12,
    security_level: 'high',
    smart_contracts: true,
    gateway_support: ['coinbase', 'btcpay']
  },
  bitcoin_cash: {
    symbol: 'BCH',
    name: 'Bitcoin Cash',
    network: 'Bitcoin Cash',
    decimals: 8,
    min_payment: 0.01, // BCH
    avg_confirmation_time: '10-30 minutes',
    required_confirmations: 1,
    lower_fees: true,
    gateway_support: ['coinbase', 'btcpay']
  },
  litecoin: {
    symbol: 'LTC',
    name: 'Litecoin',
    network: 'Litecoin',
    decimals: 8,
    min_payment: 0.1, // LTC
    avg_confirmation_time: '2.5-10 minutes',
    required_confirmations: 3,
    faster_processing: true,
    gateway_support: ['coinbase', 'btcpay']
  }
};
```

### **Stablecoins (Tier 2) - Recommended for Business**
```typescript
const STABLECOIN_CURRENCIES = {
  usdc: {
    symbol: 'USDC',
    name: 'USD Coin',
    networks: ['Ethereum', 'Polygon', 'BSC', 'Avalanche'],
    decimals: 6,
    min_payment: 10, // USDC (€9-10)
    stable_value: true,
    regulatory_compliant: true,
    preferred_network: 'Polygon', // Lower fees
    gateway_support: ['coinbase', 'btcpay'],
    recommended: true // Best for business transactions
  },
  usdt: {
    symbol: 'USDT',
    name: 'Tether USD',
    networks: ['Ethereum', 'Tron', 'BSC', 'Polygon'],
    decimals: 6,
    min_payment: 10, // USDT
    stable_value: true,
    preferred_network: 'Polygon', // Lower fees
    gateway_support: ['coinbase', 'btcpay'],
    note: 'Most widely accepted stablecoin'
  },
  dai: {
    symbol: 'DAI',
    name: 'MakerDAO DAI',
    networks: ['Ethereum', 'Polygon', 'BSC'],
    decimals: 18,
    min_payment: 10, // DAI
    decentralized: true,
    preferred_network: 'Polygon',
    gateway_support: ['btcpay'], // More decentralized option
    transparency: 'Fully decentralized and transparent'
  }
};
```

## 🏪 **Payment Gateway Implementation**

### **Coinbase Commerce Integration**
```typescript
// services/coinbasePaymentService.ts
import { CoinbaseCommerce, Webhook } from 'coinbase-commerce-node';

CoinbaseCommerce.init(process.env.COINBASE_COMMERCE_API_KEY!);

export class CoinbasePaymentService {
  async createPayment({
    amount,
    currency,
    cryptoCurrency,
    userId,
    serviceType
  }: CreatePaymentParams) {
    try {
      const charge = await CoinbaseCommerce.resources.Charge.create({
        name: `Statex ${serviceType} Service`,
        description: `AI-powered ${serviceType} service payment`,
        pricing_type: 'fixed_price',
        local_price: {
          amount: amount.toString(),
          currency: currency
        },
        metadata: {
          user_id: userId,
          service_type: serviceType,
          created_via: 'statex_website'
        },
        redirect_url: `${process.env.FRONTEND_URL}/payment/success`,
        cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`
      });

      // Store payment in database
      const payment = await prisma.cryptoPayments.create({
        data: {
          userId,
          serviceType,
          amount,
          currency,
          cryptoCurrency,
          gateway: 'coinbase',
          externalId: charge.id,
          paymentAddress: charge.addresses?.[cryptoCurrency],
          qrCodeData: this.generateQRCode(charge.addresses?.[cryptoCurrency], amount),
          expiresAt: new Date(charge.expires_at),
          status: 'PENDING'
        }
      });

      return {
        id: payment.id,
        hostedUrl: charge.hosted_url,
        address: charge.addresses?.[cryptoCurrency],
        qrCode: payment.qrCodeData,
        cryptoAmount: charge.pricing?.[cryptoCurrency]?.amount,
        expiresAt: charge.expires_at
      };
    } catch (error) {
      throw new Error(`Coinbase payment creation failed: ${error.message}`);
    }
  }

  async handleWebhook(payload: any, signature: string) {
    try {
      const event = Webhook.verifyEventBody(
        JSON.stringify(payload),
        signature,
        process.env.COINBASE_WEBHOOK_SECRET!
      );

      switch (event.type) {
        case 'charge:pending':
          await this.handleChargePending(event.data);
          break;
        case 'charge:confirmed':
          await this.handleChargeConfirmed(event.data);
          break;
        case 'charge:failed':
          await this.handleChargeFailed(event.data);
          break;
        case 'charge:resolved':
          await this.handleChargeResolved(event.data);
          break;
      }
    } catch (error) {
      throw new Error(`Webhook verification failed: ${error.message}`);
    }
  }

  private generateQRCode(address: string, amount: string): string {
    // Generate QR code data for crypto payment
    return `bitcoin:${address}?amount=${amount}`;
  }
}
```

### **BTCPay Server Integration**
```typescript
// services/btcpayPaymentService.ts
import { BTCPayClient } from 'btcpay-greenfield-node-client';

export class BTCPayPaymentService {
  private client: BTCPayClient;

  constructor() {
    this.client = new BTCPayClient({
      baseUrl: process.env.BTCPAY_SERVER_URL!,
      apiKey: process.env.BTCPAY_API_KEY!
    });
  }

  async createPayment({
    amount,
    currency,
    cryptoCurrency,
    userId,
    serviceType
  }: CreatePaymentParams) {
    try {
      const invoice = await this.client.createInvoice({
        storeId: process.env.BTCPAY_STORE_ID!,
        amount: amount.toString(),
        currency: currency,
        defaultPaymentMethod: cryptoCurrency,
        metadata: {
          userId,
          serviceType,
          orderId: `statex-${Date.now()}`
        },
        checkout: {
          redirectURL: `${process.env.FRONTEND_URL}/payment/success`,
          defaultLanguage: 'en'
        }
      });

      // Store payment in database
      const payment = await prisma.cryptoPayments.create({
        data: {
          userId,
          serviceType,
          amount,
          currency,
          cryptoCurrency,
          gateway: 'btcpay',
          externalId: invoice.id,
          paymentAddress: invoice.paymentMethods?.[0]?.destination,
          status: 'PENDING',
          expiresAt: new Date(invoice.expirationTime)
        }
      });

      return {
        id: payment.id,
        hostedUrl: invoice.checkoutLink,
        address: invoice.paymentMethods?.[0]?.destination,
        cryptoAmount: invoice.paymentMethods?.[0]?.rate,
        expiresAt: invoice.expirationTime
      };
    } catch (error) {
      throw new Error(`BTCPay payment creation failed: ${error.message}`);
    }
  }

  async handleWebhook(payload: any) {
    try {
      const { invoiceId, type } = payload;

      switch (type) {
        case 'InvoiceReceivedPayment':
          await this.handlePaymentReceived(invoiceId);
          break;
        case 'InvoiceConfirmed':
          await this.handlePaymentConfirmed(invoiceId);
          break;
        case 'InvoiceInvalid':
          await this.handlePaymentFailed(invoiceId);
          break;
      }
    } catch (error) {
      throw new Error(`BTCPay webhook processing failed: ${error.message}`);
    }
  }
}
```

## 🎨 **Next.js 14+ Frontend Integration**

### **Crypto Payment Component**
```typescript
// components/payments/CryptoPayment.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { apiClient } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import QRCode from 'qrcode.react';

interface CryptoPaymentProps {
  amount: number;
  currency: string;
  serviceType: string;
  onSuccess: (paymentId: string) => void;
  onError: (error: string) => void;
}

export function CryptoPayment({ 
  amount, 
  currency, 
  serviceType, 
  onSuccess, 
  onError 
}: CryptoPaymentProps) {
  const { data: session } = useSession();
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');
  const [selectedGateway, setSelectedGateway] = useState('coinbase');
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(false);

  const SUPPORTED_CRYPTOS = {
    BTC: { name: 'Bitcoin', icon: '₿' },
    ETH: { name: 'Ethereum', icon: 'Ξ' },
    USDC: { name: 'USD Coin', icon: '$', recommended: true },
    LTC: { name: 'Litecoin', icon: 'Ł' }
  };

  const createPayment = async () => {
    if (!session) {
      onError('Please log in to make a payment');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post('/api/payments/crypto/create', {
        amount,
        currency,
        gateway: selectedGateway,
        cryptoCurrency: selectedCrypto,
        serviceType
      });

      setPayment(response.data);
      
      // Start payment verification polling
      startPaymentVerification(response.data.paymentId);
    } catch (error) {
      onError('Failed to create crypto payment');
    } finally {
      setLoading(false);
    }
  };

  const startPaymentVerification = (paymentId: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await apiClient.post(`/api/payments/crypto/verify/${paymentId}`);
        
        if (response.data.status === 'COMPLETED') {
          clearInterval(interval);
          onSuccess(paymentId);
        }
      } catch (error) {
        console.error('Payment verification failed:', error);
      }
    }, 10000); // Check every 10 seconds

    // Stop checking after 1 hour
    setTimeout(() => clearInterval(interval), 3600000);
  };

  if (payment) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Complete Your Payment</h3>
          <p className="text-gray-600">
            Send exactly <strong>{payment.amount}</strong> {selectedCrypto} to the address below
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <QRCode value={payment.qrCode} size={200} className="mx-auto mb-4" />
          <div className="font-mono text-sm break-all bg-white p-2 rounded border">
            {payment.address}
          </div>
        </div>

        <div className="flex space-x-4">
          <Button 
            onClick={() => window.open(payment.paymentUrl, '_blank')}
            className="flex-1"
          >
            Open in Wallet
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigator.clipboard.writeText(payment.address)}
            className="flex-1"
          >
            Copy Address
          </Button>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>Payment expires in: {new Date(payment.expiresAt).toLocaleString()}</p>
          <p>Waiting for payment confirmation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Pay with Cryptocurrency</h3>
        
        <div className="grid grid-cols-2 gap-2 mb-4">
          {Object.entries(SUPPORTED_CRYPTOS).map(([symbol, crypto]) => (
            <button
              key={symbol}
              onClick={() => setSelectedCrypto(symbol)}
              className={`p-3 border rounded-lg text-left ${
                selectedCrypto === symbol 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="text-lg">{crypto.icon}</span>
                <div>
                  <div className="font-medium">{crypto.name}</div>
                  <div className="text-sm text-gray-500">{symbol}</div>
                </div>
                {crypto.recommended && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                    Recommended
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Payment Gateway</label>
          <select
            value={selectedGateway}
            onChange={(e) => setSelectedGateway(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="coinbase">Coinbase Commerce (Recommended)</option>
            <option value="btcpay">BTCPay Server (Privacy-focused)</option>
          </select>
        </div>
      </div>

      <Button 
        onClick={createPayment} 
        loading={loading}
        className="w-full"
      >
        Create {selectedCrypto} Payment
      </Button>
    </div>
  );
}
```

## 🧪 **Vitest Testing Implementation**

### **Crypto Payment Service Tests**
```typescript
// __tests__/services/cryptoPaymentService.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CoinbasePaymentService } from '../../src/services/coinbasePaymentService';
import { BTCPayPaymentService } from '../../src/services/btcpayPaymentService';

describe('Crypto Payment Services', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Coinbase Commerce', () => {
    it('should create a cryptocurrency payment', async () => {
      const coinbaseService = new CoinbasePaymentService();
      
      const mockCharge = {
        id: 'test-charge-id',
        hosted_url: 'https://commerce.coinbase.com/charges/test',
        addresses: { BTC: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa' },
        expires_at: '2024-12-31T23:59:59Z'
      };

      // Mock Coinbase Commerce API
      vi.mock('coinbase-commerce-node', () => ({
        CoinbaseCommerce: {
          init: vi.fn(),
          resources: {
            Charge: {
              create: vi.fn().mockResolvedValue(mockCharge)
            }
          }
        }
      }));

      const payment = await coinbaseService.createPayment({
        amount: 100,
        currency: 'EUR',
        cryptoCurrency: 'BTC',
        userId: 'user-id',
        serviceType: 'prototype'
      });

      expect(payment.hostedUrl).toBe(mockCharge.hosted_url);
      expect(payment.address).toBe(mockCharge.addresses.BTC);
    });
  });

  describe('BTCPay Server', () => {
    it('should create a self-hosted cryptocurrency payment', async () => {
      const btcpayService = new BTCPayPaymentService();
      
      const mockInvoice = {
        id: 'test-invoice-id',
        checkoutLink: 'https://btcpay.statex.cz/invoice/test',
        paymentMethods: [{
          destination: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
          rate: '0.00234567'
        }],
        expirationTime: '2024-12-31T23:59:59Z'
      };

      const payment = await btcpayService.createPayment({
        amount: 100,
        currency: 'EUR',
        cryptoCurrency: 'BTC',
        userId: 'user-id',
        serviceType: 'prototype'
      });

      expect(payment.hostedUrl).toBe(mockInvoice.checkoutLink);
      expect(payment.address).toBe(mockInvoice.paymentMethods[0].destination);
    });
  });
});
```

## 🔒 **EU Compliance and Security**

### **Cryptocurrency Regulation Compliance**
```typescript
const EU_CRYPTO_COMPLIANCE = {
  mica_regulation: {
    name: 'Markets in Crypto-Assets (MiCA)',
    status: 'Effective from 2024',
    requirements: [
      'Stablecoin reserve transparency',
      'Consumer protection measures',
      'Anti-money laundering (AML) compliance',
      'Authorization for crypto asset services'
    ]
  },
  
  payment_services_directive: {
    name: 'PSD2 (Payment Services Directive 2)',
    requirements: [
      'Strong customer authentication',
      'Transaction monitoring',
      'Open banking compliance',
      'Consumer protection'
    ]
  },
  
  gdpr_compliance: {
    data_collection: 'Minimal data collection for crypto payments',
    user_rights: 'Right to erasure and data portability',
    consent: 'Explicit consent for payment processing',
    retention: 'Limited data retention for compliance'
  }
};
```

---

This comprehensive cryptocurrency payment system integrates seamlessly with our **Fastify** backend, **PostgreSQL + Prisma** database, and **Next.js 14+** frontend, providing secure, compliant, and user-friendly crypto payment options while supporting our multi-gateway payment strategy and EU regulatory requirements. 