"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type ActionId = "open" | "return" | "transition";

type CaseRecord = {
  id: string;
  title: string;
  brief: string;
  scenario: string;
  clues: string[];
  correctAction: ActionId;
  rationale: string;
  comparisons: Record<ActionId, string>;
  nextHref: string;
  nextLabel: string;
};

const ACTIONS: Record<
  ActionId,
  {
    label: string;
    shortLabel: string;
    summary: string;
  }
> = {
  open: {
    label: "桂枝开门",
    shortLabel: "开门",
    summary: "更适合内外不接、门轴卡住的局面。",
  },
  return: {
    label: "附子归根",
    shortLabel: "归根",
    summary: "更适合阳浮于上、根部失守的局面。",
  },
  transition: {
    label: "茯神缓转",
    shortLabel: "缓转",
    summary: "更适合先稳局面、先把乱象带下来的局面。",
  },
};

const CASES: CaseRecord[] = [
  {
    id: "wind-gate",
    title: "题 1: 门轴被卡住",
    brief: "外感刚起，胸背不舒，像是门没开。",
    scenario:
      "一个入门案例里，人物怕风、身微热、汗像是想出来又出不畅，胸背发紧，整个人像被卡在里外之间。",
    clues: [
      "重点是“内外不接”，不是阳气完全掉回去。",
      "局面没有明显的“真阳浮越无根”感。",
      "更像先把门轴拨开，让里外恢复接轨。",
    ],
    correctAction: "open",
    rationale:
      "这题最像“门没打开”。要先恢复里外交通，所以优先看桂枝法的开门拨机，而不是直接归根或先做长时间缓转。",
    comparisons: {
      open: "对，因为问题核心是门轴卡住、内外不接。",
      return: "不对，因为这里不是典型的阳浮无根，不是先往下收的题。",
      transition: "不对，因为局面并不以躁乱失序为主，先稳局面的优先级没那么高。",
    },
    nextHref: "/prototypes/guizhi-gate-animation",
    nextLabel: "回看桂枝开门",
  },
  {
    id: "yang-root",
    title: "题 2: 上亮下空",
    brief: "上面热象明显，但下面接不住。",
    scenario:
      "另一个案例里，人物面赤、烦躁、上部像很亮很亢，但手足偏冷，下部空虚，整个人给人的感觉是“往上冲，却没有根”。",
    clues: [
      "重点不是开一条路，而是把浮散之阳收回来。",
      "上部亮，不等于系统有主。",
      "如果根不守住，只往外开，局面会更浮。",
    ],
    correctAction: "return",
    rationale:
      "这题更像“阳浮无根”。要先让根部重新守住，所以优先看附子法的归根回阳，而不是把注意力放在开门或仅仅缓缓带下。",
    comparisons: {
      open: "不对，因为这里的主问题不是路没开，而是根没守住。",
      return: "对，因为最关键的是把浮散无根的阳收回去、守下来。",
      transition: "不对，因为虽然也可能有躁，但核心矛盾仍是无根，不只是需要过渡。",
    },
    nextHref: "/prototypes/fuzi-root-return",
    nextLabel: "回看附子归根",
  },
  {
    id: "agitated-handoff",
    title: "题 3: 局面太乱，先别猛推",
    brief: "上部烦躁乱动，先把局面缓下来。",
    scenario:
      "第三个案例里，人物心烦不宁、上部躁动明显，整个人很乱，虽然也能看到上热下弱，但你会直觉觉得：现在如果立刻猛开或猛收，都容易让局面更硬。",
    clues: [
      "先要把乱象带下去，让系统能接住。",
      "这一手更像过渡动作，不是终局动作。",
      "重点是“先稳局面，再决定后续”。",
    ],
    correctAction: "transition",
    rationale:
      "这题最适合先看茯神法的右降缓转。它的价值在于先让系统从“太乱”变成“可继续处理”，之后才更好判断是否要进一步开门或归根。",
    comparisons: {
      open: "不对，因为现在最急的不是开门，而是先把乱象降下来。",
      return: "不对，因为虽然可能也有根虚，但当前第一任务不是立刻强收，而是先稳住。",
      transition: "对，因为这题的核心是过渡处理，让系统先能承接。",
    },
    nextHref: "/prototypes/fushen-right-descend",
    nextLabel: "回看茯神缓转",
  },
];

export function FuYangTriagePractice() {
  const [caseIndex, setCaseIndex] = useState(0);
  const [answers, setAnswers] = useState<Partial<Record<string, ActionId>>>({});
  const [revealed, setRevealed] = useState<Partial<Record<string, boolean>>>({});

  const currentCase = CASES[caseIndex];
  const currentAnswer = answers[currentCase.id];
  const isRevealed = Boolean(revealed[currentCase.id]);

  const summary = useMemo(() => {
    const finished = CASES.filter((item) => revealed[item.id]).length;
    const correct = CASES.filter((item) => revealed[item.id] && answers[item.id] === item.correctAction).length;

    return { finished, correct };
  }, [answers, revealed]);

  const currentResult =
    isRevealed && currentAnswer ? currentAnswer === currentCase.correctAction : null;

  function handleReveal() {
    if (!currentAnswer) {
      return;
    }

    setRevealed((prev) => ({ ...prev, [currentCase.id]: true }));
  }

  function handleNextCase() {
    setCaseIndex((prev) => (prev + 1) % CASES.length);
  }

  return (
    <section className="practice-prototype">
      <div className="practice-prototype__sidebar">
        <div className="practice-prototype__intro">
          <p className="eyebrow">Practice</p>
          <h2>扶阳病例分流练习</h2>
          <p>
            这里开始把前面的动作图变成真正的判断任务。目标不是背答案，而是训练用户先辨“没路、没根、还是太乱”。
          </p>
        </div>

        <div className="practice-prototype__summary">
          <article className="practice-prototype__summary-card">
            <p className="practice-prototype__summary-label">已完成</p>
            <strong>
              {summary.finished}/{CASES.length}
            </strong>
            <span>先做完 3 题，再看自己最容易混淆的是哪一类动作。</span>
          </article>
          <article className="practice-prototype__summary-card">
            <p className="practice-prototype__summary-label">当前得分</p>
            <strong>
              {summary.correct}/{summary.finished || 1}
            </strong>
            <span>这里只做概念训练，不构成真实用药建议。</span>
          </article>
        </div>

        <div className="practice-prototype__case-tabs">
          {CASES.map((item, index) => {
            const answered = revealed[item.id];
            const correct = answers[item.id] === item.correctAction;

            return (
              <button
                className={`practice-prototype__case-tab ${index === caseIndex ? "is-active" : ""}`}
                key={item.id}
                onClick={() => setCaseIndex(index)}
                type="button"
              >
                <strong>{item.title}</strong>
                <span>{item.brief}</span>
                <em className={answered ? (correct ? "is-correct" : "is-wrong") : ""}>
                  {answered ? (correct ? "已答对" : "已解析") : "未作答"}
                </em>
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
            <span className="practice-prototype__counter">
              {caseIndex + 1}/{CASES.length}
            </span>
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
          {(Object.entries(ACTIONS) as Array<[ActionId, (typeof ACTIONS)[ActionId]]>).map(([key, item]) => {
            const isActive = currentAnswer === key;
            const resultClass =
              isRevealed && key === currentCase.correctAction
                ? "is-correct"
                : isRevealed && isActive && key !== currentCase.correctAction
                  ? "is-wrong"
                  : "";

            return (
              <button
                className={`practice-prototype__action ${isActive ? "is-active" : ""} ${resultClass}`.trim()}
                key={key}
                onClick={() => setAnswers((prev) => ({ ...prev, [currentCase.id]: key }))}
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
          <Link className="button button--ghost" href="/prototypes/fu-yang-action-triad">
            回看三动作总览
          </Link>
        </div>

        {isRevealed && currentAnswer && (
          <div className="practice-prototype__feedback">
            <article className={`practice-prototype__result-card ${currentResult ? "is-correct" : "is-wrong"}`}>
              <p className="practice-prototype__summary-label">本题结果</p>
              <strong>{currentResult ? "判断正确" : "这题更适合换一个动作"}</strong>
              <p>{currentCase.rationale}</p>
            </article>

            <div className="practice-prototype__matrix">
              {(Object.entries(ACTIONS) as Array<[ActionId, (typeof ACTIONS)[ActionId]]>).map(([key, item]) => (
                <article className="practice-prototype__matrix-card" key={key}>
                  <p className="practice-prototype__summary-label">{item.shortLabel}</p>
                  <strong>{item.label}</strong>
                  <span>{currentCase.comparisons[key]}</span>
                </article>
              ))}
            </div>

            <div className="practice-prototype__next-row">
              <Link className="button button--ghost" href={currentCase.nextHref}>
                {currentCase.nextLabel}
              </Link>
              <Link className="button button--ghost" href="/prototypes/guizhi-vs-fuzi">
                回看双图对照
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
