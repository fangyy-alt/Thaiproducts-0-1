# โอบ / Hug — 设计规范 (DESIGN.md)

> 最后更新：2026-05-03
> 上游来源：[PRD/03-design-handoff.md](./PRD/03-design-handoff.md) + [PRD/04-pages-components.md](./PRD/04-pages-components.md)
> 交互档位：**L1 静态优雅**（仅翻牌 + 流式打字 2 处允许 L2 强动效，由 PRD §3.7 明确豁免）
> 证据等级：🟡 有限——继承自 PRD/BRD/MRD 🟡 链路；色板与字阶基于"暮色温柔（Calm 风）"方向推导，未做用户偏好测试

---

## 1. 设计基调

- **氛围关键词**：月光、温柔、被拥抱、低饱和、像深夜的一盏小灯
- **一句话定调**：像深夜独自走进一个安全、灯光柔和的小房间——没有人评判你，可以放下肩膀
- **目标用户视角**：泰国扛家中年女性（30-55 岁），凌晨/深夜独处场景，手机竖屏单手操作
- **目标地区/语言**：泰国 / 泰语（th-TH）单语，V1 不做多语言切换
- **必须传递的核心感受**：安全感、不被评判、被接住、有人在听
- **必须避开的雷**：刺激色 / 佛像经文 / 卡通 Avatar / 闪烁强动效 / 任何"未付费看不全"的暗示

---

## 2. 色彩系统

### 2.1 暗色主形态（默认，90% 使用场景）

```css
:root,
[data-theme="dark"] {
  /* —— 背景层（自下而上递进）—— */
  --color-bg:              #0F1424;  /* rgb: 15, 20, 36   暮色深底，不纯黑（避免冷硬）*/
  --color-bg-elevated:     #161C30;  /* rgb: 22, 28, 48   卡片/面板 */
  --color-surface:         #1E2540;  /* rgb: 30, 37, 64   输入框/突出面板 */
  --color-surface-hover:   #252D4D;  /* rgb: 37, 45, 77   交互悬浮 */

  /* —— 文字层（依阅读重要度递减）—— */
  --color-text:            #E8E4F0;  /* rgb: 232, 228, 240  正文/开示主文 */
  --color-text-strong:     #F4F1FA;  /* rgb: 244, 241, 250  H1/牌名/强调 */
  --color-text-muted:      #A39FB8;  /* rgb: 163, 159, 184  次要/字数提示/隐私徽章 */
  --color-text-subtle:     #6E6A85;  /* rgb: 110, 106, 133  placeholder/禁用文字 */

  /* —— 边框与分隔 —— */
  --color-border:          #2A3155;  /* rgb: 42, 49, 85    卡片边框 */
  --color-border-soft:     #1E2440;  /* rgb: 30, 36, 64    分隔线极弱 */
  --color-border-focus:    #C8A875;  /* rgb: 200, 168, 117  键盘聚焦光晕（暖月光金）*/

  /* —— 强调色：暖月光金（用于按钮、CTA、牌面金线、光晕）—— */
  --color-accent:          #C8A875;  /* rgb: 200, 168, 117  主强调，暖金月光 */
  --color-accent-hover:    #D4B583;  /* rgb: 212, 181, 131  hover 略亮 */
  --color-accent-pressed:  #B89866;  /* rgb: 184, 152, 102  按下略暗 */
  --color-accent-soft:     rgba(200, 168, 117, 0.12);  /* 背景轻染 */

  /* —— 次强调：暮色紫（牌堆暗影、装饰光晕）—— */
  --color-secondary:       #8E84B5;  /* rgb: 142, 132, 181  紫色月光晕 */
  --color-secondary-soft:  rgba(142, 132, 181, 0.10);

  /* —— 语义色（克制，不刺激）—— */
  --color-success:         #7FB48E;  /* rgb: 127, 180, 142  柔和绿，仅打赏成功状态 */
  --color-warning:         #D4A574;  /* rgb: 212, 165, 116  暖橙，字数即将上限 */
  --color-danger:          #C98A8A;  /* rgb: 201, 138, 138  柔和红，错误（不刺激）*/
  --color-info:            #8FAAB8;  /* rgb: 143, 170, 184  柔蓝，提示 */

  /* —— 危机干预专用（不刺激、有温度）—— */
  --color-crisis-bg:       #2A2640;  /* rgb: 42, 38, 64    比 surface 略偏紫 */
  --color-crisis-accent:   #B5A5D4;  /* rgb: 181, 165, 212  柔紫，热线号码颜色 */

  /* —— 阴影（柔和大半径，模拟月光散射）—— */
  --shadow-sm:  0 1px 2px rgba(0, 0, 0, 0.20);
  --shadow-md:  0 4px 16px rgba(0, 0, 0, 0.28);
  --shadow-lg:  0 12px 40px rgba(0, 0, 0, 0.36);
  --shadow-glow: 0 0 32px rgba(200, 168, 117, 0.18);  /* 牌面/按钮焦点光晕 */
}
```

### 2.2 亮色形态（日间备选，可选启用）

```css
[data-theme="light"] {
  --color-bg:              #F5F1E8;  /* rgb: 245, 241, 232  米杏暖底（不纯白，避免凌厉）*/
  --color-bg-elevated:     #FBF8F1;  /* rgb: 251, 248, 241 */
  --color-surface:         #FFFFFF;  /* rgb: 255, 255, 255 */
  --color-surface-hover:   #F0EBDF;  /* rgb: 240, 235, 223 */

  --color-text:            #2A2640;  /* rgb: 42, 38, 64    暮色紫深做正文 */
  --color-text-strong:     #1A1730;  /* rgb: 26, 23, 48 */
  --color-text-muted:      #6E6A85;  /* rgb: 110, 106, 133 */
  --color-text-subtle:     #A39FB8;  /* rgb: 163, 159, 184 */

  --color-border:          #E5DFD0;  /* rgb: 229, 223, 208 */
  --color-border-soft:     #F0EBDF;  /* rgb: 240, 235, 223 */
  --color-border-focus:    #A8895B;  /* rgb: 168, 137, 91  暖金加深 */

  --color-accent:          #A8895B;  /* rgb: 168, 137, 91 */
  --color-accent-hover:    #93764C;  /* rgb: 147, 118, 76 */
  --color-accent-pressed:  #7E633E;  /* rgb: 126, 99, 62 */
  --color-accent-soft:     rgba(168, 137, 91, 0.10);

  --color-secondary:       #6E5F8E;  /* rgb: 110, 95, 142 */
  --color-secondary-soft:  rgba(110, 95, 142, 0.08);

  --color-success:         #5C8E6B;
  --color-warning:         #B0824D;
  --color-danger:          #A05C5C;
  --color-info:            #5C7E8E;

  --color-crisis-bg:       #EDE8DC;
  --color-crisis-accent:   #6E5F8E;

  --shadow-sm:  0 1px 2px rgba(42, 38, 64, 0.06);
  --shadow-md:  0 4px 16px rgba(42, 38, 64, 0.10);
  --shadow-lg:  0 12px 40px rgba(42, 38, 64, 0.14);
  --shadow-glow: 0 0 32px rgba(168, 137, 91, 0.14);
}
```

### 2.3 主题切换策略

- **默认主题**：dark（呼应 90% 凌晨/深夜场景）
- **切换方式**：`<html data-theme="dark|light">`，配合 `prefers-color-scheme` media query 自动跟随系统但默认偏 dark
- **无系统偏好/未设置**：强制 dark

```css
@media (prefers-color-scheme: light) {
  :root:not([data-theme="dark"]) {
    /* 自动应用 light token，仅在用户系统偏好亮且未显式选 dark 时 */
  }
}
```

### 2.4 对比度自检（WCAG AA）

| 组合（dark 模式） | 比值 | 是否达标 (≥4.5 正文 / ≥3 大字) |
|------|------|-------|
| `--color-text` (#E8E4F0) on `--color-bg` (#0F1424) | ≈ 14.2 | ✅ AAA |
| `--color-text-muted` (#A39FB8) on `--color-bg` (#0F1424) | ≈ 7.1 | ✅ AAA |
| `--color-text-subtle` (#6E6A85) on `--color-bg` (#0F1424) | ≈ 3.6 | ⚠️ 仅大字号或非关键文字使用 |
| `--color-accent` (#C8A875) on `--color-bg` (#0F1424) | ≈ 7.6 | ✅ AAA（按钮文字） |
| `--color-text` (#E8E4F0) on `--color-surface` (#1E2540) | ≈ 11.4 | ✅ AAA |

> 实施时用浏览器 DevTools 实测；如某组合在真实环境降至 < AA，优先调 muted 端而非 bg 端（保暮色氛围）。

---

## 3. 字体系统

### 3.1 字族选择

| 用途 | 字族 | 来源 | 理由 |
|------|------|------|------|
| 泰语正文与标题 | **Sarabun** | Google Fonts | 泰语圈最广泛的现代正文字族；字怀宽阔、节奏舒缓，适合 200-400 字长开示 |
| 拉丁字符（含数字、英文）| **Inter** | Google Fonts | 现代、克制、与 Sarabun 中性气质匹配；x-height 接近 |
| 装饰性数字（金额按钮、倒计时） | Inter Tabular Nums | 等宽数字 | `font-feature-settings: "tnum"` |

### 3.2 引入方式（Next.js 14 App Router · 推荐 next/font）

```tsx
// src/app/layout.tsx
import { Sarabun, Inter } from 'next/font/google';

const sarabun = Sarabun({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sarabun',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={`${sarabun.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

### 3.3 CSS 变量与栈

```css
:root {
  /* 主字族：Sarabun 优先（覆盖泰语+拉丁），Inter 仅作为数字回退 */
  --font-body:    var(--font-sarabun), var(--font-inter), -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  --font-display: var(--font-sarabun), var(--font-inter), -apple-system, sans-serif;
  --font-mono:    'IBM Plex Mono', ui-monospace, 'SF Mono', monospace;
}
```

### 3.4 字阶（基于 1.25 模块化比例，4 / 8 px 栅格对齐）

> 泰语字符比拉丁略高、笔画密度更大，**所有字号在泰语下行高 ≥ 1.7**、字距 +0.01em ~ +0.02em。

| 用途 | 字号（rem / px） | 行高 | 字重 | 字距 | 备注 |
|------|----------------|------|------|------|------|
| H1（首页邀请文案、收尾） | 2.0rem / 32px | 1.4 | 600 | +0.005em | 一句话使用，移动端为主 |
| H2（牌名、危机标题） | 1.5rem / 24px | 1.5 | 600 | +0.01em | — |
| H3（区块标题、打赏区头）| 1.25rem / 20px | 1.6 | 500 | +0.01em | — |
| **Body-Reading（开示正文）** | **1.0625rem / 17px** | **1.85** | **400** | **+0.02em** | 200-400 字长泰语阅读核心；行高加大 |
| Body（普通正文、表单 label）| 1.0rem / 16px | 1.7 | 400 | +0.015em | — |
| Small（字数提示、徽章）| 0.875rem / 14px | 1.6 | 400 | +0.015em | — |
| Caption（极弱辅助文字）| 0.75rem / 12px | 1.5 | 400 | +0.02em | 仅在隐私徽章内 |
| Numeric（金额、倒计时）| 1.125rem / 18px | 1.4 | 500 | 0 | `font-feature-settings: "tnum"` |

```css
:root {
  --font-size-h1:   2rem;
  --font-size-h2:   1.5rem;
  --font-size-h3:   1.25rem;
  --font-size-body-reading: 1.0625rem;
  --font-size-body: 1rem;
  --font-size-small: 0.875rem;
  --font-size-caption: 0.75rem;
  --font-size-numeric: 1.125rem;

  --line-height-tight: 1.4;
  --line-height-snug:  1.5;
  --line-height-normal: 1.7;
  --line-height-loose: 1.85;  /* Body-Reading 专用 */
}
```

### 3.5 大字号可访问性方案（30-55 岁长文阅读必备）

页面顶部隐私徽章旁提供"A / A+"切换（也由 1× 文档级 `font-size` 控制，rem 自动放大）：

```css
[data-font-scale="1"]   { font-size: 100%; }    /* 默认 */
[data-font-scale="1.15"] { font-size: 115%; }   /* A+ */
[data-font-scale="1.3"]  { font-size: 130%; }   /* A++ */
```

切换偏好用 `localStorage` 持久化（`hug_font_scale`）。这是产品对中年用户的承诺，不是装饰功能。

---

## 4. 布局原则

### 4.1 间距栅格（4 px 基准）

```css
:root {
  --space-0:   0;
  --space-1:   4px;   /* 紧凑间隙 */
  --space-2:   8px;   /* 行内 icon-text 间距 */
  --space-3:   12px;
  --space-4:   16px;  /* 默认元素间距 */
  --space-5:   20px;
  --space-6:   24px;  /* 卡片内 padding */
  --space-8:   32px;  /* 区块间距 */
  --space-10:  40px;
  --space-12:  48px;  /* 大区块间距 */
  --space-16:  64px;  /* 页面竖向呼吸 */
  --space-20:  80px;  /* 首页留白 */
}
```

### 4.2 圆角

```css
:root {
  --radius-xs:   4px;   /* 字数提示等微元素 */
  --radius-sm:   8px;   /* 按钮、徽章 */
  --radius-md:   12px;  /* 输入框、小卡片 */
  --radius-lg:   20px;  /* 大卡片、面板 */
  --radius-xl:   28px;  /* 牌面、抽牌容器 */
  --radius-full: 9999px;
}
```

### 4.3 断点与容器

```css
:root {
  --breakpoint-sm: 640px;
  --breakpoint-md: 1024px;
  --breakpoint-lg: 1280px;

  --container-max:    560px;  /* 单栏阅读最大宽度，长开示舒适度第一 */
  --container-padding-mobile:  16px;
  --container-padding-tablet:  24px;
  --container-padding-desktop: 32px;
}
```

> **MVP 移动端优先**：所有页面单栏，最大宽度 560px 居中（开示页正文 17px × 1.85 行高时每行 ~30 字符，泰语阅读最舒适）。Tablet/Desktop 仅扩展两侧 padding，不做多栏布局。

### 4.4 z-index 层级

```css
:root {
  --z-base:     0;
  --z-elevated: 10;
  --z-sticky:   100;   /* 顶部隐私徽章 */
  --z-overlay:  500;   /* 倾诉离开守卫 */
  --z-modal:    1000;  /* 隐私说明 Dialog */
  --z-toast:    2000;
}
```

---

## 5. 组件样式（覆盖 PRD §4.3 全部组件）

> 所有组件零硬编码颜色，全部走 CSS 变量。每个组件包含 default / hover / focus / disabled 全部状态。

### 5.1 DuskBackground（暮色背景）

全局背景，不是 hex 实色，而是**柔和渐变 + 微噪点**模拟夜空：

```css
.dusk-background {
  position: fixed;
  inset: 0;
  z-index: var(--z-base);
  background:
    radial-gradient(ellipse 80% 60% at 50% 20%,
      var(--color-secondary-soft) 0%,
      transparent 60%),
    radial-gradient(ellipse 60% 40% at 50% 90%,
      var(--color-accent-soft) 0%,
      transparent 70%),
    var(--color-bg);
  /* 噪点叠层让纯色不显得"塑料感" */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E");
    opacity: 0.03;
    pointer-events: none;
    mix-blend-mode: overlay;
  }
}
```

### 5.2 PrivacyBadge（隐私徽章）

顶部 sticky，传达"匿名 · 不会被记录身份"——可见但不抢戏。

```css
.privacy-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  background: var(--color-surface);
  border: 1px solid var(--color-border-soft);
  border-radius: var(--radius-full);
  color: var(--color-text-muted);
  font-size: var(--font-size-small);
  font-weight: 500;
  cursor: pointer;
  transition: background 200ms ease-out, color 200ms ease-out;
}
.privacy-badge:hover  { background: var(--color-surface-hover); color: var(--color-text); }
.privacy-badge:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px;
}
```

### 5.3 Button（通用按钮：Primary / Ghost / Tertiary）

#### 5.3.1 Primary（用于"开始""提交倾诉""再来一张"）

```css
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  min-height: 48px;        /* 触控目标 ≥ 44px */
  padding: 0 var(--space-6);
  background: var(--color-accent);
  color: #1A1730;          /* 仅按钮内文字反相到深紫，AA ≥ 7 */
  font-family: var(--font-body);
  font-size: var(--font-size-body);
  font-weight: 600;
  letter-spacing: 0.01em;
  border: none;
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: background 200ms ease-out, box-shadow 200ms ease-out, transform 200ms ease-out;
}
.btn-primary:hover    { background: var(--color-accent-hover); box-shadow: var(--shadow-glow); }
.btn-primary:active   { background: var(--color-accent-pressed); transform: translateY(1px); }
.btn-primary:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 3px;
}
.btn-primary:disabled {
  background: var(--color-surface);
  color: var(--color-text-subtle);
  cursor: not-allowed;
  box-shadow: none;
}
```

#### 5.3.2 Ghost（用于"已经够了""返回首页"——同等权重的次操作）

```css
.btn-ghost {
  /* 同 .btn-primary 的尺寸/字体 */
  background: transparent;
  color: var(--color-text);
  border: 1px solid var(--color-border);
}
.btn-ghost:hover  { background: var(--color-surface-hover); border-color: var(--color-accent); }
.btn-ghost:focus-visible { outline: 2px solid var(--color-border-focus); outline-offset: 3px; }
.btn-ghost:disabled { color: var(--color-text-subtle); border-color: var(--color-border-soft); }
```

#### 5.3.3 Tertiary（极轻链接式按钮）

```css
.btn-tertiary {
  background: transparent;
  color: var(--color-text-muted);
  font-size: var(--font-size-small);
  padding: var(--space-2) var(--space-3);
  border: none;
  border-radius: var(--radius-sm);
}
.btn-tertiary:hover { color: var(--color-text); }
```

### 5.4 InviteCTA（首页邀请）

```css
.invite-cta {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-12);    /* 邀请文案与按钮之间留充足呼吸 */
  padding: var(--space-20) var(--container-padding-mobile);
  text-align: center;
}
.invite-cta__text {
  font-size: var(--font-size-h1);
  line-height: 1.4;
  font-weight: 500;        /* 不用 700，太重不温柔 */
  color: var(--color-text-strong);
  max-width: 18ch;          /* 让一句话自然换行成 2-3 行的呼吸节奏 */
}
```

### 5.5 CardDeck / CardDraw / CardFace（塔罗牌相关）

#### 5.5.1 CardFace（牌面）

```css
.card-face {
  position: relative;
  aspect-ratio: 2 / 3;
  width: 100%;
  max-width: 240px;        /* 移动端竖屏不超过半屏 */
  background:
    linear-gradient(160deg,
      var(--color-bg-elevated) 0%,
      var(--color-surface) 100%);
  border: 1px solid var(--color-accent-soft);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md), var(--shadow-glow);
  overflow: hidden;
}
.card-face--mini {
  max-width: 80px;
  aspect-ratio: 2 / 3;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}
.card-face__name {
  position: absolute;
  bottom: var(--space-4);
  left: 50%;
  transform: translateX(-50%);
  font-size: var(--font-size-h3);
  font-weight: 500;
  color: var(--color-accent);
  letter-spacing: 0.02em;
}
.card-face__keyword {
  font-size: var(--font-size-small);
  color: var(--color-text-muted);
  text-align: center;
  margin-top: var(--space-3);
}
```

#### 5.5.2 翻牌动效（**L2 允许豁免之一**，PRD §3.7）

```css
@keyframes card-flip {
  0%   { transform: rotateY(180deg) scale(0.95); opacity: 0; }
  60%  { transform: rotateY(0deg) scale(1.02); opacity: 1; }
  100% { transform: rotateY(0deg) scale(1); opacity: 1; }
}
.card-face--flipping {
  animation: card-flip 1200ms cubic-bezier(0.22, 1, 0.36, 1);
  transform-style: preserve-3d;
  backface-visibility: hidden;
}

@media (prefers-reduced-motion: reduce) {
  .card-face--flipping {
    animation: none;
    transition: opacity 300ms ease-out;
  }
}
```

### 5.6 ConfessTextarea（倾诉输入区）

```css
.confess-textarea {
  width: 100%;
  min-height: 200px;
  max-width: var(--container-max);
  padding: var(--space-6);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  color: var(--color-text);
  font-family: var(--font-body);
  font-size: var(--font-size-body-reading);
  line-height: var(--line-height-loose);
  letter-spacing: 0.02em;
  resize: vertical;
  transition: border-color 200ms ease-out, box-shadow 200ms ease-out;
}
.confess-textarea::placeholder {
  color: var(--color-text-subtle);
}
.confess-textarea:hover    { border-color: var(--color-border-focus); }
.confess-textarea:focus-visible {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px var(--color-accent-soft);
}
.confess-textarea:disabled { opacity: 0.5; cursor: not-allowed; }

.confess-meta {                /* 字数提示 + 隐私微提示 */
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--space-2);
  font-size: var(--font-size-caption);
  color: var(--color-text-muted);
}
.confess-meta--warn { color: var(--color-warning); }   /* 接近 1000 字上限 */
```

### 5.7 ConfessSubmit（提交按钮）

继承 `.btn-primary`。字数 < 50 时禁用，提示文案使用 `--color-text-muted`，**不用 `--color-danger`**——禁用不是错误，是"再多说一点点"。

### 5.8 StreamingReading（流式开示展示）

```css
.streaming-reading {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: var(--space-8) var(--container-padding-mobile);
  font-family: var(--font-body);
  font-size: var(--font-size-body-reading);
  line-height: var(--line-height-loose);
  letter-spacing: 0.02em;
  color: var(--color-text);
}
.streaming-reading p { margin-bottom: var(--space-6); }      /* 段间呼吸 */
.streaming-reading p:last-child { margin-bottom: 0; }

/* 流式打字过程中的光标，**L2 允许豁免之二**，PRD §3.7 */
.streaming-reading__cursor {
  display: inline-block;
  width: 0.5em;
  height: 1.1em;
  margin-left: 0.1em;
  background: var(--color-accent);
  vertical-align: middle;
  animation: cursor-blink 1.2s ease-in-out infinite;
}
@keyframes cursor-blink {
  0%, 100% { opacity: 0; }
  50%      { opacity: 1; }
}

/* 首 token 前的呼吸式 placeholder */
.streaming-reading__waiting {
  color: var(--color-text-subtle);
  font-style: italic;
  animation: breath 3s ease-in-out infinite;
}
@keyframes breath {
  0%, 100% { opacity: 0.5; }
  50%      { opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
  .streaming-reading__cursor,
  .streaming-reading__waiting { animation: none; }
}
```

### 5.9 DonateBlock（打赏区块）

**核心约束（PRD §3.5）**：视觉权重必须**轻于**开示正文；3 档金额按钮**完全等权重**，无大小差异、无"推荐"高亮。

```css
.donate-block {
  margin-top: var(--space-12);
  padding: var(--space-6);
  background: var(--color-bg-elevated);   /* 比正文背景略亮，但不喧宾夺主 */
  border: 1px solid var(--color-border-soft);
  border-radius: var(--radius-lg);
}
.donate-block__title {
  font-size: var(--font-size-small);    /* 比正文小，不抢主角 */
  font-weight: 500;
  color: var(--color-text-muted);       /* 用 muted，不用 strong */
  text-align: center;
  margin-bottom: var(--space-4);
}
.donate-amounts {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3);
}
.donate-amount {
  /* 注意：3 个按钮**完全相同**，禁止 .donate-amount--recommended 之类 */
  min-height: 56px;
  padding: var(--space-3) var(--space-4);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text);
  font-family: var(--font-body);
  font-size: var(--font-size-numeric);
  font-weight: 500;
  font-feature-settings: "tnum";
  cursor: pointer;
  transition: border-color 200ms ease-out, background 200ms ease-out;
}
.donate-amount:hover    { border-color: var(--color-accent); background: var(--color-surface-hover); }
.donate-amount[aria-pressed="true"] {
  border-color: var(--color-accent);
  background: var(--color-accent-soft);
  color: var(--color-accent);
}
.donate-amount:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px;
}
```

### 5.10 PromptPayQR（QR 码展示）

```css
.promptpay-qr {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-6);
  background: #FFFFFF;       /* QR 必须白底（扫码识别要求）—— 唯一允许的硬编码白 */
  border-radius: var(--radius-lg);
}
.promptpay-qr__svg {
  width: 200px;
  height: 200px;
}
.promptpay-qr__amount {
  font-size: var(--font-size-h3);
  font-weight: 600;
  color: var(--color-text-strong);
}
.promptpay-qr__countdown {
  font-size: var(--font-size-small);
  color: var(--color-text-muted);
  font-feature-settings: "tnum";
}
```

> 例外说明：QR 容器内部白底是扫码识别的物理要求，不是设计选择。其外的卡片仍走 token。

### 5.11 CrisisGate（危机干预页）

**核心约束**：温柔，不像错误页。

```css
.crisis-gate {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: var(--space-12) var(--container-padding-mobile);
  background: var(--color-crisis-bg);
  border: 1px solid var(--color-secondary-soft);
  border-radius: var(--radius-lg);
  text-align: center;
}
.crisis-gate__title {
  font-size: var(--font-size-h2);
  font-weight: 500;
  color: var(--color-text-strong);
  margin-bottom: var(--space-6);
  line-height: 1.5;
}
.crisis-gate__message {
  font-size: var(--font-size-body-reading);
  line-height: var(--line-height-loose);
  color: var(--color-text);
  margin-bottom: var(--space-8);
}
.crisis-gate__hotline {
  display: inline-block;
  font-size: var(--font-size-h2);
  font-weight: 600;
  color: var(--color-crisis-accent);    /* 紫色月光，不刺激不冰冷 */
  text-decoration: none;
  letter-spacing: 0.05em;
  padding: var(--space-4) var(--space-8);
  border: 1px solid var(--color-crisis-accent);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-8);
}
.crisis-gate__hotline:hover { background: var(--color-secondary-soft); }
```

### 5.12 FarewellMessage（结束页）

```css
.farewell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-12);
  padding: var(--space-20) var(--container-padding-mobile);
  text-align: center;
}
.farewell__text {
  font-size: var(--font-size-h2);
  font-weight: 500;
  color: var(--color-text);
  line-height: 1.6;
  max-width: 24ch;
}
```

### 5.13 Toast / Dialog（uiStore 驱动）

```css
.toast {
  position: fixed;
  bottom: var(--space-8);
  left: 50%;
  transform: translateX(-50%);
  padding: var(--space-3) var(--space-6);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  color: var(--color-text);
  font-size: var(--font-size-small);
  box-shadow: var(--shadow-md);
  z-index: var(--z-toast);
  animation: toast-in 250ms cubic-bezier(0.22, 1, 0.36, 1);
}
@keyframes toast-in {
  from { opacity: 0; transform: translate(-50%, 10px); }
  to   { opacity: 1; transform: translate(-50%, 0); }
}
.toast--error   { border-color: var(--color-danger); }
.toast--success { border-color: var(--color-success); }

.dialog {
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-8);
  max-width: 400px;
  box-shadow: var(--shadow-lg);
}
.dialog__overlay {
  background: rgba(15, 20, 36, 0.8);
  backdrop-filter: blur(8px);
}
```

---

## 6. 动效与交互

### 6.1 默认档位：L1 静态优雅

**全局允许的动效（仅 4 种）**：

```css
/* 1. 按钮 hover/active 色彩+阴影过渡 */
.transition-default { transition: all 200ms ease-out; }

/* 2. 入场 fadeInUp（页面切换） */
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up { animation: fade-in-up 400ms cubic-bezier(0.22, 1, 0.36, 1) both; }

/* 3. Toast 滑入（5.13 已定义） */

/* 4. 流式打字光标闪烁（5.8 已定义） */
```

### 6.2 L2 豁免：仅以下 2 处允许（PRD §3.7 已明确）

- **翻牌动效** — 5.5.2 `card-flip` keyframe；曲线 `cubic-bezier(0.22, 1, 0.36, 1)`；时长 1200ms
- **流式文字打字** — 5.8 `cursor-blink` + 服务端 SSE 逐 token 推送

> **不允许**：滚动 reveal、视差、光标跟随、pin 动画、3D / WebGL、自动播放视频。

### 6.3 必备：reduced-motion 降级

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  /* 翻牌降级为简单淡入 */
  .card-face--flipping { animation: fade-in-up 300ms ease-out both; }
  /* 流式打字光标隐藏 */
  .streaming-reading__cursor { display: none; }
}
```

### 6.4 缓动曲线（统一）

```css
:root {
  --ease-out-soft:  cubic-bezier(0.22, 1, 0.36, 1);   /* 默认，柔和减速 */
  --ease-in-out:    cubic-bezier(0.65, 0, 0.35, 1);   /* 双向 */
  --duration-fast:  150ms;
  --duration-base:  200ms;
  --duration-slow:  400ms;
  --duration-card:  1200ms;
}
```

---

## 7. Do's & Don'ts

### Do ✅

- 所有颜色走 CSS 变量，无 hex 硬编码（除 `5.10 PromptPayQR` 内部白底的物理要求）
- 所有可交互元素都有 `:hover` + `:focus-visible` + `:disabled` 状态
- 移动端优先，最大宽度 560px 居中（保泰语长文阅读舒适度）
- 提供 A / A+ / A++ 字号切换，持久化用户偏好
- 暗色为默认主形态，亮色作为日间备选可手动切换
- 所有强动效（翻牌、打字、Toast）都有 `prefers-reduced-motion` 降级
- 段落间距用 `--space-6`（24px）保正文呼吸
- 错误文案温柔（"网络似乎慢了下来"），不冰冷（"请求失败"）

### Don't ❌

- ❌ 不在 V1 实现 PRD 「不做清单」里的功能（注册/历史/订阅/社区等）
- ❌ 不给 3 个金额按钮加大小差异 / 推荐高亮（PRD §3.5 红线）
- ❌ 不用刺激红 / 亮黄做主色或大面积色块
- ❌ 不用佛像/经文/塔罗暗黑骷髅等具象符号
- ❌ 不用卡通插画 / 拟人 Avatar
- ❌ 不写"未付费看不全"的暗示样式（开示糊化、付费弹窗等）
- ❌ 不在打赏区块抢走开示正文的视觉重量
- ❌ 不引入 GSAP / Lenis / WebGL（L1 用纯 CSS 即可）
- ❌ 不用全屏白色 spinner（任何 loading 都保留暮色调性）
- ❌ 不为单个图标装整个图标包（用 lucide-react / 内联 SVG）

---

## 📎 实现交接（供下游 Claude Code 读取）

```yaml
design_status: ready
theme: 暮色温柔（月光、被拥抱、低饱和、像深夜的一盏小灯）
interaction_level: L1
allowed_l2_exceptions:
  - card-flip (1200ms cubic-bezier(0.22,1,0.36,1))
  - streaming-text-cursor (1.2s blink)
color_system: 见 §2，CSS 变量驱动；暗色主形态 + 亮色备选
font_system:
  thai_main: Sarabun (next/font/google, weights 300-700, subsets thai+latin)
  latin_aux: Inter (next/font/google, weights 400-700)
  variables: --font-sarabun / --font-inter
  body_reading_size: 17px / 1.85 line-height / +0.02em letter-spacing
  font_scale_options: ['1', '1.15', '1.3']  # A / A+ / A++
core_components:
  - DuskBackground
  - PrivacyBadge
  - InviteCTA
  - Button (primary / ghost / tertiary)
  - CardDeck / CardDraw / CardFace (large + mini)
  - ConfessTextarea
  - ConfessSubmit
  - StreamingReading
  - DonateBlock + DonateAmounts (3 等权按钮)
  - PromptPayQR
  - CrisisGate
  - ReadingActions
  - FarewellMessage
  - Toast / Dialog
breakpoints:
  mobile: '<=640px (主)'
  tablet: '641-1024px'
  desktop: '>=1025px'
  container_max: 560px
spacing_grid: 4px base (--space-1 ~ --space-20)
radius_grid: 4 / 8 / 12 / 20 / 28 / full
motion_libs: []   # L1 纯 CSS，不引入 GSAP/Lenis/WebGL
language_default: th
locale: th-TH
dark_mode: required (default)
light_mode: optional (daytime)
accessibility:
  - WCAG AA 对比度全表通过（见 §2.4）
  - prefers-reduced-motion 降级
  - prefers-color-scheme 自动跟随但默认 dark
  - 字号切换 A/A+/A++ 持久化
mvp_scope_inheritance:
  v1_features: [匿名倾诉容器, 抽牌+AI长开示, 自愿打赏闭环]
  v1_hard_gates_from_brd:
    - 危机干预（CrisisGate）必须上线
    - 关键词词典 ≥ 30 个由本地顾问审核
    - 单次会话成本测算 ARPU 模型成立
upstream_chain:
  prd: ./PRD/
  brd: ./BRD.md
  mrd: ./MRD.md
  data_source: ./all_comments.json
evidence_level: yellow
```

---

## 📎 给 Claude Code 的实现指令（MVP 落地）

> 本节是 DESIGN.md 的最后一节，把"规格"和"实现"无缝衔接。
> Claude Code 拿到 [PRD/](./PRD/) + DESIGN.md 后，**严格按下面规则写代码**。

### 实现纪律（MVP 优先，不可破）

1. **只实现 PRD/01-overview.md §1.5 列出的 V1 三个核心功能**——「不做清单」就是不做。看到"顺手加个登录"立刻停下问用户
2. **每个页面先跑通再美化**——HTML 结构 + 泰语 i18n 文案（先用 placeholder string）+ 基础样式 → 跑通核心闭环 → 再加翻牌/打字两处 L2 动效
3. **不引入 PRD/02-tech-stack.md 列表外的依赖**——禁止 GSAP / Lenis / WebGL / Framer Motion；动效全部用纯 CSS（见 §6）
4. **图标用 lucide-react 或内联 SVG**，不要为单个图标装整个图标包
5. **图片**：塔罗牌面图先用 SVG 文字卡片占位（牌名 + 关键词），后续由用户替换；不要去网上找图
6. **零硬编码颜色**——全部走 `var(--color-...)`；唯一例外是 `5.10 PromptPayQR` 内部白底（扫码物理要求）
7. **所有可交互元素**必须有 `:hover` + `:focus-visible` + `:disabled` 三态
8. **移动端优先**——先写 ≤ 640px 样式，再用 `@media (min-width: 1025px)` 扩展桌面端
9. **不写 README、不写测试、不写 CI 配置**——MVP 阶段都是噪音
10. **每写完一个页面停下来告诉用户**："X 页已跑通，要不要看一眼？"

### 落地顺序（推荐 5 步）

1. **初始化**：按 [PRD/02-tech-stack.md](./PRD/02-tech-stack.md) §2.2 跑完 `npx create-next-app` 等命令；把 §2/§3/§4 的 CSS 变量写入 `src/styles/globals.css`；配 `next/font` Sarabun + Inter
2. **首页 + 抽牌页（无后端）**：先把 InviteCTA + CardDraw + CardFace 跑通；用 mock 数据（随机选 22 张大阿尔卡那中的 1 张）；翻牌动效用 §5.5.2 的 CSS keyframe，无需任何 JS 动效库
3. **倾诉页 + 危机干预（半后端）**：ConfessTextarea + ConfessSubmit；接入本地泰语关键词词典（[PRD/07 §7.4](./PRD/07-business-logic.md)）；命中 → CrisisGate 渲染。**这一步上线是 BRD hard gate**
4. **开示流式生成（接 LLM）**：按 [PRD/05](./PRD/05-ai-capabilities.md) 接 Anthropic streamText；前端用 §5.8 的 StreamingReading 组件；首 token 前显示 `breath` 呼吸 placeholder；用 `prefers-reduced-motion` 降级到无光标
5. **打赏闭环（接 Stripe）**：按 [PRD/07 §7.5](./PRD/07-business-logic.md) 创建 PaymentIntent；DonateAmounts 三等权按钮，**禁止任何 "推荐"/高亮/不等大设计**；PromptPayQR 用白底容器；webhook 处理幂等

### 反模式（看到就停下来问）

- 用户说"做个登录页"，但 PRD V1 没有用户系统 → **停下来问**："PRD 里没列登录，要加进 V1 吗？加的话其他 3 个核心功能要砍一个"
- 想加 GSAP / Framer Motion / Lenis 做更炫动效 → **不要**。L1 纯 CSS 已足够，PRD §3.7 仅豁免翻牌 + 打字两处
- 跑通前想"补完整"地加 SEO / Analytics / PWA / Service Worker / E2E 测试 → 全部缓一缓，进 [PRD/10-roadmap.md](./PRD/10-roadmap.md)
- 想给 3 个打赏金额按钮加"推荐 35 泰铢"高亮 → **绝对不行**。PRD §3.5 + DESIGN §5.9 双重红线
- 想用 `<img>` 加载真实塔罗牌图 → V1 用 SVG 文字卡片占位即可，避免美术资源 blocker
- 想加历史记录 / 收藏 / 我的开示 → V1 不做（违背匿名 P0 价值）
- 想用 localStorage 存倾诉内容 → 不允许（隐私要求只在内存，[PRD/06 §6.4](./PRD/06-data-model.md)）

### 给 Agent 的开工提示词

> 以下是用户复制粘贴给 Claude Code 的标准开场白模板：

```
请按 ./PRD/ + ./DESIGN.md 实现 MVP。

读取顺序：
1. ./PRD/README.md（产品全貌 + 加载建议）
2. ./PRD/01-overview.md（V1 范围 + 核心流程）
3. ./PRD/02-tech-stack.md（初始化命令）
4. ./DESIGN.md（视觉规范，重点读 §2/§3/§4/§5/§6）

实现纪律严格遵守 ./DESIGN.md 末尾「给 Claude Code 的实现指令」。

落地顺序按 5 步：初始化 → 首页/抽牌页 → 倾诉页/危机干预 → 流式开示 → 打赏闭环。
每完成一步暂停告诉我，不要一口气写完所有代码。
```

---

> 本设计规范由 design-spec skill 辅助生成。所有视觉决策可回溯至 [PRD/03-design-handoff.md](./PRD/03-design-handoff.md) §3.1-3.7。
