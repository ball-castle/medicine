import Link from "next/link";
import type { DiagramRecord, ModuleRecord, StoryboardRecord } from "@medicine/content-schema";

import { getSiteContent } from "@/lib/content";

function DiagramAtlasCard(props: {
  diagram: DiagramRecord;
  module: ModuleRecord;
  storyboard: StoryboardRecord | null;
}) {
  return (
    <article className="atlas-card">
      <div className="atlas-card__top">
        <div>
          <p className="eyebrow">Diagram</p>
          <h2>{props.diagram.title}</h2>
        </div>
        <div className="atlas-card__meta">
          <span>{props.diagram.productionFormat}</span>
          <span>{props.diagram.visualPriority}</span>
        </div>
      </div>
      <p>{props.diagram.purpose}</p>
      <p className="atlas-card__idea">{props.diagram.interactionIdea}</p>
      <div className="token-row">
        <span className="token">{props.module.title}</span>
        <span className="token token--light">{props.diagram.chapter}</span>
        {props.storyboard && <span className="token">已有分镜</span>}
        {props.diagram.prototypeHref && <span className="token">已有原型</span>}
      </div>
      <div className="atlas-card__actions">
        <Link className="button button--ghost" href={`/modules/${props.module.id}`}>
          回到模块
        </Link>
        {props.diagram.prototypeHref && (
          <Link className="button button--ghost" href={props.diagram.prototypeHref}>
            打开原型
          </Link>
        )}
        {props.storyboard && (
          <Link className="button button--ghost" href="/storyboards">
            查看分镜
          </Link>
        )}
      </div>
    </article>
  );
}

export default async function DiagramsPage() {
  const { diagrams, modules, storyboards } = await getSiteContent();

  const diagramsByModule = modules.map((module) => ({
    module,
    diagrams: diagrams.filter((diagram) => diagram.moduleId === module.id),
  }));
  const storyboardMap = new Map(storyboards.map((storyboard) => [storyboard.diagramId, storyboard]));

  return (
    <main className="page-shell page-shell--storyboards">
      <section className="detail-hero">
        <div className="detail-hero__content">
          <p className="eyebrow">Diagrams</p>
          <h1>图表目录页</h1>
          <p className="detail-hero__subtitle">把重点图表、模块归属、原型入口和分镜状态放进同一页。</p>
          <p className="detail-hero__intro">
            这个页面的任务不是展示“有多少图”，而是让图表真正成为课程和练习的中间层。后面继续补图时，也应该先从这里登记，而不是直接散落到各个页面。
          </p>
          <div className="hero__actions">
            <Link className="button button--primary" href="/">
              返回首页
            </Link>
            <Link className="button button--ghost" href="/storyboards">
              查看分镜页
            </Link>
            <Link className="button button--ghost" href="/progress">
              查看学习进度
            </Link>
          </div>
        </div>
        <div className="detail-hero__stats">
          <div className="hero-metric">
            <strong>{diagrams.length}</strong>
            <span>图表总数</span>
          </div>
          <div className="hero-metric">
            <strong>{diagrams.filter((diagram) => diagram.prototypeHref).length}</strong>
            <span>已有原型</span>
          </div>
          <div className="hero-metric">
            <strong>{storyboards.length}</strong>
            <span>已有分镜</span>
          </div>
          <div className="hero-metric">
            <strong>{modules.length}</strong>
            <span>覆盖模块</span>
          </div>
        </div>
      </section>

      {diagramsByModule.map(({ module, diagrams: moduleDiagrams }) => (
        <section className="section" key={module.id}>
          <div className="section-heading">
            <p className="eyebrow">Module Atlas</p>
            <h2>{module.title}</h2>
            <p>{module.visualFocus}</p>
          </div>
          <div className="atlas-grid">
            {moduleDiagrams.map((diagram) => (
              <DiagramAtlasCard
                diagram={diagram}
                key={diagram.id}
                module={module}
                storyboard={(storyboardMap.get(diagram.id) as StoryboardRecord | undefined) ?? null}
              />
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
