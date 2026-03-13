import Link from "next/link";
import type { DiagramRecord, ModuleRecord } from "@medicine/content-schema";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getSiteContent } from "@/lib/content";

export default async function StoryboardsPage() {
  const { storyboards, diagrams, modules } = await getSiteContent();

  const diagramMap = new Map(diagrams.map((diagram) => [diagram.id, diagram]));
  const moduleMap = new Map(modules.map((module) => [module.id, module]));

  return (
    <main className="mx-auto flex w-[min(1200px,calc(100vw-32px))] flex-col gap-6 py-8 md:py-10">
      <section className="grid gap-6 rounded-[36px] border border-border/70 bg-[linear-gradient(135deg,rgba(255,249,240,0.9),rgba(241,233,220,0.74))] p-6 shadow-soft backdrop-blur md:p-8 lg:grid-cols-[1.18fr_0.82fr]">
        <div className="space-y-6">
          <div className="space-y-4">
            <Badge className="rounded-full px-3 py-1" variant="accent">
              Storyboards
            </Badge>
            <h1 className="font-display text-4xl leading-[0.96] tracking-[-0.05em] text-foreground md:text-6xl">
              第一批重点图已经拆成可制作分镜。
            </h1>
            <p className="text-lg leading-8 text-foreground/86">
              这些不是灵感便签，而是能直接进入设计、动画、交互讨论的第一轮制作说明。
            </p>
            <p className="max-w-3xl text-base leading-8 text-muted-foreground">
              每张图都定义了用户感受、讲解目标、场景顺序、交互动作、素材建议和成功标准。这样团队不会先陷在“画什么风格”里，而会先对齐“到底要让用户学会什么”。
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/">返回首页</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/modules/foundations">看模块页样例</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="border-border/70 bg-card/78">
            <CardHeader className="space-y-2">
              <CardTitle className="text-4xl">{storyboards.length}</CardTitle>
              <CardDescription>分镜稿</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-border/70 bg-card/78">
            <CardHeader className="space-y-2">
              <CardTitle className="text-4xl">{storyboards.reduce((sum, item) => sum + item.scenes.length, 0)}</CardTitle>
              <CardDescription>场景节点</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-border/70 bg-card/78">
            <CardHeader className="space-y-2">
              <CardTitle className="text-4xl">3</CardTitle>
              <CardDescription>最高优先级图</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-border/70 bg-card/78">
            <CardHeader className="space-y-2">
              <CardTitle className="text-4xl">MVP</CardTitle>
              <CardDescription>适合先制作</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      <section className="rounded-[32px] border border-border/70 bg-card/80 p-6 shadow-soft backdrop-blur md:p-8">
        <div className="space-y-3">
          <p className="font-display text-xs uppercase tracking-[0.24em] text-primary">Production Queue</p>
          <h2 className="font-display text-3xl leading-tight tracking-[-0.04em] text-foreground md:text-4xl">
            按教学价值排序的第一轮图表
          </h2>
          <p className="max-w-3xl text-base leading-8 text-muted-foreground">
            建议优先做“世界观入口 + 一眼看懂的动作图 + 高价值空间图”这三类组合。
          </p>
        </div>

        <div className="mt-6 grid gap-4">
          {storyboards.map((storyboard) => {
            const diagram = diagramMap.get(storyboard.diagramId) as DiagramRecord | undefined;
            const module = diagram ? (moduleMap.get(diagram.moduleId) as ModuleRecord | undefined) : undefined;

            return (
              <Card className="border-border/70 bg-card/82" key={storyboard.id}>
                <CardHeader className="space-y-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-3">
                      <Badge className="w-fit rounded-full px-3 py-1" variant="outline">
                        Storyboard
                      </Badge>
                      <CardTitle className="text-[1.7rem] leading-tight">{storyboard.title}</CardTitle>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{diagram?.productionFormat ?? "unknown"}</Badge>
                      <Badge variant="outline">{module?.title ?? "未分配模块"}</Badge>
                    </div>
                  </div>
                  <CardDescription className="text-base">
                    用户感受：{storyboard.targetFeeling}
                    <br />
                    学习目标：{storyboard.userGoal}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="grid gap-3">
                    {storyboard.scenes.map((scene) => (
                      <Card className="border-border/70 bg-background/60 shadow-none" key={scene.id}>
                        <CardContent className="space-y-3 p-5">
                          <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                            <strong className="font-display text-lg text-foreground">{scene.title}</strong>
                            <Badge variant="secondary">{scene.duration}</Badge>
                          </div>
                          <p className="text-sm leading-7 text-foreground/85">画面：{scene.visualFocus}</p>
                          <p className="text-sm leading-7 text-foreground/85">讲解：{scene.narration}</p>
                          <p className="text-sm leading-7 text-foreground/85">交互：{scene.interaction}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="grid gap-4 xl:grid-cols-3">
                    <Card className="border-border/70 bg-background/60 shadow-none">
                      <CardHeader className="space-y-2">
                        <CardTitle className="text-xl">关键交互</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {storyboard.interactionBeats.map((item) => (
                          <p className="text-sm leading-7 text-foreground/85" key={item}>
                            {item}
                          </p>
                        ))}
                      </CardContent>
                    </Card>

                    <Card className="border-border/70 bg-background/60 shadow-none">
                      <CardHeader className="space-y-2">
                        <CardTitle className="text-xl">素材说明</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {storyboard.assetNotes.map((item) => (
                          <p className="text-sm leading-7 text-foreground/85" key={item}>
                            {item}
                          </p>
                        ))}
                      </CardContent>
                    </Card>

                    <Card className="border-border/70 bg-background/60 shadow-none">
                      <CardHeader className="space-y-2">
                        <CardTitle className="text-xl">成功标准</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {storyboard.successCriteria.map((item) => (
                          <p className="text-sm leading-7 text-foreground/85" key={item}>
                            {item}
                          </p>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </main>
  );
}
