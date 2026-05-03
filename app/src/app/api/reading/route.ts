/**
 * POST /api/reading
 *
 * 两段式 API 第二段（PRD/05 §5.5 + 预检对齐结论 #5）：
 * - 接收 { sessionId }（cardId/confessText 从 mock-store 拿，不再走前端）
 * - 返回 text/event-stream 风格的流（这里用 ReadableStream 直接逐 chunk 输出）
 * - 流结束后 INSERT readings + UPDATE session.status='reading_done'
 *
 * V1 用 mock-reading 模拟 LLM；上线前换成 Anthropic streamText（PRD/05 §5.3 system prompt）
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import { mockStore } from '@/lib/mock-store';
import { findCard } from '@/lib/tarot-deck';
import { streamMockReading } from '@/lib/mock-reading';

export const runtime = 'nodejs'; // 流式 + setTimeout 需 node runtime

const BodySchema = z.object({
  sessionId: z.string().min(1),
});

export async function POST(req: NextRequest) {
  let body: z.infer<typeof BodySchema>;
  try {
    body = BodySchema.parse(await req.json());
  } catch {
    return new Response(JSON.stringify({ error: 'invalid_input' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  const session = mockStore.getSession(body.sessionId);
  if (!session) {
    return new Response(JSON.stringify({ error: 'session_not_found' }), {
      status: 404,
      headers: { 'content-type': 'application/json' },
    });
  }

  if (!session.cardId || !session.confessText) {
    return new Response(JSON.stringify({ error: 'session_not_ready' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  if (session.status === 'crisis') {
    return new Response(JSON.stringify({ error: 'session_in_crisis' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  const card = findCard(session.cardId);
  if (!card) {
    return new Response(JSON.stringify({ error: 'card_not_found' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }

  const confessText = session.confessText;
  const sessionId = session.id;
  const cardId = card.id;

  // 流式输出
  const encoder = new TextEncoder();
  let fullText = '';

  const stream = new ReadableStream({
    async start(controller) {
      const ac = new AbortController();
      // 客户端断开时停掉生成
      req.signal.addEventListener('abort', () => ac.abort());

      try {
        for await (const chunk of streamMockReading(card, confessText, ac.signal)) {
          if (ac.signal.aborted) break;
          fullText += chunk;
          controller.enqueue(encoder.encode(chunk));
        }
        // 流结束 → 写库 + 更新 session 状态
        if (!ac.signal.aborted) {
          mockStore.saveReading({
            id: nanoid(16),
            sessionId,
            cardId,
            readingText: fullText,
            modelVersion: 'mock-v1',
            promptVersion: 'v1.0.0-mock',
            generatedAt: Date.now(),
          });
          mockStore.updateSession(sessionId, { status: 'reading_done' });
        }
      } catch (err) {
        controller.error(err);
        return;
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'no-cache, no-transform',
      'x-accel-buffering': 'no',
    },
  });
}
