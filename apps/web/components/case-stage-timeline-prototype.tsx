"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { CaseStudyRecord } from "@medicine/content-schema";

import { getCaseStudyHref } from "@/lib/cases";
import { getPracticeHref } from "@/lib/practice";

type LensId = "axis" | "timing" | "branch";

const LENSES: Record<
  LensId,
  {
    label: string;
    summary: string;
  }
> = {
  axis: {
    label: "看主轴切换",
    summary: "每个阶段都先问: 现在真正主导局面的是什么。",
  },
  timing: {
    label: "看先后手",
    summary: "不是所有正确动作都该第一手做，先后顺序本身就是判断。",
  },
  branch: {
    label: "看为什么不是别的路",
    summary: "每个阶段都要训练排除错误分支，而不是只背标准答案。",
  },
};

export function CaseStageTimelinePrototype(props: { caseStudies: CaseStudyRecord[] }) {
  const { caseStudies } = props;

  const [caseIndex, setCaseIndex] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);
  const [lens, setLens] = useState<LensId>("axis");

  const currentCase = caseStudies[caseIndex] ?? null;
  const currentStage = currentCase?.stages[stageIndex] ?? null;

  const derived = useMemo(() => {
    if (!currentCase || !currentStage) {
      return null;
    }

    const correctOption =
      currentStage.options.find((option) => option.id === currentStage.correctOptionId) ?? currentStage.options[0];
    if (!correctOption) {
      return null;
    }

    const lensSummary =
      lens === "axis"
        ? currentStage.rationale
        : lens === "timing"
          ? currentStage.takeaway
          : currentStage.optionFeedbacks[correctOption.id] ?? currentStage.rationale;

    return { correctOption, lensSummary };
  }, [currentCase, currentStage, lens]);

  if (!currentCase || !currentStage || !derived) {
    return (
      <section className="timeline-prototype timeline-prototype--empty">
        <article className="phase-card">
          <p>当前还没有可供时间线原型使用的病例数据。</p>
        </article>
      </section>
    );
  }

  return (
    <section className="timeline-prototype">
      <div className="timeline-prototype__sidebar">
        <div className="timeline-prototype__intro">
          <p className="eyebrow">Prototype</p>
          <h2>医案分阶段时间线</h2>
          <p>
            这张原型把医案从“最后给你个答案”改成“每一段都要重新判断”的时间线。重点不是记方，
            而是学会为什么第一段、第二段、第三段的主轴会变。
          </p>
        </div>

        <div className="timeline-prototype__controls">
          <div className="timeline-prototype__control-group">
            <p className="timeline-prototype__control-title">选病例</p>
            <div className="timeline-prototype__case-list">
              {caseStudies.map((caseStudy, index) => (
                <button
                  className={`timeline-prototype__case ${caseIndex === index ? "is-active" : ""}`}
                  key={caseStudy.id}
                  onClick={() => {
                    setCaseIndex(index);
                    setStageIndex(0);
                  }}
                  type="button"
                >
                  <strong>{caseStudy.title}</strong>
                  <span>{caseStudy.subtitle}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="timeline-prototype__control-group">
            <p className="timeline-prototype__control-title">观察镜头</p>
            <div className="timeline-prototype__lens-list">
              {(Object.entries(LENSES) as Array<[LensId, (typeof LENSES)[LensId]]>).map(([key, item]) => (
                <button
                  className={`timeline-prototype__lens ${lens === key ? "is-active" : ""}`}
                  key={key}
                  onClick={() => setLens(key)}
                  type="button"
                >
                  <strong>{item.label}</strong>
                  <span>{item.summary}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="timeline-prototype__notes">
          <article className="timeline-prototype__note-card">
            <p className="timeline-prototype__note-title">当前病例</p>
            <strong>{currentCase.title}</strong>
            <p>{currentCase.summary}</p>
          </article>
          <article className="timeline-prototype__note-card">
            <p className="timeline-prototype__note-title">当前阶段</p>
            <strong>{currentStage.title}</strong>
            <p>{currentStage.stateSummary}</p>
          </article>
          <article className="timeline-prototype__note-card">
            <p className="timeline-prototype__note-title">镜头结论</p>
            <strong>{LENSES[lens].label}</strong>
            <p>{derived.lensSummary}</p>
          </article>
        </div>
      </div>

      <div className="timeline-prototype__stage">
        <div className="timeline-prototype__visual-card">
          <div className="timeline-prototype__rail">
            {currentCase.stages.map((stage, index) => (
              <button
                className={`timeline-prototype__stage-stop ${stageIndex === index ? "is-active" : ""}`}
                key={stage.id}
                onClick={() => setStageIndex(index)}
                type="button"
              >
                <span>{index + 1}</span>
                <strong>{stage.title}</strong>
                <em>{stage.correctOptionId === stage.options[0]?.id ? "先看第一路" : "需要换路"}</em>
              </button>
            ))}
          </div>

          <div className="timeline-prototype__detail">
            <div className="timeline-prototype__detail-top">
              <div>
                <p className="eyebrow">Stage</p>
                <h3>{currentStage.title}</h3>
              </div>
              <div className="timeline-prototype__counter">
                {stageIndex + 1}/{currentCase.stages.length}
              </div>
            </div>
            <p className="timeline-prototype__state">{currentStage.stateSummary}</p>
            <p className="timeline-prototype__question">{currentStage.question}</p>

            <div className="timeline-prototype__clues">
              {currentStage.clues.map((clue) => (
                <article className="timeline-prototype__clue" key={clue}>
                  <p>{clue}</p>
                </article>
              ))}
            </div>

            <div className="timeline-prototype__option-grid">
              {currentStage.options.map((option) => {
                const isCorrect = option.id === currentStage.correctOptionId;

                return (
                  <article
                    className={`timeline-prototype__option ${isCorrect ? "is-correct" : ""}`}
                    key={option.id}
                  >
                    <p>{isCorrect ? "当前正解" : "备选分支"}</p>
                    <strong>{option.label}</strong>
                    <span>{option.summary}</span>
                    <em>{currentStage.optionFeedbacks[option.id]}</em>
                  </article>
                );
              })}
            </div>
          </div>
        </div>

        <div className="timeline-prototype__readout">
          <article className="timeline-prototype__readout-card">
            <p className="timeline-prototype__readout-label">这一步为什么成立</p>
            <strong>{derived.correctOption.label}</strong>
            <span>{currentStage.rationale}</span>
          </article>
          <article className="timeline-prototype__readout-card">
            <p className="timeline-prototype__readout-label">这一步学到什么</p>
            <strong>{currentStage.takeaway}</strong>
            <span>时间线真正训练的，是阶段变了以后愿不愿意重新判断主轴。</span>
          </article>
          <article className="timeline-prototype__readout-card">
            <p className="timeline-prototype__readout-label">回看入口</p>
            <strong>{currentStage.reviewLabel}</strong>
            <span>{currentStage.reviewPrompt}</span>
          </article>
        </div>

        <div className="timeline-prototype__link-row">
          <Link className="button button--ghost" href={getCaseStudyHref(currentCase.id)}>
            打开完整病例
          </Link>
          <Link className="button button--ghost" href={getPracticeHref("cases-stage-rhythm-basic")}>
            打开医案练习
          </Link>
          <Link className="button button--ghost" href={currentStage.reviewHref}>
            {currentStage.reviewLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
