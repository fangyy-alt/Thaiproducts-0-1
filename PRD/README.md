# 「โอบ / Hug」— 项目规范

> 本文件夹是面向 AI 编程 Agent（Cursor / Claude Code / Trae 等）的项目执行规范。
> 按模块拆成多个文件，Agent 做项目时按任务阶段按需加载对应文件。

| 字段 | 内容 |
|------|------|
| 版本 | v1.0 |
| 创建日期 | 2026-05-03 |
| 最后更新 | 2026-05-03 |
| 目标 Agent | Cursor / Claude Code / Trae / Codex |
| 技术栈 | Next.js 14 + TypeScript + Tailwind + Vercel AI SDK + Claude Sonnet 4.6 + Supabase + Stripe (PromptPay) + Vercel |
| 上游来源 | [BRD.md](../BRD.md) + [MRD.md](../MRD.md)（继承）|

---

## 30 秒电梯介绍

**产品是什么**：一个让泰国扛家中年女性在凌晨三点也能打开手机、抽一张牌、收到一段有重量的泰语开示、被接住情绪、自愿打赏的私密 Web 网页。

**给谁用**：泰国中年女性（30-55 岁）为主的「扛家者」（เดอะแบก）——单亲母亲、家中长女、家庭经济支柱。

**核心价值**：所有现有占卜产品押"算得准不准"，我们押"被接住"。这是 MRD 反直觉发现的直接产品化（数据中"求被算"0 条 vs "求倾诉"593+ 条）。

**V1 核心功能**（3 个）：
1. **匿名倾诉容器**（无注册、cookie 匿名 session、字数门槛 50 字保表达深度）
2. **抽牌 + AI 长开示**（1 张大阿尔卡那塔罗 + 流式生成 200-400 字泰语开示）
3. **自愿打赏闭环**（PromptPay QR + 三档金额 20/35/50 泰铢，无强制无弹窗）

> 危机干预兜底（关键词命中 → 推送 1323 心理热线 + 阻断 LLM）作为安全护栏写在每个功能里，是上线硬门槛但不占核心配额。

---

## 📂 文件导航

| 文件 | 内容 | 什么时候读 |
|------|------|----------|
| [README.md](./README.md) | 入口 + 导航 + Agent 加载建议 | 首次启动必读 |
| [01-overview.md](./01-overview.md) | 项目概述、MVP 范围、核心用户流程 | 首次启动必读 |
| [02-tech-stack.md](./02-tech-stack.md) | 技术栈、初始化命令、目录结构、环境变量 | 首次启动必读 |
| [03-design-handoff.md](./03-design-handoff.md) | 给 design-spec 的设计输入清单（不含 token） | 跑 /design-spec 前读 |
| `../DESIGN.md` | 完整视觉规范（hex/字体/CSS 变量），由 /design-spec 产出 | 写样式时读 |
| [04-pages-components.md](./04-pages-components.md) | 路由表、组件树、Props 接口 | 搭页面骨架时读 |
| [05-ai-capabilities.md](./05-ai-capabilities.md) | AI 调用点、Prompt、流式处理 | 接入 AI 功能时读 |
| [06-data-model.md](./06-data-model.md) | 实体接口、ER 图、Supabase schema、隐私策略 | 设计数据表时读 |
| [07-business-logic.md](./07-business-logic.md) | 4 个核心功能 + 危机干预的流程图、规则、验收标准、不做清单 | 实现具体功能时读 |
| [08-state-management.md](./08-state-management.md) | Zustand Store 划分、状态流转、持久化策略 | 处理状态时读 |
| [09-error-handling.md](./09-error-handling.md) | 错误分类、Loading 规范、空状态、监控 | 兜底异常时读 |
| [10-roadmap.md](./10-roadmap.md) | V2 升级清单、长期方向、技术债 | 规划未来迭代时读 |
| [APPENDIX-data-index.md](./APPENDIX-data-index.md) | 上游数据索引（追溯用户原声） | 验证某条需求来源时读 |

---

## 🤖 Agent 加载建议

**首次启动必读**（按顺序）：
1. [README.md](./README.md)（本文件）——了解产品全貌和技术栈
2. [01-overview.md](./01-overview.md)——确认 MVP 范围和核心流程
3. [02-tech-stack.md](./02-tech-stack.md)——执行初始化命令
4. `../DESIGN.md`（如已存在）——读完整视觉规范

**按任务加载**：做到哪一步，再读哪个文件。不要一次性把所有文件都读进上下文。

**执行原则**：
- 每完成一个模块，暂停确认再继续
- 遇到设计决策不确定的地方，停下来问用户
- 所有决策以文件里写的为准，不要自己发明

---

## 🎨 设计规范是否已就绪？

- ✅ **如果项目根目录已有 `../DESIGN.md`**：本 PRD + DESIGN.md 都准备好了，可以开工
- ⚠️ **如果还没有 `../DESIGN.md`**：先在项目根目录运行 `/design-spec`——它会读取本 PRD 的 [03-design-handoff.md](./03-design-handoff.md) + [04-pages-components.md](./04-pages-components.md)，产出完整的 `../DESIGN.md`（hex 色板、字体、间距、组件样式）。**不要在没有 DESIGN.md 的情况下直接开工写代码**——视觉会失控

---

## 📎 上游数据追溯

本 PRD 基于以下上游文档建立：

- **[BRD.md](../BRD.md)**：方向判断 = ⚠️ 有条件地做（付费假设需先验证）；证据等级 🟡
- **[MRD.md](../MRD.md)**：P0/P1/P2 需求依据的索引在 [APPENDIX-data-index.md](./APPENDIX-data-index.md)；证据等级 🟡
- **数据源**：[all_comments.json](../all_comments.json)（2917 条原始 / 2548 条有效，[data-context.md](../data-context.md) 描述局限）

如需验证某条需求的来源，查阅 [APPENDIX-data-index.md](./APPENDIX-data-index.md) 或直接到 [all_comments.json](../all_comments.json) 查原文。

---

## ⚠️ 上线前的硬门槛（继承自 BRD）

> 这些是 BRD `hard_gates_before_launch` 强制项，任何一项不满足都不能上线。**不只是产品事，是商业约束。**

1. **泰国本地内容顾问已签约**（具备塔罗 + 佛教 + 扛家文化语境）—— 必须审核 system prompt + 危机关键词词典 + 所有 i18n 文案
2. **危机干预兜底已上线并测试通过**——关键词词典扩充至 ≥ 30 个，命中后绝对不调 LLM；详见 [07-business-logic.md](./07-business-logic.md) §7.4
3. **单次会话成本已测算**——LLM token + Moderation + Stripe 手续费 vs 预期 ARPU，确保模型成立

> 还有一个**前置硬门槛**写在 [10-roadmap.md](./10-roadmap.md) §10.1：**写 V1 代码前，先用手动 Telegram/Line bot 跑 1-2 周低成本付费验证（30-50 名 TikTok 倾诉用户）**。验证通过才动 V1，未通过则改商业模式或暂缓。

---

## 🎯 设计交接区（供 design-spec 读取）

> 给 [03-design-handoff.md](./03-design-handoff.md) 的 design-spec 总结摘要。design-spec 应同时读 03 + 04。

```yaml
# 产品基础
product_codename: hug
product_name_th: โอบ
brand_name_status: tentative   # 正式品牌名待 design-spec 阶段确认
target_market: thailand
target_locale: th-TH
multilingual: false             # V1 仅泰语

# 用户场景
primary_user: middle-aged Thai women acting as family-burden bearers (เดอะแบก)
primary_scenario: late-night solo emotional release on mobile phone
mood_keywords: ["moonlight", "warm", "held", "low-saturation", "like a small lamp at 3am"]

# 调性边界
must_feel: ["safety", "non-judgment", "being heard", "presence"]
must_avoid:
  - high-saturation alarm-red / bright-yellow as primary or large area
  - direct buddhist symbols (statues, sutras) — risk of cultural offense
  - cartoon illustration / human avatar — clashes with adult-burden scenario
  - flashing / strong autoplay motion — taboo in late-night context
must_avoid_payment_pressure: true   # 打赏区块视觉权重必须轻于开示正文

# 输出契约（design-spec 必出）
required_outputs:
  - full_color_palette_hex
  - thai_font_system_with_google_fonts_or_next_font_url
  - spacing_radius_grid (recommend 4px or 8px base)
  - motion_spec (default L1 static-elegant; flip-card and streaming-text are L2 allowed)
  - component_styles_for_7_categories  # see 03 §3.6
  - dark_mode_primary (light_mode optional as daytime fallback)
  - large_font_accessibility_option

# 组件密度提示（详见 03 §3.6）
component_density_summary:
  landing: ultra-low info, ultra-low action
  card_draw: ultra-low info, ultra-low action, ritual focus
  confess: low info (one big textarea), low action, safety focus on input
  reading: medium info (200-400 thai chars body), low action, body readability first
  donate: low info (3 buttons + QR), medium action, equal visual weight on amounts
  crisis_gate: low info, ultra-low action, warm not cold
  done: ultra-low info, ultra-low action, soft farewell

# 上游链路
upstream_chain:
  mrd: ../MRD.md
  brd: ../BRD.md
  evidence_level: yellow
  data_source: ../all_comments.json
  data_context: ../data-context.md
```

---

## 📋 质量审查记录

**文件结构**：
- [x] 所有必生成文件存在（README + 01~10 共 11 个 + APPENDIX）
- [x] 可选文件决策一致：05-ai-capabilities（涉及 AI ✓）、06-data-model（需持久化 ✓）、APPENDIX（继承上游 ✓）全部生成
- [x] README 导航表与实际文件同步

**各模块质量**：
| 文件 | 结果 | 备注 |
|------|------|------|
| 01-overview.md | ✅ 通过 | 一句话描述能过电梯测试；MVP 闭环 ≤ 5 步；不做清单充分 |
| 02-tech-stack.md | ✅ 通过 | 版本号具体；初始化命令可复制粘贴；目录结构含注释；环境变量必填项标注清楚 |
| 03-design-handoff.md | ✅ 通过 | 全文经 grep 验证无 hex / px / rem / CSS 变量 / Google Fonts URL；7 个小节齐全；头尾指引下游跑 /design-spec |
| 04-pages-components.md | ✅ 通过 | 每个组件有 TS Props；命名 PascalCase；交互用"用户操作 → 系统响应"格式 |
| 05-ai-capabilities.md | ✅ 通过 | 每个调用点有降级；Prompt 完整具体；流式处理含中断与超时 |
| 06-data-model.md | ✅ 通过 | 实体用 TS interface；含完整 SQL；隐私策略硬性规则齐全 |
| 07-business-logic.md | ✅ 通过 | 每个功能含 Mermaid + 验收标准 + 不做清单 + 边界 ≥ 3 |
| 08-state-management.md | ✅ 通过 | TS 定义 state + actions；2 个 store 拆分清晰；持久化策略明确 |
| 09-error-handling.md | ✅ 通过 | 每个 AI 调用点有超时 + 失败处理；Loading 方式具体；空状态有引导 |
| 10-roadmap.md | ✅ 通过 | V2 来自 V1 不做清单；标注前置依赖；技术债诚实记录 |
| APPENDIX-data-index.md | ✅ 通过 | PRD 引用的 8 条索引在原数据中真实存在 |

**跨文件一致性**：
- [x] 数据一致性：V1 三个核心功能直接对应 MRD P0+P1（匿名倾诉容器 / 有重量回应 / 占卜壳子入口）
- [x] 索引回溯：APPENDIX 列出的 8 条 comment_id 全部真实存在于 [all_comments.json](../all_comments.json)
- [x] 反模糊：通篇无"合适的颜色 / 良好的体验 / 现代框架"等模糊描述
- [x] 技术栈一致性：02 选 Next.js + TS，04 用 TypeScript Props，06 用 SQL + TS interface，全链路一致
- [x] 设计交接清单完整：03 §3.6 列出的 7 类组件全部能在 04 找到对应（landing → InviteCTA / card_draw → CardDraw+CardFace / confess → ConfessTextarea+ConfessSubmit / reading → StreamingReading / donate → DonateBlock+PromptPayQR / crisis_gate → CrisisGate / done → FarewellMessage）
- [x] 03-design-handoff.md 不越界：grep `#[a-fA-F0-9]{3,8}` / `--color-` / `Google Fonts` / `\dpx` / `\drem` 全部 0 命中

---

> 本 PRD 由 prd-writing skill 辅助生成。所有结构决策可回溯至 [BRD.md](../BRD.md) / [MRD.md](../MRD.md) / [all_comments.json](../all_comments.json)。
