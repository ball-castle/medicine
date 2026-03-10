"use client";

import type { CaseStudyRecord } from "@medicine/content-schema";
import Link from "next/link";
import { useEffect, useState } from "react";

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
  const correct = caseStudy.stages.filter(
    (stage) => revealed[stage.id] && answers[stage.id] === stage.correctOptionId,
  ).length;
  const currentResult =
    isRevealed && currentAnswer ? currentAnswer === currentStage.correctOptionId : null;
  const chosenOption =
    currentAnswer ? currentStage.options.find((option) => option.id === currentAnswer) ?? null : null;
  const correctOption =
    currentStage.options.find((option) => option.id === currentStage.correctOptionId) ?? null;

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
    <section className="case-study-player">
      <div className="case-study-player__sidebar">
        <div className="case-study-player__intro">
          <p className="eyebrow">Case Study</p>
          <h2>{caseStudy.title}</h2>
          <p>{caseStudy.summary}</p>
        </div>

        <div className="case-study-player__summary">
          <article className="case-study-player__summary-card">
            <p className="case-study-player__label">已完成阶段</p>
            <strong>
              {finished}/{caseStudy.stages.length}
            </strong>
            <span>这类病例的关键不是背结论，而是跟着节奏看主轴怎么变。</span>
          </article>
          <article className="case-study-player__summary-card">
            <p className="case-study-player__label">当前判断</p>
            <strong>
              {correct}/{finished || 1}
            </strong>
            <span>{caseStudy.targetSkill}</span>
          </article>
        </div>

        <div className="token-row">
          <span className="token token--light">{caseStudy.estimatedTime}</span>
          <span className="token token--light">{caseStudy.stages.length} 个阶段</span>
        </div>

        <div className="case-study-player__stage-tabs">
          {caseStudy.stages.map((stage, index) => {
            const answered = revealed[stage.id];
            const isCorrect = answers[stage.id] === stage.correctOptionId;

            return (
              <button
                className={`case-study-player__stage-tab ${index === stageIndex ? "is-active" : ""}`}
                key={stage.id}
                onClick={() => setStageIndex(index)}
                type="button"
              >
                <strong>{stage.title}</strong>
                <span>{stage.stateSummary}</span>
                <em className={answered ? (isCorrect ? "is-correct" : "is-wrong") : ""}>
                  {answered ? (isCorrect ? "已答对" : "已解析") : "未判断"}
                </em>
              </button>
            );
          })}
        </div>
      </div>

      <div className="case-study-player__stage">
        <article className="case-study-player__prompt-card">
          <div className="case-study-player__prompt-top">
            <div>
              <p className="eyebrow">Stage</p>
              <h3>{currentStage.title}</h3>
            </div>
            <span className="case-study-player__counter">
              {stageIndex + 1}/{caseStudy.stages.length}
            </span>
          </div>
          <p className="case-study-player__state-summary">{currentStage.stateSummary}</p>
          <p className="case-study-player__question">{currentStage.question}</p>
          <div className="case-study-player__clues">
            {currentStage.clues.map((clue) => (
              <article className="case-study-player__clue" key={clue}>
                <p>{clue}</p>
              </article>
            ))}
          </div>
        </article>

        <div className="case-study-player__options">
          {currentStage.options.map((option) => {
            const isActive = currentAnswer === option.id;
            const resultClass =
              isRevealed && option.id === currentStage.correctOptionId
                ? "is-correct"
                : isRevealed && isActive && option.id !== currentStage.correctOptionId
                  ? "is-wrong"
                  : "";

            return (
              <button
                className={`case-study-player__option ${isActive ? "is-active" : ""} ${resultClass}`.trim()}
                key={option.id}
                onClick={() => setAnswers((prev) => ({ ...prev, [currentStage.id]: option.id }))}
                type="button"
              >
                <p>{option.label}</p>
                <strong>{option.summary}</strong>
                <span>{isRevealed ? currentStage.optionFeedbacks[option.id] : "先判断这一步是否更该往这条路走。"}</span>
              </button>
            );
          })}
        </div>

        <div className="case-study-player__actions-row">
          <button
            className="button button--primary"
            disabled={!currentAnswer || isRevealed}
            onClick={handleReveal}
            type="button"
          >
            提交阶段判断
          </button>
          <button className="button button--ghost" onClick={handleNextStage} type="button">
            下一阶段
          </button>
          <Link className="button button--ghost" href="/cases">
            查看病例目录
          </Link>
        </div>

        {isRevealed && currentAnswer && chosenOption && (
          <div className="case-study-player__feedback">
            <article className={`case-study-player__result-card ${currentResult ? "is-correct" : "is-wrong"}`}>
              <p className="case-study-player__label">阶段结果</p>
              <strong>{currentResult ? "这一步判断正确" : "这一步更适合换条路线"}</strong>
              <p>{currentStage.rationale}</p>
            </article>

            <article className="case-study-player__result-card">
              <p className="case-study-player__label">你刚刚选了什么</p>
              <strong>{chosenOption.label}</strong>
              <p>{currentStage.optionFeedbacks[chosenOption.id]}</p>
            </article>

            <article className="case-study-player__result-card">
              <p className="case-study-player__label">这一阶段要带走什么</p>
              <strong>{currentStage.takeaway}</strong>
              <p>{currentStage.reviewPrompt}</p>
            </article>

            <div className="case-study-player__matrix">
              {currentStage.options.map((option) => (
                <article className="case-study-player__matrix-card" key={option.id}>
                  <p className="case-study-player__label">{option.label}</p>
                  <strong>{option.id === currentStage.correctOptionId ? "当前更合适" : "这步不宜先选"}</strong>
                  <span>{currentStage.optionFeedbacks[option.id]}</span>
                </article>
              ))}
            </div>

            <div className="case-study-player__next-row">
              <Link className="button button--ghost" href={currentStage.reviewHref}>
                {currentStage.reviewLabel}
              </Link>
              {correctOption?.href && (
                <Link className="button button--ghost" href={correctOption.href}>
                  打开当前正确路线
                </Link>
              )}
              {chosenOption.href && chosenOption.href !== currentStage.reviewHref && (
                <Link className="button button--ghost" href={chosenOption.href}>
                  打开你选的路线
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
