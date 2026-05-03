# 5. AI 能力配置

> 本文件是 PRD/ 文件夹的第 5 部分。如需了解产品全貌请先读 [README.md](./README.md)。
> 上一模块：[04-pages-components.md](./04-pages-components.md) · 下一模块：[06-data-model.md](./06-data-model.md)

---

## 5.1 AI 配置架构

服务端配置（环境变量驱动，用户不可在前端修改 — 与"匿名 session"理念一致，用户无设置页）：

```typescript
// src/lib/ai.ts
interface AIConfig {
  provider: 'anthropic';
  model: string;            // 默认 'claude-sonnet-4-6'
  apiKey: string;            // 服务端环境变量
  maxTokens: number;         // 默认 1500（覆盖 200-400 字泰语开示需求）
  temperature: number;       // 默认 0.85
}

export const aiConfig: AIConfig = {
  provider: 'anthropic',
  model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6',
  apiKey: process.env.ANTHROPIC_API_KEY!,
  maxTokens: Number(process.env.AI_MAX_TOKENS) || 1500,
  temperature: Number(process.env.AI_TEMPERATURE) || 0.85,
};
```

> ⚠️ V1 不向用户暴露任何 AI 配置项。模型/温度仅运维侧调整。这与匿名 session 的设计哲学一致。

## 5.2 AI 调用点清单

| 调用点 | 触发时机 | 输入 | 期望输出 | 超时(s) | 降级策略 |
|-------|---------|------|---------|--------|---------|
| **生成长开示** | 用户在 `/confess` 提交且通过危机关键词检查 | `cardId` (string) + `confessText` (string, 50-1000 字) | 200-400 字泰语长开示，分段、有针对性、有重量、不是通用安慰话术 | 60s（流式，首 token < 5s） | 见 §5.6 |
| **内容审核（兜底）** | 倾诉提交后、调用 LLM 前 | `confessText` | `flagged: boolean` + 类别 | 5s | 失败时回退到本地泰语关键词词典；详见 [09-error-handling.md](./09-error-handling.md) §9.1 |

> V1 仅 1 个 LLM 调用点 + 1 个 Moderation 调用点。**不做**: 标题生成、关键词推荐、个性化开场白等装饰性 AI 调用。

## 5.3 Prompt 设计

### 调用点 1：生成长开示

**System Prompt**（`src/lib/prompts.ts`，泰语 + 英语注释混合）：

```text
你是一位充满智慧的泰国精神导师，融合了寺庙长者的开示传统与现代心理陪伴的温度。
你不是塔罗预测师——你不预测未来，不算"什么时候会怎样"。
你是一个深夜还醒着、愿意认真听一个疲惫扛家者的故事并给出有重量回应的人。

【输出要求】
- 语言：泰语（th-TH）；不允许出现任何英文/中文/其他语种
- 字数：250-400 个泰语字符（不含标点和空格）
- 结构：3-4 个自然段，每段 1-3 句
- 第一段：先承认/接住对方此刻的具体处境（必须引用对方原文里的至少一个具体细节），不要立刻给建议
- 第二段：把抽到的牌作为一个隐喻，与对方处境产生联系（不是"这张牌代表 XX 含义"的教科书式解读）
- 第三段：给一个温柔的视角转换或一个能落地的小动作，**不强求积极**，可以承认"现在不需要好起来"
- 末段（可选）：一句送别式的祝愿

【禁止】
- 禁止使用"加油"、"สู้ๆ"、"คุณทำได้"等空泛安慰
- 禁止预测未来（"3 个月后会..."、"明年会遇到..."这类不允许）
- 禁止指令式建议（"你应该..."、"你必须..."）
- 禁止冒犯佛教（不要直接引用经文 / 神佛之口）
- 禁止把痛苦工具化（不说"这是上天给你的考验"这类灵性逃避）
- 禁止出现品牌名、URL、广告、其他平台引导

【风格】
- 像深夜里一个温和的人在你身边坐下，慢慢说话
- 句子可以短，可以有停顿感
- 允许沉默式的表达，比如"现在你不用回答任何人，先喘一口气"
```

**User Prompt 模板**：

```text
用户抽到的塔罗牌：{{cardName}}（{{cardKeywordsTh}}）

用户此刻在写下：
"""
{{confessText}}
"""

请基于以上信息，按 system prompt 的要求生成一段泰语长开示。
```

**输入变量绑定**：

| 变量 | 来源 | 类型 |
|------|------|------|
| `cardName` | `TarotCard.nameTh` | string |
| `cardKeywordsTh` | `TarotCard.keywordsTh.join(', ')` | string |
| `confessText` | `/api/reading` 接收的请求体字段 | string |

**输出格式**：纯文本流（非 JSON），由前端 `StreamingReading` 组件按 token 拼接展示。

**Prompt Caching**：System prompt 启用 Anthropic prompt caching（`cache_control: { type: 'ephemeral' }`），降低重复成本（同一 system prompt 跨用户复用）。

### 调用点 2：内容审核（兜底）

调用 OpenAI Moderation API（`omni-moderation-latest`），仅传入 `confessText`，返回 `flagged` 与类别。**首层为本地泰语关键词词典**，Moderation API 是兜底。

> 危机干预流程详见 [07-business-logic.md](./07-business-logic.md) §7.4

## 5.4 流式响应处理

前端 hook：`src/hooks/useStreamingReading.ts`

```typescript
interface UseStreamingReadingOptions {
  sessionId: string;
  cardId: string;
  confessText: string;
  onComplete: (fullText: string) => void;
  onError: (error: Error) => void;
}

interface UseStreamingReadingResult {
  text: string;                           // 已接收的累积文本
  phase: 'idle' | 'streaming' | 'complete' | 'error';
  abort: () => void;                      // 中断流
}
```

**流式处理逻辑**：

1. 挂载时 fetch `/api/reading`（POST，body 含 `sessionId / cardId / confessText`）
2. 服务端使用 Vercel AI SDK 的 `streamText({ model, system, prompt })`，返回 `Response`（`text/event-stream`）
3. 前端用 `ReadableStream.getReader()` 逐 chunk 读取，追加到 `text`
4. 收到 `[DONE]` 标记或流结束 → `phase: 'complete'`，调用 `onComplete(fullText)`
5. 中途断网 / 超时 / 错误 → `phase: 'error'`，调用 `onError(error)`
6. 用户离开页面 → 调用 `abort()` 中断 fetch

**用户感知**：
- 首 token 期望 < 5s，否则展示 "ขอเวลาฉันสักครู่..." 微动效（具体动效由 [DESIGN.md](../DESIGN.md) 定）
- 流式过程中不允许跳页面（路由守卫提示"开示生成中，离开会丢失"）
- 流式生成期间打赏区块**不显示**——必须等 `phase === 'complete'` 才出现

## 5.5 服务端 API：`/api/reading` 实现要点

```typescript
// src/app/api/reading/route.ts
export async function POST(req: Request) {
  const { sessionId, cardId, confessText } = await req.json();

  // 1. 校验输入（zod schema）
  // 2. 双层内容审核（本地词典 + Moderation API）
  //    - 危机命中 → 返回 { type: 'crisis', hotline: '1323' }，不调 LLM
  //    - 其他不当内容（暴力/色情）→ 返回 { type: 'rejected', reason }
  // 3. 调 anthropic streamText，传入 system + user prompt
  // 4. 返回 streaming response
  // 5. 流结束后写入 readings 表（→ [06-data-model.md](./06-data-model.md) §6.1）
}
```

> 完整业务流程图见 [07-business-logic.md](./07-business-logic.md) §7.3

## 5.6 降级策略

| 失败类型 | 处理方式 | 用户感知 |
|---------|---------|---------|
| Anthropic API 5xx / 超时 | 重试 1 次（间隔 2s）；二次失败返回错误 | 显示 "现在网络有点慢，先深呼吸一下，要不要再试一次？" + 重试按钮 |
| Anthropic API 429 限流 | 不重试；返回错误 | 同上文案 |
| Anthropic API 4xx（非 429） | 不重试；记录到 Sentry | 同上文案 |
| Moderation API 失败 | 静默回退到本地词典；继续走流程 | 用户无感知 |
| 流式中断（用户网络断）| 已生成部分保留展示 + 错误提示 | "似乎信号断了一下，已经收到的话还在；要不要继续等待，或重新开始？" |
| 流式生成超过 60s 仍未结束 | 客户端中断；提示重试 | "今晚的回应来得慢了一点，再试一次？" |

详见 [09-error-handling.md](./09-error-handling.md) §9.1

## 5.7 不做（V1）

- ❌ 用户自定义 Prompt / 自定义模型
- ❌ 多模型对比 / Fallback 到 GPT-4o
- ❌ AI 生成图片（牌面图为静态资源）
- ❌ 语音输入 / 语音播报开示
- ❌ 多轮对话（V1 单次会话即结束）
