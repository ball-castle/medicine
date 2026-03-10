import Link from "next/link";

import { CircleFlowPrototype } from "@/components/circle-flow-prototype";

export default function CircleFlowMapPrototypePage() {
  return (
    <main className="page-shell page-shell--prototype">
      <section className="detail-hero">
        <div className="detail-hero__content">
          <p className="eyebrow">Prototype</p>
          <h1>圆运动总图原型</h1>
          <p className="detail-hero__subtitle">
            第一张从“规划文档”真正走到“可操作界面”的图。
          </p>
          <p className="detail-hero__intro">
            这个页面的重点不是还原最终美术，而是验证教学动作本身是否成立：用户切换时令、调整中气、
            比较不同失衡模式后，能不能直觉地说出“先看整体运行，再看局部病名”。
          </p>
          <div className="hero__actions">
            <Link className="button button--primary" href="/modules/foundations">
              返回 foundations 模块
            </Link>
            <Link className="button button--ghost" href="/storyboards">
              看对应分镜
            </Link>
          </div>
        </div>
        <div className="detail-hero__stats">
          <div className="hero-metric">
            <strong>5</strong>
            <span>时令焦点</span>
          </div>
          <div className="hero-metric">
            <strong>4</strong>
            <span>观察模式</span>
          </div>
          <div className="hero-metric">
            <strong>1</strong>
            <span>中气滑杆</span>
          </div>
          <div className="hero-metric">
            <strong>MVP</strong>
            <span>首张可玩图</span>
          </div>
        </div>
      </section>

      <CircleFlowPrototype />

      <section className="section section--split">
        <div>
          <div className="section-heading">
            <p className="eyebrow">What To Validate</p>
            <h2>这张图当前主要验证什么</h2>
            <p>现在先验证学习动作正确，再决定它后面要往 SVG 动画还是轻 3D 场景继续做深。</p>
          </div>
          <div className="phase-list">
            <article className="phase-card">
              <p>用户能不能区分“该升不升”“该降不降”“中轴偏弱”这三种不同失衡。</p>
            </article>
            <article className="phase-card">
              <p>用户会不会把注意力自动落回中气和整体流线，而不是只看外圈节点。</p>
            </article>
            <article className="phase-card">
              <p>季节切换是否真的帮助理解五脏方向，而不是只是视觉换色。</p>
            </article>
          </div>
        </div>
        <div>
          <div className="section-heading">
            <p className="eyebrow">Next Build</p>
            <h2>如果这张图方向成立，下一步怎么做</h2>
            <p>不需要一次到位，先在这个原型上逐层加深。</p>
          </div>
          <div className="phase-list">
            <article className="phase-card">
              <p>把当前静态文字说明收敛成更短的引导脚本，适合真实用户首轮体验。</p>
            </article>
            <article className="phase-card">
              <p>把异常模式和症状外观做成连动，让用户看到“同病名不同结构”的差异。</p>
            </article>
            <article className="phase-card">
              <p>决定是否把流线动画进一步升级成更强空间感的 2.5D 或 3D 场景。</p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
