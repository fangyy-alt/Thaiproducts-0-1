# 2. 技术栈与环境配置

> 本文件是 PRD/ 文件夹的第 2 部分。如需了解产品全貌请先读 [README.md](./README.md)。
> 上一模块：[01-overview.md](./01-overview.md) · 下一模块：[03-design-handoff.md](./03-design-handoff.md)

---

## 2.1 技术栈总览

| 层面 | 选型 | 版本 | 用途 |
|------|------|------|------|
| 前端框架 | Next.js (App Router) | 14.2.x | SSR + API Routes 一体；移动端响应式开箱即用 |
| 语言 | TypeScript | 5.4.x | 强类型，所有组件 Props / 数据模型 / Store 都用 TS 接口 |
| 样式方案 | Tailwind CSS | 3.4.x | DESIGN.md 阶段定的 token 直接 map 成 tailwind.config.ts |
| UI 基础组件 | shadcn/ui | latest | Button / Dialog / Toast 等，皮肤由 DESIGN.md 决定 |
| 状态管理 | Zustand | 4.5.x | 轻量；session 状态 + UI 状态分两个 store |
| AI SDK | Vercel AI SDK | 3.4.x | `streamText` 流式输出（用户看到 AI 一句一句生成"开示"，仪式感关键） |
| LLM | Anthropic Claude Sonnet 4.6 | `claude-sonnet-4-6` | 长泰语文本质量更稳；prompt caching 压成本 |
| 数据库 + 认证 | Supabase | latest | PostgreSQL + 匿名 session（无需注册）+ Row-Level Security |
| 支付 | Stripe + PromptPay | latest（API 2024-06+）| Stripe 已支持泰国 PromptPay QR 支付 |
| 内容审核 | OpenAI Moderation API（兜底）+ 本地泰语关键词词典（首层）| 双层审核：泰语关键词词典优先（速度 + 文化适配），Moderation API 做兜底 |
| 部署 | Vercel | — | 与 Next.js 零配置；Singapore region (sin1) 服务东南亚低延迟 |
| 监控 | Vercel Analytics + Sentry | latest | 时段分布数据（验证"凌晨高峰"假设）+ 错误监控 |

## 2.2 项目初始化命令

```bash
# 1. 创建 Next.js 项目
npx create-next-app@14.2.0 hug --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd hug

# 2. 安装核心依赖
npm install \
  ai@^3.4.0 \
  @ai-sdk/anthropic@^0.0.50 \
  zustand@^4.5.0 \
  @supabase/supabase-js@^2.45.0 \
  @supabase/ssr@^0.5.0 \
  stripe@^16.0.0 \
  zod@^3.23.0 \
  nanoid@^5.0.0

# 3. 安装 shadcn/ui（DESIGN.md 阶段决定具体组件，先安装 CLI）
npx shadcn@latest init
# DESIGN.md 完成后再运行：npx shadcn@latest add button dialog toast textarea card

# 4. 安装开发依赖
npm install -D \
  @types/node@^20.14.0 \
  prettier@^3.3.0 \
  prettier-plugin-tailwindcss@^0.6.0

# 5. 监控（可选，上线前配置）
npm install @vercel/analytics @sentry/nextjs
```

## 2.3 项目目录结构

```
src/
├── app/                          # Next.js App Router 页面
│   ├── layout.tsx                # 根布局（含 ThaiSans 字体加载，由 DESIGN.md 定）
│   ├── page.tsx                  # 首页（邀请文案 + 开始按钮）
│   ├── draw/page.tsx             # 抽牌页
│   ├── confess/page.tsx          # 倾诉输入页
│   ├── reading/[sessionId]/page.tsx  # 开示展示页（含打赏入口）
│   ├── done/page.tsx             # 结束页（可重新开始）
│   └── api/
│       ├── reading/route.ts      # POST 触发 AI 生成开示（streaming）
│       ├── donate/route.ts       # POST 创建 Stripe PromptPay PaymentIntent
│       └── webhook/stripe/route.ts  # Stripe webhook 接收支付结果
├── components/
│   ├── ui/                       # shadcn 基础组件
│   ├── tarot/
│   │   ├── CardDraw.tsx          # 抽牌动画
│   │   └── CardFace.tsx          # 牌面展示
│   ├── confess/
│   │   ├── ConfessTextarea.tsx   # 多行倾诉输入
│   │   └── CrisisGate.tsx        # 危机关键词命中提示
│   ├── reading/
│   │   ├── StreamingReading.tsx  # 流式开示展示
│   │   └── DonateBlock.tsx       # 打赏区块（三档金额 + QR）
│   └── layout/
│       ├── DuskBackground.tsx    # 暮色氛围背景
│       └── PrivacyBadge.tsx      # 顶部"匿名 · 不会被记录身份"徽章
├── lib/
│   ├── ai.ts                     # Vercel AI SDK + Anthropic 配置封装
│   ├── prompts.ts                # 开示 system prompt + user template
│   ├── supabase.ts               # Supabase 客户端（匿名 session）
│   ├── stripe.ts                 # Stripe 客户端 + PromptPay PaymentIntent
│   ├── crisis-keywords.ts        # 泰语极端关键词词典
│   ├── moderation.ts             # 双层内容审核
│   ├── session.ts                # 匿名 session 管理（cookie + nanoid）
│   └── utils.ts                  # 通用工具（cn / formatThaiBaht 等）
├── hooks/
│   ├── useStreamingReading.ts    # 流式开示 hook
│   └── useDonation.ts            # 打赏流程 hook
├── stores/
│   ├── sessionStore.ts           # 当前 session（牌、倾诉、开示、状态）
│   └── uiStore.ts                # UI 状态（Toast / Dialog 等）
├── types/
│   ├── session.ts                # SessionState / TarotCard / Reading 接口
│   └── donation.ts               # Donation 接口
└── styles/
    └── globals.css               # Tailwind 入口；具体 CSS 变量由 DESIGN.md 写入
```

> 每个文件/文件夹的具体职责在对应模块详述：
> - 页面 → [04-pages-components.md](./04-pages-components.md)
> - AI 调用 → [05-ai-capabilities.md](./05-ai-capabilities.md)
> - 数据 → [06-data-model.md](./06-data-model.md)
> - 业务逻辑 → [07-business-logic.md](./07-business-logic.md)

## 2.4 环境变量

```env
# .env.local 模板

# ===== AI 配置（服务端）=====
ANTHROPIC_API_KEY=                # 必填：Anthropic API key
ANTHROPIC_MODEL=claude-sonnet-4-6 # 默认；可在设置层覆盖
AI_MAX_TOKENS=1500                # 默认；200-400 字泰语开示足够
AI_TEMPERATURE=0.85               # 默认；偏温暖有人味（不死板）

# ===== Supabase =====
NEXT_PUBLIC_SUPABASE_URL=         # 必填：Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=    # 必填：Supabase anon key（带 RLS 安全）
SUPABASE_SERVICE_ROLE_KEY=        # 必填：服务端写入用（Stripe webhook 等）

# ===== Stripe（PromptPay 泰国）=====
STRIPE_SECRET_KEY=                # 必填：Stripe secret key
STRIPE_WEBHOOK_SECRET=            # 必填：Stripe webhook 签名密钥
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=  # 必填：前端用 publishable key

# ===== OpenAI Moderation（双层审核兜底）=====
OPENAI_API_KEY=                   # 必填：仅用于 Moderation API

# ===== 应用配置 =====
NEXT_PUBLIC_APP_NAME=Hug
NEXT_PUBLIC_APP_LOCALE=th-TH      # 默认 th-TH
CRISIS_HOTLINE_TH=1323            # 泰国心理热线
```

> **必填**项不配置应用启动直接 fail-fast；非必填的有默认值。所有 `NEXT_PUBLIC_*` 会暴露到浏览器，其他仅服务端可见。
