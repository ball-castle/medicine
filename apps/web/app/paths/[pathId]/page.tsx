import Link from "next/link";
import { notFound } from "next/navigation";

import { LearningPathPlayer } from "@/components/learning-path-player";
import { getSiteContent } from "@/lib/content";

export async function generateStaticParams() {
  const { learningPaths } = await getSiteContent();
  return learningPaths.map((path) => ({ pathId: path.id }));
}

export default async function LearningPathPage(props: { params: Promise<{ pathId: string }> }) {
  const { pathId } = await props.params;
  const { learningPaths } = await getSiteContent();
  const path = learningPaths.find((item) => item.id === pathId);

  if (!path) {
    notFound();
  }

  return (
    <main className="page-shell page-shell--prototype">
      <section className="detail-hero">
        <div className="detail-hero__content">
          <p className="eyebrow">Learning Path</p>
          <h1>{path.title}</h1>
          <p className="detail-hero__subtitle">{path.subtitle}</p>
          <p className="detail-hero__intro">{path.targetOutcome}</p>
          <div className="hero__actions">
            <Link className="button button--primary" href="/paths">
              返回路线目录
            </Link>
            <Link className="button button--ghost" href="/progress">
              查看学习进度
            </Link>
          </div>
        </div>
        <div className="detail-hero__stats">
          <div className="hero-metric">
            <strong>{path.steps.length}</strong>
            <span>连续步骤</span>
          </div>
          <div className="hero-metric">
            <strong>{path.estimatedTime}</strong>
            <span>整条路线时长</span>
          </div>
          <div className="hero-metric">
            <strong>{path.reviewChecklist.length}</strong>
            <span>收尾检查点</span>
          </div>
          <div className="hero-metric">
            <strong>MVP</strong>
            <span>首条闭环路线</span>
          </div>
        </div>
      </section>

      <LearningPathPlayer path={path} />
    </main>
  );
}
