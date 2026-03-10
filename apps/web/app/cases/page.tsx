import Link from "next/link";
import type { ConceptRecord, DiagramRecord, ModuleRecord } from "@medicine/content-schema";

import { getCaseStudyHref } from "@/lib/cases";
import { getSiteContent } from "@/lib/content";

function CaseAtlasCard(props: {
  caseStudy: {
    id: string;
    title: string;
    subtitle: string;
    summary: string;
    targetSkill: string;
    estimatedTime: string;
    stages: number;
    concepts: ConceptRecord[];
    diagrams: DiagramRecord[];
  };
  module: ModuleRecord;
}) {
  return (
    <article className="atlas-card">
      <div className="atlas-card__top">
        <div>
          <p className="eyebrow">Case Study</p>
          <h2>{props.caseStudy.title}</h2>
        </div>
        <div className="atlas-card__meta">
          <span>{props.caseStudy.stages} 个阶段</span>
          <span>{props.caseStudy.estimatedTime}</span>
        </div>
      </div>
      <p>{props.caseStudy.subtitle}</p>
      <p className="atlas-card__idea">{props.caseStudy.summary}</p>
      <div className="token-row">
        <span className="token">{props.module.title}</span>
        {props.caseStudy.concepts.slice(0, 3).map((concept) => (
          <span className="token token--light" key={concept.id}>
            {concept.title}
          </span>
        ))}
        {props.caseStudy.diagrams.slice(0, 2).map((diagram) => (
          <span className="token token--light" key={diagram.id}>
            {diagram.title}
          </span>
        ))}
      </div>
      <div className="atlas-card__actions">
        <Link className="button button--ghost" href={getCaseStudyHref(props.caseStudy.id)}>
          打开病例推演
        </Link>
        <Link className="button button--ghost" href={`/modules/${props.module.id}`}>
          回到模块
        </Link>
      </div>
    </article>
  );
}

export default async function CasesPage() {
  const { caseStudies, concepts, diagrams, modules } = await getSiteContent();

  const moduleMap = new Map(modules.map((module) => [module.id, module]));
  const conceptMap = new Map(concepts.map((concept) => [concept.id, concept]));
  const diagramMap = new Map(diagrams.map((diagram) => [diagram.id, diagram]));

  const enrichedCases = caseStudies.map((caseStudy) => ({
    ...caseStudy,
    stages: caseStudy.stages.length,
    concepts: caseStudy.focusConceptIds
      .map((conceptId) => conceptMap.get(conceptId))
      .filter(Boolean) as ConceptRecord[],
    diagrams: caseStudy.focusDiagramIds
      .map((diagramId) => diagramMap.get(diagramId))
      .filter(Boolean) as DiagramRecord[],
    module: moduleMap.get(caseStudy.moduleId) ?? null,
  }));

  return (
    <main className="page-shell page-shell--prototype">
      <section className="detail-hero">
        <div className="detail-hero__content">
          <p className="eyebrow">Cases</p>
          <h1>病例推演目录</h1>
          <p className="detail-hero__subtitle">把“先后手、节奏、转方逻辑”做成可走的互动病例，而不是只留在文字说明里。</p>
          <p className="detail-hero__intro">
            这里的目标不是替代真实临床，而是把两本书里最难学的一层能力拆出来训练：
            看主轴、分阶段、判断当前更该往哪一步走。
          </p>
          <div className="hero__actions">
            <Link className="button button--primary" href="/">
              返回首页
            </Link>
            <Link className="button button--ghost" href="/modules/cases-and-application">
              打开医案模块
            </Link>
            <Link className="button button--ghost" href="/progress">
              查看学习进度
            </Link>
          </div>
        </div>
        <div className="detail-hero__stats">
          <div className="hero-metric">
            <strong>{caseStudies.length}</strong>
            <span>病例推演</span>
          </div>
          <div className="hero-metric">
            <strong>{caseStudies.reduce((sum, item) => sum + item.stages.length, 0)}</strong>
            <span>阶段节点</span>
          </div>
          <div className="hero-metric">
            <strong>{new Set(caseStudies.flatMap((item) => item.focusConceptIds)).size}</strong>
            <span>覆盖概念</span>
          </div>
          <div className="hero-metric">
            <strong>MVP</strong>
            <span>病例学习链</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">Case Atlas</p>
          <h2>第一组可直接体验的病例</h2>
          <p>先从少量高密度病例开始，重点验证用户能不能跟着时间线看见主轴转换，而不是背一个静态答案。</p>
        </div>
        <div className="atlas-grid">
          {enrichedCases.map((caseStudy) =>
            caseStudy.module ? (
              <CaseAtlasCard caseStudy={caseStudy} key={caseStudy.id} module={caseStudy.module} />
            ) : null,
          )}
        </div>
      </section>
    </main>
  );
}
