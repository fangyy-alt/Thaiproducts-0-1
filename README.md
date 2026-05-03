# โอบ / Hug — 泰国情绪陪伴产品（0→1 完整闭环）

借占卜壳子做的泰国扛家中年女性私密 AI 情绪陪伴 Web 产品——不卖准，卖被接住。

> **一句话定位**：在凌晨三点能接住一个扛家妈妈情绪的网页。抽一张牌、写下此刻在想什么、收到一段有重量的泰语开示、看完觉得被接住了可以打赏 20-50 泰铢。

---

## 这个 repo 是什么

一份从**用户原声数据 → 市场需求 → 商业可行性判断 → 项目规范 → 视觉规范 → 可跑通 MVP** 的完整 0→1 决策链。每一步都有上游证据回溯。

```
all_comments.json (TikTok 2917 条泰语评论)
   ↓ 数据聚类
MRD.md  ── 市场需求文档（证据 🟡）
   ↓
BRD.md  ── 商业可行性判断（⚠️ 有条件地做）
   ↓
PRD/    ── 项目规范（10 个模块 + APPENDIX）
   ↓
DESIGN.md ── 视觉规范（hex 色板 / Sarabun 泰文字体 / 动效）
   ↓
app/    ── Next.js 14 MVP 实现（V1 三个核心功能跑通）
```

## 文档地图

| 文件 | 说明 |
|------|------|
| [data-context.md](./data-context.md) | 原始数据来源、字段、采集局限（实际数据 `all_comments.json` 因体积未入仓）|
| [MRD.md](./MRD.md) | 市场需求文档：用户聚类、痛点优先级、25 条原声索引 |
| [BRD.md](./BRD.md) | 商业可行性：⚠️ 有条件地做（写代码前先做 1-2 周手动 bot 验证付费假设）|
| [PRD/README.md](./PRD/README.md) | 项目规范入口与文件导航 |
| [PRD/01-overview.md](./PRD/01-overview.md) | V1 范围 + 核心流程 |
| [PRD/02-tech-stack.md](./PRD/02-tech-stack.md) | 技术栈与初始化 |
| [PRD/03-design-handoff.md](./PRD/03-design-handoff.md) | 给 design-spec 的输入清单 |
| [PRD/04-pages-components.md](./PRD/04-pages-components.md) | 路由表 + 组件 Props |
| [PRD/05-ai-capabilities.md](./PRD/05-ai-capabilities.md) | LLM 调用点 + Prompt |
| [PRD/06-data-model.md](./PRD/06-data-model.md) | 实体 + Supabase schema + 隐私策略 |
| [PRD/07-business-logic.md](./PRD/07-business-logic.md) | 4 个核心功能 + 危机干预 |
| [PRD/08-state-management.md](./PRD/08-state-management.md) | Zustand store |
| [PRD/09-error-handling.md](./PRD/09-error-handling.md) | 错误兜底 |
| [PRD/10-roadmap.md](./PRD/10-roadmap.md) | V2 升级清单 + 技术债 |
| [PRD/APPENDIX-data-index.md](./PRD/APPENDIX-data-index.md) | 数据索引（追溯用户原声）|
| [DESIGN.md](./DESIGN.md) | 视觉规范：完整暗色 hex 色板 + Sarabun 字体 + 翻牌/打字动效 + 给 Claude Code 的实现指令 |

## 跑起来

```bash
cd app
npm install
npm run dev
# → http://localhost:3000
```

V1 流程：`/` → `/draw` → `/confess` → `/reading/[sessionId]` → `/done`

## 当前状态：MVP 跑通（全 mock）

- ✅ 完整 V1 闭环可点：抽牌 → 倾诉 → 危机词典筛查 → 流式开示 → 三档自愿打赏
- ✅ 视觉严格按 [DESIGN.md](./DESIGN.md) 落地（暮色温柔调性、Sarabun 泰语、翻牌/打字 L2 动效）
- ✅ 严格只做 [PRD/01-overview.md](./PRD/01-overview.md) §1.5 的 V1 三个核心功能；「不做清单」未碰

**所有外部依赖均为 mock**：
- LLM 调用 → `src/lib/mock-reading.ts` 模板拼接
- Supabase → `src/lib/mock-store.ts` 内存 Map
- Stripe PromptPay → 4 秒后自动 succeeded 的假 PaymentIntent
- OpenAI Moderation → 跳过，仅用本地泰语关键词词典

## 上线前必做（继承自 BRD `hard_gates_before_launch`）

> 这些不是工程问题，是商业约束。任何一项不满足都不能上线。

1. **先用手动 Telegram/Line bot 跑 1-2 周验证付费假设**（30-50 名 TikTok 倾诉用户）。BRD §3 关键假设 1 置信度 🔴；通过才动真上线
2. 签约**泰国本地内容顾问**（具备塔罗 + 佛教 + 扛家文化语境），审核：
   - `src/lib/i18n-th.ts` 全部泰语文案
   - `src/lib/crisis-keywords.ts`（V1 起步 13 词，需扩充至 ≥ 30 个核心词及变体）
   - `src/lib/tarot-deck.ts` 22 张牌的泰语名 + keywords
   - `src/lib/mock-reading.ts` 替换为真 LLM 后的 system prompt（[PRD/05 §5.3](./PRD/05-ai-capabilities.md)）
3. 测算单次会话成本（LLM token + 内容审核 + Stripe 手续费）vs 预期 ARPU，确保模型成立

## 替换 mock 为真依赖

替换路径详见 [DESIGN.md](./DESIGN.md) 末尾「给 Claude Code 的实现指令」+ [PRD/02-tech-stack.md](./PRD/02-tech-stack.md) §2.4 环境变量列表：

| Mock | 替换为 |
|------|-------|
| `src/lib/mock-reading.ts` | `@ai-sdk/anthropic` + Claude Sonnet 4.6（PRD/05 §5.3 的 system prompt 直接拷贝）|
| `src/lib/mock-store.ts` | `@supabase/supabase-js`（PRD/06 §6.3 SQL 已写好）|
| `src/app/api/donate/route.ts` mock 段 | Stripe PaymentIntent + PromptPay + webhook（PRD/07 §7.5）|
| `src/lib/crisis-keywords.ts` 单层 | 加 OpenAI Moderation 兜底层（PRD/05 §5.2）|

## 证据等级链

🟡（黄）— 上游 MRD/BRD 均为 🟡。原因：
- 数据仅来自 TikTok 单平台单语言（泰语），无跨平台校验
- 付费意愿在原始数据中几乎不可见（仅 9/2548 条留账号求私聊），所有付费假设均推断
- AI 内容质量未真测，本 MVP 用 mock 模板验证视觉与闭环

下游 BRD/PRD/DESIGN 都继承了这个 🟡 等级，不会自欺。

---

**链路上有任何节点要改**：改源头那份文档（如 MRD），下游的 BRD/PRD/DESIGN/代码按交接区字段重生。每一份都末尾留了「交接区」给下一步消费。
