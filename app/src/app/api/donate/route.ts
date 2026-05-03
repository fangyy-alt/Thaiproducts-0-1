/**
 * POST /api/donate
 *
 * V1 mock 模式：
 * - 不调真 Stripe，直接建一条 pending donation
 * - 返回伪 PaymentIntent + 假 QR（前端自己渲染装饰性条纹块）
 * - 4 秒后由前端轮询 /api/donate/status 看到 succeeded（mock 自动 fulfill）
 *
 * 上线前替换为真实 Stripe PaymentIntent 创建（PRD/07 §7.5）。
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import { mockStore } from '@/lib/mock-store';

const BodySchema = z.object({
  sessionId: z.string().min(1),
  amountThb: z.number().int().positive().max(200), // PRD §7.5 单次上限 200
});

const VALID_AMOUNTS = new Set([20, 35, 50]);
const QR_TTL_SECONDS = 60; // mock：60 秒过期
const MOCK_FULFILL_DELAY_MS = 4000; // 4 秒后自动标记 succeeded

export async function POST(req: NextRequest) {
  let body: z.infer<typeof BodySchema>;
  try {
    body = BodySchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: 'invalid_input' }, { status: 400 });
  }

  if (!VALID_AMOUNTS.has(body.amountThb)) {
    return NextResponse.json({ error: 'invalid_amount' }, { status: 400 });
  }

  const session = mockStore.getSession(body.sessionId);
  if (!session) {
    return NextResponse.json({ error: 'session_not_found' }, { status: 404 });
  }

  const piId = `pi_mock_${nanoid(12)}`;
  mockStore.createDonation({
    id: nanoid(16),
    sessionId: session.id,
    amountThb: body.amountThb,
    stripePaymentIntentId: piId,
    status: 'awaiting_payment',
    createdAt: Date.now(),
    paidAt: null,
  });

  // mock：模拟用户在银行 App 完成扫码 — 4 秒后自动 succeeded
  setTimeout(() => {
    mockStore.updateDonationStatus(piId, 'succeeded', Date.now());
  }, MOCK_FULFILL_DELAY_MS);

  return NextResponse.json({
    paymentIntentId: piId,
    amountThb: body.amountThb,
    expiresInSeconds: QR_TTL_SECONDS,
    // 前端用 piId 做 QR 文本展示（真 Stripe 会返回 SVG）
    mockQrPayload: piId,
  });
}
