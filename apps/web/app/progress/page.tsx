import Link from "next/link";

import { ProgressDashboard } from "@/components/progress-dashboard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCaseStudyHref } from "@/lib/cases";
import { getSiteContent } from "@/lib/content";
import { getLearningPathHref } from "@/lib/learning-paths";
import { getPracticeHref } from "@/lib/practice";

export default async function ProgressPage() {
  const { modules, moduleDetails, practiceSets, caseStudies, learningPaths } = await getSiteContent();

  return (
    <main className="mx-auto flex w-[min(1200px,calc(100vw-32px))] flex-col gap-6 py-8 md:py-10">
      <section className="grid gap-6 rounded-[36px] border border-border/70 bg-[linear-gradient(135deg,rgba(255,249,240,0.9),rgba(241,233,220,0.74))] p-6 shadow-soft backdrop-blur md:p-8 lg:grid-cols-[1.18fr_0.82fr]">
        <div className="space-y-6">
          <div className="space-y-4">
            <Badge className="rounded-full px-3 py-1" variant="accent">
              Progress
            </Badge>
            <h1 className="font-display text-4xl leading-[0.96] tracking-[-0.05em] text-foreground md:text-6xl">
              学习进度页
            </h1>
            <p className="text-lg leading-8 text-foreground/86">先用本地记录把“看过什么、练到哪里、还差什么”连起来。</p>
            <p className="max-w-3xl text-base leading-8 text-muted-foreground">
              这是第一版学习引擎的入口。当前还没有账号系统，所以进度只保存在当前浏览器，但已经足够把模块、练习和回看链路串起来。
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/">返回首页</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/diagrams">查看图表目录</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href={getLearningPathHref(learningPaths[0]?.id ?? "pulse-formula-case-loop")}>打开首条路线</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href={getPracticeHref("fu-yang-triage-basic")}>继续扶阳练习</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href={getCaseStudyHref("fu-yang-three-step-case")}>继续扶阳病例</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="border-border/70 bg-card/78">
            <CardHeader className="space-y-2">
              <CardTitle className="text-4xl">{modules.length}</CardTitle>
              <CardDescription>学习模块</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-border/70 bg-card/78">
            <CardHeader className="space-y-2">
              <CardTitle className="text-4xl">{practiceSets.length}</CardTitle>
              <CardDescription>练习组</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-border/70 bg-card/78">
            <CardHeader className="space-y-2">
              <CardTitle className="text-4xl">{caseStudies.length}</CardTitle>
              <CardDescription>病例组</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-border/70 bg-card/78">
            <CardHeader className="space-y-2">
              <CardTitle className="text-4xl">{learningPaths.length}</CardTitle>
              <CardDescription>学习路线</CardDescription>
            </CardHeader>
          </Card>
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
