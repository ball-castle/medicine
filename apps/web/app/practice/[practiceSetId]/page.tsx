import Link from "next/link";
import { notFound } from "next/navigation";

import { PracticeSetPlayer } from "@/components/fu-yang-triage-practice";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getSiteContent } from "@/lib/content";

export async function generateStaticParams() {
  const { practiceSets } = await getSiteContent();
  return practiceSets.map((practiceSet) => ({ practiceSetId: practiceSet.id }));
}

export default async function PracticeSetPage(props: { params: Promise<{ practiceSetId: string }> }) {
  const { practiceSetId } = await props.params;
  const { practiceSets, modules } = await getSiteContent();
  const practiceSet = practiceSets.find((item) => item.id === practiceSetId);

  if (!practiceSet) {
    notFound();
  }

  const module = modules.find((item) => item.id === practiceSet.moduleId) ?? null;

  return (
    <main className="mx-auto flex w-[min(1200px,calc(100vw-32px))] flex-col gap-6 py-8 md:py-10">
      <section className="grid gap-6 rounded-[36px] border border-border/70 bg-[linear-gradient(135deg,rgba(255,249,240,0.9),rgba(241,233,220,0.74))] p-6 shadow-soft backdrop-blur md:p-8 lg:grid-cols-[1.18fr_0.82fr]">
        <div className="space-y-6">
          <div className="space-y-4">
            <Badge className="rounded-full px-3 py-1" variant="accent">
              Practice
            </Badge>
            <h1 className="font-display text-4xl leading-[0.96] tracking-[-0.05em] text-foreground md:text-6xl">
              {practiceSet.title}
            </h1>
            <p className="text-lg leading-8 text-foreground/86">{practiceSet.subtitle}</p>
            <p className="max-w-3xl text-base leading-8 text-muted-foreground">
              这个页面把相关模块的核心判断压成 {practiceSet.cases.length} 个短案例，让用户从“看图懂了”继续推进到“自己能分流、能回看、能复习”。
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href={module ? `/modules/${module.id}` : "/"}>{module ? `返回 ${module.id} 模块` : "返回首页"}</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/progress">查看学习进度</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/diagrams">查看图表目录</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="border-border/70 bg-card/78">
            <CardHeader className="space-y-2">
              <CardTitle className="text-4xl">{practiceSet.cases.length}</CardTitle>
              <CardDescription>练习案例</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-border/70 bg-card/78">
            <CardHeader className="space-y-2">
              <CardTitle className="text-4xl">{practiceSet.actions.length}</CardTitle>
              <CardDescription>动作选项</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-border/70 bg-card/78">
            <CardHeader className="space-y-2">
              <CardTitle className="text-4xl">{practiceSet.estimatedTime}</CardTitle>
              <CardDescription>推荐时长</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-border/70 bg-card/78">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl">{module?.title ?? "Practice"}</CardTitle>
              <CardDescription>所属模块</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      <PracticeSetPlayer practiceSet={practiceSet} />

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/70 bg-card/82">
          <CardHeader className="space-y-4">
            <Badge className="w-fit rounded-full px-3 py-1" variant="outline">
              What To Validate
            </Badge>
            <div className="space-y-3">
              <CardTitle className="text-3xl md:text-4xl">这组练习当前主要验证什么</CardTitle>
              <CardDescription className="text-base">
                它主要验证用户是否能把模块里的图形直觉，转成真正的结构判断和回看路径。
              </CardDescription>
            </div>
          </CardHeader>
          <div className="grid gap-4 px-6 pb-6">
            <Card className="border-border/70 bg-background/60 shadow-none">
              <CardHeader>
                <CardDescription className="text-base">
                  用户是否会先看问题类型和方向，再做选择，而不是按熟悉词汇乱猜。
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-border/70 bg-background/60 shadow-none">
              <CardHeader>
                <CardDescription className="text-base">
                  错题提示和回看建议，是否足够让用户理解自己错在什么层面。
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-border/70 bg-background/60 shadow-none">
              <CardHeader>
                <CardDescription className="text-base">
                  本地进度是否已经能支撑“做题、复习、再做”的初级闭环。
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </Card>

        <Card className="border-border/70 bg-card/82">
          <CardHeader className="space-y-4">
            <Badge className="w-fit rounded-full px-3 py-1" variant="outline">
              Next Build
            </Badge>
            <div className="space-y-3">
              <CardTitle className="text-3xl md:text-4xl">如果方向成立，下一步怎么继续</CardTitle>
              <CardDescription className="text-base">
                下一步就不是继续堆页面，而是把题库做成难度分层、错题回看和病例推演的主入口。
              </CardDescription>
            </div>
          </CardHeader>
          <div className="grid gap-4 px-6 pb-6">
            <Card className="border-border/70 bg-background/60 shadow-none">
              <CardHeader>
                <CardDescription className="text-base">把每组练习继续扩成基础题、进阶题和病例题三级结构。</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-border/70 bg-background/60 shadow-none">
              <CardHeader>
                <CardDescription className="text-base">把错题自动聚合到进度页，形成更明确的复习队列。</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-border/70 bg-background/60 shadow-none">
              <CardHeader>
                <CardDescription className="text-base">把高价值题目升级成更完整的病例推演互动，而不是只做单步选择。</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </Card>
      </section>
    </main>
  );
}
