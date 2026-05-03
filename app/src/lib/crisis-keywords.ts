/**
 * 危机关键词词典 — V1 起步版本（PRD/07 §7.4）
 *
 * 🚨 BRD hard_gates_before_launch 强制项：
 * 上线前必须由签约的泰国本地内容顾问审核扩充至 ≥ 30 个核心词及变体。
 * 命中即阻断 LLM 生成，引导至 1323 心理热线。
 */

export const CRISIS_KEYWORDS_TH: string[] = [
  // 自杀/想死直接表达
  'อยากตาย',
  'ฆ่าตัวตาย',
  'ไม่อยากอยู่',
  'ไม่อยากมีชีวิต',
  'อยากหายไป',
  'อยากจบชีวิต',
  'จบชีวิต',
  // 自伤
  'กรีดข้อมือ',
  'ทำร้ายตัวเอง',
  'ทำลายตัวเอง',
  // 强烈无望（需结合上下文，但 V1 起步版本即命中）
  'หมดหวัง',
  'ไม่มีทางออก',
  'อยู่ไปก็ไม่มีประโยชน์',
];

/**
 * 检测文本是否命中危机关键词
 * 返回命中的关键词列表（用于日志，不展示给用户）
 */
export function detectCrisisKeywords(text: string): string[] {
  const lowerText = text.toLowerCase();
  return CRISIS_KEYWORDS_TH.filter((kw) => lowerText.includes(kw.toLowerCase()));
}
