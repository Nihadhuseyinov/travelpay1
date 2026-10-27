export type CurrencyCode = 'AZN' | 'USD' | 'EUR' | 'GBP' | 'TRY' | 'AED' | 'RUB' | 'BTC' | 'ETH' | 'USDT';

export interface ExchangeRate {
  code: CurrencyCode;
  name: string;
  symbol: string;
  rateToAZN: number; // 1 Unit in AZN (CBAR official)
  change24h: number;
  flag: string;
  isCrypto?: boolean;
}

export interface Transaction {
  id: string;
  timestamp: string;
  merchantName: string;
  category: 'Hotel' | 'Restaurant' | 'Museum' | 'Transport' | 'Shopping' | 'P2P' | 'CryptoConversion';
  amountAZN: number;
  originalAmount: number;
  originalCurrency: CurrencyCode;
  status: 'Completed' | 'Pending' | 'Flagged' | 'Blocked';
  fraudRiskScore: number; // 0 to 100
  paymentMethod: 'Risk-Free QR' | 'NFC Card' | 'Crypto Wallet' | 'P2P Instant' | 'Offline QR Token';
  location: string;
  txHash?: string;
  receiptNumber: string;
  vatRefundAZN?: number; // Tax Free / ƏDV Geri Al
}

export interface TouristProfile {
  id: string;
  fullName: string;
  passportNumber: string;
  nationality: string;
  countryCode: string;
  flag: string;
  arrivalDate: string;
  departureDate: string;
  tripPurpose: 'Tourism' | 'Business' | 'Culture & Events' | 'Formula 1 / Sports';
  kycStatus: 'Verified' | 'Pending' | 'Rejected';
  trustScore: number; // 0 - 100
  biometricEnrolled: boolean;
  avatarUrl: string;
  balances: {
    AZN: number;
    USD: number;
    EUR: number;
    BTC: number;
    ETH: number;
    USDT: number;
  };
}

export interface PartnerMerchant {
  id: string;
  name: string;
  category: 'Hotel' | 'Restaurant' | 'Museum' | 'Transport';
  location: string;
  discountOrPerk: string;
  acceptsCrypto: boolean;
  trustRating: number;
  imagePlaceholder: string;
}

export interface FraudAlert {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  riskScore: number;
  riskFactors: string[];
  resolved: boolean;
  actionTaken: 'Biometric Verified' | 'Auto-Blocked' | 'Pending Investigation' | 'Allowed';
}
