"use client";

import type {
  CaseStudyRecord,
  ModuleDetailRecord,
  ModuleRecord,
  PracticeSetRecord,
} from "@medicine/content-schema";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { getCaseStudyHref } from "@/lib/cases";
import { clearLearningProgress, readLearningProgress } from "@/lib/learning-progress";
import type { LearningProgressStore } from "@/lib/learning-progress";
import { getPracticeHref } from "@/lib/practice";

type ProgressDashboardProps = {
  modules: ModuleRecord[];
  moduleDetails: ModuleDetailRecord[];
  practiceSets: PracticeSetRecord[];
  caseStudies: CaseStudyRecord[];
};

type ModuleStatus = "not-started" | "in-progress" | "completed" | "content-only";

const MODULE_STATUS_LABELS: Record<ModuleStatus, string> = {
  "not-started": "未开始",
  "in-progress": "进行中",
  completed: "已完成",
  "content-only": "内容已铺好",
};

function getModuleStatus(totalInteractive: number, completedInteractive: number): ModuleStatus {
  if (!totalInteractive) {
    return "content-only";
  }

  if (!completedInteractive) {
    return "not-started";
  }

  if (completedInteractive >= totalInteractive) {
    return "completed";
  }

  return "in-progress";
}

function sortByLastUpdated(left: { lastUpdatedAt: string }, right: { lastUpdatedAt: string }) {
  return Date.parse(right.lastUpdatedAt) - Date.parse(left.lastUpdatedAt);
}

export function ProgressDashboard({
  modules,
  moduleDetails,
  practiceSets,
  caseStudies,
}: ProgressDashboardProps) {
  const [progressStore, setProgressStore] = useState<LearningProgressStore>({
    practiceSets: {},
    caseStudies: {},
  });

  useEffect(() => {
    setProgressStore(readLearningProgress());
  }, []);

  const summaries = useMemo(() => {
    const practiceProgress = Object.values(progressStore.practiceSets);
    const caseProgress = Object.values(progressStore.caseStudies);
    const totalCases = practiceProgress.reduce((sum, item) => sum + item.totalCases, 0);
    const completedCases = practiceProgress.reduce((sum, item) => sum + item.revealedCaseIds.length, 0);
    const correctCases = practiceProgress.reduce((sum, item) => sum + item.correctCaseIds.length, 0);
    const totalStages = caseProgress.reduce((sum, item) => sum + item.totalStages, 0);
    const completedStages = caseProgress.reduce((sum, item) => sum + item.revealedStageIds.length, 0);
    const correctStages = caseProgress.reduce((sum, item) => sum + item.correctStageIds.length, 0);
    const completedItems = completedCases + completedStages;
    const correctItems = correctCases + correctStages;
    const accuracy = completedItems ? Math.round((correctItems / completedItems) * 100) : 0;

    return {
      practiceStarted: practiceProgress.length,
      caseStarted: caseProgress.length,
      totalCases,
      completedCases,
      totalStages,
      completedStages,
      accuracy,
    };
  }, [progressStore.caseStudies, progressStore.practiceSets]);

  const reviewItems = useMemo(() => {
    return practiceSets
      .flatMap((practiceSet) => {
        const saved = progressStore.practiceSets[practiceSet.id];
        const wrongCaseIds = saved?.wrongCaseIds ?? [];
        if (!wrongCaseIds.length) {
          return [];
        }

        return wrongCaseIds.map((caseId) => {
          const caseItem = practiceSet.cases.find((item) => item.id === caseId);
          const module = modules.find((item) => item.id === practiceSet.moduleId);
          const answerId = saved.answers[caseId];
          const wrongAction = practiceSet.actions.find((item) => item.id === answerId) ?? null;

          if (!caseItem) {
            return null;
          }

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
      .filter((item): item is NonNullable<typeof item> => Boolean(item));
  }, [modules, practiceSets, progressStore.practiceSets]);

  const caseReviewItems = useMemo(() => {
    return caseStudies
      .flatMap((caseStudy) => {
        const saved = progressStore.caseStudies[caseStudy.id];
        const wrongStageIds = saved?.wrongStageIds ?? [];
        if (!wrongStageIds.length) {
          return [];
        }

        return wrongStageIds.map((stageId) => {
          const stage = caseStudy.stages.find((item) => item.id === stageId);
          const module = modules.find((item) => item.id === caseStudy.moduleId);
          const chosenOptionId = saved.answers[stageId];
          const chosenOption = stage?.options.find((item) => item.id === chosenOptionId) ?? null;
          const correctOption = stage?.options.find((item) => item.id === stage?.correctOptionId) ?? null;

          if (!stage) {
            return null;
          }

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
      .filter((item): item is NonNullable<typeof item> => Boolean(item));
  }, [caseStudies, modules, progressStore.caseStudies]);

  const weakActions = useMemo(() => {
    const buckets = new Map<
      string,
      {
        label: string;
        href: string;
        count: number;
        practiceTitle: string;
      }
    >();

    for (const practiceSet of practiceSets) {
      const saved = progressStore.practiceSets[practiceSet.id];
      if (!saved) {
        continue;
      }

      for (const wrongCaseId of saved.wrongCaseIds ?? []) {
        const chosenActionId = saved.answers[wrongCaseId];
        const chosenAction = practiceSet.actions.find((item) => item.id === chosenActionId);
        if (!chosenAction) {
          continue;
        }

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
      const moduleCaseProgress = moduleCaseStudies
        .map((caseStudy) => ({
          caseStudy,
          saved: progressStore.caseStudies[caseStudy.id] ?? null,
        }));

      const totalPracticeCases = practiceSet?.cases.length ?? 0;
      const completedPracticeCases = practiceSaved?.revealedCaseIds.length ?? 0;
      const totalCaseStages = moduleCaseStudies.reduce((sum, item) => sum + item.stages.length, 0);
      const completedCaseStages = moduleCaseProgress.reduce(
        (sum, item) => sum + (item.saved?.revealedStageIds.length ?? 0),
        0,
      );
      const totalInteractive = totalPracticeCases + totalCaseStages;
      const completedInteractive = completedPracticeCases + completedCaseStages;
      const progressPercent = totalInteractive ? Math.round((completedInteractive / totalInteractive) * 100) : 0;
      const status = getModuleStatus(totalInteractive, completedInteractive);

      const incompleteCaseStudy =
        moduleCaseProgress.find(
          (item) => (item.saved?.revealedStageIds.length ?? 0) < item.caseStudy.stages.length,
        ) ?? null;

      let nextAction:
        | {
            href: string;
            label: string;
            summary: string;
          }
        | null = null;

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
          summary: `${incompleteCaseStudy.caseStudy.title} 还剩 ${
            incompleteCaseStudy.caseStudy.stages.length - completedStages
          } 段。`,
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
        practiceSaved,
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
      ...practiceSets
        .map((practiceSet) => {
          const saved = progressStore.practiceSets[practiceSet.id];
          if (!saved || saved.revealedCaseIds.length >= practiceSet.cases.length) {
            return null;
          }

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
          if (!saved || saved.revealedStageIds.length >= caseStudy.stages.length) {
            return null;
          }

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

    const continueRecommendation =
      activeItems[0] ??
      (() => {
        const firstModule = moduleProgress.find((item) => item.nextAction) ?? null;
        if (!firstModule?.nextAction) {
          return null;
        }

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
                : nextModuleRecommendation.nextAction?.summary ??
                  "这个模块是当前学习路径里最适合往前推进的一站。",
            href: nextModuleRecommendation.nextAction?.href ?? `/modules/${nextModuleRecommendation.module.id}`,
            label: nextModuleRecommendation.nextAction?.label ?? "打开模块",
            moduleTitle: nextModuleRecommendation.module.title,
          }
        : null,
    };
  }, [caseReviewItems, caseStudies, moduleProgress, modules, practiceSets, progressStore.caseStudies, progressStore.practiceSets, reviewItems, weakActions]);

  function handleClear() {
    clearLearningProgress();
    setProgressStore({ practiceSets: {}, caseStudies: {} });
  }

  return (
    <section className="progress-dashboard">
      <div className="progress-dashboard__summary">
        <article className="progress-dashboard__metric">
          <p className="progress-dashboard__label">已启动学习链</p>
          <strong>{summaries.practiceStarted + summaries.caseStarted}</strong>
          <span>练习题库和病例推演都会计入。</span>
        </article>
        <article className="progress-dashboard__metric">
          <p className="progress-dashboard__label">已完成判断</p>
          <strong>
            {summaries.completedCases + summaries.completedStages}/
            {summaries.totalCases + summaries.totalStages ||
              practiceSets.reduce((sum, item) => sum + item.cases.length, 0) +
                caseStudies.reduce((sum, item) => sum + item.stages.length, 0)}
          </strong>
          <span>题目和病例阶段都会统计在当前浏览器本地记录里。</span>
        </article>
        <article className="progress-dashboard__metric">
          <p className="progress-dashboard__label">当前正确率</p>
          <strong>{summaries.accuracy}%</strong>
          <span>用来帮助你判断当前更适合继续学还是先回看。</span>
        </article>
        <article className="progress-dashboard__metric">
          <p className="progress-dashboard__label">病例进度</p>
          <strong>
            {summaries.completedStages}/
            {summaries.totalStages || caseStudies.reduce((sum, item) => sum + item.stages.length, 0)}
          </strong>
          <span>现在病例推演也已经进入可续学、可复盘的状态。</span>
        </article>
      </div>

      <div className="progress-dashboard__toolbar">
        <Link className="button button--ghost" href="/diagrams">
          去看图表目录
        </Link>
        <Link className="button button--ghost" href="/cases">
          去看病例推演
        </Link>
        <button className="button button--ghost" onClick={handleClear} type="button">
          清空本地进度
        </button>
      </div>

      <div className="section-heading">
        <p className="eyebrow">Recommended Next</p>
        <h2>系统建议你接下来先做什么</h2>
        <p>这里不只是展示记录，而是把当前最该继续、最该回看、最该打开的下一步压缩成 3 个动作。</p>
      </div>
      <div className="progress-dashboard__recommendations">
        {learningRecommendations.continueRecommendation && (
          <article className="progress-dashboard__card">
            <p className="progress-dashboard__label">继续推进</p>
            <h3>{learningRecommendations.continueRecommendation.title}</h3>
            <p>{learningRecommendations.continueRecommendation.summary}</p>
            <div className="progress-dashboard__meta">
              <span>{learningRecommendations.continueRecommendation.moduleTitle}</span>
            </div>
            <div className="progress-dashboard__actions">
              <Link className="button button--ghost" href={learningRecommendations.continueRecommendation.href}>
                {learningRecommendations.continueRecommendation.label}
              </Link>
            </div>
          </article>
        )}

        <article className="progress-dashboard__card">
          <p className="progress-dashboard__label">优先复盘</p>
          <h3>{learningRecommendations.reviewRecommendation.title}</h3>
          <p>{learningRecommendations.reviewRecommendation.summary}</p>
          <div className="progress-dashboard__meta">
            <span>{learningRecommendations.reviewRecommendation.moduleTitle}</span>
          </div>
          <div className="progress-dashboard__actions">
            <Link className="button button--ghost" href={learningRecommendations.reviewRecommendation.href}>
              {learningRecommendations.reviewRecommendation.label}
            </Link>
          </div>
        </article>

        {learningRecommendations.nextModuleRecommendation && (
          <article className="progress-dashboard__card">
            <p className="progress-dashboard__label">打开下一站</p>
            <h3>{learningRecommendations.nextModuleRecommendation.title}</h3>
            <p>{learningRecommendations.nextModuleRecommendation.summary}</p>
            <div className="progress-dashboard__meta">
              <span>{learningRecommendations.nextModuleRecommendation.moduleTitle}</span>
            </div>
            <div className="progress-dashboard__actions">
              <Link className="button button--ghost" href={learningRecommendations.nextModuleRecommendation.href}>
                {learningRecommendations.nextModuleRecommendation.label}
              </Link>
            </div>
          </article>
        )}
      </div>

      <div className="section-heading">
        <p className="eyebrow">Module Status</p>
        <h2>模块状态</h2>
        <p>先把每个模块处于未开始、进行中还是已完成看清楚，再决定是往前推还是先回头补漏。</p>
      </div>
      <div className="progress-dashboard__cards">
        {moduleProgress.map((item, index) => (
          <article className="progress-dashboard__card" key={item.module.id}>
            <p className="progress-dashboard__label">Step {index + 1}</p>
            <h3>{item.module.title}</h3>
            <p>{item.module.targetOutcome}</p>
            <div className="progress-dashboard__meta">
              <span>{item.statusLabel}</span>
              <span>
                {item.completedInteractive}/{item.totalInteractive || 0} 互动完成
              </span>
              <span>{item.detail?.estimatedDuration ?? "10-15 分钟"}</span>
            </div>
            <div className="progress-dashboard__bar">
              <span style={{ width: `${item.progressPercent}%` }} />
            </div>
            <p className="progress-dashboard__bar-caption">
              {item.totalInteractive
                ? `当前互动完成度 ${item.progressPercent}%`
                : "这个模块的互动层还在继续补，当前适合先看课程主线。"}
            </p>
            <div className="token-row">
              <span className="token token--light">{item.module.conceptIds.length} 个知识点</span>
              <span className="token token--light">{item.module.diagramIds.length} 张重点图</span>
              {item.practiceSet && <span className="token">有练习</span>}
              {item.moduleCaseStudies.length > 0 && <span className="token">有病例</span>}
            </div>
            <div className="progress-dashboard__actions">
              <Link className="button button--ghost" href={`/modules/${item.module.id}`}>
                打开模块
              </Link>
              {item.nextAction && (
                <Link className="button button--ghost" href={item.nextAction.href}>
                  {item.nextAction.label}
                </Link>
              )}
            </div>
          </article>
        ))}
      </div>

      <div className="progress-dashboard__grid">
        <div className="progress-dashboard__column">
          <div className="section-heading">
            <p className="eyebrow">Practice Progress</p>
            <h2>练习进度</h2>
            <p>先看哪些练习已经开始、完成了多少，再决定下一步继续哪一组。</p>
          </div>
          <div className="progress-dashboard__cards">
            {practiceSets.map((practiceSet) => {
              const saved = progressStore.practiceSets[practiceSet.id];
              const completed = saved?.revealedCaseIds.length ?? 0;
              const correct = saved?.correctCaseIds.length ?? 0;
              const wrong = saved?.wrongCaseIds?.length ?? 0;

              return (
                <article className="progress-dashboard__card" key={practiceSet.id}>
                  <p className="progress-dashboard__label">Practice Set</p>
                  <h3>{practiceSet.title}</h3>
                  <p>{practiceSet.objective}</p>
                  <div className="progress-dashboard__meta">
                    <span>{completed}/{practiceSet.cases.length} 已完成</span>
                    <span>{correct} 题答对</span>
                    <span>{wrong} 题待复盘</span>
                  </div>
                  <div className="token-row">
                    {practiceSet.actions.map((action) => (
                      <span className="token" key={action.id}>
                        {action.shortLabel}
                      </span>
                    ))}
                  </div>
                  <div className="progress-dashboard__actions">
                    <Link className="button button--ghost" href={saved?.continueHref ?? getPracticeHref(practiceSet.id)}>
                      {completed ? "继续练习" : "开始练习"}
                    </Link>
                    <Link className="button button--ghost" href={`/modules/${practiceSet.moduleId}`}>
                      回到所属模块
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="section-heading">
            <p className="eyebrow">Case Progress</p>
            <h2>病例推演进度</h2>
            <p>病例现在也能续学了，可以直接看每一组已经走到哪一段、哪几步还需要回看。</p>
          </div>
          <div className="progress-dashboard__cards">
            {caseStudies.map((caseStudy) => {
              const saved = progressStore.caseStudies[caseStudy.id];
              const completed = saved?.revealedStageIds.length ?? 0;
              const correct = saved?.correctStageIds.length ?? 0;
              const wrong = saved?.wrongStageIds.length ?? 0;

              return (
                <article className="progress-dashboard__card" key={caseStudy.id}>
                  <p className="progress-dashboard__label">Case Study</p>
                  <h3>{caseStudy.title}</h3>
                  <p>{caseStudy.targetSkill}</p>
                  <div className="progress-dashboard__meta">
                    <span>{completed}/{caseStudy.stages.length} 已完成</span>
                    <span>{correct} 段判断正确</span>
                    <span>{wrong} 段待复盘</span>
                  </div>
                  <div className="token-row">
                    {caseStudy.stages.map((stage) => (
                      <span className="token token--light" key={stage.id}>
                        {stage.title}
                      </span>
                    ))}
                  </div>
                  <div className="progress-dashboard__actions">
                    <Link className="button button--ghost" href={saved?.continueHref ?? getCaseStudyHref(caseStudy.id)}>
                      {completed ? "继续病例" : "开始病例"}
                    </Link>
                    <Link className="button button--ghost" href={`/modules/${caseStudy.moduleId}`}>
                      回到所属模块
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="progress-dashboard__column">
          <div className="section-heading">
            <p className="eyebrow">Review Queue</p>
            <h2>错题回看</h2>
            <p>这里聚合当前浏览器里做错过的题，帮助你直接跳回对应动作图和模块。</p>
          </div>
          <div className="progress-dashboard__cards">
            {reviewItems.length > 0 ? (
              reviewItems.map((item) => (
                <article className="progress-dashboard__card" key={item.id}>
                  <p className="progress-dashboard__label">{item.moduleTitle}</p>
                  <h3>{item.caseTitle}</h3>
                  <p>{item.mistakeTag}</p>
                  <div className="progress-dashboard__meta">
                    <span>{item.practiceTitle}</span>
                    <span>{item.difficulty}</span>
                    <span>你当时更偏向 {item.wrongActionLabel}</span>
                  </div>
                  <p>{item.mistakeReason}</p>
                  <p>{item.reviewPrompt}</p>
                  <div className="progress-dashboard__actions">
                    <Link className="button button--ghost" href={item.reviewHref}>
                      {item.reviewLabel}
                    </Link>
                  </div>
                </article>
              ))
            ) : (
              <article className="progress-dashboard__card">
                <p className="progress-dashboard__label">Review Queue</p>
                <h3>当前还没有错题记录</h3>
                <p>先去做一组练习，进度页就会开始生成错题回看和复习建议。</p>
              </article>
            )}
          </div>

          <div className="section-heading">
            <p className="eyebrow">Case Review</p>
            <h2>病例回看</h2>
            <p>这里聚合你在病例推演里走偏过的阶段，帮助你直接跳回对应模块或图表入口。</p>
          </div>
          <div className="progress-dashboard__cards">
            {caseReviewItems.length > 0 ? (
              caseReviewItems.map((item) => (
                <article className="progress-dashboard__card" key={item.id}>
                  <p className="progress-dashboard__label">{item.moduleTitle}</p>
                  <h3>{item.stageTitle}</h3>
                  <p>{item.caseTitle}</p>
                  <div className="progress-dashboard__meta">
                    <span>你当时更偏向 {item.wrongOptionLabel}</span>
                    <span>当前更合适 {item.correctOptionLabel}</span>
                  </div>
                  <p>{item.takeaway}</p>
                  <p>{item.reviewPrompt}</p>
                  <div className="progress-dashboard__actions">
                    <Link className="button button--ghost" href={item.reviewHref}>
                      {item.reviewLabel}
                    </Link>
                  </div>
                </article>
              ))
            ) : (
              <article className="progress-dashboard__card">
                <p className="progress-dashboard__label">Case Review</p>
                <h3>当前还没有病例回看记录</h3>
                <p>先走完一组病例推演，进度页就会开始积累需要回看的阶段节点。</p>
              </article>
            )}
          </div>

          <div className="section-heading">
            <p className="eyebrow">Weak Actions</p>
            <h2>最容易混淆的动作</h2>
            <p>不是只看哪题错了，还要看你最容易把哪种动作混成另一种动作。</p>
          </div>
          <div className="progress-dashboard__cards">
            {weakActions.length > 0 ? (
              weakActions.map((item) => (
                <article className="progress-dashboard__card" key={`${item.practiceTitle}:${item.label}`}>
                  <p className="progress-dashboard__label">Weak Action</p>
                  <h3>{item.label}</h3>
                  <p>{item.practiceTitle}</p>
                  <div className="progress-dashboard__meta">
                    <span>{item.count} 次误选</span>
                  </div>
                  <div className="progress-dashboard__actions">
                    <Link className="button button--ghost" href={item.href}>
                      回看对应动作图
                    </Link>
                  </div>
                </article>
              ))
            ) : (
              <article className="progress-dashboard__card">
                <p className="progress-dashboard__label">Weak Action</p>
                <h3>当前还没有动作混淆记录</h3>
                <p>先做题，系统才会知道你最容易把哪类动作混成别的动作。</p>
              </article>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
