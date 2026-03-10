import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getSiteContent } from "@/lib/content";
import { getLearningPathHref } from "@/lib/learning-paths";

export default async function LearningPathsPage() {
  const { learningPaths } = await getSiteContent();

  return (
    <main className="mx-auto flex w-[min(1200px,calc(100vw-32px))] flex-col gap-6 py-8 md:py-10">
      <section className="grid gap-6 rounded-[36px] border border-border/70 bg-[linear-gradient(135deg,rgba(255,249,240,0.9),rgba(241,233,220,0.74))] p-6 shadow-soft backdrop-blur md:p-8 lg:grid-cols-[1.18fr_0.82fr]">
        <div className="space-y-6">
          <div className="space-y-4">
            <Badge className="rounded-full px-3 py-1" variant="accent">
              Paths
            </Badge>
            <h1 className="font-display text-4xl leading-[0.96] tracking-[-0.05em] text-foreground md:text-6xl">
              学习路线目录
            </h1>
            <p className="text-lg leading-8 text-foreground/86">把分散的模块、原型、练习和病例压成真正能走完的学习路径。</p>
            <p className="max-w-3xl text-base leading-8 text-muted-foreground">
              当前这一步最重要的不是再补更多页面，而是把现有资产收拢成可体验、可复盘、可拿给别人直接试学
              的成品路径。这里放的就是这种“能走完”的路线。
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/">返回首页</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/progress">查看学习进度</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="border-border/70 bg-card/78">
            <CardHeader className="space-y-2">
              <CardTitle className="text-4xl">{learningPaths.length}</CardTitle>
              <CardDescription>学习路线</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-border/70 bg-card/78">
            <CardHeader className="space-y-2">
              <CardTitle className="text-4xl">
                {learningPaths.reduce((count, path) => count + path.steps.length, 0)}
              </CardTitle>
              <CardDescription>总步骤</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-border/70 bg-card/78">
            <CardHeader className="space-y-2">
              <CardTitle className="text-4xl">1st</CardTitle>
              <CardDescription>成品闭环</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-border/70 bg-card/78">
            <CardHeader className="space-y-2">
              <CardTitle className="text-4xl">MVP</CardTitle>
              <CardDescription>可试学路径</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      <section className="rounded-[32px] border border-border/70 bg-card/80 p-6 shadow-soft backdrop-blur md:p-8">
        <div className="space-y-3">
          <p className="font-display text-xs uppercase tracking-[0.24em] text-primary">Path Atlas</p>
          <h2 className="font-display text-3xl leading-tight tracking-[-0.04em] text-foreground md:text-4xl">
            当前可直接体验的路线
          </h2>
          <p className="max-w-3xl text-base leading-8 text-muted-foreground">
            先从一条高密度闭环路线开始，验证用户能不能顺着完整路径学完，而不是在页面之间迷路。
          </p>
        </div>

        <div className="mt-6 grid gap-4">
          {learningPaths.map((path) => (
            <Card
              className="overflow-hidden border-border/70 bg-[linear-gradient(135deg,rgba(15,118,110,0.08),rgba(255,250,242,0.92))]"
              key={path.id}
            >
              <CardHeader className="space-y-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-3">
                    <Badge className="w-fit rounded-full px-3 py-1" variant="outline">
                      Learning Path
                    </Badge>
                    <CardTitle className="text-[1.8rem]">{path.title}</CardTitle>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{path.steps.length} 步</Badge>
                    <Badge variant="outline">{path.estimatedTime}</Badge>
                  </div>
                </div>
                <CardDescription className="text-base">{path.subtitle}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <p className="text-sm leading-7 text-foreground/85">{path.summary}</p>
                <div className="flex flex-wrap gap-2">
                  {path.steps.slice(0, 4).map((step) => (
                    <Badge className="rounded-full px-3 py-1" key={step.id} variant="outline">
                      {step.title}
                    </Badge>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button asChild>
                    <Link href={getLearningPathHref(path.id)}>打开这条路线</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/progress">查看路线进度</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
