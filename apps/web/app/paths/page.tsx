import Link from "next/link";

import { getSiteContent } from "@/lib/content";
import { getLearningPathHref } from "@/lib/learning-paths";

export default async function LearningPathsPage() {
  const { learningPaths } = await getSiteContent();

  return (
    <main className="page-shell page-shell--prototype">
      <section className="detail-hero">
        <div className="detail-hero__content">
          <p className="eyebrow">Paths</p>
          <h1>学习路线目录</h1>
          <p className="detail-hero__subtitle">把分散的模块、原型、练习和病例压成真正能走完的学习路径。</p>
          <p className="detail-hero__intro">
            当前这一步最重要的不是再补更多页面，而是把现有资产收拢成可体验、可复盘、可拿给别人直接试学
            的成品路径。这里放的就是这种“能走完”的路线。
          </p>
          <div className="hero__actions">
            <Link className="button button--primary" href="/">
              返回首页
            </Link>
            <Link className="button button--ghost" href="/progress">
              查看学习进度
            </Link>
          </div>
        </div>
        <div className="detail-hero__stats">
          <div className="hero-metric">
            <strong>{learningPaths.length}</strong>
            <span>学习路线</span>
          </div>
          <div className="hero-metric">
            <strong>{learningPaths.reduce((count, path) => count + path.steps.length, 0)}</strong>
            <span>总步骤</span>
          </div>
          <div className="hero-metric">
            <strong>1st</strong>
            <span>成品闭环</span>
          </div>
          <div className="hero-metric">
            <strong>MVP</strong>
            <span>可试学路径</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">Path Atlas</p>
          <h2>当前可直接体验的路线</h2>
          <p>先从一条高密度闭环路线开始，验证用户能不能顺着完整路径学完，而不是在页面之间迷路。</p>
        </div>
        <div className="atlas-grid">
          {learningPaths.map((path) => (
            <article className="atlas-card" key={path.id}>
              <div className="atlas-card__top">
                <div>
                  <p className="eyebrow">Learning Path</p>
                  <h2>{path.title}</h2>
                </div>
                <div className="atlas-card__meta">
                  <span>{path.steps.length} 步</span>
                  <span>{path.estimatedTime}</span>
                </div>
              </div>
              <p>{path.subtitle}</p>
              <p className="atlas-card__idea">{path.summary}</p>
              <div className="token-row">
                {path.steps.slice(0, 4).map((step) => (
                  <span className="token token--light" key={step.id}>
                    {step.title}
                  </span>
                ))}
              </div>
              <div className="atlas-card__actions">
                <Link className="button button--ghost" href={getLearningPathHref(path.id)}>
                  打开这条路线
                </Link>
                <Link className="button button--ghost" href="/progress">
                  查看路线进度
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
