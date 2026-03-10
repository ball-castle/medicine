import Link from "next/link";

import { PulseDashboardPrototype } from "@/components/pulse-dashboard-prototype";

export default function PulseDashboardPrototypePage() {
  return (
    <main className="page-shell page-shell--prototype">
      <section className="detail-hero">
        <div className="detail-hero__content">
          <p className="eyebrow">Prototype</p>
          <h1>脉诊总开关面板原型</h1>
          <p className="detail-hero__subtitle">先抓脉象主轴，再让舌象辅助，最后把病名标签压回后位。</p>
          <p className="detail-hero__intro">
            这张图验证的不是“会不会背脉名”，而是用户能不能把判断顺序排对。只要顺序一乱，后面的
            方药、病例和复盘都会被一并带偏。
          </p>
          <div className="hero__actions">
            <Link className="button button--primary" href="/modules/diagnostic-judgment">
              返回诊断模块
            </Link>
            <Link className="button button--ghost" href="/practice/diagnostic-axis-basic">
              打开诊断练习
            </Link>
            <Link className="button button--ghost" href="/cases/pulse-axis-priority-case">
              打开脉象病例
            </Link>
          </div>
        </div>
        <div className="detail-hero__stats">
          <div className="hero-metric">
            <strong>4</strong>
            <span>脉象轮廓</span>
          </div>
          <div className="hero-metric">
            <strong>4</strong>
            <span>舌象窗口</span>
          </div>
          <div className="hero-metric">
            <strong>3</strong>
            <span>判断顺序</span>
          </div>
          <div className="hero-metric">
            <strong>MVP</strong>
            <span>第二批原型</span>
          </div>
        </div>
      </section>

      <PulseDashboardPrototype />
    </main>
  );
}
