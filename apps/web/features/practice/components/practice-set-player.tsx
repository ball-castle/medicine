"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { PracticeDifficulty, PracticeSetRecord } from "@medicine/content-schema";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { readLearningProgress, savePracticeSetProgress } from "@/lib/learning-progress";
import { getPracticeHref } from "@/lib/practice";

type PracticeSetPlayerProps = {
  practiceSet: PracticeSetRecord;
};

const DIFFICULTY_LABELS: Record<PracticeDifficulty, string> = {
  foundation: "基础题",
  intermediate: "进阶题",
  advanced: "挑战题",
};

export function PracticeSetPlayer({ practiceSet }: PracticeSetPlayerProps) {
  const [caseIndex, setCaseIndex] = useState(0);
  const [answers, setAnswers] = useState<Partial<Record<string, string>>>({});
  const [revealed, setRevealed] = useState<Partial<Record<string, boolean>>>({});
  const [hasLoadedProgress, setHasLoadedProgress] = useState(false);

  const currentCase = practiceSet.cases[caseIndex];
  const currentAnswer = currentCase ? answers[currentCase.id] : undefined;
  const isRevealed = currentCase ? Boolean(revealed[currentCase.id]) : false;

  const summary = useMemo(() => {
    const finished = practiceSet.cases.filter((item) => revealed[item.id]).length;
    const correct = practiceSet.cases.filter((item) => revealed[item.id] && answers[item.id] === item.correctActionId).length;
    const difficultyMix = practiceSet.cases.reduce<Record<PracticeDifficulty, number>>(
      (result, item) => {
        result[item.difficulty] += 1;
        return result;
      },
      { foundation: 0, intermediate: 0, advanced: 0 },
    );

    return { finished, correct, difficultyMix };
  }, [answers, practiceSet.cases, revealed]);

  useEffect(() => {
    const stored = readLearningProgress().practiceSets[practiceSet.id];
    if (!stored) {
      setHasLoadedProgress(true);
      return;
    }

    setAnswers(stored.answers);
    setRevealed(
      stored.revealedCaseIds.reduce<Partial<Record<string, boolean>>>((result, caseId) => {
        result[caseId] = true;
        return result;
      }, {}),
    );
    setHasLoadedProgress(true);
  }, [practiceSet.id]);

  useEffect(() => {
    if (!hasLoadedProgress) {
      return;
    }

    const revealedCaseIds = Object.entries(revealed)
      .filter(([, value]) => value)
      .map(([caseId]) => caseId);
    const correctCaseIds = practiceSet.cases
      .filter((item) => revealed[item.id] && answers[item.id] === item.correctActionId)
      .map((item) => item.id);
    const wrongCaseIds = practiceSet.cases
      .filter((item) => revealed[item.id] && answers[item.id] && answers[item.id] !== item.correctActionId)
      .map((item) => item.id);

    savePracticeSetProgress({
      practiceSetId: practiceSet.id,
      moduleId: practiceSet.moduleId,
      title: practiceSet.title,
      totalCases: practiceSet.cases.length,
      answers: answers as Record<string, string>,
      revealedCaseIds,
      correctCaseIds,
      wrongCaseIds,
      continueHref: getPracticeHref(practiceSet.id),
      lastUpdatedAt: new Date().toISOString(),
    });
  }, [answers, hasLoadedProgress, practiceSet.cases, practiceSet.id, practiceSet.moduleId, practiceSet.title, revealed]);

  if (!currentCase) {
    return null;
  }

  const currentResult = isRevealed && currentAnswer ? currentAnswer === currentCase.correctActionId : null;
  const wrongAction =
    isRevealed && currentAnswer && currentAnswer !== currentCase.correctActionId
      ? practiceSet.actions.find((item) => item.id === currentAnswer) ?? null
      : null;
  const progressPercent = practiceSet.cases.length ? Math.round((summary.finished / practiceSet.cases.length) * 100) : 0;

  function handleReveal() {
    if (!currentAnswer) {
      return;
    }

    setRevealed((prev) => ({ ...prev, [currentCase.id]: true }));
  }

  function handleNextCase() {
    setCaseIndex((prev) => (prev + 1) % practiceSet.cases.length);
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
      <div className="space-y-6">
        <Card className="border-border/70 bg-card/82">
          <CardHeader className="space-y-4">
            <Badge className="w-fit rounded-full px-3 py-1" variant="accent">
              Practice
            </Badge>
            <div className="space-y-3">
              <CardTitle className="text-3xl">{practiceSet.title}</CardTitle>
              <CardDescription className="text-base">{practiceSet.objective}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>练习进度</span>
                <span>
                  {summary.finished}/{practiceSet.cases.length}
                </span>
              </div>
              <Progress value={progressPercent} />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <Card className="border-border/70 bg-background/60 shadow-none">
                <CardContent className="space-y-2 p-5">
                  <p className="text-xs uppercase tracking-[0.22em] text-primary">已完成</p>
                  <strong className="block text-base leading-7 text-foreground">
                    {summary.finished}/{practiceSet.cases.length}
                  </strong>
                  <span className="block text-sm text-muted-foreground">
                    先做完 {practiceSet.cases.length} 题，再看自己最容易混淆的是哪一类判断。
                  </span>
                </CardContent>
              </Card>
              <Card className="border-border/70 bg-background/60 shadow-none">
                <CardContent className="space-y-2 p-5">
                  <p className="text-xs uppercase tracking-[0.22em] text-primary">当前得分</p>
                  <strong className="block text-base leading-7 text-foreground">
                    {summary.correct}/{summary.finished || 1}
                  </strong>
                  <span className="block text-sm text-muted-foreground">{practiceSet.warning}</span>
                </CardContent>
              </Card>
            </div>
            <div className="flex flex-wrap gap-2">
              {summary.difficultyMix.foundation > 0 ? <Badge variant="outline">基础 {summary.difficultyMix.foundation}</Badge> : null}
              {summary.difficultyMix.intermediate > 0 ? <Badge variant="outline">进阶 {summary.difficultyMix.intermediate}</Badge> : null}
              {summary.difficultyMix.advanced > 0 ? <Badge variant="outline">挑战 {summary.difficultyMix.advanced}</Badge> : null}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/82">
          <CardHeader className="space-y-3">
            <p className="font-display text-xs uppercase tracking-[0.24em] text-primary">Case Navigator</p>
            <CardTitle className="text-2xl">按题推进这组练习</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {practiceSet.cases.map((item, index) => {
              const answered = revealed[item.id];
              const correct = answers[item.id] === item.correctActionId;

              return (
                <button
                  className={cn(
                    "rounded-[24px] border px-4 py-4 text-left transition-all duration-200",
                    index === caseIndex ? "border-primary/40 bg-primary/10 shadow-soft" : "border-border/70 bg-background/60 hover:bg-background",
                  )}
                  key={item.id}
                  onClick={() => setCaseIndex(index)}
                  type="button"
                >
                  <strong className="block text-lg leading-7 text-foreground">{item.title}</strong>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.brief}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge variant="outline">{DIFFICULTY_LABELS[item.difficulty]}</Badge>
                    <Badge variant={answered ? (correct ? "accent" : "secondary") : "outline"}>
                      {answered ? (correct ? "已答对" : "已解析") : "未作答"}
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
                  Case
                </Badge>
                <CardTitle className="text-[2rem]">{currentCase.title}</CardTitle>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">
                  {caseIndex + 1}/{practiceSet.cases.length}
                </Badge>
                <Badge variant="outline">{DIFFICULTY_LABELS[currentCase.difficulty]}</Badge>
              </div>
            </div>
            <CardDescription className="text-base">{currentCase.scenario}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-3 md:grid-cols-2">
              {currentCase.clues.map((clue) => (
                <Card className="border-border/70 bg-background/60 shadow-none" key={clue}>
                  <CardContent className="p-5 text-sm leading-7 text-foreground/85">{clue}</CardContent>
                </Card>
              ))}
            </div>

            <div className="grid gap-3">
              {practiceSet.actions.map((item) => {
                const isActive = currentAnswer === item.id;
                const resultClass =
                  isRevealed && item.id === currentCase.correctActionId
                    ? "border-emerald-400/50 bg-emerald-50"
                    : isRevealed && isActive && item.id !== currentCase.correctActionId
                      ? "border-amber-400/50 bg-amber-50"
                      : "";

                return (
                  <button
                    className={cn(
                      "rounded-[24px] border px-4 py-4 text-left transition-all duration-200",
                      isActive ? "border-primary/40 bg-primary/10 shadow-soft" : "border-border/70 bg-background/60 hover:bg-background",
                      resultClass,
                    )}
                    key={item.id}
                    onClick={() => setAnswers((prev) => ({ ...prev, [currentCase.id]: item.id }))}
                    type="button"
                  >
                    <p className="text-sm uppercase tracking-[0.2em] text-primary">{item.shortLabel}</p>
                    <strong className="mt-2 block text-lg leading-7 text-foreground">{item.label}</strong>
                    <span className="mt-2 block text-sm leading-7 text-muted-foreground">{item.summary}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-3">
              <Button disabled={!currentAnswer || isRevealed} onClick={handleReveal} type="button">
                提交判断
              </Button>
              <Button onClick={handleNextCase} type="button" variant="outline">
                下一题
              </Button>
              <Button asChild variant="ghost">
                <Link href="/progress">查看学习进度</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {isRevealed && currentAnswer ? (
          <div className="space-y-4">
            <Card className={cn("border-border/70", currentResult ? "bg-emerald-50" : "bg-amber-50")}>
              <CardHeader className="space-y-3">
                <Badge className="w-fit rounded-full px-3 py-1" variant={currentResult ? "accent" : "secondary"}>
                  本题结果
                </Badge>
                <CardTitle className="text-[1.5rem]">{currentResult ? "判断正确" : "这题更适合换一个动作"}</CardTitle>
                <CardDescription className="text-base">{currentCase.rationale}</CardDescription>
              </CardHeader>
            </Card>

            {!currentResult && wrongAction ? (
              <Card className="border-border/70 bg-card/82">
                <CardHeader className="space-y-3">
                  <Badge className="w-fit rounded-full px-3 py-1" variant="outline">
                    常见误区
                  </Badge>
                  <CardTitle className="text-[1.35rem]">{currentCase.mistakeTag}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-7 text-foreground/85">
                    你刚刚更偏向选了“{wrongAction.label}”。{currentCase.mistakeReason}
                  </p>
                </CardContent>
              </Card>
            ) : null}

            <Card className="border-border/70 bg-card/82">
              <CardHeader className="space-y-3">
                <Badge className="w-fit rounded-full px-3 py-1" variant="outline">
                  回看建议
                </Badge>
                <CardTitle className="text-[1.35rem]">{currentCase.nextLabel}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-7 text-foreground/85">{currentCase.reviewPrompt}</p>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              {practiceSet.actions.map((item) => (
                <Card className="border-border/70 bg-card/82" key={item.id}>
                  <CardHeader className="space-y-3">
                    <Badge className="w-fit rounded-full px-3 py-1" variant="outline">
                      {item.shortLabel}
                    </Badge>
                    <CardTitle className="text-[1.25rem]">{item.label}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-7 text-foreground/85">{currentCase.comparisons[item.id]}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outline">
                <Link href={currentCase.nextHref}>{currentCase.nextLabel}</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link
                  href={
                    practiceSet.actions.find((item) => item.id === currentCase.correctActionId)?.linkedPrototypeHref ??
                    currentCase.nextHref
                  }
                >
                  打开对应动作图
                </Link>
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
