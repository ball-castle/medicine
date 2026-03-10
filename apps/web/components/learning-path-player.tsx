"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { LearningPathRecord, LearningPathStepRecord } from "@medicine/content-schema";

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
  const nextStep = path.steps[selectedIndex + 1] ?? null;

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
      <section className="path-player path-player--empty">
        <article className="phase-card">
          <p>当前路线还没有可展示的学习步骤。</p>
        </article>
      </section>
    );
  }

  return (
    <section className="path-player">
      <div className="path-player__sidebar">
        <div className="path-player__intro">
          <p className="eyebrow">Learning Route</p>
          <h2>{path.title}</h2>
          <p>{path.summary}</p>
        </div>

        <div className="path-player__summary">
          <article className="path-player__summary-card">
            <p className="path-player__label">当前完成度</p>
            <strong>
              {completedStepIds.length}/{path.steps.length}
            </strong>
            <span>{progressPercent}% 已完成</span>
          </article>
          <article className="path-player__summary-card">
            <p className="path-player__label">目标结果</p>
            <strong>{path.targetOutcome}</strong>
            <span>{path.estimatedTime}</span>
          </article>
        </div>

        <div className="path-player__step-list">
          {path.steps.map((step, index) => {
            const isDone = completedStepIds.includes(step.id);
            const isActive = selectedStep.id === step.id;

            return (
              <button
                className={`path-player__step-tab ${isActive ? "is-active" : ""} ${isDone ? "is-done" : ""}`}
                key={step.id}
                onClick={() => continueToStep(step.id)}
                type="button"
              >
                <div className="path-player__step-meta">
                  <span>{index + 1}</span>
                  <em>{step.kind}</em>
                </div>
                <strong>{step.title}</strong>
                <p>{step.goal}</p>
              </button>
            );
          })}
        </div>

        <div className="path-player__notes">
          <article className="path-player__note-card">
            <p className="path-player__label">下一步建议</p>
            <strong>{summary.nextTitle}</strong>
            <p>这条路线不要求一次看完，但最好按顺序走，不然体验会重新碎回单页面。</p>
          </article>
          <article className="path-player__note-card">
            <p className="path-player__label">收尾检查</p>
            <strong>走完以后至少确认这 4 件事</strong>
            <ul>
              {path.reviewChecklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </div>

      <div className="path-player__stage">
        <div className="path-player__detail-card">
          <div className="path-player__detail-top">
            <div>
              <p className="eyebrow">Current Step</p>
              <h3>{selectedStep.title}</h3>
            </div>
            <div className="path-player__counter">
              {selectedIndex + 1}/{path.steps.length}
            </div>
          </div>
          <p className="path-player__detail-subtitle">{selectedStep.summary}</p>
          <div className="path-player__detail-grid">
            <article className="path-player__detail-panel">
              <p className="path-player__label">这一步要完成什么</p>
              <strong>{selectedStep.goal}</strong>
              <span>{selectedStep.estimatedTime}</span>
            </article>
            <article className="path-player__detail-panel">
              <p className="path-player__label">完成提示</p>
              <strong>{selectedStep.completionHint}</strong>
              <span>走完后直接标记完成，再顺着按钮进入下一步。</span>
            </article>
          </div>

          <div className="path-player__actions">
            <Link className="button button--primary" href={selectedStep.href}>
              {selectedStep.buttonLabel}
            </Link>
            <button
              className="button button--ghost"
              onClick={() => toggleStep(selectedStep)}
              type="button"
            >
              {completedStepIds.includes(selectedStep.id) ? "取消完成" : "标记这一步已完成"}
            </button>
            {nextStep && (
              <button
                className="button button--ghost"
                onClick={() => continueToStep(nextStep.id)}
                type="button"
              >
                跳到下一步
              </button>
            )}
            {!nextStep && completedStepIds.includes(selectedStep.id) && (
              <Link className="button button--ghost" href="/progress">
                打开进度页复盘
              </Link>
            )}
          </div>
        </div>

        <div className="path-player__timeline">
          {path.steps.map((step, index) => {
            const isDone = completedStepIds.includes(step.id);
            const isCurrent = step.id === selectedStep.id;

            return (
              <article
                className={`path-player__timeline-card ${isCurrent ? "is-active" : ""} ${isDone ? "is-done" : ""}`}
                key={step.id}
              >
                <div className="path-player__timeline-top">
                  <span>{index + 1}</span>
                  <em>{step.kind}</em>
                </div>
                <h3>{step.title}</h3>
                <p>{step.summary}</p>
                <div className="token-row">
                  <span className="token token--light">{step.moduleId}</span>
                  <span className="token token--light">{step.estimatedTime}</span>
                  {isDone && <span className="token">已完成</span>}
                </div>
                <div className="path-player__timeline-actions">
                  <button className="button button--ghost" onClick={() => continueToStep(step.id)} type="button">
                    查看这一步
                  </button>
                  <Link className="button button--ghost" href={step.href}>
                    打开页面
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        <article className="path-player__completion-card">
          <p className="path-player__label">路线收尾</p>
          <strong>{summary.finished ? "这条路线已经走完" : "走完以后，你会拿到什么"}</strong>
          <p>{path.completionMessage}</p>
          <div className="path-player__actions">
            <Link className="button button--ghost" href={summary.nextHref}>
              {summary.nextLabel}
            </Link>
            <Link className="button button--ghost" href="/paths">
              查看路线目录
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}
