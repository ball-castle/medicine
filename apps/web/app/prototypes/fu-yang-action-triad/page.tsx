import Link from "next/link";

import { FuYangActionTriad } from "@/components/fu-yang-action-triad";

export default function FuYangActionTriadPage() {
  return (
    <main className="page-shell page-shell--prototype">
      <section className="detail-hero">
        <div className="detail-hero__content">
          <p className="eyebrow">Triad</p>
          <h1>扶阳三动作对照页</h1>
          <p className="detail-hero__subtitle">把“开门、归根、缓转”放进同一坐标系，一次性讲清动作边界。</p>
          <p className="detail-hero__intro">
            这个页面不再只做单图演示，而是把扶阳模块里最关键的三个动作放在同一画面比较。
            它的目标很直接：让用户不再把所有扶阳思路都混成一个模糊的“温热推进”，而是能看懂三种不同任务。
          </p>
          <div className="hero__actions">
            <Link className="button button--primary" href="/modules/fu-yang-core">
              返回 fu-yang-core 模块
            </Link>
            <Link className="button button--ghost" href="/prototypes/guizhi-vs-fuzi">
              回看双图对照
            </Link>
            <Link className="button button--ghost" href="/prototypes/fushen-right-descend">
              回看茯神缓转
            </Link>
            <Link className="button button--ghost" href="/prototypes/fu-yang-triage-practice">
              去做分流练习
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
            <span>观察视角</span>
          </div>
          <div className="hero-metric">
            <strong>3</strong>
            <span>核心动作</span>
          </div>
          <div className="hero-metric">
            <strong>MVP</strong>
            <span>三图总览</span>
          </div>
        </div>
      </section>

      <FuYangActionTriad />

      <section className="section section--split">
        <div>
          <div className="section-heading">
            <p className="eyebrow">What To Validate</p>
            <h2>这张总览页当前主要验证什么</h2>
            <p>它主要验证用户能不能在一页里完成动作分流，而不是继续把三种方法混在一起。</p>
          </div>
          <div className="phase-list">
            <article className="phase-card">
              <p>用户是否能先按问题类型分流，而不是先按药名或熟悉度做判断。</p>
            </article>
            <article className="phase-card">
              <p>三张图的空间方向差异，是否足够支撑大众建立稳定直觉。</p>
            </article>
            <article className="phase-card">
              <p>这张页是否已经能成为后续病例推演和入门练习的主入口。</p>
            </article>
          </div>
        </div>
        <div>
          <div className="section-heading">
            <p className="eyebrow">Next Build</p>
            <h2>如果方向成立，下一步怎么继续</h2>
            <p>三动作总览之后，第一版练习页已经接上。接下来要做的是把练习做深，而不是重新回到纯展示。</p>
          </div>
          <div className="phase-list">
            <article className="phase-card">
              <p>把练习题从 3 题扩到 6 到 9 题，开始形成真正的入门测验。</p>
            </article>
            <article className="phase-card">
              <p>把错题解析接回对应原型页，形成“错哪就回看哪”的学习回路。</p>
            </article>
            <article className="phase-card">
              <p>再决定哪些高价值场景值得升级成更完整的 2.5D 或 3D 动画。</p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
