"use client";

import type { PracticeDifficulty, PracticeSetRecord } from "@medicine/content-schema";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

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
    const correct = practiceSet.cases.filter(
      (item) => revealed[item.id] && answers[item.id] === item.correctActionId,
    ).length;
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

  const currentResult =
    isRevealed && currentAnswer ? currentAnswer === currentCase.correctActionId : null;
  const wrongAction =
    isRevealed && currentAnswer && currentAnswer !== currentCase.correctActionId
      ? practiceSet.actions.find((item) => item.id === currentAnswer) ?? null
      : null;

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
    <section className="practice-prototype">
      <div className="practice-prototype__sidebar">
        <div className="practice-prototype__intro">
          <p className="eyebrow">Practice</p>
          <h2>{practiceSet.title}</h2>
          <p>{practiceSet.objective}</p>
        </div>

        <div className="practice-prototype__summary">
          <article className="practice-prototype__summary-card">
            <p className="practice-prototype__summary-label">已完成</p>
            <strong>
              {summary.finished}/{practiceSet.cases.length}
            </strong>
            <span>先做完 {practiceSet.cases.length} 题，再看自己最容易混淆的是哪一类判断。</span>
          </article>
          <article className="practice-prototype__summary-card">
            <p className="practice-prototype__summary-label">当前得分</p>
            <strong>
              {summary.correct}/{summary.finished || 1}
            </strong>
            <span>{practiceSet.warning}</span>
          </article>
        </div>

        <div className="token-row">
          {summary.difficultyMix.foundation > 0 && (
            <span className="token token--light">基础 {summary.difficultyMix.foundation}</span>
          )}
          {summary.difficultyMix.intermediate > 0 && (
            <span className="token token--light">进阶 {summary.difficultyMix.intermediate}</span>
          )}
          {summary.difficultyMix.advanced > 0 && (
            <span className="token token--light">挑战 {summary.difficultyMix.advanced}</span>
          )}
        </div>

        <div className="practice-prototype__case-tabs">
          {practiceSet.cases.map((item, index) => {
            const answered = revealed[item.id];
            const correct = answers[item.id] === item.correctActionId;

            return (
              <button
                className={`practice-prototype__case-tab ${index === caseIndex ? "is-active" : ""}`}
                key={item.id}
                onClick={() => setCaseIndex(index)}
                type="button"
              >
                <strong>{item.title}</strong>
                <span>{item.brief}</span>
                <div className="practice-prototype__case-meta">
                  <em className="practice-prototype__difficulty">{DIFFICULTY_LABELS[item.difficulty]}</em>
                  <em className={answered ? (correct ? "is-correct" : "is-wrong") : ""}>
                    {answered ? (correct ? "已答对" : "已解析") : "未作答"}
                  </em>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="practice-prototype__stage">
        <article className="practice-prototype__scenario-card">
          <div className="practice-prototype__scenario-top">
            <div>
              <p className="eyebrow">Case</p>
              <h3>{currentCase.title}</h3>
            </div>
            <div className="practice-prototype__scenario-badges">
              <span className="practice-prototype__counter">
                {caseIndex + 1}/{practiceSet.cases.length}
              </span>
              <span className="practice-prototype__difficulty-pill">
                {DIFFICULTY_LABELS[currentCase.difficulty]}
              </span>
            </div>
          </div>
          <p className="practice-prototype__scenario-text">{currentCase.scenario}</p>
          <div className="practice-prototype__clues">
            {currentCase.clues.map((clue) => (
              <article className="practice-prototype__clue" key={clue}>
                <p>{clue}</p>
              </article>
            ))}
          </div>
        </article>

        <div className="practice-prototype__action-grid">
          {practiceSet.actions.map((item) => {
            const isActive = currentAnswer === item.id;
            const resultClass =
              isRevealed && item.id === currentCase.correctActionId
                ? "is-correct"
                : isRevealed && isActive && item.id !== currentCase.correctActionId
                  ? "is-wrong"
                  : "";

            return (
              <button
                className={`practice-prototype__action ${isActive ? "is-active" : ""} ${resultClass}`.trim()}
                key={item.id}
                onClick={() => setAnswers((prev) => ({ ...prev, [currentCase.id]: item.id }))}
                type="button"
              >
                <p>{item.shortLabel}</p>
                <strong>{item.label}</strong>
                <span>{item.summary}</span>
              </button>
            );
          })}
        </div>

        <div className="practice-prototype__actions-row">
          <button
            className="button button--primary"
            disabled={!currentAnswer || isRevealed}
            onClick={handleReveal}
            type="button"
          >
            提交判断
          </button>
          <button className="button button--ghost" onClick={handleNextCase} type="button">
            下一题
          </button>
          <Link className="button button--ghost" href="/progress">
            查看学习进度
          </Link>
        </div>

        {isRevealed && currentAnswer && (
          <div className="practice-prototype__feedback">
            <article className={`practice-prototype__result-card ${currentResult ? "is-correct" : "is-wrong"}`}>
              <p className="practice-prototype__summary-label">本题结果</p>
              <strong>{currentResult ? "判断正确" : "这题更适合换一个动作"}</strong>
              <p>{currentCase.rationale}</p>
            </article>

            {!currentResult && wrongAction && (
              <article className="practice-prototype__result-card">
                <p className="practice-prototype__summary-label">常见误区</p>
                <strong>{currentCase.mistakeTag}</strong>
                <p>
                  你刚刚更偏向选了“{wrongAction.label}”。{currentCase.mistakeReason}
                </p>
              </article>
            )}

            <article className="practice-prototype__result-card">
              <p className="practice-prototype__summary-label">回看建议</p>
              <strong>{currentCase.nextLabel}</strong>
              <p>{currentCase.reviewPrompt}</p>
            </article>

            <div className="practice-prototype__matrix">
              {practiceSet.actions.map((item) => (
                <article className="practice-prototype__matrix-card" key={item.id}>
                  <p className="practice-prototype__summary-label">{item.shortLabel}</p>
                  <strong>{item.label}</strong>
                  <span>{currentCase.comparisons[item.id]}</span>
                </article>
              ))}
            </div>

            <div className="practice-prototype__next-row">
              <Link className="button button--ghost" href={currentCase.nextHref}>
                {currentCase.nextLabel}
              </Link>
              <Link className="button button--ghost" href={practiceSet.actions.find((item) => item.id === currentCase.correctActionId)?.linkedPrototypeHref ?? currentCase.nextHref}>
                打开对应动作图
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
