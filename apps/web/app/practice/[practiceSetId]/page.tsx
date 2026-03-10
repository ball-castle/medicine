import Link from "next/link";
import { notFound } from "next/navigation";

import { PracticeSetPlayer } from "@/components/fu-yang-triage-practice";
import { getSiteContent } from "@/lib/content";

export async function generateStaticParams() {
  const { practiceSets } = await getSiteContent();
  return practiceSets.map((practiceSet) => ({ practiceSetId: practiceSet.id }));
}

export default async function PracticeSetPage(props: {
  params: Promise<{ practiceSetId: string }>;
}) {
  const { practiceSetId } = await props.params;
  const { practiceSets, modules } = await getSiteContent();
  const practiceSet = practiceSets.find((item) => item.id === practiceSetId);

  if (!practiceSet) {
    notFound();
  }

  const module = modules.find((item) => item.id === practiceSet.moduleId) ?? null;

  return (
    <main className="page-shell page-shell--prototype">
      <section className="detail-hero">
        <div className="detail-hero__content">
          <p className="eyebrow">Practice</p>
          <h1>{practiceSet.title}</h1>
          <p className="detail-hero__subtitle">{practiceSet.subtitle}</p>
          <p className="detail-hero__intro">
            这个页面把相关模块的核心判断压成 {practiceSet.cases.length} 个短案例，让用户从“看图懂了”继续推进到“自己能分流、能回看、能复习”。
          </p>
          <div className="hero__actions">
            <Link className="button button--primary" href={module ? `/modules/${module.id}` : "/"}>
              {module ? `返回 ${module.id} 模块` : "返回首页"}
            </Link>
            <Link className="button button--ghost" href="/progress">
              查看学习进度
            </Link>
            <Link className="button button--ghost" href="/diagrams">
              查看图表目录
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
            <strong>{module?.title ?? "Practice"}</strong>
            <span>所属模块</span>
          </div>
        </div>
      </section>

      <PracticeSetPlayer practiceSet={practiceSet} />

      <section className="section section--split">
        <div>
          <div className="section-heading">
            <p className="eyebrow">What To Validate</p>
            <h2>这组练习当前主要验证什么</h2>
            <p>它主要验证用户是否能把模块里的图形直觉，转成真正的结构判断和回看路径。</p>
          </div>
          <div className="phase-list">
            <article className="phase-card">
              <p>用户是否会先看问题类型和方向，再做选择，而不是按熟悉词汇乱猜。</p>
            </article>
            <article className="phase-card">
              <p>错题提示和回看建议，是否足够让用户理解自己错在什么层面。</p>
            </article>
            <article className="phase-card">
              <p>本地进度是否已经能支撑“做题、复习、再做”的初级闭环。</p>
            </article>
          </div>
        </div>
        <div>
          <div className="section-heading">
            <p className="eyebrow">Next Build</p>
            <h2>如果方向成立，下一步怎么继续</h2>
            <p>下一步就不是继续堆页面，而是把题库做成难度分层、错题回看和病例推演的主入口。</p>
          </div>
          <div className="phase-list">
            <article className="phase-card">
              <p>把每组练习继续扩成基础题、进阶题和病例题三级结构。</p>
            </article>
            <article className="phase-card">
              <p>把错题自动聚合到进度页，形成更明确的复习队列。</p>
            </article>
            <article className="phase-card">
              <p>把高价值题目升级成更完整的病例推演互动，而不是只做单步选择。</p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
