import type { ConceptRecord, DiagramRecord, ModuleRecord } from "@medicine/content-schema";

import { getSiteContent } from "@/lib/content";

function SectionTitle(props: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="section-heading">
      <p className="eyebrow">{props.eyebrow}</p>
      <h2>{props.title}</h2>
      <p>{props.description}</p>
    </div>
  );
}

function ModuleCard(props: {
  module: ModuleRecord;
  concepts: ConceptRecord[];
  diagrams: DiagramRecord[];
}) {
  return (
    <article className="module-card">
      <div className="module-card__top">
        <p className="module-card__eyebrow">Learning Module</p>
        <h3>{props.module.title}</h3>
        <p>{props.module.premise}</p>
      </div>
      <div className="module-card__meta">
        <span>{props.concepts.length} 个知识点</span>
        <span>{props.diagrams.length} 张重点图</span>
      </div>
      <p className="module-card__outcome">{props.module.targetOutcome}</p>
      <div className="token-row">
        {props.concepts.slice(0, 4).map((concept) => (
          <span className="token" key={concept.id}>
            {concept.title}
          </span>
        ))}
      </div>
    </article>
  );
}

function DiagramCard(props: { diagram: DiagramRecord }) {
  return (
    <article className="diagram-card">
      <div className="diagram-card__badge">{props.diagram.productionFormat}</div>
      <h3>{props.diagram.title}</h3>
      <p>{props.diagram.purpose}</p>
      <p className="diagram-card__idea">{props.diagram.interactionIdea}</p>
    </article>
  );
}

export default async function HomePage() {
  const { books, concepts, diagrams, modules, phases } = await getSiteContent();

  const conceptMap = new Map(concepts.map((concept) => [concept.id, concept]));
  const diagramMap = new Map(diagrams.map((diagram) => [diagram.id, diagram]));

  const featuredConcepts = concepts.filter((concept) => concept.tier === "foundation").slice(0, 6);
  const featuredDiagrams = diagrams.filter((diagram) => diagram.visualPriority === "high").slice(0, 6);

  return (
    <main className="page-shell">
      <section className="hero">
        <div className="hero__content">
          <p className="eyebrow">TCM Learning Product</p>
          <h1>把两本流派中医书，做成大众能看懂、能反复学、能玩着学的学习平台。</h1>
          <p className="hero__summary">
            第一版不是做大游戏，而是先做一个以动态图表、学习地图和少量高质量 3D
            场景为核心的 Web 产品。内容已经拆成可继续生产的结构化底盘。
          </p>
          <div className="hero__actions">
            <a className="button button--primary" href="#modules">
              看模块结构
            </a>
            <a className="button button--ghost" href="#diagrams">
              看图表优先级
            </a>
          </div>
        </div>
        <div className="hero__panel">
          <div className="hero-metric">
            <strong>{books.length}</strong>
            <span>核心书目</span>
          </div>
          <div className="hero-metric">
            <strong>{concepts.length}</strong>
            <span>结构化知识点</span>
          </div>
          <div className="hero-metric">
            <strong>{diagrams.length}</strong>
            <span>优先重绘图表</span>
          </div>
          <div className="hero-metric">
            <strong>{modules.length}</strong>
            <span>学习模块</span>
          </div>
        </div>
      </section>

      <section className="tracks">
        <div className="track">
          <p className="track__index">01</p>
          <h3>动态课程</h3>
          <p>把重理论内容拆成短模块，先教用户看结构，再让他们记细节。</p>
        </div>
        <div className="track">
          <p className="track__index">02</p>
          <h3>图表交互化</h3>
          <p>把原书里最难啃的图表重构成可点击、可播放、可切层的图谱。</p>
        </div>
        <div className="track">
          <p className="track__index">03</p>
          <h3>选择性 3D</h3>
          <p>只把圆运动、坎离水火、厥阴逆冲这些空间感最强的概念做成沉浸式场景。</p>
        </div>
      </section>

      <section className="callout">
        <p className="eyebrow">Current Product Stance</p>
        <h2>先做学习产品，再逐步长成“会动的中医世界”。</h2>
        <p>
          现在最大的瓶颈不是技术，而是如何把抽象、流派化、术语密集的内容拆成大众能吸收的学习路径。
          所以第一版的架构应该优先保证内容可维护、图表可重绘、模块可复用。
        </p>
      </section>

      <section className="section" id="modules">
        <SectionTitle
          eyebrow="Modules"
          title="学习地图"
          description="先把复杂内容拆成 6 个模块，每个模块都有明确的学习结果、图表方向和后续互动空间。"
        />
        <div className="module-grid">
          {modules.map((module) => (
            <ModuleCard
              key={module.id}
              module={module}
              concepts={module.conceptIds.map((id) => conceptMap.get(id)).filter(Boolean) as ConceptRecord[]}
              diagrams={module.diagramIds.map((id) => diagramMap.get(id)).filter(Boolean) as DiagramRecord[]}
            />
          ))}
        </div>
      </section>

      <section className="section section--split">
        <div>
          <SectionTitle
            eyebrow="Concepts"
            title="第一批最值得做成产品的知识点"
            description="先做底层语言，再做玩法。下面这些是最适合转成动态解释和轻练习的起手概念。"
          />
          <div className="concept-list">
            {featuredConcepts.map((concept) => (
              <article className="concept-card" key={concept.id}>
                <div className="concept-card__meta">
                  <span>{concept.visualType}</span>
                  <span>{concept.chapter}</span>
                </div>
                <h3>{concept.title}</h3>
                <p>{concept.plainExplanation}</p>
                <div className="token-row">
                  {concept.keywords.map((keyword) => (
                    <span className="token token--light" key={keyword}>
                      {keyword}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
        <div className="blueprint">
          <p className="eyebrow">MVP Blueprint</p>
          <h2>首个样例建议</h2>
          <ol>
            <li>圆运动基础模块</li>
            <li>圆运动总图</li>
            <li>坎离水火交通图</li>
            <li>方剂方向罗盘小练习</li>
          </ol>
          <p>
            这个组合能同时验证内容结构、图表重绘、动效表达和未来的游戏化方向。
          </p>
        </div>
      </section>

      <section className="section" id="diagrams">
        <SectionTitle
          eyebrow="Diagrams"
          title="优先重绘的图表"
          description="不要直接搬运扫描图，应该把教学目的、交互动作和输出格式一起定义清楚。"
        />
        <div className="diagram-grid">
          {featuredDiagrams.map((diagram) => (
            <DiagramCard key={diagram.id} diagram={diagram} />
          ))}
        </div>
      </section>

      <section className="section section--split">
        <div>
          <SectionTitle
            eyebrow="Books"
            title="内容来源"
            description="两本书各自承担不同角色：一本负责搭骨架，一本负责把扶阳主线具体化。"
          />
          <div className="book-grid">
            {books.map((book) => (
              <article className="book-card" key={book.id}>
                <p className="book-card__short">{book.shortTitle}</p>
                <h3>{book.title}</h3>
                <p>{book.focus}</p>
                <dl>
                  <div>
                    <dt>适合谁</dt>
                    <dd>{book.audience}</dd>
                  </div>
                  <div>
                    <dt>来源文件</dt>
                    <dd>{book.sourcePdf}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </div>
        <div>
          <SectionTitle
            eyebrow="Roadmap"
            title="开发路线"
            description="先定内容底盘，再做 MVP，最后才逐步加深沉浸感和游戏化。"
          />
          <div className="phase-list">
            {phases.map((phase) => (
              <article className="phase-card" key={phase.id}>
                <div className="phase-card__top">
                  <h3>{phase.title}</h3>
                  <span>{phase.duration}</span>
                </div>
                <p>{phase.goal}</p>
                <div className="token-row">
                  {phase.deliverables.map((item) => (
                    <span className="token" key={item}>
                      {item}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
