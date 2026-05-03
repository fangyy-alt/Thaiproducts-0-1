/**
 * GET /api/donate/[paymentIntentId]
 * 前端轮询打赏状态。V1 mock，prod 替换为查 Supabase + 校验 Stripe webhook 已写入。
 */

import { NextResponse } from 'next/server';
import { mockStore } from '@/lib/mock-store';

export async function GET(
  _req: Request,
  { params }: { params: { paymentIntentId: string } },
) {
  const d = mockStore.getDonationByPI(params.paymentIntentId);
  if (!d) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }
  return NextResponse.json({
    status: d.status,
    amountThb: d.amountThb,
    paidAt: d.paidAt,
  });
}
