import Link from "next/link";

import { ProgressDashboard } from "@/components/progress-dashboard";
import { getCaseStudyHref } from "@/lib/cases";
import { getSiteContent } from "@/lib/content";
import { getLearningPathHref } from "@/lib/learning-paths";
import { getPracticeHref } from "@/lib/practice";

export default async function ProgressPage() {
  const { modules, moduleDetails, practiceSets, caseStudies, learningPaths } = await getSiteContent();

  return (
    <main className="page-shell page-shell--prototype">
      <section className="detail-hero">
        <div className="detail-hero__content">
          <p className="eyebrow">Progress</p>
          <h1>学习进度页</h1>
          <p className="detail-hero__subtitle">先用本地记录把“看过什么、练到哪里、还差什么”连起来。</p>
          <p className="detail-hero__intro">
            这是第一版学习引擎的入口。当前还没有账号系统，所以进度只保存在当前浏览器，但已经足够把模块、练习和回看链路串起来。
          </p>
          <div className="hero__actions">
            <Link className="button button--primary" href="/">
              返回首页
            </Link>
            <Link className="button button--ghost" href="/diagrams">
              查看图表目录
            </Link>
            <Link className="button button--ghost" href={getLearningPathHref(learningPaths[0]?.id ?? "pulse-formula-case-loop")}>
              打开首条路线
            </Link>
            <Link className="button button--ghost" href={getPracticeHref("fu-yang-triage-basic")}>
              继续扶阳练习
            </Link>
            <Link className="button button--ghost" href={getCaseStudyHref("fu-yang-three-step-case")}>
              继续扶阳病例
            </Link>
          </div>
        </div>
        <div className="detail-hero__stats">
          <div className="hero-metric">
            <strong>{modules.length}</strong>
            <span>学习模块</span>
          </div>
          <div className="hero-metric">
            <strong>{practiceSets.length}</strong>
            <span>练习组</span>
          </div>
          <div className="hero-metric">
            <strong>{caseStudies.length}</strong>
            <span>病例组</span>
          </div>
          <div className="hero-metric">
            <strong>{learningPaths.length}</strong>
            <span>学习路线</span>
          </div>
        </div>
      </section>

      <ProgressDashboard
        caseStudies={caseStudies}
        learningPaths={learningPaths}
        moduleDetails={moduleDetails}
        modules={modules}
        practiceSets={practiceSets}
      />
    </main>
  );
}
