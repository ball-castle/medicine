import Link from "next/link";
import { notFound } from "next/navigation";
import type { BookRecord, ConceptRecord, DiagramRecord } from "@medicine/content-schema";

import { CaseStudyPlayer } from "@/components/case-study-player";
import { getCaseStudyHref } from "@/lib/cases";
import { getSiteContent } from "@/lib/content";

export async function generateStaticParams() {
  const { caseStudies } = await getSiteContent();
  return caseStudies.map((caseStudy) => ({ caseStudyId: caseStudy.id }));
}

export default async function CaseStudyPage(props: {
  params: Promise<{ caseStudyId: string }>;
}) {
  const { caseStudyId } = await props.params;
  const { books, caseStudies, concepts, diagrams, modules } = await getSiteContent();

  const caseStudy = caseStudies.find((item) => item.id === caseStudyId);
  if (!caseStudy) {
    notFound();
  }

  const module = modules.find((item) => item.id === caseStudy.moduleId) ?? null;
  const bookMap = new Map(books.map((book) => [book.id, book]));
  const conceptMap = new Map(concepts.map((concept) => [concept.id, concept]));
  const diagramMap = new Map(diagrams.map((diagram) => [diagram.id, diagram]));

  const focusBooks = caseStudy.bookIds
    .map((bookId) => bookMap.get(bookId))
    .filter(Boolean) as BookRecord[];
  const focusConcepts = caseStudy.focusConceptIds
    .map((conceptId) => conceptMap.get(conceptId))
    .filter(Boolean) as ConceptRecord[];
  const focusDiagrams = caseStudy.focusDiagramIds
    .map((diagramId) => diagramMap.get(diagramId))
    .filter(Boolean) as DiagramRecord[];
  const siblingCases = caseStudies.filter((item) => item.id !== caseStudy.id);

  return (
    <main className="page-shell page-shell--prototype">
      <section className="detail-hero">
        <div className="detail-hero__content">
          <p className="eyebrow">Case Study</p>
          <h1>{caseStudy.title}</h1>
          <p className="detail-hero__subtitle">{caseStudy.subtitle}</p>
          <p className="detail-hero__intro">{caseStudy.summary}</p>
          <div className="hero__actions">
            <Link className="button button--primary" href="/cases">
              返回病例目录
            </Link>
            {module && (
              <Link className="button button--ghost" href={`/modules/${module.id}`}>
                回到 {module.title}
              </Link>
            )}
            <Link className="button button--ghost" href="/diagrams">
              查看相关图表
            </Link>
          </div>
        </div>
        <div className="detail-hero__stats">
          <div className="hero-metric">
            <strong>{caseStudy.stages.length}</strong>
            <span>阶段节点</span>
          </div>
          <div className="hero-metric">
            <strong>{focusConcepts.length}</strong>
            <span>锚点概念</span>
          </div>
          <div className="hero-metric">
            <strong>{focusDiagrams.length}</strong>
            <span>回看图表</span>
          </div>
          <div className="hero-metric">
            <strong>{caseStudy.estimatedTime}</strong>
            <span>建议时长</span>
          </div>
        </div>
      </section>

      <CaseStudyPlayer caseStudy={caseStudy} />

      <section className="section section--split">
        <div>
          <div className="section-heading">
            <p className="eyebrow">Focus</p>
            <h2>这组病例在练什么</h2>
            <p>{caseStudy.targetSkill}</p>
          </div>
          <div className="token-row">
            {focusConcepts.map((concept) => (
              <span className="token" key={concept.id}>
                {concept.title}
              </span>
            ))}
            {focusDiagrams.map((diagram) => (
              <span className="token token--light" key={diagram.id}>
                {diagram.title}
              </span>
            ))}
          </div>
          <div className="phase-list">
            {focusBooks.map((book) => (
              <article className="phase-card" key={book.id}>
                <div className="phase-card__top">
                  <h3>{book.shortTitle}</h3>
                  <span>{book.author}</span>
                </div>
                <p>{book.focus}</p>
              </article>
            ))}
          </div>
        </div>
        <div>
          <div className="section-heading">
            <p className="eyebrow">Next</p>
            <h2>看完这组病例后接着去哪</h2>
            <p>当前病例不是孤立页面，它应该把用户重新带回模块、图表和下一组病例里。</p>
          </div>
          <div className="phase-list">
            {module && (
              <article className="phase-card">
                <div className="phase-card__top">
                  <h3>{module.title}</h3>
                  <span>所属模块</span>
                </div>
                <p>{module.targetOutcome}</p>
                <div className="atlas-card__actions">
                  <Link className="button button--ghost" href={`/modules/${module.id}`}>
                    回到模块
                  </Link>
                </div>
              </article>
            )}
            {siblingCases.slice(0, 2).map((item) => (
              <article className="phase-card" key={item.id}>
                <div className="phase-card__top">
                  <h3>{item.title}</h3>
                  <span>{item.stages.length} 阶段</span>
                </div>
                <p>{item.summary}</p>
                <div className="atlas-card__actions">
                  <Link className="button button--ghost" href={getCaseStudyHref(item.id)}>
                    打开这组病例
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
