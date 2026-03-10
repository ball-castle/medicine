import Link from "next/link";
import type { DiagramRecord, ModuleRecord, StoryboardRecord } from "@medicine/content-schema";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getSiteContent } from "@/lib/content";

function DiagramAtlasCard(props: {
  diagram: DiagramRecord;
  module: ModuleRecord;
  storyboard: StoryboardRecord | null;
}) {
  return (
    <Card className="h-full border-border/70 bg-card/82">
      <CardHeader className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-3">
            <Badge className="w-fit rounded-full px-3 py-1" variant="outline">
              Diagram
            </Badge>
            <CardTitle className="text-[1.55rem]">{props.diagram.title}</CardTitle>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{props.diagram.productionFormat}</Badge>
            <Badge variant="outline">{props.diagram.visualPriority}</Badge>
          </div>
        </div>
        <CardDescription className="text-base">{props.diagram.purpose}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-sm leading-7 text-foreground/85">{props.diagram.interactionIdea}</p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="accent">{props.module.title}</Badge>
          <Badge variant="outline">{props.diagram.chapter}</Badge>
          {props.storyboard ? <Badge variant="secondary">已有分镜</Badge> : null}
          {props.diagram.prototypeHref ? <Badge variant="secondary">已有原型</Badge> : null}
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link href={`/modules/${props.module.id}`}>回到模块</Link>
          </Button>
          {props.diagram.prototypeHref ? (
            <Button asChild variant="outline">
              <Link href={props.diagram.prototypeHref}>打开原型</Link>
            </Button>
          ) : null}
          {props.storyboard ? (
            <Button asChild variant="ghost">
              <Link href="/storyboards">查看分镜</Link>
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

export default async function DiagramsPage() {
  const { diagrams, modules, storyboards } = await getSiteContent();

  const diagramsByModule = modules.map((module) => ({
    module,
    diagrams: diagrams.filter((diagram) => diagram.moduleId === module.id),
  }));
  const storyboardMap = new Map(storyboards.map((storyboard) => [storyboard.diagramId, storyboard]));

  return (
    <main className="mx-auto flex w-[min(1200px,calc(100vw-32px))] flex-col gap-6 py-8 md:py-10">
      <section className="grid gap-6 rounded-[36px] border border-border/70 bg-[linear-gradient(135deg,rgba(255,249,240,0.9),rgba(241,233,220,0.74))] p-6 shadow-soft backdrop-blur md:p-8 lg:grid-cols-[1.18fr_0.82fr]">
        <div className="space-y-6">
          <div className="space-y-4">
            <Badge className="rounded-full px-3 py-1" variant="accent">
              Diagrams
            </Badge>
            <h1 className="font-display text-4xl leading-[0.96] tracking-[-0.05em] text-foreground md:text-6xl">
              图表目录页
            </h1>
            <p className="text-lg leading-8 text-foreground/86">把重点图表、模块归属、原型入口和分镜状态放进同一页。</p>
            <p className="max-w-3xl text-base leading-8 text-muted-foreground">
              这个页面的任务不是展示“有多少图”，而是让图表真正成为课程和练习的中间层。后面继续补图时，也应该先从这里登记，而不是直接散落到各个页面。
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/">返回首页</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/storyboards">查看分镜页</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/progress">查看学习进度</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="border-border/70 bg-card/78">
            <CardHeader className="space-y-2">
              <CardTitle className="text-4xl">{diagrams.length}</CardTitle>
              <CardDescription>图表总数</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-border/70 bg-card/78">
            <CardHeader className="space-y-2">
              <CardTitle className="text-4xl">{diagrams.filter((diagram) => diagram.prototypeHref).length}</CardTitle>
              <CardDescription>已有原型</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-border/70 bg-card/78">
            <CardHeader className="space-y-2">
              <CardTitle className="text-4xl">{storyboards.length}</CardTitle>
              <CardDescription>已有分镜</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-border/70 bg-card/78">
            <CardHeader className="space-y-2">
              <CardTitle className="text-4xl">{modules.length}</CardTitle>
              <CardDescription>覆盖模块</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {diagramsByModule.map(({ module, diagrams: moduleDiagrams }) => (
        <section className="rounded-[32px] border border-border/70 bg-card/80 p-6 shadow-soft backdrop-blur md:p-8" key={module.id}>
          <div className="space-y-3">
            <p className="font-display text-xs uppercase tracking-[0.24em] text-primary">Module Atlas</p>
            <h2 className="font-display text-3xl leading-tight tracking-[-0.04em] text-foreground md:text-4xl">
              {module.title}
            </h2>
            <p className="max-w-3xl text-base leading-8 text-muted-foreground">{module.visualFocus}</p>
          </div>
          <div className="mt-6 grid gap-4 xl:grid-cols-2">
            {moduleDiagrams.map((diagram) => (
              <DiagramAtlasCard
                diagram={diagram}
                key={diagram.id}
                module={module}
                storyboard={(storyboardMap.get(diagram.id) as StoryboardRecord | undefined) ?? null}
              />
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
