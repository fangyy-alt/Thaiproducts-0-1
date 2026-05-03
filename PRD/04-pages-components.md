# 4. 页面与组件清单

> 本文件是 PRD/ 文件夹的第 4 部分。如需了解产品全貌请先读 [README.md](./README.md)。
> 上一模块：[03-design-handoff.md](./03-design-handoff.md) · 下一模块：[05-ai-capabilities.md](./05-ai-capabilities.md)

---

## 4.1 页面路由

| 路由 | 页面名称 | 文件路径 | 功能描述 | 布局 |
|------|---------|---------|---------|------|
| `/` | 首页 (Landing) | `app/page.tsx` | 暮色氛围 + 一句泰语邀请文案 + "开始"按钮 | RootLayout |
| `/draw` | 抽牌页 | `app/draw/page.tsx` | 1 张随机塔罗牌从牌堆翻开 + 牌面短描述 | RootLayout |
| `/confess` | 倾诉输入页 | `app/confess/page.tsx` | 多行文本输入 + 字数提示 + 隐私徽章 + 提交 | RootLayout |
| `/reading/[sessionId]` | 开示展示页 | `app/reading/[sessionId]/page.tsx` | 流式生成 200-400 字泰语开示 + 文末打赏区块 | RootLayout |
| `/done` | 结束页 | `app/done/page.tsx` | 感谢 + "再来一张牌" / "完全离开" | RootLayout |

> **路由策略**：抽牌页、倾诉页是无 sessionId 的（用户随时可重抽）；开示页用 `sessionId` 区分本次会话。匿名 session 由 cookie + nanoid 管理 → 详见 [06-data-model.md](./06-data-model.md) §6.4

> **危机干预**不是独立路由，而是 `/confess` 提交时的拦截响应，UI 上替换"开示展示页"内容 → 详见 [07-business-logic.md](./07-business-logic.md) §7.4

## 4.2 组件树

```
RootLayout (app/layout.tsx)
├── DuskBackground          # 全局暮色氛围背景
├── PrivacyBadge            # 顶部"匿名 · 不会被记录身份"徽章
└── <children>
    ├── HomePage (/)
    │   └── InviteCTA       # 邀请文案 + 开始按钮
    │
    ├── DrawPage (/draw)
    │   ├── CardDeck        # 牌堆
    │   ├── CardDraw        # 抽牌动画交互
    │   └── CardFace        # 翻开后的牌面 + 短描述
    │
    ├── ConfessPage (/confess)
    │   ├── ConfessTextarea     # 多行输入 + 字数提示
    │   └── ConfessSubmit       # 提交按钮（含字数门槛禁用态）
    │
    ├── ReadingPage (/reading/[sessionId])
    │   ├── CardFaceMini        # 顶部小尺寸的牌（保持仪式感）
    │   ├── StreamingReading    # 流式开示文本展示
    │   ├── DonateBlock         # 文末打赏区块
    │   │   ├── DonateAmounts   # 3 档金额按钮
    │   │   └── PromptPayQR     # 选额后展示 QR
    │   └── ReadingActions      # "再来一张" / "已经够了" 操作
    │
    ├── CrisisGate (条件渲染于 /confess 提交后)
    │   ├── CrisisMessage       # 温柔说明文案
    │   ├── HotlineCard         # 1323 热线信息
    │   └── BackHomeButton      # 返回首页按钮
    │
    └── DonePage (/done)
        └── FarewellMessage     # 收尾文案 + "再来一张牌"按钮
```

## 4.3 核心组件定义

### DuskBackground

- **文件路径**：`components/layout/DuskBackground.tsx`
- **职责**：全局暮色渐变背景；具体颜色由 [DESIGN.md](../DESIGN.md) 定义
- **Props**：
  ```typescript
  interface DuskBackgroundProps {
    children: React.ReactNode;
  }
  ```
- **内部状态**：无
- **依赖**：仅 Tailwind 类（具体类名由 DESIGN.md 决定）
- **交互行为**：无（纯展示）

### PrivacyBadge

- **文件路径**：`components/layout/PrivacyBadge.tsx`
- **职责**：始终可见的顶部徽章，传达"匿名 · 不会被记录身份"承诺，建立安全感
- **Props**：
  ```typescript
  interface PrivacyBadgeProps {
    /** 是否在白色背景上显示（影响样式变体） */
    variant?: 'default' | 'inverted';
  }
  ```
- **内部状态**：无
- **依赖**：无
- **交互行为**：
  - 点击徽章 → 弹出说明 Toast 解释匿名机制（"我们不记录你的姓名、邮箱、IP"）

### InviteCTA

- **文件路径**：`components/home/InviteCTA.tsx`
- **职责**：首页的核心招呼，包含一句泰语邀请文案 + "เริ่มต้น"（开始）按钮
- **Props**：
  ```typescript
  interface InviteCTAProps {
    inviteText: string;        // 邀请文案（泰语 i18n key）
    ctaText: string;           // 按钮文案（泰语 i18n key）
    onStart: () => void;       // 点击开始的回调（路由跳转 /draw）
  }
  ```
- **内部状态**：无
- **依赖**：无
- **交互行为**：
  - 点击按钮 → `router.push('/draw')`

### CardDraw

- **文件路径**：`components/tarot/CardDraw.tsx`
- **职责**：抽牌交互——展示牌堆，用户点击后随机抽 1 张并翻开
- **Props**：
  ```typescript
  interface CardDrawProps {
    onCardDrawn: (card: TarotCard) => void;  // 翻牌完成回调
  }
  ```
- **内部状态**：
  - `phase: 'deck' | 'flipping' | 'revealed'` — 抽牌阶段
  - `drawnCard: TarotCard | null`
- **依赖**：`@/lib/tarot.ts`（牌组定义）；`TarotCard` 类型 → 见 [06-data-model.md](./06-data-model.md) §6.1
- **交互行为**：
  - 用户点击牌堆 → `phase: 'deck' → 'flipping'`，播放翻牌动画
  - 动画结束（约 1.2s）→ `phase: 'revealed'`，调用 `onCardDrawn(drawnCard)`

### CardFace

- **文件路径**：`components/tarot/CardFace.tsx`
- **职责**：展示一张已翻开的塔罗牌（牌面图 + 牌名 + 短描述泰语）
- **Props**：
  ```typescript
  interface CardFaceProps {
    card: TarotCard;
    size?: 'large' | 'mini';   // 抽牌页 large；开示页顶部 mini
  }
  ```
- **内部状态**：无
- **依赖**：`TarotCard` 类型
- **交互行为**：无（纯展示）

### ConfessTextarea

- **文件路径**：`components/confess/ConfessTextarea.tsx`
- **职责**：多行倾诉输入区，含实时字数提示和隐私微提示
- **Props**：
  ```typescript
  interface ConfessTextareaProps {
    value: string;
    onChange: (value: string) => void;
    minChars?: number;           // 默认 50
    maxChars?: number;           // 默认 1000
    placeholder?: string;        // 默认 i18n key
  }
  ```
- **内部状态**：无（受控组件）
- **依赖**：无
- **交互行为**：
  - 输入文字 → 实时回传 `onChange`
  - 字数 < `minChars` → 字数提示显示当前/最小
  - 字数 ≥ `maxChars` → 阻止继续输入

### ConfessSubmit

- **文件路径**：`components/confess/ConfessSubmit.tsx`
- **职责**：提交按钮，根据字数门槛切换禁用/可用态
- **Props**：
  ```typescript
  interface ConfessSubmitProps {
    text: string;
    minChars: number;
    onSubmit: (text: string) => void | Promise<void>;
    isLoading?: boolean;
  }
  ```
- **内部状态**：无
- **依赖**：无
- **交互行为**：
  - 字数 < `minChars` → 禁用，提示"再多说一点点也没关系"
  - 字数 ≥ `minChars` → 可用，点击触发 `onSubmit(text)`

### CrisisGate

- **文件路径**：`components/confess/CrisisGate.tsx`
- **职责**：当倾诉文本命中危机关键词时展示——替代 AI 生成，给到泰国心理热线 1323
- **Props**：
  ```typescript
  interface CrisisGateProps {
    matchedKeywords: string[];   // 命中的关键词（仅用于内部日志，不展示给用户）
    onBackHome: () => void;
  }
  ```
- **内部状态**：无
- **依赖**：业务逻辑见 [07-business-logic.md](./07-business-logic.md) §7.4
- **交互行为**：
  - 自动展示（无用户主动触发）
  - 点击"返回首页" → `onBackHome()`

### StreamingReading

- **文件路径**：`components/reading/StreamingReading.tsx`
- **职责**：以打字机效果流式展示 AI 生成的 200-400 字泰语开示
- **Props**：
  ```typescript
  interface StreamingReadingProps {
    sessionId: string;
    confessText: string;
    cardId: string;
    onComplete: (fullReading: string) => void;
    onError: (error: Error) => void;
  }
  ```
- **内部状态**：
  - `text: string` — 已接收的累积文本
  - `phase: 'streaming' | 'complete' | 'error'`
- **依赖**：`useStreamingReading` hook → 见 [05-ai-capabilities.md](./05-ai-capabilities.md) §5.4
- **交互行为**：
  - 挂载即触发 fetch `/api/reading`（POST stream）
  - 每收到一个 chunk → 追加到 `text`
  - 流结束 → 调用 `onComplete(fullText)`
  - 出错 → 调用 `onError(error)` → 见 [09-error-handling.md](./09-error-handling.md) §9.1

### DonateBlock

- **文件路径**：`components/reading/DonateBlock.tsx`
- **职责**：开示文末的自愿打赏区块，3 档金额 + PromptPay QR 唤起
- **Props**：
  ```typescript
  interface DonateBlockProps {
    sessionId: string;
    /** 金额档位（泰铢），默认 [20, 35, 50] */
    amounts?: number[];
    onDonationComplete?: (amount: number) => void;
  }
  ```
- **内部状态**：
  - `selectedAmount: number | null`
  - `paymentIntent: { qrCode: string; clientSecret: string } | null`
  - `phase: 'idle' | 'creating' | 'awaiting_payment' | 'success' | 'error'`
- **依赖**：`useDonation` hook；Stripe.js
- **交互行为**：
  - 点击金额按钮 → 调用 `/api/donate` → `phase: 'creating' → 'awaiting_payment'`，展示 PromptPay QR
  - Webhook 回调成功 → `phase: 'success'`，触发 `onDonationComplete`
  - 失败 → 友好提示 → 见 [09-error-handling.md](./09-error-handling.md) §9.1

### PromptPayQR

- **文件路径**：`components/reading/PromptPayQR.tsx`
- **职责**：展示 Stripe 返回的 PromptPay QR + 倒计时 + 文案"用银行 App 扫码完成"
- **Props**：
  ```typescript
  interface PromptPayQRProps {
    qrCodeSvg: string;        // Stripe 返回的 SVG 字符串
    amount: number;           // 泰铢
    expiresAt: Date;          // 过期时间
    onExpired: () => void;
  }
  ```
- **内部状态**：
  - `secondsLeft: number`
- **依赖**：无
- **交互行为**：
  - 倒计时归零 → 调用 `onExpired()`

### ReadingActions

- **文件路径**：`components/reading/ReadingActions.tsx`
- **职责**：开示页底部"再来一张" / "已经够了"双选项
- **Props**：
  ```typescript
  interface ReadingActionsProps {
    onDrawAgain: () => void;
    onDone: () => void;
  }
  ```
- **内部状态**：无
- **依赖**：无
- **交互行为**：
  - "再来一张" → `router.push('/draw')`
  - "已经够了" → `router.push('/done')`

### FarewellMessage

- **文件路径**：`components/done/FarewellMessage.tsx`
- **职责**：结束页的收尾文案 + "再来一张牌"按钮
- **Props**：
  ```typescript
  interface FarewellMessageProps {
    onRestart: () => void;
  }
  ```
- **内部状态**：无
- **依赖**：无
- **交互行为**：
  - "再来一张牌" → 清空 sessionStore → `router.push('/draw')`

---

> 视觉样式（颜色 / 字体 / 间距 / 动效曲线）由 [DESIGN.md](../DESIGN.md) 定义，本文件只定义结构、Props、行为。
