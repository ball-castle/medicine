import Link from "next/link";

import { FuziRootPrototype } from "@/components/fuzi-root-prototype";

export default function FuziRootReturnPrototypePage() {
  return (
    <main className="page-shell page-shell--prototype">
      <section className="detail-hero">
        <div className="detail-hero__content">
          <p className="eyebrow">Prototype</p>
          <h1>附子法归根动画原型</h1>
          <p className="detail-hero__subtitle">第四张关键原型，负责把“归根回阳”讲成和桂枝法完全不同的动作。</p>
          <p className="detail-hero__intro">
            这个页面专门让用户看懂一件事：附子法不是继续把系统往外拨，而是把浮散无根的阳往下收、往里归、
            让根部重新守住。只要这件事讲清楚，和桂枝法的差别就不再是文字概念。
          </p>
          <div className="hero__actions">
            <Link className="button button--primary" href="/modules/fu-yang-core">
              返回 fu-yang-core 模块
            </Link>
            <Link className="button button--ghost" href="/prototypes/guizhi-gate-animation">
              回看桂枝开门
            </Link>
          </div>
        </div>
        <div className="detail-hero__stats">
          <div className="hero-metric">
            <strong>1</strong>
            <span>归根滑杆</span>
          </div>
          <div className="hero-metric">
            <strong>3</strong>
            <span>讲解焦点</span>
          </div>
          <div className="hero-metric">
            <strong>3</strong>
            <span>归根状态</span>
          </div>
          <div className="hero-metric">
            <strong>MVP</strong>
            <span>归根动作图</span>
          </div>
        </div>
      </section>

      <FuziRootPrototype />

      <section className="section section--split">
        <div>
          <div className="section-heading">
            <p className="eyebrow">What To Validate</p>
            <h2>这张图当前主要验证什么</h2>
            <p>它主要验证“归根”能不能被直观看懂，而不是继续被用户误解成“更热、更冲”。</p>
          </div>
          <div className="phase-list">
            <article className="phase-card">
              <p>用户是否能区分“上面发亮”与“根部有主”不是同一个判断。</p>
            </article>
            <article className="phase-card">
              <p>滑杆和下潜轨迹，是否足够清楚地表达“收回去、守下来”的过程感。</p>
            </article>
            <article className="phase-card">
              <p>用户是否能把这张图和桂枝法自动配对，形成“开门 vs 归根”的稳定记忆。</p>
            </article>
          </div>
        </div>
        <div>
          <div className="section-heading">
            <p className="eyebrow">Next Build</p>
            <h2>如果方向成立，下一步怎么继续</h2>
            <p>这张图最适合和桂枝法组成双图教学，再反挂到坎离主图里。</p>
          </div>
          <div className="phase-list">
            <article className="phase-card">
              <p>把桂枝与附子两个动作页串成一个双图对照体验，用户左右切换就能看懂区别。</p>
            </article>
            <article className="phase-card">
              <p>把“上热下寒、内外不通”的案例轻度挂进来，开始形成病例式学习入口。</p>
            </article>
            <article className="phase-card">
              <p>继续补第五张图：茯神法右降路径图，形成“开、归、缓转”三种不同动作层次。</p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
