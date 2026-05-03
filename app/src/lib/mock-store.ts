/**
 * 内存版 mock store —— 替代 Supabase
 *
 * V1 教学/演示场景下不接真 DB；进程重启数据丢失（符合"匿名 session"理念，且省成本）。
 * 上线前需按 PRD/06 §6.3 替换为 Supabase 实现。
 */

import type { Session, Reading, Donation, SessionStatus } from '@/types/session';

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 天
const CONFESS_REDACT_MS = 24 * 60 * 60 * 1000; // 24 小时后清空 confessText

class MockStore {
  private sessions = new Map<string, Session>();
  private readings = new Map<string, Reading>();
  private donations = new Map<string, Donation>();
  private crisisLogs: Array<{ id: string; sessionId: string; matchedKeywords: string[]; createdAt: number }> = [];

  // —— Session ——
  createSession(id: string): Session {
    const now = Date.now();
    const session: Session = {
      id,
      cardId: null,
      confessText: null,
      status: 'created',
      createdAt: now,
      updatedAt: now,
      expiresAt: now + SESSION_TTL_MS,
    };
    this.sessions.set(id, session);
    return session;
  }

  getSession(id: string): Session | null {
    const s = this.sessions.get(id);
    if (!s) return null;
    if (Date.now() > s.expiresAt) {
      this.sessions.delete(id);
      return null;
    }
    // 模拟 24h confess 清空
    if (s.confessText && Date.now() - s.createdAt > CONFESS_REDACT_MS) {
      s.confessText = null;
    }
    return s;
  }

  updateSession(id: string, patch: Partial<Pick<Session, 'cardId' | 'confessText' | 'status'>>): Session | null {
    const s = this.getSession(id);
    if (!s) return null;
    if (patch.cardId !== undefined) s.cardId = patch.cardId;
    if (patch.confessText !== undefined) s.confessText = patch.confessText;
    if (patch.status !== undefined) s.status = patch.status;
    s.updatedAt = Date.now();
    this.sessions.set(id, s);
    return s;
  }

  // —— Reading ——
  saveReading(reading: Reading) {
    this.readings.set(reading.id, reading);
  }

  // —— Donation ——
  createDonation(d: Donation) {
    this.donations.set(d.id, d);
  }

  updateDonationStatus(stripePaymentIntentId: string, status: Donation['status'], paidAt?: number) {
    const all = Array.from(this.donations.values());
    for (let i = 0; i < all.length; i++) {
      const d = all[i];
      if (d.stripePaymentIntentId === stripePaymentIntentId) {
        d.status = status;
        if (paidAt) d.paidAt = paidAt;
        return d;
      }
    }
    return null;
  }

  getDonationByPI(stripePaymentIntentId: string): Donation | null {
    const all = Array.from(this.donations.values());
    for (let i = 0; i < all.length; i++) {
      if (all[i].stripePaymentIntentId === stripePaymentIntentId) return all[i];
    }
    return null;
  }

  // —— CrisisLog ——
  logCrisis(sessionId: string, matchedKeywords: string[]) {
    this.crisisLogs.push({
      id: `crisis-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      sessionId,
      matchedKeywords,
      createdAt: Date.now(),
    });
  }
}

// 全局单例（dev 模式 hot reload 也复用同一份）
const globalForStore = globalThis as unknown as { __mockStore?: MockStore };
export const mockStore = globalForStore.__mockStore ?? new MockStore();
if (!globalForStore.__mockStore) globalForStore.__mockStore = mockStore;
