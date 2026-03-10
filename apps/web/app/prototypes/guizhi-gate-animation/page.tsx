import Link from "next/link";

import { GuizhiGatePrototype } from "@/components/guizhi-gate-prototype";

export default function GuizhiGateAnimationPrototypePage() {
  return (
    <main className="page-shell page-shell--prototype">
      <section className="detail-hero">
        <div className="detail-hero__content">
          <p className="eyebrow">Prototype</p>
          <h1>桂枝法开门动画原型</h1>
          <p className="detail-hero__subtitle">第三张关键原型，负责把“开门拨机”讲成一眼能懂的动作。</p>
          <p className="detail-hero__intro">
            这个页面不打算把桂枝法讲成药味背诵卡，而是先让用户明白：问题在于门轴卡住、内外不接，
            桂枝法的动作是把门拨开。只要这件事讲清楚，后面与附子法的区别就能站住。
          </p>
          <div className="hero__actions">
            <Link className="button button--primary" href="/modules/fu-yang-core">
              返回 fu-yang-core 模块
            </Link>
            <Link className="button button--ghost" href="/prototypes/kan-li-circulation">
              回看坎离交通
            </Link>
            <Link className="button button--ghost" href="/prototypes/fuzi-root-return">
              去看附子归根
            </Link>
            <Link className="button button--ghost" href="/prototypes/guizhi-vs-fuzi">
              打开双图对照
            </Link>
            <Link className="button button--ghost" href="/prototypes/fu-yang-action-triad">
              打开三动作总览
            </Link>
          </div>
        </div>
        <div className="detail-hero__stats">
          <div className="hero-metric">
            <strong>1</strong>
            <span>拨门滑杆</span>
          </div>
          <div className="hero-metric">
            <strong>3</strong>
            <span>讲解焦点</span>
          </div>
          <div className="hero-metric">
            <strong>3</strong>
            <span>门轴状态</span>
          </div>
          <div className="hero-metric">
            <strong>MVP</strong>
            <span>开门动作图</span>
          </div>
        </div>
      </section>

      <GuizhiGatePrototype />

      <section className="section section--split">
        <div>
          <div className="section-heading">
            <p className="eyebrow">What To Validate</p>
            <h2>这张图当前主要验证什么</h2>
            <p>它主要验证“开门”这个动作能不能被看懂，而不是验证用户记了多少名词。</p>
          </div>
          <div className="phase-list">
            <article className="phase-card">
              <p>用户会不会自然把注意力放到门轴和开合，而不是直接把桂枝法理解成发汗按钮。</p>
            </article>
            <article className="phase-card">
              <p>滑杆和门板开启角度，是否足够清楚地表达“拨动”的过程感。</p>
            </article>
            <article className="phase-card">
              <p>用户是否能在同一张图上接受“开门”和“归根”是两个不同动作这一对照。</p>
            </article>
          </div>
        </div>
        <div>
          <div className="section-heading">
            <p className="eyebrow">Next Build</p>
            <h2>如果方向成立，下一步怎么继续</h2>
            <p>单图和对照图已经成型，接下来该把它们挂进更真实的学习任务里。</p>
          </div>
          <div className="phase-list">
            <article className="phase-card">
              <p>把门轴阻力和阈值反馈做得更明显，强化“拨开”的力学感。</p>
            </article>
            <article className="phase-card">
              <p>把桂枝动作接进三动作总览页后的病例练习，让用户先判断它是否真的是“开门题”。</p>
            </article>
            <article className="phase-card">
              <p>把这张图重新挂回坎离主图和模块页，形成“先看结构，再做动作分流”的学习链路。</p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
