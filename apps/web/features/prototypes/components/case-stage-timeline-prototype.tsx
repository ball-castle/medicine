"use client";

import { useMemo, useState } from "react";
import type { CaseStudyRecord } from "@medicine/content-schema";

import { cn } from "@/lib/utils";
import { getCaseStudyHref } from "@/lib/cases";
import { getPracticeHref } from "@/lib/practice";

import {
  PrototypeControlGroup,
  PrototypeEyebrow,
  PrototypeIntro,
  PrototypeLinkButton,
  PrototypeLinkRow,
  PrototypeNoteCard,
  PrototypeReadoutCard,
  PrototypeSelectableButton,
  PrototypeShell,
  PrototypeSidebar,
  PrototypeStage,
  PrototypeVisualCard,
  prototypeCardGridClassName,
  prototypeReadoutGridClassName,
} from "./prototype-primitives";

type LensId = "axis" | "timing" | "branch";

const LENSES: Record<LensId, { label: string; summary: string }> = {
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
      <PrototypeShell className="xl:grid-cols-1">
        <div className="rounded-[24px] border border-border/70 bg-card/82 p-5 text-sm leading-7 text-muted-foreground shadow-soft">
          当前还没有可供时间线原型使用的病例数据。
        </div>
      </PrototypeShell>
    );
  }

  return (
    <PrototypeShell>
      <PrototypeSidebar>
        <PrototypeIntro
          description={
            <>
              这张原型把医案从“最后给你个答案”改成“每一段都要重新判断”的时间线。重点不是记方，
              而是学会为什么第一段、第二段、第三段的主轴会变。
            </>
          }
          title="医案分阶段时间线"
        />

        <div className="space-y-4">
          <PrototypeControlGroup title="选病例">
            <div className="grid gap-2">
              {caseStudies.map((caseStudy, index) => (
                <PrototypeSelectableButton
                  active={caseIndex === index}
                  key={caseStudy.id}
                  onClick={() => {
                    setCaseIndex(index);
                    setStageIndex(0);
                  }}
                >
                  <strong className="block font-display text-base text-foreground">{caseStudy.title}</strong>
                  <span className="mt-2 block text-sm leading-7 text-muted-foreground">{caseStudy.subtitle}</span>
                </PrototypeSelectableButton>
              ))}
            </div>
          </PrototypeControlGroup>

          <PrototypeControlGroup title="观察镜头">
            <div className="grid gap-2">
              {(Object.entries(LENSES) as Array<[LensId, (typeof LENSES)[LensId]]>).map(([key, item]) => (
                <PrototypeSelectableButton active={lens === key} key={key} onClick={() => setLens(key)}>
                  <strong className="block font-display text-base text-foreground">{item.label}</strong>
                  <span className="mt-2 block text-sm leading-7 text-muted-foreground">{item.summary}</span>
                </PrototypeSelectableButton>
              ))}
            </div>
          </PrototypeControlGroup>
        </div>

        <div className={prototypeCardGridClassName}>
          <PrototypeNoteCard description={currentCase.summary} label="当前病例" title={currentCase.title} />
          <PrototypeNoteCard description={currentStage.stateSummary} label="当前阶段" title={currentStage.title} />
          <PrototypeNoteCard description={derived.lensSummary} label="镜头结论" title={LENSES[lens].label} />
        </div>
      </PrototypeSidebar>

      <PrototypeStage>
        <PrototypeVisualCard className="space-y-4 p-5 md:p-6">
          <div className="grid gap-2 md:grid-cols-3">
            {currentCase.stages.map((stage, index) => (
              <PrototypeSelectableButton active={stageIndex === index} key={stage.id} onClick={() => setStageIndex(index)}>
                <span className="inline-flex min-w-10 items-center justify-center rounded-full bg-primary/10 px-3 py-1 font-display text-sm text-primary">
                  {index + 1}
                </span>
                <strong className="mt-3 block font-display text-base text-foreground">{stage.title}</strong>
                <em className="mt-2 block text-xs not-italic uppercase tracking-[0.24em] text-accent">
                  {stage.correctOptionId === stage.options[0]?.id ? "先看第一路" : "需要换路"}
                </em>
              </PrototypeSelectableButton>
            ))}
          </div>

          <div className="rounded-[24px] border border-border/70 bg-white/70 p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="space-y-2">
                <PrototypeEyebrow>Stage</PrototypeEyebrow>
                <h3 className="font-display text-2xl leading-tight text-foreground">{currentStage.title}</h3>
              </div>
              <div className="inline-flex min-w-16 items-center justify-center rounded-full bg-primary/10 px-4 py-2 font-display text-sm text-primary">
                {stageIndex + 1}/{currentCase.stages.length}
              </div>
            </div>

            <p className="mt-4 text-sm leading-7 text-foreground/85">{currentStage.stateSummary}</p>
            <p className="mt-3 text-base leading-8 text-foreground">{currentStage.question}</p>

            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {currentStage.clues.map((clue) => (
                <article className="rounded-[18px] border border-border/70 bg-background/60 p-4" key={clue}>
                  <p className="text-sm leading-7 text-foreground/85">{clue}</p>
                </article>
              ))}
            </div>

            <div className="mt-4 grid gap-3 xl:grid-cols-3">
              {currentStage.options.map((option) => {
                const isCorrect = option.id === currentStage.correctOptionId;

                return (
                  <article
                    className={cn(
                      "rounded-[18px] border border-border/70 bg-background/60 p-4",
                      isCorrect && "border-primary/35 bg-primary/10",
                    )}
                    key={option.id}
                  >
                    <p className="text-xs uppercase tracking-[0.24em] text-primary">
                      {isCorrect ? "当前正解" : "备选分支"}
                    </p>
                    <strong className="mt-2 block font-display text-lg text-foreground">{option.label}</strong>
                    <span className="mt-2 block text-sm leading-7 text-muted-foreground">{option.summary}</span>
                    <em className="mt-3 block text-sm not-italic leading-7 text-foreground/80">
                      {currentStage.optionFeedbacks[option.id]}
                    </em>
                  </article>
                );
              })}
            </div>
          </div>
        </PrototypeVisualCard>

        <div className={prototypeReadoutGridClassName}>
          <PrototypeReadoutCard description={currentStage.rationale} label="这一步为什么成立" title={derived.correctOption.label} />
          <PrototypeReadoutCard
            description="时间线真正训练的，是阶段变了以后愿不愿意重新判断主轴。"
            label="这一步学到什么"
            title={currentStage.takeaway}
          />
          <PrototypeReadoutCard description={currentStage.reviewPrompt} label="回看入口" title={currentStage.reviewLabel} />
        </div>

        <PrototypeLinkRow>
          <PrototypeLinkButton href={getCaseStudyHref(currentCase.id)}>打开完整病例</PrototypeLinkButton>
          <PrototypeLinkButton href={getPracticeHref("cases-stage-rhythm-basic")}>打开医案练习</PrototypeLinkButton>
          <PrototypeLinkButton href={currentStage.reviewHref}>{currentStage.reviewLabel}</PrototypeLinkButton>
        </PrototypeLinkRow>
      </PrototypeStage>
    </PrototypeShell>
  );
}
