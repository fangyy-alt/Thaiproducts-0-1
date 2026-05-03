/**
 * 假泰语开示模板 —— mock 替代 Anthropic streamText
 *
 * 上线前替换为真实 LLM 调用（PRD/05 §5.3 system prompt）。
 * 这里的内容仅供 MVP 视觉/闭环验证，不代表真正的开示质量。
 */

import type { TarotCard } from '@/types/session';

/**
 * 根据牌和倾诉文本生成一段拟"师父开示"风格的泰语长文。
 * 不是真 AI——是模板拼接，但保留了 PRD 要求的 3-4 段结构。
 */
export function buildMockReading(card: TarotCard, confessText: string): string {
  // 取倾诉里前 30 个字符做"具体引用"占位
  const snippet = confessText.trim().slice(0, 30);

  const paragraphs = [
    // 第一段：承认/接住
    `ฉันได้ยินสิ่งที่คุณเขียน "${snippet}..." แล้ว นั่นเป็นน้ำหนักที่ไม่เบาเลย และคุณก็แบกมานานพอแล้ว ไม่ต้องรีบหาคำตอบในคืนนี้`,

    // 第二段：把牌当隐喻
    `ไพ่ที่คุณหยิบคือ "${card.nameTh}" — มันไม่ใช่คำทำนายว่าจะเกิดอะไร แต่เป็นภาพที่บอกว่า ในคุณยังมี ${card.keywordsTh[0]} อยู่ แม้ว่าคุณจะไม่รู้สึก เห็นมัน ในคืนแบบนี้`,

    // 第三段：温柔视角转换 + 不强求积极
    `คืนนี้ ถ้ารู้สึกว่ายังไม่ดีขึ้น ก็ไม่เป็นไรเลย ไม่จำเป็นต้องเข้มแข็งสำหรับใครในตอนนี้ ลองแค่หายใจช้า ๆ สักห้าครั้ง แล้วยอมให้ตัวเองหนักได้ แค่ในคืนนี้`,

    // 末段：送别
    `พรุ่งนี้คุณยังเหนื่อยได้ และยังมีคนแบบเรา ที่นั่งฟังคุณเงียบ ๆ อยู่ตรงนี้`,
  ];

  return paragraphs.join('\n\n');
}

/**
 * 模拟流式输出 —— 把整段泰文按字符切片，每片间隔 30-60ms 推送
 * 给前端 fetch + ReadableStream 用。
 */
export async function* streamMockReading(
  card: TarotCard,
  confessText: string,
  signal?: AbortSignal,
): AsyncGenerator<string> {
  const fullText = buildMockReading(card, confessText);

  // 首 token 前轻微延迟，模拟 LLM 思考
  await sleep(800);
  if (signal?.aborted) return;

  // 按 1-3 字符切片输出（泰语字符密集，逐字会太慢）
  let i = 0;
  while (i < fullText.length) {
    if (signal?.aborted) return;
    const chunkSize = Math.random() < 0.5 ? 1 : 2 + Math.floor(Math.random() * 2);
    const chunk = fullText.slice(i, i + chunkSize);
    i += chunkSize;
    yield chunk;
    await sleep(30 + Math.random() * 30);
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
