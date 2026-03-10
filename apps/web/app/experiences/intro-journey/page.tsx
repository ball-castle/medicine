import Link from "next/link";

import { ImmersiveIntroJourney } from "@/components/immersive-intro-journey";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function IntroJourneyPage() {
  return (
    <main className="mx-auto flex w-[min(1200px,calc(100vw-32px))] flex-col gap-6 py-8 md:py-10">
      <section className="grid gap-6 rounded-[36px] border border-border/70 bg-[linear-gradient(135deg,rgba(255,249,240,0.9),rgba(241,233,220,0.74))] p-6 shadow-soft backdrop-blur md:p-8 lg:grid-cols-[1.18fr_0.82fr]">
        <div className="space-y-6">
          <div className="space-y-4">
            <Badge className="rounded-full px-3 py-1" variant="accent">
              Experience
            </Badge>
            <h1 className="font-display text-4xl leading-[0.96] tracking-[-0.05em] text-foreground md:text-6xl">
              中医动态世界的第一站
            </h1>
            <p className="text-lg leading-8 text-foreground/86">先让人想看，再让人想点，最后才让人愿意学。</p>
            <p className="max-w-3xl text-base leading-8 text-muted-foreground">
              这个页面不是课程目录，也不是题库入口。它的任务很单纯: 用最短时间把圆运动、水火交通、
              开门与归根三个最抓人的画面连续压给用户，让他们先感到“这个世界有意思”。
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/">返回首页</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/paths/pulse-formula-case-loop">进入学习版</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/diagrams">看图表目录</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="border-border/70 bg-card/78">
            <CardHeader className="space-y-2">
              <CardTitle className="text-4xl">3</CardTitle>
              <CardDescription>沉浸场景</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-border/70 bg-card/78">
            <CardHeader className="space-y-2">
              <CardTitle className="text-4xl">60-90s</CardTitle>
              <CardDescription>推荐体验时长</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-border/70 bg-card/78">
            <CardHeader className="space-y-2">
              <CardTitle className="text-4xl">World</CardTitle>
              <CardDescription>展览式入口</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-border/70 bg-card/78">
            <CardHeader className="space-y-2">
              <CardTitle className="text-4xl">MVP</CardTitle>
              <CardDescription>吸引力优先</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      <ImmersiveIntroJourney />

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/70 bg-card/80">
          <CardHeader className="space-y-4">
            <Badge className="w-fit rounded-full px-3 py-1" variant="outline">
              Intent
            </Badge>
            <div className="space-y-3">
              <CardTitle className="text-3xl md:text-4xl">这个页面现在最重要的是什么</CardTitle>
              <CardDescription className="text-base">
                它不是解释得最全，而是负责把用户从“中医很难”切到“我想再看一下”。
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Card className="border-border/70 bg-background/60 shadow-none">
              <CardContent className="p-5 text-sm leading-7 text-foreground/85">第一眼先抓世界观，不先塞术语和病名。</CardContent>
            </Card>
            <Card className="border-border/70 bg-background/60 shadow-none">
              <CardContent className="p-5 text-sm leading-7 text-foreground/85">
                先让用户看到动态结构，再决定要不要继续进入学习版。
              </CardContent>
            </Card>
            <Card className="border-border/70 bg-background/60 shadow-none">
              <CardContent className="p-5 text-sm leading-7 text-foreground/85">
                把“圆运动、水火交通、开门归根”做成可转发、可展示的入口资产。
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/80">
          <CardHeader className="space-y-4">
            <Badge className="w-fit rounded-full px-3 py-1" variant="outline">
              Next Layer
            </Badge>
            <div className="space-y-3">
              <CardTitle className="text-3xl md:text-4xl">如果吸引力方向成立，下一步怎么加深</CardTitle>
              <CardDescription className="text-base">
                先把体验做得更像短片和展览，再决定哪些部分值得上更重的 3D。
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Card className="border-border/70 bg-background/60 shadow-none">
              <CardContent className="p-5 text-sm leading-7 text-foreground/85">
                给每个场景补更短的自动旁白脚本和镜头推进。
              </CardContent>
            </Card>
            <Card className="border-border/70 bg-background/60 shadow-none">
              <CardContent className="p-5 text-sm leading-7 text-foreground/85">
                让场景之间有更明确的过场，不只是页面切块。
              </CardContent>
            </Card>
            <Card className="border-border/70 bg-background/60 shadow-none">
              <CardContent className="p-5 text-sm leading-7 text-foreground/85">
                挑 1 个最有空间感的场景，再升级成更重的 2.5D 或 3D。
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
