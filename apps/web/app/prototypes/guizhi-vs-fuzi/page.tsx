import Link from "next/link";

import { GuizhiFuziCompare } from "@/components/guizhi-fuzi-compare";

export default function GuizhiVsFuziPage() {
  return (
    <main className="page-shell page-shell--prototype">
      <section className="detail-hero">
        <div className="detail-hero__content">
          <p className="eyebrow">Comparison</p>
          <h1>桂枝 vs 附子</h1>
          <p className="detail-hero__subtitle">把“开门”和“归根”放进同一页面，直接建立动作差异。</p>
          <p className="detail-hero__intro">
            这个页面不是新的知识点，而是把已经做出来的两张动作图压到同一个坐标系里。它的目标很直接：
            让用户一眼分清桂枝法解决“没路”的问题，附子法解决“没根”的问题。
          </p>
          <div className="hero__actions">
            <Link className="button button--primary" href="/modules/fu-yang-core">
              返回 fu-yang-core 模块
            </Link>
            <Link className="button button--ghost" href="/prototypes/guizhi-gate-animation">
              看桂枝细版
            </Link>
            <Link className="button button--ghost" href="/prototypes/fuzi-root-return">
              看附子细版
            </Link>
            <Link className="button button--ghost" href="/prototypes/fushen-right-descend">
              看茯神缓转
            </Link>
            <Link className="button button--ghost" href="/prototypes/fu-yang-action-triad">
              打开三动作总览
            </Link>
          </div>
        </div>
        <div className="detail-hero__stats">
          <div className="hero-metric">
            <strong>1</strong>
            <span>统一进度</span>
          </div>
          <div className="hero-metric">
            <strong>3</strong>
            <span>对照视角</span>
          </div>
          <div className="hero-metric">
            <strong>2</strong>
            <span>核心动作</span>
          </div>
          <div className="hero-metric">
            <strong>1</strong>
            <span>双图记忆入口</span>
          </div>
        </div>
      </section>

      <GuizhiFuziCompare />

      <section className="section section--split">
        <div>
          <div className="section-heading">
            <p className="eyebrow">What To Validate</p>
            <h2>这张对照页当前主要验证什么</h2>
            <p>这里不是新增理论，而是验证用户能否在最短时间内建立动作边界。</p>
          </div>
          <div className="phase-list">
            <article className="phase-card">
              <p>用户是否会把“开门”和“归根”自动和不同问题配对，而不是只记成两种热药。</p>
            </article>
            <article className="phase-card">
              <p>统一进度条是否足够帮助用户看到两个动作的方向差异，而不是只看形状差异。</p>
            </article>
            <article className="phase-card">
              <p>双图页是否能成为后续病例推演和练习的稳定入口。</p>
            </article>
          </div>
        </div>
        <div>
          <div className="section-heading">
            <p className="eyebrow">Next Build</p>
            <h2>如果方向成立，下一步怎么继续</h2>
            <p>双图页现在已经接进三动作总览，接下来最值钱的是把它们变成真正的判断训练。</p>
          </div>
          <div className="phase-list">
            <article className="phase-card">
              <p>把一个典型“上热下寒”的病例接到双图页上，让用户先判断更偏开门还是更偏归根。</p>
            </article>
            <article className="phase-card">
              <p>把双图页收成三动作总览里的一个对照步骤，而不是让用户在多个页面之间迷路。</p>
            </article>
            <article className="phase-card">
              <p>把这页收成更短的教学模式，做成真正的 1 分钟入门互动。</p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
