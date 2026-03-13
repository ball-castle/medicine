"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { CaseStudyRecord } from "@medicine/content-schema";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { getCaseStudyHref } from "@/lib/cases";
import { readLearningProgress, saveCaseStudyProgress } from "@/lib/learning-progress";

type CaseStudyPlayerProps = {
  caseStudy: CaseStudyRecord;
};

export function CaseStudyPlayer({ caseStudy }: CaseStudyPlayerProps) {
  const [stageIndex, setStageIndex] = useState(0);
  const [answers, setAnswers] = useState<Partial<Record<string, string>>>({});
  const [revealed, setRevealed] = useState<Partial<Record<string, boolean>>>({});
  const [hasLoadedProgress, setHasLoadedProgress] = useState(false);

  const currentStage = caseStudy.stages[stageIndex];
  const currentAnswer = currentStage ? answers[currentStage.id] : undefined;
  const isRevealed = currentStage ? Boolean(revealed[currentStage.id]) : false;

  useEffect(() => {
    const stored = readLearningProgress().caseStudies[caseStudy.id];
    if (!stored) {
      setHasLoadedProgress(true);
      return;
    }

    setAnswers(stored.answers);
    setRevealed(
      stored.revealedStageIds.reduce<Partial<Record<string, boolean>>>((result, stageId) => {
        result[stageId] = true;
        return result;
      }, {}),
    );

    if (stored.continueHref === getCaseStudyHref(caseStudy.id)) {
      const nextStageIndex = caseStudy.stages.findIndex((stage) => !stored.revealedStageIds.includes(stage.id));
      if (nextStageIndex >= 0) {
        setStageIndex(nextStageIndex);
      }
    }

    setHasLoadedProgress(true);
  }, [caseStudy.id, caseStudy.stages]);

  useEffect(() => {
    if (!hasLoadedProgress) {
      return;
    }

    const revealedStageIds = Object.entries(revealed)
      .filter(([, value]) => value)
      .map(([stageId]) => stageId);
    const correctStageIds = caseStudy.stages
      .filter((stage) => revealed[stage.id] && answers[stage.id] === stage.correctOptionId)
      .map((stage) => stage.id);
    const wrongStageIds = caseStudy.stages
      .filter((stage) => revealed[stage.id] && answers[stage.id] && answers[stage.id] !== stage.correctOptionId)
      .map((stage) => stage.id);

    saveCaseStudyProgress({
      caseStudyId: caseStudy.id,
      moduleId: caseStudy.moduleId,
      title: caseStudy.title,
      totalStages: caseStudy.stages.length,
      answers: answers as Record<string, string>,
      revealedStageIds,
      correctStageIds,
      wrongStageIds,
      continueHref: getCaseStudyHref(caseStudy.id),
      lastUpdatedAt: new Date().toISOString(),
    });
  }, [answers, caseStudy.id, caseStudy.moduleId, caseStudy.stages, caseStudy.title, hasLoadedProgress, revealed]);

  if (!currentStage) {
    return null;
  }

  const finished = caseStudy.stages.filter((stage) => revealed[stage.id]).length;
  const correct = caseStudy.stages.filter((stage) => revealed[stage.id] && answers[stage.id] === stage.correctOptionId).length;
  const currentResult = isRevealed && currentAnswer ? currentAnswer === currentStage.correctOptionId : null;
  const chosenOption = currentAnswer ? currentStage.options.find((option) => option.id === currentAnswer) ?? null : null;
  const correctOption = currentStage.options.find((option) => option.id === currentStage.correctOptionId) ?? null;
  const progressPercent = caseStudy.stages.length ? Math.round((finished / caseStudy.stages.length) * 100) : 0;

  function handleReveal() {
    if (!currentAnswer) {
      return;
    }
    setRevealed((prev) => ({ ...prev, [currentStage.id]: true }));
  }

  function handleNextStage() {
    setStageIndex((prev) => (prev + 1) % caseStudy.stages.length);
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
      <div className="space-y-6">
        <Card className="border-border/70 bg-card/82">
          <CardHeader className="space-y-4">
            <Badge className="w-fit rounded-full px-3 py-1" variant="accent">
              Case Study
            </Badge>
            <div className="space-y-3">
              <CardTitle className="text-3xl">{caseStudy.title}</CardTitle>
              <CardDescription className="text-base">{caseStudy.summary}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>病例进度</span>
                <span>
                  {finished}/{caseStudy.stages.length}
                </span>
              </div>
              <Progress value={progressPercent} />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <Card className="border-border/70 bg-background/60 shadow-none">
                <CardContent className="space-y-2 p-5">
                  <p className="text-xs uppercase tracking-[0.22em] text-primary">已完成阶段</p>
                  <strong className="block text-base leading-7 text-foreground">
                    {finished}/{caseStudy.stages.length}
                  </strong>
                  <span className="block text-sm text-muted-foreground">
                    关键不是背结论，而是跟着节奏看主轴怎么变。
                  </span>
                </CardContent>
              </Card>
              <Card className="border-border/70 bg-background/60 shadow-none">
                <CardContent className="space-y-2 p-5">
                  <p className="text-xs uppercase tracking-[0.22em] text-primary">当前判断</p>
                  <strong className="block text-base leading-7 text-foreground">
                    {correct}/{finished || 1}
                  </strong>
                  <span className="block text-sm text-muted-foreground">{caseStudy.targetSkill}</span>
                </CardContent>
              </Card>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{caseStudy.estimatedTime}</Badge>
              <Badge variant="outline">{caseStudy.stages.length} 个阶段</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/82">
          <CardHeader className="space-y-3">
            <p className="font-display text-xs uppercase tracking-[0.24em] text-primary">Stage Navigator</p>
            <CardTitle className="text-2xl">按阶段推进病例</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {caseStudy.stages.map((stage, index) => {
              const answered = revealed[stage.id];
              const isCorrect = answers[stage.id] === stage.correctOptionId;
              return (
                <button
                  className={cn(
                    "rounded-[24px] border px-4 py-4 text-left transition-all duration-200",
                    index === stageIndex ? "border-primary/40 bg-primary/10 shadow-soft" : "border-border/70 bg-background/60 hover:bg-background",
                  )}
                  key={stage.id}
                  onClick={() => setStageIndex(index)}
                  type="button"
                >
                  <strong className="block text-lg leading-7 text-foreground">{stage.title}</strong>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{stage.stateSummary}</p>
                  <div className="mt-3">
                    <Badge variant={answered ? (isCorrect ? "accent" : "secondary") : "outline"}>
                      {answered ? (isCorrect ? "已答对" : "已解析") : "未判断"}
                    </Badge>
                  </div>
                </button>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="border-border/70 bg-card/84">
          <CardHeader className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-3">
                <Badge className="w-fit rounded-full px-3 py-1" variant="outline">
                  Stage
                </Badge>
                <CardTitle className="text-[2rem]">{currentStage.title}</CardTitle>
              </div>
              <Badge variant="secondary">
                {stageIndex + 1}/{caseStudy.stages.length}
              </Badge>
            </div>
            <CardDescription className="text-base">{currentStage.stateSummary}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="rounded-[24px] border border-border/70 bg-background/60 px-4 py-4 text-base leading-8 text-foreground/85">
              {currentStage.question}
            </p>

            <div className="grid gap-3 md:grid-cols-2">
              {currentStage.clues.map((clue) => (
                <Card className="border-border/70 bg-background/60 shadow-none" key={clue}>
                  <CardContent className="p-5 text-sm leading-7 text-foreground/85">{clue}</CardContent>
                </Card>
              ))}
            </div>

            <div className="grid gap-3">
              {currentStage.options.map((option) => {
                const isActive = currentAnswer === option.id;
                const isCorrectChoice = isRevealed && option.id === currentStage.correctOptionId;
                const isWrongChoice = isRevealed && isActive && option.id !== currentStage.correctOptionId;
                return (
                  <button
                    className={cn(
                      "rounded-[24px] border px-4 py-4 text-left transition-all duration-200",
                      isActive ? "border-primary/40 bg-primary/10 shadow-soft" : "border-border/70 bg-background/60 hover:bg-background",
                      isCorrectChoice && "border-emerald-400/50 bg-emerald-50",
                      isWrongChoice && "border-amber-400/50 bg-amber-50",
                    )}
                    key={option.id}
                    onClick={() => setAnswers((prev) => ({ ...prev, [currentStage.id]: option.id }))}
                    type="button"
                  >
                    <p className="text-sm uppercase tracking-[0.2em] text-primary">{option.label}</p>
                    <strong className="mt-2 block text-lg leading-7 text-foreground">{option.summary}</strong>
                    <span className="mt-2 block text-sm leading-7 text-muted-foreground">
                      {isRevealed ? currentStage.optionFeedbacks[option.id] : "先判断这一步是否更该往这条路走。"}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-3">
              <Button disabled={!currentAnswer || isRevealed} onClick={handleReveal} type="button">
                提交阶段判断
              </Button>
              <Button onClick={handleNextStage} type="button" variant="outline">
                下一阶段
              </Button>
              <Button asChild variant="ghost">
                <Link href="/cases">查看病例目录</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {isRevealed && currentAnswer && chosenOption ? (
          <div className="space-y-4">
            <Card className={cn("border-border/70", currentResult ? "bg-emerald-50" : "bg-amber-50")}>
              <CardHeader className="space-y-3">
                <Badge className="w-fit rounded-full px-3 py-1" variant={currentResult ? "accent" : "secondary"}>
                  阶段结果
                </Badge>
                <CardTitle className="text-[1.5rem]">{currentResult ? "这一步判断正确" : "这一步更适合换条路线"}</CardTitle>
                <CardDescription className="text-base">{currentStage.rationale}</CardDescription>
              </CardHeader>
            </Card>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <Card className="border-border/70 bg-card/82">
                <CardHeader className="space-y-3">
                  <Badge className="w-fit rounded-full px-3 py-1" variant="outline">
                    你刚刚选了什么
                  </Badge>
                  <CardTitle className="text-[1.35rem]">{chosenOption.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-7 text-foreground/85">{currentStage.optionFeedbacks[chosenOption.id]}</p>
                </CardContent>
              </Card>

              <Card className="border-border/70 bg-card/82">
                <CardHeader className="space-y-3">
                  <Badge className="w-fit rounded-full px-3 py-1" variant="outline">
                    这一阶段要带走什么
                  </Badge>
                  <CardTitle className="text-[1.35rem]">{currentStage.takeaway}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-7 text-foreground/85">{currentStage.reviewPrompt}</p>
                </CardContent>
              </Card>

              <Card className="border-border/70 bg-card/82 md:col-span-2 xl:col-span-1">
                <CardHeader className="space-y-3">
                  <Badge className="w-fit rounded-full px-3 py-1" variant="outline">
                    下一步
                  </Badge>
                  <CardTitle className="text-[1.35rem]">继续回看</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3">
                  <Button asChild variant="outline">
                    <Link href={currentStage.reviewHref}>{currentStage.reviewLabel}</Link>
                  </Button>
                  {correctOption?.href ? (
                    <Button asChild variant="ghost">
                      <Link href={correctOption.href}>打开当前正确路线</Link>
                    </Button>
                  ) : null}
                  {chosenOption.href && chosenOption.href !== currentStage.reviewHref ? (
                    <Button asChild variant="ghost">
                      <Link href={chosenOption.href}>打开你选的路线</Link>
                    </Button>
                  ) : null}
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {currentStage.options.map((option) => (
                <Card className="border-border/70 bg-card/82" key={option.id}>
                  <CardHeader className="space-y-3">
                    <Badge className="w-fit rounded-full px-3 py-1" variant="outline">
                      {option.label}
                    </Badge>
                    <CardTitle className="text-[1.25rem]">
                      {option.id === currentStage.correctOptionId ? "当前更合适" : "这步不宜先选"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-7 text-foreground/85">{currentStage.optionFeedbacks[option.id]}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
