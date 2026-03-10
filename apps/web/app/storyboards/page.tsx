import Link from "next/link";
import type { DiagramRecord, ModuleRecord } from "@medicine/content-schema";

import { getSiteContent } from "@/lib/content";

export default async function StoryboardsPage() {
  const { storyboards, diagrams, modules } = await getSiteContent();

  const diagramMap = new Map(diagrams.map((diagram) => [diagram.id, diagram]));
  const moduleMap = new Map(modules.map((module) => [module.id, module]));

  return (
    <main className="page-shell page-shell--storyboards">
      <section className="detail-hero">
        <div className="detail-hero__content">
          <p className="eyebrow">Storyboards</p>
          <h1>第一批重点图已经拆成可制作分镜。</h1>
          <p className="detail-hero__subtitle">
            这些不是灵感便签，而是能直接进入设计、动画、交互讨论的第一轮制作说明。
          </p>
          <p className="detail-hero__intro">
            每张图都定义了用户感受、讲解目标、场景顺序、交互动作、素材建议和成功标准。这样团队不会先陷在“画什么风格”里，而会先对齐“到底要让用户学会什么”。
          </p>
          <div className="hero__actions">
            <Link className="button button--primary" href="/">
              返回首页
            </Link>
            <Link className="button button--ghost" href="/modules/foundations">
              看模块页样例
            </Link>
          </div>
        </div>
        <div className="detail-hero__stats">
          <div className="hero-metric">
            <strong>{storyboards.length}</strong>
            <span>分镜稿</span>
          </div>
          <div className="hero-metric">
            <strong>{storyboards.reduce((sum, item) => sum + item.scenes.length, 0)}</strong>
            <span>场景节点</span>
          </div>
          <div className="hero-metric">
            <strong>3</strong>
            <span>最高优先级图</span>
          </div>
          <div className="hero-metric">
            <strong>MVP</strong>
            <span>适合先制作</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">Production Queue</p>
          <h2>按教学价值排序的第一轮图表</h2>
          <p>建议优先做“世界观入口 + 一眼看懂的动作图 + 高价值空间图”这三类组合。</p>
        </div>
        <div className="storyboard-grid">
          {storyboards.map((storyboard) => {
            const diagram = diagramMap.get(storyboard.diagramId) as DiagramRecord | undefined;
            const module = diagram ? (moduleMap.get(diagram.moduleId) as ModuleRecord | undefined) : undefined;

            return (
              <article className="storyboard-card" key={storyboard.id}>
                <div className="storyboard-card__top">
                  <div>
                    <p className="eyebrow">Storyboard</p>
                    <h2>{storyboard.title}</h2>
                  </div>
                  <div className="storyboard-card__meta">
                    <span>{diagram?.productionFormat ?? "unknown"}</span>
                    <span>{module?.title ?? "未分配模块"}</span>
                  </div>
                </div>

                <div className="storyboard-card__brief">
                  <p>
                    <strong>用户感受：</strong>
                    {storyboard.targetFeeling}
                  </p>
                  <p>
                    <strong>学习目标：</strong>
                    {storyboard.userGoal}
                  </p>
                </div>

                <div className="storyboard-scenes">
                  {storyboard.scenes.map((scene) => (
                    <article className="storyboard-scene" key={scene.id}>
                      <div className="storyboard-scene__top">
                        <h3>{scene.title}</h3>
                        <span>{scene.duration}</span>
                      </div>
                      <p>
                        <strong>画面：</strong>
                        {scene.visualFocus}
                      </p>
                      <p>
                        <strong>讲解：</strong>
                        {scene.narration}
                      </p>
                      <p>
                        <strong>交互：</strong>
                        {scene.interaction}
                      </p>
                    </article>
                  ))}
                </div>

                <div className="storyboard-lists">
                  <div>
                    <h3>关键交互</h3>
                    <ul>
                      {storyboard.interactionBeats.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3>素材说明</h3>
                    <ul>
                      {storyboard.assetNotes.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3>成功标准</h3>
                    <ul>
                      {storyboard.successCriteria.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
