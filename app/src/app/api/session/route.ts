/**
 * POST /api/session
 *
 * 两段式 API 第一段（PRD/07 §7.3 + 预检对齐结论 #5）：
 * - 接收 { cardId, confessText }
 * - 跑危机关键词审核（命中即返回 { type: 'crisis' }，不调 LLM）
 * - 通过则更新 session（cardId + confessText + status='confessed'）并返回 { sessionId }
 * - 前端拿到 sessionId 后跳 /reading/[sessionId]，由那里再发起 /api/reading 流式请求
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import { mockStore } from '@/lib/mock-store';
import { detectCrisisKeywords } from '@/lib/crisis-keywords';
import { findCard } from '@/lib/tarot-deck';
import { SESSION_COOKIE_NAME, SESSION_COOKIE_MAX_AGE } from '@/lib/session';

const BodySchema = z.object({
  cardId: z.string().min(1),
  confessText: z.string().min(50).max(1000),
});

export async function POST(req: NextRequest) {
  // 1. 校验输入
  let body: z.infer<typeof BodySchema>;
  try {
    const json = await req.json();
    body = BodySchema.parse(json);
  } catch (err) {
    return NextResponse.json(
      { error: 'invalid_input', detail: (err as Error).message },
      { status: 400 },
    );
  }

  // 2. 校验 cardId 真实存在
  const card = findCard(body.cardId);
  if (!card) {
    return NextResponse.json({ error: 'invalid_card' }, { status: 400 });
  }

  // 3. 取得或创建 session（cookie 驱动）
  const existingId = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  let sessionId = existingId;
  let session = existingId ? mockStore.getSession(existingId) : null;
  if (!session) {
    sessionId = nanoid(16);
    session = mockStore.createSession(sessionId);
  }

  // 4. 第一层：本地泰语关键词词典
  const matched = detectCrisisKeywords(body.confessText);
  if (matched.length > 0) {
    mockStore.logCrisis(session.id, matched);
    mockStore.updateSession(session.id, {
      cardId: body.cardId,
      // 命中危机时不存 confessText 原文（PRD/06 §6.5 隐私规则 3）
      confessText: null,
      status: 'crisis',
    });
    const res = NextResponse.json({
      type: 'crisis' as const,
      hotline: '1323',
    });
    res.cookies.set(SESSION_COOKIE_NAME, session.id, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: SESSION_COOKIE_MAX_AGE,
      path: '/',
    });
    return res;
  }

  // 5. （V1 mock 模式跳过 OpenAI Moderation 兜底层）
  // TODO: 接真 key 时启用 lib/moderation.ts 的双层审核

  // 6. 写入 session
  mockStore.updateSession(session.id, {
    cardId: body.cardId,
    confessText: body.confessText,
    status: 'confessed',
  });

  // 7. 返回 sessionId
  const res = NextResponse.json({
    type: 'session_ready' as const,
    sessionId: session.id,
  });
  res.cookies.set(SESSION_COOKIE_NAME, session.id, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: SESSION_COOKIE_MAX_AGE,
    path: '/',
  });
  return res;
}
