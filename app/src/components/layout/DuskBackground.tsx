/**
 * 暮色背景 — DESIGN.md §5.1
 * 全局固定背景，不阻挡交互（pointer-events: none in CSS）
 */
export default function DuskBackground() {
  return <div className="dusk-background" aria-hidden="true" />;
}
