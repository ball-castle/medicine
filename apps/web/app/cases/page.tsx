import Link from "next/link";
import type { ConceptRecord, DiagramRecord, ModuleRecord } from "@medicine/content-schema";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCaseStudyHref } from "@/lib/cases";
import { getSiteContent } from "@/lib/content";

function CaseAtlasCard(props: {
  caseStudy: {
    id: string;
    title: string;
    subtitle: string;
    summary: string;
    targetSkill: string;
    estimatedTime: string;
    stages: number;
    concepts: ConceptRecord[];
    diagrams: DiagramRecord[];
  };
  module: ModuleRecord;
}) {
  return (
    <Card className="h-full border-border/70 bg-card/82">
      <CardHeader className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-3">
            <Badge className="w-fit rounded-full px-3 py-1" variant="outline">
              Case Study
            </Badge>
            <CardTitle className="text-[1.55rem]">{props.caseStudy.title}</CardTitle>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{props.caseStudy.stages} 个阶段</Badge>
            <Badge variant="outline">{props.caseStudy.estimatedTime}</Badge>
          </div>
        </div>
        <CardDescription className="text-base">{props.caseStudy.subtitle}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-sm leading-7 text-foreground/85">{props.caseStudy.summary}</p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="accent">{props.module.title}</Badge>
          {props.caseStudy.concepts.slice(0, 3).map((concept) => (
            <Badge className="rounded-full px-3 py-1" key={concept.id} variant="outline">
              {concept.title}
            </Badge>
          ))}
          {props.caseStudy.diagrams.slice(0, 2).map((diagram) => (
            <Badge className="rounded-full px-3 py-1" key={diagram.id} variant="outline">
              {diagram.title}
            </Badge>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link href={getCaseStudyHref(props.caseStudy.id)}>打开病例推演</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href={`/modules/${props.module.id}`}>回到模块</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default async function CasesPage() {
  const { caseStudies, concepts, diagrams, modules } = await getSiteContent();

  const moduleMap = new Map(modules.map((module) => [module.id, module]));
  const conceptMap = new Map(concepts.map((concept) => [concept.id, concept]));
  const diagramMap = new Map(diagrams.map((diagram) => [diagram.id, diagram]));

  const enrichedCases = caseStudies.map((caseStudy) => ({
    ...caseStudy,
    stages: caseStudy.stages.length,
    concepts: caseStudy.focusConceptIds
      .map((conceptId) => conceptMap.get(conceptId))
      .filter(Boolean) as ConceptRecord[],
    diagrams: caseStudy.focusDiagramIds
      .map((diagramId) => diagramMap.get(diagramId))
      .filter(Boolean) as DiagramRecord[],
    module: moduleMap.get(caseStudy.moduleId) ?? null,
  }));

  return (
    <main className="mx-auto flex w-[min(1200px,calc(100vw-32px))] flex-col gap-6 py-8 md:py-10">
      <section className="grid gap-6 rounded-[36px] border border-border/70 bg-[linear-gradient(135deg,rgba(255,249,240,0.9),rgba(241,233,220,0.74))] p-6 shadow-soft backdrop-blur md:p-8 lg:grid-cols-[1.18fr_0.82fr]">
        <div className="space-y-6">
          <div className="space-y-4">
            <Badge className="rounded-full px-3 py-1" variant="accent">
              Cases
            </Badge>
            <h1 className="font-display text-4xl leading-[0.96] tracking-[-0.05em] text-foreground md:text-6xl">
              病例推演目录
            </h1>
            <p className="text-lg leading-8 text-foreground/86">把“先后手、节奏、转方逻辑”做成可走的互动病例，而不是只留在文字说明里。</p>
            <p className="max-w-3xl text-base leading-8 text-muted-foreground">
              这里的目标不是替代真实临床，而是把两本书里最难学的一层能力拆出来训练：看主轴、分阶段、判断当前更该往哪一步走。
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/">返回首页</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/modules/cases-and-application">打开医案模块</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/progress">查看学习进度</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="border-border/70 bg-card/78">
            <CardHeader className="space-y-2">
              <CardTitle className="text-4xl">{caseStudies.length}</CardTitle>
              <CardDescription>病例推演</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-border/70 bg-card/78">
            <CardHeader className="space-y-2">
              <CardTitle className="text-4xl">{caseStudies.reduce((sum, item) => sum + item.stages.length, 0)}</CardTitle>
              <CardDescription>阶段节点</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-border/70 bg-card/78">
            <CardHeader className="space-y-2">
              <CardTitle className="text-4xl">{new Set(caseStudies.flatMap((item) => item.focusConceptIds)).size}</CardTitle>
              <CardDescription>覆盖概念</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-border/70 bg-card/78">
            <CardHeader className="space-y-2">
              <CardTitle className="text-4xl">MVP</CardTitle>
              <CardDescription>病例学习链</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      <section className="rounded-[32px] border border-border/70 bg-card/80 p-6 shadow-soft backdrop-blur md:p-8">
        <div className="space-y-3">
          <p className="font-display text-xs uppercase tracking-[0.24em] text-primary">Case Atlas</p>
          <h2 className="font-display text-3xl leading-tight tracking-[-0.04em] text-foreground md:text-4xl">
            第一组可直接体验的病例
          </h2>
          <p className="max-w-3xl text-base leading-8 text-muted-foreground">
            先从少量高密度病例开始，重点验证用户能不能跟着时间线看见主轴转换，而不是背一个静态答案。
          </p>
        </div>
        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          {enrichedCases.map((caseStudy) =>
            caseStudy.module ? <CaseAtlasCard caseStudy={caseStudy} key={caseStudy.id} module={caseStudy.module} /> : null,
          )}
        </div>
      </section>
    </main>
  );
}
