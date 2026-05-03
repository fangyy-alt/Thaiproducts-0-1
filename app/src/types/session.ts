export type SessionStatus =
  | 'created'
  | 'card_drawn'
  | 'confessed'
  | 'crisis'
  | 'reading_done'
  | 'expired';

export interface TarotCard {
  id: string;
  nameTh: string;
  nameEn: string;
  arcana: 'major' | 'minor';
  keywordsTh: string[];
  symbol: string; // 用于占位的 unicode 符号
}

export interface Session {
  id: string;
  cardId: string | null;
  confessText: string | null;
  status: SessionStatus;
  createdAt: number;
  updatedAt: number;
  expiresAt: number;
}

export interface Reading {
  id: string;
  sessionId: string;
  cardId: string;
  readingText: string;
  modelVersion: string;
  promptVersion: string;
  generatedAt: number;
}

export type DonationStatus =
  | 'pending'
  | 'awaiting_payment'
  | 'succeeded'
  | 'failed'
  | 'expired';

export interface Donation {
  id: string;
  sessionId: string;
  amountThb: number;
  stripePaymentIntentId: string;
  status: DonationStatus;
  createdAt: number;
  paidAt: number | null;
}
