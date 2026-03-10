import Link from "next/link";

import { FormulaDirectionPrototype } from "@/components/formula-direction-prototype";

export default function FormulaDirectionCompassPrototypePage() {
  return (
    <main className="page-shell page-shell--prototype">
      <section className="detail-hero">
        <div className="detail-hero__content">
          <p className="eyebrow">Prototype</p>
          <h1>方剂方向罗盘原型</h1>
          <p className="detail-hero__subtitle">把桂枝、麻黄、承气、四逆先讲成方向动作，而不是功效词表。</p>
          <p className="detail-hero__intro">
            这个页面的目标不是讲完所有方，而是验证一个教学动作: 用户能不能先在空间里看懂“外开、
            和解、通降、守根”，再去理解为什么同样叫治病，动作却完全不是一回事。
          </p>
          <div className="hero__actions">
            <Link className="button button--primary" href="/modules/formula-logic">
              返回方药模块
            </Link>
            <Link className="button button--ghost" href="/practice/formula-direction-basic">
              打开方药练习
            </Link>
          </div>
        </div>
        <div className="detail-hero__stats">
          <div className="hero-metric">
            <strong>5</strong>
            <span>核心方义</span>
          </div>
          <div className="hero-metric">
            <strong>4</strong>
            <span>罗盘象限</span>
          </div>
          <div className="hero-metric">
            <strong>3</strong>
            <span>观察镜头</span>
          </div>
          <div className="hero-metric">
            <strong>MVP</strong>
            <span>第二批原型</span>
          </div>
        </div>
      </section>

      <FormulaDirectionPrototype />
    </main>
  );
}
