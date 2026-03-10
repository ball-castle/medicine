import Link from "next/link";

import { KanLiPrototype } from "@/components/kan-li-prototype";

export default function KanLiCirculationPrototypePage() {
  return (
    <main className="page-shell page-shell--prototype">
      <section className="detail-hero">
        <div className="detail-hero__content">
          <p className="eyebrow">Prototype</p>
          <h1>坎离水火交通图原型</h1>
          <p className="detail-hero__subtitle">第二张真正可玩的核心图，负责把扶阳主线讲成空间结构。</p>
          <p className="detail-hero__intro">
            这个页面先验证一件事：用户能不能在没有大量术语灌输的情况下，看懂“上下既济”“交通中断”“逐步回接”，以及为什么这会自然分出“开门”和“归根”两个不同动作。
          </p>
          <div className="hero__actions">
            <Link className="button button--primary" href="/modules/fu-yang-core">
              返回 fu-yang-core 模块
            </Link>
            <Link className="button button--ghost" href="/storyboards">
              看对应分镜
            </Link>
          </div>
        </div>
        <div className="detail-hero__stats">
          <div className="hero-metric">
            <strong>3</strong>
            <span>状态模式</span>
          </div>
          <div className="hero-metric">
            <strong>4</strong>
            <span>讲解焦点</span>
          </div>
          <div className="hero-metric">
            <strong>1</strong>
            <span>恢复滑杆</span>
          </div>
          <div className="hero-metric">
            <strong>MVP</strong>
            <span>扶阳核心图</span>
          </div>
        </div>
      </section>

      <KanLiPrototype />

      <section className="section section--split">
        <div>
          <div className="section-heading">
            <p className="eyebrow">What To Validate</p>
            <h2>这张图当前主要验证什么</h2>
            <p>这里先验证“交通”这个概念能不能被直观看懂，而不是先验证术语记忆量。</p>
          </div>
          <div className="phase-list">
            <article className="phase-card">
              <p>用户是否能区分“上面更热”与“根里更有力”不是同一个判断。</p>
            </article>
            <article className="phase-card">
              <p>恢复滑杆是否真的能帮助理解“重新接通”是一个过程，而非一个结论。</p>
            </article>
            <article className="phase-card">
              <p>用户是否会自然理解为什么后续会分出“开门”和“归根”两种不同动作。</p>
            </article>
          </div>
        </div>
        <div>
          <div className="section-heading">
            <p className="eyebrow">Next Build</p>
            <h2>如果方向成立，下一步怎么继续</h2>
            <p>不需要立刻做复杂 3D，先把教学动作和导览脚本做顺。</p>
          </div>
          <div className="phase-list">
            <article className="phase-card">
              <p>把当前状态和后续桂枝法、附子法原型做成强链接，形成完整学习链路。</p>
            </article>
            <article className="phase-card">
              <p>加入更轻的语音式导览文案，让第一次进入的用户不需要自己摸索界面含义。</p>
            </article>
            <article className="phase-card">
              <p>决定是否升级成更有层次的 2.5D 视差场景，强化上下空间感和阻断感。</p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
