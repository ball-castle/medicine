import Link from "next/link";

import { CaseStageTimelinePrototype } from "@/components/case-stage-timeline-prototype";
import { getSiteContent } from "@/lib/content";

export default async function CaseStageTimelinePrototypePage() {
  const { caseStudies } = await getSiteContent();
  const totalStages = caseStudies.reduce((count, caseStudy) => count + caseStudy.stages.length, 0);

  return (
    <main className="page-shell page-shell--prototype">
      <section className="detail-hero">
        <div className="detail-hero__content">
          <p className="eyebrow">Prototype</p>
          <h1>医案分阶段时间线原型</h1>
          <p className="detail-hero__subtitle">把病例里的定主轴、分阶段、转方和排错理由放进同一条时间线。</p>
          <p className="detail-hero__intro">
            这个页面不是在替代完整病例播放器，而是在验证更核心的一层: 用户能不能看懂为什么同一个病例
            走到不同阶段，主轴、动作和排错逻辑都会跟着变。
          </p>
          <div className="hero__actions">
            <Link className="button button--primary" href="/modules/cases-and-application">
              返回医案模块
            </Link>
            <Link className="button button--ghost" href="/cases">
              打开病例目录
            </Link>
            <Link className="button button--ghost" href="/practice/cases-stage-rhythm-basic">
              打开医案练习
            </Link>
          </div>
        </div>
        <div className="detail-hero__stats">
          <div className="hero-metric">
            <strong>{caseStudies.length}</strong>
            <span>病例样本</span>
          </div>
          <div className="hero-metric">
            <strong>{totalStages}</strong>
            <span>阶段节点</span>
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

      <CaseStageTimelinePrototype caseStudies={caseStudies} />
    </main>
  );
}
