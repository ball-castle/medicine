import Link from "next/link";
import { notFound } from "next/navigation";

import { FuYangTriagePractice } from "@/components/fu-yang-triage-practice";
import { getSiteContent } from "@/lib/content";

export default async function FuYangTriagePracticePage() {
  const { practiceSets } = await getSiteContent();
  const practiceSet = practiceSets.find((item) => item.id === "fu-yang-triage-basic");

  if (!practiceSet) {
    notFound();
  }

  return (
    <main className="page-shell page-shell--prototype">
      <section className="detail-hero">
        <div className="detail-hero__content">
          <p className="eyebrow">Practice</p>
          <h1>{practiceSet.title}</h1>
          <p className="detail-hero__subtitle">{practiceSet.subtitle}</p>
          <p className="detail-hero__intro">
            这个页面把前面的动作原型转成 {practiceSet.cases.length} 个简化案例，让用户先判断更像“开门、归根、还是缓转”。
            它的价值在于从展示型产品，往可学习、可测试的产品迈一步。
          </p>
          <div className="hero__actions">
            <Link className="button button--primary" href="/modules/fu-yang-core">
              返回 fu-yang-core 模块
            </Link>
            <Link className="button button--ghost" href="/prototypes/fu-yang-action-triad">
              回看三动作总览
            </Link>
            <Link className="button button--ghost" href="/prototypes/guizhi-vs-fuzi">
              回看双图对照
            </Link>
          </div>
        </div>
        <div className="detail-hero__stats">
          <div className="hero-metric">
            <strong>{practiceSet.cases.length}</strong>
            <span>练习案例</span>
          </div>
          <div className="hero-metric">
            <strong>{practiceSet.actions.length}</strong>
            <span>动作选项</span>
          </div>
          <div className="hero-metric">
            <strong>{practiceSet.estimatedTime}</strong>
            <span>推荐时长</span>
          </div>
          <div className="hero-metric">
            <strong>MVP</strong>
            <span>分流练习</span>
          </div>
        </div>
      </section>

      <FuYangTriagePractice practiceSet={practiceSet} />

      <section className="section section--split">
        <div>
          <div className="section-heading">
            <p className="eyebrow">What To Validate</p>
            <h2>这张练习页当前主要验证什么</h2>
            <p>它主要验证用户能不能把图形直觉转成选择判断，而不是只停留在“看懂一点”的阶段。</p>
          </div>
          <div className="phase-list">
            <article className="phase-card">
              <p>用户是否会先看问题类型，再做动作分流，而不是直接按熟悉词汇乱猜。</p>
            </article>
            <article className="phase-card">
              <p>即时解析是否足够帮助用户理解“为什么不是另外两个动作”。</p>
            </article>
            <article className="phase-card">
              <p>{practiceSet.cases.length} 题小练习是否已经能形成第一版可测试学习闭环。</p>
            </article>
          </div>
        </div>
        <div>
          <div className="section-heading">
            <p className="eyebrow">Next Build</p>
            <h2>如果方向成立，下一步怎么继续</h2>
            <p>练习页一旦成立，接下来就该进入更真实的课程结构，而不是无限补更多单图。</p>
          </div>
          <div className="phase-list">
            <article className="phase-card">
              <p>把每道题的错因接到对应原型页，形成“做错就回看”的学习回路。</p>
            </article>
            <article className="phase-card">
              <p>把题目继续抽成更细的难度层级，开始形成基础题和进阶题。</p>
            </article>
            <article className="phase-card">
              <p>再决定哪些案例值得升级成更完整的 2.5D 动画推演或 3D 漫游场景。</p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
