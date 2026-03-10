import Link from "next/link";
import { notFound } from "next/navigation";
import type {
  ConceptRecord,
  DiagramRecord,
  ModuleDetailRecord,
  ModuleRecord,
  StoryboardRecord,
} from "@medicine/content-schema";

import { CircleFlowPrototype } from "@/components/circle-flow-prototype";
import { FuziRootPrototype } from "@/components/fuzi-root-prototype";
import { GuizhiGatePrototype } from "@/components/guizhi-gate-prototype";
import { KanLiPrototype } from "@/components/kan-li-prototype";
import { getSiteContent } from "@/lib/content";

function pickModuleContent(
  module: ModuleRecord,
  concepts: ConceptRecord[],
  diagrams: DiagramRecord[],
  moduleDetails: ModuleDetailRecord[],
  storyboards: StoryboardRecord[],
) {
  const conceptMap = new Map(concepts.map((concept) => [concept.id, concept]));
  const diagramMap = new Map(diagrams.map((diagram) => [diagram.id, diagram]));

  const moduleConcepts = module.conceptIds
    .map((conceptId) => conceptMap.get(conceptId))
    .filter(Boolean) as ConceptRecord[];
  const moduleDiagrams = module.diagramIds
    .map((diagramId) => diagramMap.get(diagramId))
    .filter(Boolean) as DiagramRecord[];
  const moduleDetail = moduleDetails.find((detail) => detail.moduleId === module.id) ?? null;
  const moduleStoryboards = storyboards.filter((storyboard) =>
    moduleDiagrams.some((diagram) => diagram.id === storyboard.diagramId),
  );

  return { moduleConcepts, moduleDiagrams, moduleDetail, moduleStoryboards };
}

export async function generateStaticParams() {
  const { modules } = await getSiteContent();
  return modules.map((module) => ({ moduleId: module.id }));
}

export default async function ModulePage(props: {
  params: Promise<{ moduleId: string }>;
}) {
  const { moduleId } = await props.params;
  const { modules, concepts, diagrams, moduleDetails, storyboards } = await getSiteContent();

  const module = modules.find((item) => item.id === moduleId);
  if (!module) {
    notFound();
  }

  const { moduleConcepts, moduleDiagrams, moduleDetail, moduleStoryboards } = pickModuleContent(
    module,
    concepts,
    diagrams,
    moduleDetails,
    storyboards,
  );

  const relatedModules = moduleDetail
    ? moduleDetail.nextModuleIds
        .map((id) => modules.find((item) => item.id === id))
        .filter(Boolean) as ModuleRecord[]
    : [];

  return (
    <main className="page-shell page-shell--module">
      <section className="detail-hero">
        <div className="detail-hero__content">
          <p className="eyebrow">Module</p>
          <h1>{module.title}</h1>
          <p className="detail-hero__subtitle">{moduleDetail?.subtitle ?? module.premise}</p>
          <p className="detail-hero__intro">{moduleDetail?.intro ?? module.targetOutcome}</p>
          <div className="hero__actions">
            <Link className="button button--primary" href="/">
              返回学习地图
            </Link>
            <Link className="button button--ghost" href="/storyboards">
              看分镜页
            </Link>
          </div>
        </div>
        <div className="detail-hero__stats">
          <div className="hero-metric">
            <strong>{moduleConcepts.length}</strong>
            <span>知识点</span>
          </div>
          <div className="hero-metric">
            <strong>{moduleDiagrams.length}</strong>
            <span>重点图表</span>
          </div>
          <div className="hero-metric">
            <strong>{moduleStoryboards.length}</strong>
            <span>可直接制作的分镜</span>
          </div>
          <div className="hero-metric">
            <strong>{moduleDetail?.estimatedDuration ?? "10-15 分钟"}</strong>
            <span>推荐学习时长</span>
          </div>
        </div>
      </section>

      <section className="section section--split">
        <div>
          <div className="section-heading">
            <p className="eyebrow">Premise</p>
            <h2>这个模块到底要教会什么</h2>
            <p>{module.targetOutcome}</p>
          </div>
          <div className="token-row">
            {moduleConcepts.map((concept) => (
              <span className="token" key={concept.id}>
                {concept.title}
              </span>
            ))}
          </div>
        </div>
        <div className="blueprint">
          <p className="eyebrow">Questions</p>
          <h2>建议用这些问题带用户进入</h2>
          <ol>
            {(moduleDetail?.learningQuestions ?? [module.premise, module.targetOutcome]).map((question) => (
              <li key={question}>{question}</li>
            ))}
          </ol>
        </div>
      </section>

      {module.id === "foundations" && (
        <section className="section">
          <div className="section-heading">
            <p className="eyebrow">Interactive Prototype</p>
            <h2>第一张真正可玩的图已经接进来了</h2>
            <p>
              这张原型用来验证一个关键问题：用户能不能通过切换时令、观察中轴强弱和对比失衡模式，
              真正把“圆运动”理解成可感知的整体结构。
            </p>
          </div>
          <CircleFlowPrototype />
          <div className="section-linkout">
            <Link className="button button--ghost" href="/prototypes/circle-flow-map">
              打开独立原型页
            </Link>
          </div>
        </section>
      )}

      {module.id === "fu-yang-core" && (
        <>
          <section className="section">
            <div className="section-heading">
              <p className="eyebrow">Interactive Prototype</p>
              <h2>扶阳模块的核心结构图已经能直接体验</h2>
              <p>
                这张原型先把“坎离水火”“上下交通”“表面热象”和“归根”放进同一张画面里，
                让用户先理解结构，再进入具体动作差异。
              </p>
            </div>
            <KanLiPrototype />
            <div className="section-linkout">
              <Link className="button button--ghost" href="/prototypes/kan-li-circulation">
                打开坎离独立原型页
              </Link>
            </div>
          </section>

          <section className="section">
            <div className="section-heading">
              <p className="eyebrow">Action Prototype</p>
              <h2>桂枝法的“开门拨机”也已经被做成动作原型</h2>
              <p>
                这一张图专门负责把“门没打开”和“把门拨开”讲清楚。它不是补充说明，而是扶阳模块里
                最需要一眼看懂的动作图之一。
              </p>
            </div>
            <GuizhiGatePrototype />
            <div className="section-linkout">
              <Link className="button button--ghost" href="/prototypes/guizhi-gate-animation">
                打开桂枝独立原型页
              </Link>
            </div>
          </section>

          <section className="section">
            <div className="section-heading">
              <p className="eyebrow">Return Prototype</p>
              <h2>附子法的“归根回阳”也已经被做成动作原型</h2>
              <p>
                这一张图专门负责把“浮散无根”和“收回归根”讲清楚。它和桂枝法不是同一类动作，
                必须让用户在视觉上直接看到一个是开门，一个是归根。
              </p>
            </div>
            <FuziRootPrototype />
            <div className="section-linkout">
              <Link className="button button--ghost" href="/prototypes/fuzi-root-return">
                打开附子独立原型页
              </Link>
            </div>
          </section>
        </>
      )}

      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">Course Flow</p>
          <h2>课程结构</h2>
          <p>先从直觉上看懂结构，再进入术语和动作逻辑，这样最适合大众学习。</p>
        </div>
        <div className="lesson-grid">
          {(moduleDetail?.sections ?? []).map((section) => {
            const anchorConcepts = section.anchorConceptIds
              .map((conceptId) => moduleConcepts.find((concept) => concept.id === conceptId))
              .filter(Boolean) as ConceptRecord[];
            const anchorDiagrams = section.anchorDiagramIds
              .map((diagramId) => moduleDiagrams.find((diagram) => diagram.id === diagramId))
              .filter(Boolean) as DiagramRecord[];

            return (
              <article className="lesson-card" key={section.id}>
                <p className="lesson-card__index">{section.id}</p>
                <h3>{section.title}</h3>
                <p className="lesson-card__summary">{section.summary}</p>
                <p>{section.body}</p>
                <div className="token-row">
                  {anchorConcepts.map((concept) => (
                    <span className="token token--light" key={concept.id}>
                      {concept.title}
                    </span>
                  ))}
                  {anchorDiagrams.map((diagram) => (
                    <span className="token" key={diagram.id}>
                      {diagram.title}
                    </span>
                  ))}
                </div>
              </article>
            );
          })}
          {!moduleDetail && (
            <article className="lesson-card">
              <p className="lesson-card__summary">
                这个模块已经有结构化知识点和图表，但还没有写成完整课程脚本。
              </p>
              <p>
                下一步最合适的动作，是把当前模块按“概念解释 - 图表动作 - 小练习”拆成 2 到 3 个短章节。
              </p>
            </article>
          )}
        </div>
      </section>

      <section className="section section--split">
        <div>
          <div className="section-heading">
            <p className="eyebrow">Concepts</p>
            <h2>知识点卡片</h2>
            <p>每个概念都已经拆成适合解释和可视化的最小单位。</p>
          </div>
          <div className="concept-list">
            {moduleConcepts.map((concept) => (
              <article className="concept-card" key={concept.id}>
                <div className="concept-card__meta">
                  <span>{concept.visualType}</span>
                  <span>{concept.chapter}</span>
                </div>
                <h3>{concept.title}</h3>
                <p>{concept.plainExplanation}</p>
                <p className="concept-card__why">{concept.whyItMatters}</p>
              </article>
            ))}
          </div>
        </div>
        <div>
          <div className="section-heading">
            <p className="eyebrow">Diagrams</p>
            <h2>图表与表现形式</h2>
            <p>这里决定的是每个概念更适合 2D、2.5D 还是 3D，而不是先做炫技。</p>
          </div>
          <div className="diagram-stack">
            {moduleDiagrams.map((diagram) => {
              const storyboard = moduleStoryboards.find((item) => item.diagramId === diagram.id) ?? null;

              return (
                <article className="diagram-detail-card" key={diagram.id}>
                  <div className="diagram-card__badge">{diagram.productionFormat}</div>
                  <h3>{diagram.title}</h3>
                  <p>{diagram.purpose}</p>
                  <p className="diagram-card__idea">{diagram.interactionIdea}</p>
                  {storyboard && (
                    <p className="diagram-detail-card__storyboard">
                      已有分镜：{storyboard.scenes.length} 个场景，可直接进入设计讨论。
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section section--split">
        <div>
          <div className="section-heading">
            <p className="eyebrow">Exercises</p>
            <h2>适合先做的小练习</h2>
            <p>先做判断和对比类练习，不急着上复杂游戏规则。</p>
          </div>
          <div className="phase-list">
            {(moduleDetail?.exerciseIdeas ?? []).map((exercise) => (
              <article className="phase-card" key={exercise}>
                <p>{exercise}</p>
              </article>
            ))}
          </div>
        </div>
        <div>
          <div className="section-heading">
            <p className="eyebrow">Next</p>
            <h2>建议接着学什么</h2>
            <p>这能直接决定后续的模块连接和首页学习路径设计。</p>
          </div>
          <div className="module-grid module-grid--single">
            {relatedModules.map((relatedModule) => (
              <Link className="module-card module-card--link" href={`/modules/${relatedModule.id}`} key={relatedModule.id}>
                <div className="module-card__top">
                  <p className="module-card__eyebrow">Next Module</p>
                  <h3>{relatedModule.title}</h3>
                  <p>{relatedModule.premise}</p>
                </div>
                <p className="module-card__outcome">{relatedModule.targetOutcome}</p>
              </Link>
            ))}
            {!relatedModules.length && (
              <article className="phase-card">
                <p>这个模块的后续路径还没细化，当前建议从首页继续回到全局学习地图。</p>
              </article>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
