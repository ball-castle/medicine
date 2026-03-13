import Link from "next/link";
import { notFound } from "next/navigation";

import { LearningPathPlayer } from "@/features/learning-paths";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    <main className="mx-auto flex w-[min(1200px,calc(100vw-32px))] flex-col gap-6 py-8 md:py-10">
      <section className="grid gap-6 rounded-[36px] border border-border/70 bg-[linear-gradient(135deg,rgba(255,249,240,0.9),rgba(241,233,220,0.74))] p-6 shadow-soft backdrop-blur md:p-8 lg:grid-cols-[1.18fr_0.82fr]">
        <div className="space-y-6">
          <div className="space-y-4">
            <Badge className="rounded-full px-3 py-1" variant="accent">
              Learning Path
            </Badge>
            <h1 className="font-display text-4xl leading-[0.96] tracking-[-0.05em] text-foreground md:text-6xl">
              {path.title}
            </h1>
            <p className="text-lg leading-8 text-foreground/86">{path.subtitle}</p>
            <p className="max-w-3xl text-base leading-8 text-muted-foreground">{path.targetOutcome}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/paths">返回路线目录</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/progress">查看学习进度</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="border-border/70 bg-card/78">
            <CardHeader className="space-y-2">
              <CardTitle className="text-4xl">{path.steps.length}</CardTitle>
              <CardDescription>连续步骤</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-border/70 bg-card/78">
            <CardHeader className="space-y-2">
              <CardTitle className="text-4xl">{path.estimatedTime}</CardTitle>
              <CardDescription>整条路线时长</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-border/70 bg-card/78">
            <CardHeader className="space-y-2">
              <CardTitle className="text-4xl">{path.reviewChecklist.length}</CardTitle>
              <CardDescription>收尾检查点</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-border/70 bg-card/78">
            <CardHeader className="space-y-2">
              <CardTitle className="text-4xl">MVP</CardTitle>
              <CardDescription>首条闭环路线</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      <LearningPathPlayer path={path} />
    </main>
  );
}
