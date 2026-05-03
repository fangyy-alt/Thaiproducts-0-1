# 9. 错误处理与兜底策略

> 本文件是 PRD/ 文件夹的第 9 部分。如需了解产品全貌请先读 [README.md](./README.md)。
> 上一模块：[08-state-management.md](./08-state-management.md) · 下一模块：[10-roadmap.md](./10-roadmap.md)

---

## 9.1 错误分类

> 错误文案的核心原则：**不冰冷、不像系统报错**——目标用户场景是凌晨独自崩溃，任何冷硬错误提示都是二次伤害。

| 错误类型 | 触发条件 | 处理方式 | 用户提示（泰语 i18n key） | 恢复策略 |
|---------|---------|---------|--------------------------|---------|
| **AI 流式首 token 超时** | 5s 内未收到首 token | 继续等待至 60s 总超时；超过提示 | `error.first_token_slow`：「今晚的回应来得慢了一点，再等等好吗？」 | 提供"再试一次"按钮 |
| **AI 总超时** | 60s 仍未结束 | 中断 fetch | `error.ai_timeout`：「网络似乎让我们之间慢了下来，再试一次？」 | 重试按钮（最多 2 次） |
| **AI 服务错误** | 4xx/5xx (非 429) | 不重试，记 Sentry | `error.ai_unavailable`：「现在我有点没办法好好回应你，过几分钟再试好吗？」 | 重试按钮 + 留言反馈链接（V2） |
| **AI 限流 429** | API 限流 | 不重试 | 同 `error.ai_unavailable` | 同上 |
| **API Key 无效** | 401 | 拦截 + 服务端日志 | 不展示给用户 | 运维监控告警 |
| **Moderation API 失败** | 调用失败/超时 | 静默回退本地词典 | 用户无感知 | 自动 |
| **网络断开（流式中）** | 已建立流后 fetch 失败 | 保留已收到的部分 | `error.stream_interrupted`：「似乎信号断了一下。已经收到的话还在；要不要再继续等一会儿？」 | 重试按钮 |
| **网络断开（提交时）** | POST `/api/reading` 失败 | 不进入流式 | `error.network`：「网络好像断了，再试一次？」 | 重试按钮 |
| **倾诉文本超长** | > 1000 字符 | 前端阻止输入 | 字数提示变红色 | 用户自己删 |
| **危机关键词命中** | 本地词典命中 | 不调 LLM，走 CrisisGate | `crisis.gentle_intro`：「我听到你在说很重的事，先和真人聊聊好吗？」 + 1323 热线 | 跳到首页 |
| **Stripe 支付失败** | webhook 收到 failed 状态 | 更新 status='failed' | `error.payment_failed`：「这次没收到银行的回应，要不要再试一次？」 | 重新选额按钮 |
| **PromptPay QR 过期** | 5 分钟未支付 | 标记 expired | `error.qr_expired`：「这张 QR 码过期了，再生成一张？」 | "重新选择金额"按钮 |
| **牌面图加载失败** | `<img>` onError | 渲染文字卡片 | 用户无感知（fallback 美观）| 自动 |
| **Session 过期 (7 天)** | 用户访问已过期 sessionId | 重定向 `/draw` | `error.session_expired`：「这一夜已经过去了，要不要再开始一次？」 | 自动跳转 |

## 9.2 全局错误边界

```typescript
// src/app/error.tsx —— Next.js App Router 全局 ErrorBoundary
'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <DuskBackground>
      <main role="alert">
        <h1>{/* i18n: error.global.title — 「我这边出了点小状况」 */}</h1>
        <p>{/* i18n: error.global.message — 「不是你的问题，是我这边乱了一下。」 */}</p>
        <button onClick={reset}>{/* i18n: action.try_again — 「再试一次」 */}</button>
        <a href="/">{/* i18n: action.go_home — 「回到首页」 */}</a>
      </main>
    </DuskBackground>
  );
}
```

> **降级 UI 必须保留 DuskBackground 的暮色调性**——错误页也是产品体验的一部分。

## 9.3 Loading 状态规范

| 场景 | Loading 方式 | 持续时间预期 | 超时处理 |
|------|-----------|------------|---------|
| 首页 → 抽牌页路由 | 无 loading（瞬时） | < 200ms | — |
| 抽牌动画 | CSS 翻牌动画（约 1.2s）| 1.2s | 不会超时 |
| 倾诉提交 → 跳转开示页 | 路由跳转 + 进入页 skeleton | < 500ms | 超时回到倾诉页提示重试 |
| 开示流式生成（首 token 前） | 暮色呼吸式 placeholder（具体动效由 [DESIGN.md](../DESIGN.md) 定，定义为 L2） | < 5s | 5s 后展示 `error.first_token_slow` 文案但**继续等待** |
| 开示流式生成（已开始） | 逐字打字效果 | 5-30s | 60s 总超时 → 中断 |
| 打赏 PaymentIntent 创建 | 按钮 spinner + 禁用 | < 2s | 5s 超时提示重试 |
| 等待 webhook 确认 | "已收到，等银行确认中..." + 倒计时 | 30-300s | 5 分钟超时 → QR 过期 |

> **绝对禁止全屏白色 spinner**——任何 loading 都必须保留暮色调性，不能让用户感觉"被丢回明亮的现实"。

## 9.4 空状态设计

| 页面/组件 | 空状态文案（泰语 i18n key） | 引导动作 |
|----------|------------------------|---------|
| 首页 | 不适用（首页本来就是邀请文案）| — |
| 抽牌页（无牌） | `empty.no_card`：默认看到牌堆，不存在"无牌"状态 | — |
| 倾诉页（无字数）| `empty.confess_hint`：「写下任何此刻在你心里的话，没有人会评判」 | 输入框获得焦点 |
| 开示页（流式未开始） | 暮色呼吸 placeholder | 自动开始流式 |
| 开示页（流式失败）| → §9.1 错误文案 | 重试按钮 |
| 牌面图加载失败 | 文字卡片：牌名 + 短描述泰语 | 无操作（自动 fallback） |
| 打赏成功 | `donate.thanks`：「ขอบคุณที่ฝากความหมายไว้ในวันนี้」(谢谢你今天放下一份心意) | "再来一张" / "完全离开" |
| 打赏未发生（用户直接离开）| 不显示空状态——这是合法路径，不打扰 | — |
| 危机干预页 | → §7.4 + 1323 热线展示 | 拨打热线 / 返回首页 |

## 9.5 服务端日志与监控

- **Sentry**：所有 `/api/*` 路由错误自动捕获；过滤掉 `confess_text` 字段（PII）
- **Vercel Analytics**：路由访问 + 时段分布（验证 BRD 假设"凌晨高峰"）
- **业务指标**（手动埋点到 Supabase）：
  - 进入 `/draw` → 抽牌完成转化率
  - 抽牌 → 倾诉提交转化率
  - 倾诉 → 开示完整生成转化率
  - 开示完成 → 打赏点击率
  - 打赏点击 → 支付成功率
  - 危机干预命中率（监控关键词词典效果）

> 所有埋点**禁止包含**：confess_text 原文、reading_text 原文、用户 IP、UA、设备指纹

## 9.6 不做（V1）

- ❌ 用户主动反馈通道（V2 上线后再加）
- ❌ 重试退避（exponential backoff）—— V1 简单 1 次重试足够
- ❌ 离线模式 / Service Worker 缓存
- ❌ 错误日志展示给用户（如错误码 / trace id）
- ❌ A/B 测试错误文案（V2 验证留存后再做）
