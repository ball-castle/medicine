"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { LearningPathRecord, LearningPathStepRecord } from "@medicine/content-schema";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { getLearningPathHref } from "@/lib/learning-paths";
import {
  readLearningProgress,
  saveLearningPathProgress,
  type LearningProgressStore,
} from "@/lib/learning-progress";

function emptyStore(): LearningProgressStore {
  return { practiceSets: {}, caseStudies: {}, learningPaths: {} };
}

function findFirstIncompleteStep(path: LearningPathRecord, completedStepIds: string[]) {
  return path.steps.find((step) => !completedStepIds.includes(step.id)) ?? path.steps[path.steps.length - 1] ?? null;
}

export function LearningPathPlayer(props: { path: LearningPathRecord }) {
  const { path } = props;

  const [progressStore, setProgressStore] = useState<LearningProgressStore>(emptyStore);
  const [selectedStepId, setSelectedStepId] = useState(path.steps[0]?.id ?? "");

  useEffect(() => {
    const nextStore = readLearningProgress();
    const saved = nextStore.learningPaths[path.id];

    setProgressStore(nextStore);
    setSelectedStepId(saved?.currentStepId ?? path.steps[0]?.id ?? "");
  }, [path.id, path.steps]);

  const savedPath = progressStore.learningPaths[path.id] ?? null;
  const completedStepIds = savedPath?.completedStepIds ?? [];
  const selectedStep =
    path.steps.find((step) => step.id === selectedStepId) ?? findFirstIncompleteStep(path, completedStepIds) ?? null;
  const selectedIndex = selectedStep ? path.steps.findIndex((step) => step.id === selectedStep.id) : 0;
  const progressPercent = path.steps.length ? Math.round((completedStepIds.length / path.steps.length) * 100) : 0;
  const nextStep = selectedIndex >= 0 ? path.steps[selectedIndex + 1] ?? null : null;

  const summary = useMemo(() => {
    const firstIncomplete = findFirstIncompleteStep(path, completedStepIds);
    const finished = completedStepIds.length >= path.steps.length;

    return {
      finished,
      nextTitle: finished ? "这条路线已经走完" : firstIncomplete?.title ?? path.steps[0]?.title ?? "开始首条路线",
      nextHref: finished ? "/progress" : firstIncomplete?.href ?? getLearningPathHref(path.id),
      nextLabel: finished ? "回到进度页复盘" : firstIncomplete?.buttonLabel ?? "继续这条路线",
    };
  }, [completedStepIds, path]);

  function writeProgress(nextCompletedStepIds: string[], nextCurrentStepId: string) {
    const nextProgress = {
      pathId: path.id,
      title: path.title,
      totalSteps: path.steps.length,
      completedStepIds: nextCompletedStepIds,
      currentStepId: nextCurrentStepId,
      continueHref: getLearningPathHref(path.id),
      lastUpdatedAt: new Date().toISOString(),
    };

    saveLearningPathProgress(nextProgress);
    setProgressStore((current) => ({
      ...current,
      learningPaths: {
        ...current.learningPaths,
        [path.id]: nextProgress,
      },
    }));
  }

  function toggleStep(step: LearningPathStepRecord) {
    const isDone = completedStepIds.includes(step.id);
    const nextCompletedStepIds = isDone
      ? completedStepIds.filter((item) => item !== step.id)
      : [...completedStepIds, step.id];
    const fallbackStep = findFirstIncompleteStep(path, nextCompletedStepIds) ?? step;
    const nextCurrentStepId =
      selectedStep?.id && !isDone ? nextStep?.id ?? fallbackStep.id : fallbackStep.id;

    writeProgress(nextCompletedStepIds, nextCurrentStepId);
    setSelectedStepId(step.id);
  }

  function continueToStep(stepId: string) {
    setSelectedStepId(stepId);
    writeProgress(completedStepIds, stepId);
  }

  if (!selectedStep) {
    return (
      <section>
        <Card className="border-border/70 bg-card/80">
          <CardContent className="p-6">
            <p className="text-sm leading-7 text-muted-foreground">当前路线还没有可展示的学习步骤。</p>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
      <div className="space-y-6">
        <Card className="border-border/70 bg-card/82">
          <CardHeader className="space-y-4">
            <Badge className="w-fit rounded-full px-3 py-1" variant="accent">
              Learning Route
            </Badge>
            <div className="space-y-3">
              <CardTitle className="text-3xl">{path.title}</CardTitle>
              <CardDescription className="text-base">{path.summary}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>当前完成度</span>
                <span>
                  {completedStepIds.length}/{path.steps.length}
                </span>
              </div>
              <Progress value={progressPercent} />
              <p className="text-sm text-foreground/80">{progressPercent}% 已完成</p>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <Card className="border-border/70 bg-background/60 shadow-none">
                <CardContent className="space-y-2 p-5">
                  <p className="text-xs uppercase tracking-[0.22em] text-primary">目标结果</p>
                  <strong className="block text-base leading-7 text-foreground">{path.targetOutcome}</strong>
                  <span className="block text-sm text-muted-foreground">{path.estimatedTime}</span>
                </CardContent>
              </Card>
              <Card className="border-border/70 bg-background/60 shadow-none">
                <CardContent className="space-y-2 p-5">
                  <p className="text-xs uppercase tracking-[0.22em] text-primary">下一步建议</p>
                  <strong className="block text-base leading-7 text-foreground">{summary.nextTitle}</strong>
                  <span className="block text-sm text-muted-foreground">
                    这条路线不要求一次看完，但最好按顺序走。
                  </span>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/82">
          <CardHeader className="space-y-3">
            <p className="font-display text-xs uppercase tracking-[0.24em] text-primary">Step Navigator</p>
            <CardTitle className="text-2xl">按顺序推进这条路线</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {path.steps.map((step, index) => {
              const isDone = completedStepIds.includes(step.id);
              const isActive = selectedStep.id === step.id;

              return (
                <button
                  className={cn(
                    "rounded-[24px] border px-4 py-4 text-left transition-all duration-200",
                    isActive
                      ? "border-primary/40 bg-primary/10 shadow-soft"
                      : "border-border/70 bg-background/60 hover:bg-background",
                    isDone && "border-accent/40 bg-accent/10",
                  )}
                  key={step.id}
                  onClick={() => continueToStep(step.id)}
                  type="button"
                >
                  <div className="flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-primary">
                    <span>{index + 1}</span>
                    <span>{step.kind}</span>
                    {isDone ? <Badge variant="secondary">已完成</Badge> : null}
                  </div>
                  <strong className="mt-3 block text-lg leading-7 text-foreground">{step.title}</strong>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{step.goal}</p>
                </button>
              );
            })}
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/82">
          <CardHeader className="space-y-3">
            <p className="font-display text-xs uppercase tracking-[0.24em] text-primary">Review Checklist</p>
            <CardTitle className="text-2xl">走完以后至少确认这几件事</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {path.reviewChecklist.map((item) => (
              <div className="rounded-[20px] border border-border/70 bg-background/60 px-4 py-4 text-sm leading-7 text-foreground/85" key={item}>
                {item}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="border-border/70 bg-card/84">
          <CardHeader className="space-y-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div className="space-y-3">
                <Badge className="w-fit rounded-full px-3 py-1" variant="outline">
                  Current Step
                </Badge>
                <CardTitle className="text-[2rem]">{selectedStep.title}</CardTitle>
              </div>
              <Badge variant="secondary">
                {selectedIndex + 1}/{path.steps.length}
              </Badge>
            </div>
            <CardDescription className="text-base">{selectedStep.summary}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-border/70 bg-background/60 shadow-none">
                <CardContent className="space-y-2 p-5">
                  <p className="text-xs uppercase tracking-[0.22em] text-primary">这一步要完成什么</p>
                  <strong className="block text-base leading-7 text-foreground">{selectedStep.goal}</strong>
                  <span className="block text-sm text-muted-foreground">{selectedStep.estimatedTime}</span>
                </CardContent>
              </Card>
              <Card className="border-border/70 bg-background/60 shadow-none">
                <CardContent className="space-y-2 p-5">
                  <p className="text-xs uppercase tracking-[0.22em] text-primary">完成提示</p>
                  <strong className="block text-base leading-7 text-foreground">{selectedStep.completionHint}</strong>
                  <span className="block text-sm text-muted-foreground">走完后直接标记完成，再顺着按钮进入下一步。</span>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href={selectedStep.href}>{selectedStep.buttonLabel}</Link>
              </Button>
              <Button onClick={() => toggleStep(selectedStep)} type="button" variant="outline">
                {completedStepIds.includes(selectedStep.id) ? "取消完成" : "标记这一步已完成"}
              </Button>
              {nextStep ? (
                <Button onClick={() => continueToStep(nextStep.id)} type="button" variant="outline">
                  跳到下一步
                </Button>
              ) : completedStepIds.includes(selectedStep.id) ? (
                <Button asChild variant="outline">
                  <Link href="/progress">打开进度页复盘</Link>
                </Button>
              ) : null}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {path.steps.map((step, index) => {
            const isDone = completedStepIds.includes(step.id);
            const isCurrent = step.id === selectedStep.id;

            return (
              <Card
                className={cn(
                  "border-border/70 bg-card/80 transition-all duration-200",
                  isCurrent && "border-primary/40 bg-primary/5 shadow-soft",
                  isDone && "border-accent/40 bg-accent/5",
                )}
                key={step.id}
              >
                <CardHeader className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline">Step {index + 1}</Badge>
                    <Badge variant="secondary">{step.kind}</Badge>
                    <Badge variant="outline">{step.moduleId}</Badge>
                    <Badge variant="outline">{step.estimatedTime}</Badge>
                    {isDone ? <Badge variant="accent">已完成</Badge> : null}
                  </div>
                  <div className="space-y-3">
                    <CardTitle className="text-[1.55rem]">{step.title}</CardTitle>
                    <CardDescription className="text-base">{step.summary}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3">
                  <Button onClick={() => continueToStep(step.id)} type="button" variant="outline">
                    查看这一步
                  </Button>
                  <Button asChild variant="ghost">
                    <Link href={step.href}>打开页面</Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="border-border/70 bg-[linear-gradient(135deg,rgba(15,118,110,0.08),rgba(255,250,242,0.92))]">
          <CardHeader className="space-y-3">
            <Badge className="w-fit rounded-full px-3 py-1" variant="accent">
              路线收尾
            </Badge>
            <div className="space-y-3">
              <CardTitle className="text-3xl">{summary.finished ? "这条路线已经走完" : "走完以后，你会拿到什么"}</CardTitle>
              <CardDescription className="text-base">{path.completionMessage}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href={summary.nextHref}>{summary.nextLabel}</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/paths">查看路线目录</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
