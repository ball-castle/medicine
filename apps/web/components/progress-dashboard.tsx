"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { CaseStudyRecord, LearningPathRecord, ModuleDetailRecord, ModuleRecord, PracticeSetRecord } from "@medicine/content-schema";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getCaseStudyHref } from "@/lib/cases";
import { getLearningPathHref } from "@/lib/learning-paths";
import { clearLearningProgress, readLearningProgress } from "@/lib/learning-progress";
import type { LearningProgressStore } from "@/lib/learning-progress";
import { getPracticeHref } from "@/lib/practice";

type ProgressDashboardProps = {
  modules: ModuleRecord[];
  moduleDetails: ModuleDetailRecord[];
  practiceSets: PracticeSetRecord[];
  caseStudies: CaseStudyRecord[];
  learningPaths: LearningPathRecord[];
};

type ModuleStatus = "not-started" | "in-progress" | "completed" | "content-only";

const MODULE_STATUS_LABELS: Record<ModuleStatus, string> = {
  "not-started": "未开始",
  "in-progress": "进行中",
  completed: "已完成",
  "content-only": "内容已铺好",
};

function SectionTitle(props: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="space-y-3">
      <p className="font-display text-xs uppercase tracking-[0.24em] text-primary">{props.eyebrow}</p>
      <h2 className="font-display text-3xl leading-tight tracking-[-0.04em] text-foreground md:text-4xl">{props.title}</h2>
      <p className="max-w-3xl text-base leading-8 text-muted-foreground">{props.description}</p>
    </div>
  );
}

function MetricCard(props: { label: string; value: string; summary: string }) {
  return (
    <Card className="border-border/70 bg-card/82">
      <CardContent className="space-y-3 p-6">
        <p className="text-xs uppercase tracking-[0.24em] text-primary">{props.label}</p>
        <strong className="block font-display text-4xl leading-none text-foreground">{props.value}</strong>
        <p className="text-sm leading-7 text-muted-foreground">{props.summary}</p>
      </CardContent>
    </Card>
  );
}

function getModuleStatus(totalInteractive: number, completedInteractive: number): ModuleStatus {
  if (!totalInteractive) return "content-only";
  if (!completedInteractive) return "not-started";
  if (completedInteractive >= totalInteractive) return "completed";
  return "in-progress";
}

function sortByLastUpdated(left: { lastUpdatedAt: string }, right: { lastUpdatedAt: string }) {
  return Date.parse(right.lastUpdatedAt) - Date.parse(left.lastUpdatedAt);
}

export function ProgressDashboard({ modules, moduleDetails, practiceSets, caseStudies, learningPaths }: ProgressDashboardProps) {
  const [progressStore, setProgressStore] = useState<LearningProgressStore>({ practiceSets: {}, caseStudies: {}, learningPaths: {} });

  useEffect(() => {
    setProgressStore(readLearningProgress());
  }, []);

  const summaries = useMemo(() => {
    const practiceProgress = Object.values(progressStore.practiceSets);
    const caseProgress = Object.values(progressStore.caseStudies);
    const pathProgress = Object.values(progressStore.learningPaths);
    const totalCases = practiceProgress.reduce((sum, item) => sum + item.totalCases, 0);
    const completedCases = practiceProgress.reduce((sum, item) => sum + item.revealedCaseIds.length, 0);
    const correctCases = practiceProgress.reduce((sum, item) => sum + item.correctCaseIds.length, 0);
    const totalStages = caseProgress.reduce((sum, item) => sum + item.totalStages, 0);
    const completedStages = caseProgress.reduce((sum, item) => sum + item.revealedStageIds.length, 0);
    const correctStages = caseProgress.reduce((sum, item) => sum + item.correctStageIds.length, 0);
    const accuracy = completedCases + completedStages ? Math.round(((correctCases + correctStages) / (completedCases + completedStages)) * 100) : 0;

    return {
      practiceStarted: practiceProgress.length,
      caseStarted: caseProgress.length,
      pathStarted: pathProgress.filter((item) => item.completedStepIds.length > 0).length,
      totalCases,
      completedCases,
      totalStages,
      completedStages,
      pathCompleted: pathProgress.filter((item) => item.completedStepIds.length >= item.totalSteps).length,
      accuracy,
    };
  }, [progressStore.caseStudies, progressStore.learningPaths, progressStore.practiceSets]);

  const learningPathProgress = useMemo(
    () =>
      learningPaths.map((path) => {
        const saved = progressStore.learningPaths[path.id] ?? null;
        const completedSteps = saved?.completedStepIds.length ?? 0;
        const progressPercent = path.steps.length ? Math.round((completedSteps / path.steps.length) * 100) : 0;
        const nextStep =
          path.steps.find((step) => !saved?.completedStepIds.includes(step.id)) ?? path.steps[path.steps.length - 1] ?? null;
        return { path, saved, completedSteps, progressPercent, nextStep };
      }),
    [learningPaths, progressStore.learningPaths],
  );

  const reviewItems = useMemo(
    () =>
      practiceSets
        .flatMap((practiceSet) => {
          const saved = progressStore.practiceSets[practiceSet.id];
          const wrongCaseIds = saved?.wrongCaseIds ?? [];
          if (!wrongCaseIds.length) return [];

          return wrongCaseIds.map((caseId) => {
            const caseItem = practiceSet.cases.find((item) => item.id === caseId);
            const module = modules.find((item) => item.id === practiceSet.moduleId);
            const answerId = saved.answers[caseId];
            const wrongAction = practiceSet.actions.find((item) => item.id === answerId) ?? null;
            if (!caseItem) return null;
            return {
              id: `${practiceSet.id}:${caseId}`,
              moduleTitle: module?.title ?? practiceSet.moduleId,
              practiceTitle: practiceSet.title,
              caseTitle: caseItem.title,
              difficulty: caseItem.difficulty,
              mistakeTag: caseItem.mistakeTag,
              mistakeReason: caseItem.mistakeReason,
              reviewPrompt: caseItem.reviewPrompt,
              reviewHref: caseItem.nextHref,
              reviewLabel: caseItem.nextLabel,
              wrongActionLabel: wrongAction?.label ?? "未记录",
            };
          });
        })
        .filter((item): item is NonNullable<typeof item> => Boolean(item)),
    [modules, practiceSets, progressStore.practiceSets],
  );

  const caseReviewItems = useMemo(
    () =>
      caseStudies
        .flatMap((caseStudy) => {
          const saved = progressStore.caseStudies[caseStudy.id];
          const wrongStageIds = saved?.wrongStageIds ?? [];
          if (!wrongStageIds.length) return [];

          return wrongStageIds.map((stageId) => {
            const stage = caseStudy.stages.find((item) => item.id === stageId);
            const module = modules.find((item) => item.id === caseStudy.moduleId);
            const chosenOptionId = saved.answers[stageId];
            const chosenOption = stage?.options.find((item) => item.id === chosenOptionId) ?? null;
            const correctOption = stage?.options.find((item) => item.id === stage?.correctOptionId) ?? null;
            if (!stage) return null;
            return {
              id: `${caseStudy.id}:${stageId}`,
              moduleTitle: module?.title ?? caseStudy.moduleId,
              caseTitle: caseStudy.title,
              stageTitle: stage.title,
              reviewPrompt: stage.reviewPrompt,
              reviewHref: stage.reviewHref,
              reviewLabel: stage.reviewLabel,
              takeaway: stage.takeaway,
              wrongOptionLabel: chosenOption?.label ?? "未记录",
              correctOptionLabel: correctOption?.label ?? "当前更合适路线",
            };
          });
        })
        .filter((item): item is NonNullable<typeof item> => Boolean(item)),
    [caseStudies, modules, progressStore.caseStudies],
  );

  const weakActions = useMemo(() => {
    const buckets = new Map<string, { label: string; href: string; count: number; practiceTitle: string }>();
    for (const practiceSet of practiceSets) {
      const saved = progressStore.practiceSets[practiceSet.id];
      if (!saved) continue;
      for (const wrongCaseId of saved.wrongCaseIds ?? []) {
        const chosenActionId = saved.answers[wrongCaseId];
        const chosenAction = practiceSet.actions.find((item) => item.id === chosenActionId);
        if (!chosenAction) continue;
        const key = `${practiceSet.id}:${chosenAction.id}`;
        const current = buckets.get(key);
        if (current) {
          current.count += 1;
          continue;
        }
        buckets.set(key, {
          label: chosenAction.label,
          href: chosenAction.linkedPrototypeHref,
          count: 1,
          practiceTitle: practiceSet.title,
        });
      }
    }
    return Array.from(buckets.values()).sort((left, right) => right.count - left.count).slice(0, 4);
  }, [practiceSets, progressStore.practiceSets]);

  const moduleProgress = useMemo(() => {
    const moduleDetailMap = new Map(moduleDetails.map((detail) => [detail.moduleId, detail]));
    return modules.map((module) => {
      const detail = moduleDetailMap.get(module.id) ?? null;
      const practiceSet = practiceSets.find((item) => item.moduleId === module.id) ?? null;
      const practiceSaved = practiceSet ? progressStore.practiceSets[practiceSet.id] ?? null : null;
      const moduleCaseStudies = caseStudies.filter((item) => item.moduleId === module.id);
      const moduleCaseProgress = moduleCaseStudies.map((caseStudy) => ({
        caseStudy,
        saved: progressStore.caseStudies[caseStudy.id] ?? null,
      }));
      const totalPracticeCases = practiceSet?.cases.length ?? 0;
      const completedPracticeCases = practiceSaved?.revealedCaseIds.length ?? 0;
      const totalCaseStages = moduleCaseStudies.reduce((sum, item) => sum + item.stages.length, 0);
      const completedCaseStages = moduleCaseProgress.reduce((sum, item) => sum + (item.saved?.revealedStageIds.length ?? 0), 0);
      const totalInteractive = totalPracticeCases + totalCaseStages;
      const completedInteractive = completedPracticeCases + completedCaseStages;
      const progressPercent = totalInteractive ? Math.round((completedInteractive / totalInteractive) * 100) : 0;
      const status = getModuleStatus(totalInteractive, completedInteractive);
      const incompleteCaseStudy =
        moduleCaseProgress.find((item) => (item.saved?.revealedStageIds.length ?? 0) < item.caseStudy.stages.length) ?? null;

      let nextAction: { href: string; label: string; summary: string } | null = null;
      if (practiceSet && completedPracticeCases < practiceSet.cases.length) {
        nextAction = {
          href: practiceSaved?.continueHref ?? getPracticeHref(practiceSet.id),
          label: completedPracticeCases ? "继续练习" : "开始练习",
          summary: `${practiceSet.title} 还剩 ${practiceSet.cases.length - completedPracticeCases} 题。`,
        };
      } else if (incompleteCaseStudy) {
        const completedStages = incompleteCaseStudy.saved?.revealedStageIds.length ?? 0;
        nextAction = {
          href: incompleteCaseStudy.saved?.continueHref ?? getCaseStudyHref(incompleteCaseStudy.caseStudy.id),
          label: completedStages ? "继续病例" : "开始病例",
          summary: `${incompleteCaseStudy.caseStudy.title} 还剩 ${incompleteCaseStudy.caseStudy.stages.length - completedStages} 段。`,
        };
      } else if (detail?.nextModuleIds.length) {
        nextAction = {
          href: `/modules/${detail.nextModuleIds[0]}`,
          label: "进入下一模块",
          summary: "当前模块互动部分已走完，可以顺着学习路径往后推。",
        };
      }

      return {
        module,
        detail,
        practiceSet,
        moduleCaseStudies,
        totalInteractive,
        completedInteractive,
        progressPercent,
        status,
        statusLabel: MODULE_STATUS_LABELS[status],
        nextAction,
      };
    });
  }, [caseStudies, moduleDetails, modules, practiceSets, progressStore.caseStudies, progressStore.practiceSets]);

  const learningRecommendations = useMemo(() => {
    const activeItems = [
      ...learningPaths
        .map((path) => {
          const saved = progressStore.learningPaths[path.id];
          if (!saved || saved.completedStepIds.length >= path.steps.length) return null;
          const nextStep = path.steps.find((step) => !saved.completedStepIds.includes(step.id)) ?? path.steps[0];
          return {
            id: `path:${path.id}`,
            title: path.title,
            summary: `你已经完成 ${saved.completedStepIds.length}/${path.steps.length} 步，下一步建议先去 ${nextStep.title}。`,
            href: getLearningPathHref(path.id),
            label: "继续这条路线",
            moduleTitle: path.subtitle,
            lastUpdatedAt: saved.lastUpdatedAt,
          };
        })
        .filter((item): item is NonNullable<typeof item> => Boolean(item)),
      ...practiceSets
        .map((practiceSet) => {
          const saved = progressStore.practiceSets[practiceSet.id];
          if (!saved || saved.revealedCaseIds.length >= practiceSet.cases.length) return null;
          const module = modules.find((item) => item.id === practiceSet.moduleId);
          return {
            id: `practice:${practiceSet.id}`,
            title: practiceSet.title,
            summary: `你已经做了 ${saved.revealedCaseIds.length}/${practiceSet.cases.length} 题，适合继续保持节奏。`,
            href: saved.continueHref ?? getPracticeHref(practiceSet.id),
            label: "继续这组练习",
            moduleTitle: module?.title ?? practiceSet.moduleId,
            lastUpdatedAt: saved.lastUpdatedAt,
          };
        })
        .filter((item): item is NonNullable<typeof item> => Boolean(item)),
      ...caseStudies
        .map((caseStudy) => {
          const saved = progressStore.caseStudies[caseStudy.id];
          if (!saved || saved.revealedStageIds.length >= caseStudy.stages.length) return null;
          const module = modules.find((item) => item.id === caseStudy.moduleId);
          return {
            id: `case:${caseStudy.id}`,
            title: caseStudy.title,
            summary: `你已经走到 ${saved.revealedStageIds.length}/${caseStudy.stages.length} 段，适合继续把主轴走完整。`,
            href: saved.continueHref ?? getCaseStudyHref(caseStudy.id),
            label: "继续这组病例",
            moduleTitle: module?.title ?? caseStudy.moduleId,
            lastUpdatedAt: saved.lastUpdatedAt,
          };
        })
        .filter((item): item is NonNullable<typeof item> => Boolean(item)),
    ].sort(sortByLastUpdated);

    const continueRecommendation = activeItems[0] ?? (() => {
      const firstModule = moduleProgress.find((item) => item.nextAction) ?? null;
      if (!firstModule?.nextAction) return null;
      return {
        id: `module:${firstModule.module.id}`,
        title: firstModule.module.title,
        summary: firstModule.nextAction.summary,
        href: firstModule.nextAction.href,
        label: firstModule.nextAction.label,
        moduleTitle: firstModule.module.title,
      };
    })();

    const reviewRecommendation = reviewItems[0]
      ? {
          title: reviewItems[0].caseTitle,
          summary: `${reviewItems[0].mistakeTag}。你上次更偏向 ${reviewItems[0].wrongActionLabel}。`,
          href: reviewItems[0].reviewHref,
          label: reviewItems[0].reviewLabel,
          moduleTitle: reviewItems[0].moduleTitle,
        }
      : caseReviewItems[0]
        ? {
            title: caseReviewItems[0].stageTitle,
            summary: `${caseReviewItems[0].caseTitle} 里这一段值得回看。你上次更偏向 ${caseReviewItems[0].wrongOptionLabel}。`,
            href: caseReviewItems[0].reviewHref,
            label: caseReviewItems[0].reviewLabel,
            moduleTitle: caseReviewItems[0].moduleTitle,
          }
        : weakActions[0]
          ? {
              title: weakActions[0].label,
              summary: `${weakActions[0].practiceTitle} 里它被误选了 ${weakActions[0].count} 次，值得先回看动作边界。`,
              href: weakActions[0].href,
              label: "回看对应动作图",
              moduleTitle: weakActions[0].practiceTitle,
            }
          : {
              title: "当前没有待复盘记录",
              summary: "如果你刚开始学，可以先进入第一组模块练习，系统才会逐渐知道你最需要回看哪里。",
              href: "/modules/foundations",
              label: "打开圆运动基础",
              moduleTitle: "学习地图",
            };

    const nextModuleRecommendation =
      moduleProgress.find((item) => item.status === "not-started" && item.nextAction) ??
      moduleProgress.find((item) => item.status === "content-only") ??
      moduleProgress.find((item) => item.status === "in-progress") ??
      moduleProgress[0];

    return {
      continueRecommendation,
      reviewRecommendation,
      nextModuleRecommendation: nextModuleRecommendation
        ? {
            title: nextModuleRecommendation.module.title,
            summary:
              nextModuleRecommendation.status === "content-only"
                ? "这个模块内容已经铺好，但互动练习还没补齐，适合先进去把课程主线看明白。"
                : nextModuleRecommendation.nextAction?.summary ?? "这个模块是当前学习路径里最适合往前推进的一站。",
            href: nextModuleRecommendation.nextAction?.href ?? `/modules/${nextModuleRecommendation.module.id}`,
            label: nextModuleRecommendation.nextAction?.label ?? "打开模块",
            moduleTitle: nextModuleRecommendation.module.title,
          }
        : null,
    };
  }, [caseReviewItems, caseStudies, learningPaths, moduleProgress, modules, practiceSets, progressStore.caseStudies, progressStore.learningPaths, progressStore.practiceSets, reviewItems, weakActions]);

  function handleClear() {
    clearLearningProgress();
    setProgressStore({ practiceSets: {}, caseStudies: {}, learningPaths: {} });
  }

  const totalTrackedItems = summaries.totalCases + summaries.totalStages;
  const totalPossibleItems = practiceSets.reduce((sum, item) => sum + item.cases.length, 0) + caseStudies.reduce((sum, item) => sum + item.stages.length, 0);
  const displayedTotal = totalTrackedItems || totalPossibleItems;

  return (
    <section className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="已启动学习链" summary="路线、练习题库和病例推演都会计入。" value={String(summaries.practiceStarted + summaries.caseStarted + summaries.pathStarted)} />
        <MetricCard label="已完成判断" summary="题目和病例阶段都会统计在当前浏览器本地记录里。" value={`${summaries.completedCases + summaries.completedStages}/${displayedTotal}`} />
        <MetricCard label="当前正确率" summary="用来帮助你判断当前更适合继续学还是先回看。" value={`${summaries.accuracy}%`} />
        <MetricCard label="路线完成" summary="整条学习闭环现在也已经能开始累计完成状态。" value={`${summaries.pathCompleted}/${learningPaths.length}`} />
      </div>

      <div className="flex flex-wrap gap-3">
        <Button asChild variant="outline"><Link href={getLearningPathHref(learningPaths[0]?.id ?? "pulse-formula-case-loop")}>去走首条路线</Link></Button>
        <Button asChild variant="outline"><Link href="/diagrams">去看图表目录</Link></Button>
        <Button asChild variant="outline"><Link href="/cases">去看病例推演</Link></Button>
        <Button onClick={handleClear} type="button" variant="ghost">清空本地进度</Button>
      </div>

      <section className="space-y-5">
        <SectionTitle eyebrow="Recommended Next" title="系统建议你接下来先做什么" description="这里不只是展示记录，而是把当前最该继续、最该回看、最该打开的下一步压缩成 3 个动作。" />
        <div className="grid gap-4 xl:grid-cols-3">
          {learningRecommendations.continueRecommendation ? (
            <Card className="border-border/70 bg-card/82">
              <CardHeader className="space-y-3">
                <Badge className="w-fit rounded-full px-3 py-1" variant="accent">继续推进</Badge>
                <CardTitle className="text-[1.55rem]">{learningRecommendations.continueRecommendation.title}</CardTitle>
                <CardDescription className="text-base">{learningRecommendations.continueRecommendation.summary}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Badge variant="outline">{learningRecommendations.continueRecommendation.moduleTitle}</Badge>
                <Button asChild><Link href={learningRecommendations.continueRecommendation.href}>{learningRecommendations.continueRecommendation.label}</Link></Button>
              </CardContent>
            </Card>
          ) : null}
          <Card className="border-border/70 bg-card/82">
            <CardHeader className="space-y-3">
              <Badge className="w-fit rounded-full px-3 py-1" variant="accent">优先复盘</Badge>
              <CardTitle className="text-[1.55rem]">{learningRecommendations.reviewRecommendation.title}</CardTitle>
              <CardDescription className="text-base">{learningRecommendations.reviewRecommendation.summary}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Badge variant="outline">{learningRecommendations.reviewRecommendation.moduleTitle}</Badge>
              <Button asChild variant="outline"><Link href={learningRecommendations.reviewRecommendation.href}>{learningRecommendations.reviewRecommendation.label}</Link></Button>
            </CardContent>
          </Card>
          {learningRecommendations.nextModuleRecommendation ? (
            <Card className="border-border/70 bg-card/82">
              <CardHeader className="space-y-3">
                <Badge className="w-fit rounded-full px-3 py-1" variant="accent">打开下一站</Badge>
                <CardTitle className="text-[1.55rem]">{learningRecommendations.nextModuleRecommendation.title}</CardTitle>
                <CardDescription className="text-base">{learningRecommendations.nextModuleRecommendation.summary}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Badge variant="outline">{learningRecommendations.nextModuleRecommendation.moduleTitle}</Badge>
                <Button asChild variant="outline"><Link href={learningRecommendations.nextModuleRecommendation.href}>{learningRecommendations.nextModuleRecommendation.label}</Link></Button>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </section>

      <section className="space-y-5">
        <SectionTitle eyebrow="Learning Routes" title="路线进度" description="先看整条学习闭环走到了哪里，再决定是继续推进、回看错题，还是打开下一模块。" />
        <div className="grid gap-4">
          {learningPathProgress.map((item) => (
            <Card className="border-border/70 bg-card/82" key={item.path.id}>
              <CardHeader className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-2">
                    <Badge className="w-fit rounded-full px-3 py-1" variant="outline">Learning Path</Badge>
                    <CardTitle className="text-[1.7rem]">{item.path.title}</CardTitle>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{item.completedSteps}/{item.path.steps.length} 步已完成</Badge>
                    <Badge variant="outline">{item.path.estimatedTime}</Badge>
                  </div>
                </div>
                <CardDescription className="text-base">{item.path.targetOutcome}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Progress value={item.progressPercent} />
                  <p className="text-sm leading-7 text-muted-foreground">{item.saved ? `当前路线完成度 ${item.progressPercent}%，下一步 ${item.nextStep?.title ?? "已完成"}。` : "这条路线还没开始，适合拿来做第一次完整试学。"}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button asChild variant="outline"><Link href={getLearningPathHref(item.path.id)}>{item.saved ? "继续这条路线" : "开始这条路线"}</Link></Button>
                  <Button asChild variant="ghost"><Link href="/paths">查看路线目录</Link></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <SectionTitle eyebrow="Module Status" title="模块状态" description="先把每个模块处于未开始、进行中还是已完成看清楚，再决定是往前推还是先回头补漏。" />
        <div className="grid gap-4 lg:grid-cols-2">
          {moduleProgress.map((item, index) => (
            <Card className="border-border/70 bg-card/82" key={item.module.id}>
              <CardHeader className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">Step {index + 1}</Badge>
                  <Badge variant="secondary">{item.statusLabel}</Badge>
                  <Badge variant="outline">{item.detail?.estimatedDuration ?? "10-15 分钟"}</Badge>
                </div>
                <div className="space-y-3">
                  <CardTitle className="text-[1.55rem]">{item.module.title}</CardTitle>
                  <CardDescription className="text-base">{item.module.targetOutcome}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Progress value={item.progressPercent} />
                  <p className="text-sm leading-7 text-muted-foreground">{item.totalInteractive ? `当前互动完成度 ${item.progressPercent}% (${item.completedInteractive}/${item.totalInteractive})` : "这个模块的互动层还在继续补，当前适合先看课程主线。"}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{item.module.conceptIds.length} 个知识点</Badge>
                  <Badge variant="outline">{item.module.diagramIds.length} 张重点图</Badge>
                  {item.practiceSet ? <Badge variant="accent">有练习</Badge> : null}
                  {item.moduleCaseStudies.length > 0 ? <Badge variant="accent">有病例</Badge> : null}
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button asChild variant="outline"><Link href={`/modules/${item.module.id}`}>打开模块</Link></Button>
                  {item.nextAction ? <Button asChild variant="ghost"><Link href={item.nextAction.href}>{item.nextAction.label}</Link></Button> : null}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <div className="grid gap-8 xl:grid-cols-[1.08fr_0.92fr]">
        <div className="space-y-8">
          <section className="space-y-5">
            <SectionTitle eyebrow="Practice Progress" title="练习进度" description="先看哪些练习已经开始、完成了多少，再决定下一步继续哪一组。" />
            <div className="grid gap-4">
              {practiceSets.map((practiceSet) => {
                const saved = progressStore.practiceSets[practiceSet.id];
                const completed = saved?.revealedCaseIds.length ?? 0;
                const correct = saved?.correctCaseIds.length ?? 0;
                const wrong = saved?.wrongCaseIds?.length ?? 0;
                const progressPercent = practiceSet.cases.length ? Math.round((completed / practiceSet.cases.length) * 100) : 0;
                return (
                  <Card className="border-border/70 bg-card/82" key={practiceSet.id}>
                    <CardHeader className="space-y-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline">Practice Set</Badge>
                        <Badge variant="secondary">{completed}/{practiceSet.cases.length} 已完成</Badge>
                        <Badge variant="outline">{correct} 题答对</Badge>
                        <Badge variant="outline">{wrong} 题待复盘</Badge>
                      </div>
                      <div className="space-y-3">
                        <CardTitle className="text-[1.45rem]">{practiceSet.title}</CardTitle>
                        <CardDescription className="text-base">{practiceSet.objective}</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Progress value={progressPercent} />
                      <div className="flex flex-wrap gap-2">
                        {practiceSet.actions.map((action) => <Badge className="rounded-full px-3 py-1" key={action.id} variant="outline">{action.shortLabel}</Badge>)}
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <Button asChild variant="outline"><Link href={saved?.continueHref ?? getPracticeHref(practiceSet.id)}>{completed ? "继续练习" : "开始练习"}</Link></Button>
                        <Button asChild variant="ghost"><Link href={`/modules/${practiceSet.moduleId}`}>回到所属模块</Link></Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          <section className="space-y-5">
            <SectionTitle eyebrow="Case Progress" title="病例推演进度" description="病例现在也能续学了，可以直接看每一组已经走到哪一段、哪几步还需要回看。" />
            <div className="grid gap-4">
              {caseStudies.map((caseStudy) => {
                const saved = progressStore.caseStudies[caseStudy.id];
                const completed = saved?.revealedStageIds.length ?? 0;
                const correct = saved?.correctStageIds.length ?? 0;
                const wrong = saved?.wrongStageIds.length ?? 0;
                const progressPercent = caseStudy.stages.length ? Math.round((completed / caseStudy.stages.length) * 100) : 0;
                return (
                  <Card className="border-border/70 bg-card/82" key={caseStudy.id}>
                    <CardHeader className="space-y-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline">Case Study</Badge>
                        <Badge variant="secondary">{completed}/{caseStudy.stages.length} 已完成</Badge>
                        <Badge variant="outline">{correct} 段判断正确</Badge>
                        <Badge variant="outline">{wrong} 段待复盘</Badge>
                      </div>
                      <div className="space-y-3">
                        <CardTitle className="text-[1.45rem]">{caseStudy.title}</CardTitle>
                        <CardDescription className="text-base">{caseStudy.targetSkill}</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Progress value={progressPercent} />
                      <div className="flex flex-wrap gap-2">
                        {caseStudy.stages.map((stage) => <Badge className="rounded-full px-3 py-1" key={stage.id} variant="outline">{stage.title}</Badge>)}
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <Button asChild variant="outline"><Link href={saved?.continueHref ?? getCaseStudyHref(caseStudy.id)}>{completed ? "继续病例" : "开始病例"}</Link></Button>
                        <Button asChild variant="ghost"><Link href={`/modules/${caseStudy.moduleId}`}>回到所属模块</Link></Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section className="space-y-5">
            <SectionTitle eyebrow="Review Queue" title="错题回看" description="这里聚合当前浏览器里做错过的题，帮助你直接跳回对应动作图和模块。" />
            <div className="grid gap-4">
              {reviewItems.length > 0 ? reviewItems.map((item) => (
                <Card className="border-border/70 bg-card/82" key={item.id}>
                  <CardHeader className="space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline">{item.moduleTitle}</Badge>
                      <Badge variant="secondary">{item.practiceTitle}</Badge>
                      <Badge variant="outline">{item.difficulty}</Badge>
                    </div>
                    <div className="space-y-3">
                      <CardTitle className="text-[1.35rem]">{item.caseTitle}</CardTitle>
                      <CardDescription className="text-base">{item.mistakeTag}。你当时更偏向 {item.wrongActionLabel}。</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm leading-7 text-foreground/85">{item.mistakeReason}</p>
                    <p className="text-sm leading-7 text-muted-foreground">{item.reviewPrompt}</p>
                    <Button asChild variant="outline"><Link href={item.reviewHref}>{item.reviewLabel}</Link></Button>
                  </CardContent>
                </Card>
              )) : (
                <Card className="border-border/70 bg-card/82"><CardContent className="space-y-3 p-6"><Badge className="w-fit rounded-full px-3 py-1" variant="outline">Review Queue</Badge><strong className="block text-lg text-foreground">当前还没有错题记录</strong><p className="text-sm leading-7 text-muted-foreground">先去做一组练习，进度页就会开始生成错题回看和复习建议。</p></CardContent></Card>
              )}
            </div>
          </section>

          <section className="space-y-5">
            <SectionTitle eyebrow="Case Review" title="病例回看" description="这里聚合你在病例推演里走偏过的阶段，帮助你直接跳回对应模块或图表入口。" />
            <div className="grid gap-4">
              {caseReviewItems.length > 0 ? caseReviewItems.map((item) => (
                <Card className="border-border/70 bg-card/82" key={item.id}>
                  <CardHeader className="space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline">{item.moduleTitle}</Badge>
                      <Badge variant="secondary">{item.caseTitle}</Badge>
                    </div>
                    <div className="space-y-3">
                      <CardTitle className="text-[1.35rem]">{item.stageTitle}</CardTitle>
                      <CardDescription className="text-base">你当时更偏向 {item.wrongOptionLabel}，当前更合适 {item.correctOptionLabel}。</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm leading-7 text-foreground/85">{item.takeaway}</p>
                    <p className="text-sm leading-7 text-muted-foreground">{item.reviewPrompt}</p>
                    <Button asChild variant="outline"><Link href={item.reviewHref}>{item.reviewLabel}</Link></Button>
                  </CardContent>
                </Card>
              )) : (
                <Card className="border-border/70 bg-card/82"><CardContent className="space-y-3 p-6"><Badge className="w-fit rounded-full px-3 py-1" variant="outline">Case Review</Badge><strong className="block text-lg text-foreground">当前还没有病例回看记录</strong><p className="text-sm leading-7 text-muted-foreground">先走完一组病例推演，进度页就会开始积累需要回看的阶段节点。</p></CardContent></Card>
              )}
            </div>
          </section>

          <section className="space-y-5">
            <SectionTitle eyebrow="Weak Actions" title="最容易混淆的动作" description="不是只看哪题错了，还要看你最容易把哪种动作混成另一种动作。" />
            <div className="grid gap-4">
              {weakActions.length > 0 ? weakActions.map((item) => (
                <Card className="border-border/70 bg-card/82" key={`${item.practiceTitle}:${item.label}`}>
                  <CardHeader className="space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline">Weak Action</Badge>
                      <Badge variant="secondary">{item.count} 次误选</Badge>
                    </div>
                    <div className="space-y-3">
                      <CardTitle className="text-[1.35rem]">{item.label}</CardTitle>
                      <CardDescription className="text-base">{item.practiceTitle}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent><Button asChild variant="outline"><Link href={item.href}>回看对应动作图</Link></Button></CardContent>
                </Card>
              )) : (
                <Card className="border-border/70 bg-card/82"><CardContent className="space-y-3 p-6"><Badge className="w-fit rounded-full px-3 py-1" variant="outline">Weak Action</Badge><strong className="block text-lg text-foreground">当前还没有动作混淆记录</strong><p className="text-sm leading-7 text-muted-foreground">先做题，系统才会知道你最容易把哪类动作混成别的动作。</p></CardContent></Card>
              )}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
