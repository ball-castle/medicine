import Link from "next/link";

import { FushenRightDescendPrototype } from "@/components/fushen-right-descend-prototype";

export default function FushenRightDescendPage() {
  return (
    <main className="page-shell page-shell--prototype">
      <section className="detail-hero">
        <div className="detail-hero__content">
          <p className="eyebrow">Prototype</p>
          <h1>茯神法右降路径图原型</h1>
          <p className="detail-hero__subtitle">第五张关键原型，负责把“缓转过渡”补进扶阳动作链。</p>
          <p className="detail-hero__intro">
            这个页面专门处理一个容易被忽略的问题：不是所有局面都适合立刻开门或归根。很多时候，
            需要先把上部乱象收下来、右侧带下去，让系统从“太躁太浮”变成“可继续处理”的状态。
          </p>
          <div className="hero__actions">
            <Link className="button button--primary" href="/modules/fu-yang-core">
              返回 fu-yang-core 模块
            </Link>
            <Link className="button button--ghost" href="/prototypes/guizhi-vs-fuzi">
              回看桂附对照
            </Link>
            <Link className="button button--ghost" href="/prototypes/fu-yang-action-triad">
              打开三动作总览
            </Link>
          </div>
        </div>
        <div className="detail-hero__stats">
          <div className="hero-metric">
            <strong>1</strong>
            <span>右降滑杆</span>
          </div>
          <div className="hero-metric">
            <strong>3</strong>
            <span>讲解焦点</span>
          </div>
          <div className="hero-metric">
            <strong>3</strong>
            <span>过渡状态</span>
          </div>
          <div className="hero-metric">
            <strong>MVP</strong>
            <span>缓转动作图</span>
          </div>
        </div>
      </section>

      <FushenRightDescendPrototype />

      <section className="section section--split">
        <div>
          <div className="section-heading">
            <p className="eyebrow">What To Validate</p>
            <h2>这张图当前主要验证什么</h2>
            <p>它主要验证用户能否理解：有些时候最重要的不是猛进，而是先让局面缓下来。</p>
          </div>
          <div className="phase-list">
            <article className="phase-card">
              <p>用户是否能看出“右降”与“开门”“归根”不是同一个方向动作。</p>
            </article>
            <article className="phase-card">
              <p>滑杆和路径线是否足够清楚地表达“缓缓带下、先稳局面”的过程感。</p>
            </article>
            <article className="phase-card">
              <p>用户是否会自然接受它的过渡性角色，而不是误以为它是终局方案。</p>
            </article>
          </div>
        </div>
        <div>
          <div className="section-heading">
            <p className="eyebrow">Next Build</p>
            <h2>如果方向成立，下一步怎么继续</h2>
            <p>缓转动作已经补齐，下一步最值钱的工作是让用户开始用它做判断，而不是继续只看图。</p>
          </div>
          <div className="phase-list">
            <article className="phase-card">
              <p>把“开、归、缓转”三动作总览页接进具体案例，训练用户何时先稳局面。</p>
            </article>
            <article className="phase-card">
              <p>把一个“上热下寒、心神不宁”的案例接进来，训练用户先判断更适合哪种动作。</p>
            </article>
            <article className="phase-card">
              <p>把这些原型进一步收成更短的入门互动脚本，开始为真实用户测试做准备。</p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
