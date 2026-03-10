"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type StateId = "agitated" | "descending" | "settled";
type FocusId = "descent" | "calm" | "transition";

const STATES: Record<
  StateId,
  {
    label: string;
    summary: string;
    prompt: string;
  }
> = {
  agitated: {
    label: "上热不降",
    summary: "上部躁动明显、下部承接不足，适合先建立“为什么不能直接猛攻”的问题感。",
    prompt: "先看系统哪里太浮、太乱，而不是立刻上强法。",
  },
  descending: {
    label: "右降缓转",
    summary: "通过一条偏右的下行路径，把上部躁动逐步收下来、降下来。",
    prompt: "这里的关键动作是‘缓缓带下’，而不是一下子压住或强推。",
  },
  settled: {
    label: "上下渐接",
    summary: "上部火气减躁，中下部开始承接，系统进入可继续转方和推进的状态。",
    prompt: "记住这里的重点是‘先稳局面’，不是已经把所有根本问题都解决了。",
  },
};

const FOCI: Record<
  FocusId,
  {
    label: string;
    summary: string;
  }
> = {
  descent: {
    label: "看右降路径",
    summary: "先看火气怎么沿右侧缓缓下降，理解为什么这一步叫“右降”。",
  },
  calm: {
    label: "看安神缓转",
    summary: "茯神法的价值之一是先让躁动减下来，让系统不再那么乱。",
  },
  transition: {
    label: "看过渡角色",
    summary: "它常常不是终局动作，而是为后续更强的处理创造条件。",
  },
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getStateFromProgress(progress: number): StateId {
  if (progress >= 72) {
    return "settled";
  }
  if (progress >= 34) {
    return "descending";
  }
  return "agitated";
}

export function FushenRightDescendPrototype() {
  const [descent, setDescent] = useState(38);
  const [focus, setFocus] = useState<FocusId>("descent");

  const stateId = getStateFromProgress(descent);
  const state = STATES[stateId];

  const metrics = useMemo(() => {
    const descentRatio = clamp((descent - 8) / 92, 0.02, 1);
    const upperAgitation = clamp(1 - descentRatio + (focus === "calm" ? 0.08 : 0), 0.08, 1);
    const rightFlow = clamp(descentRatio + (focus === "descent" ? 0.12 : 0), 0.08, 1);
    const groundReceive = clamp(descentRatio + (focus === "transition" ? 0.1 : 0), 0.08, 1);

    return { descentRatio, upperAgitation, rightFlow, groundReceive };
  }, [descent, focus]);

  const insight =
    focus === "descent"
      ? "这里先看右侧那条缓慢下行的路径，理解为什么茯神法常被讲成“右降法”。"
      : focus === "calm"
        ? "这里把注意力放在“躁动先降下来”，因为这一步常常在为更核心的治疗争取空间。"
        : "这里最重要的是看到它的过渡性：不是最后一步，但经常是必须先走的一步。";

  const actionLine =
    stateId === "agitated"
      ? "当前重点是识别“乱而未降”。系统太浮太躁，还不适合直接上强法。"
      : stateId === "descending"
        ? "当前重点是“带下去、稳下来”。它不是猛攻，而是先让局面松动。"
        : "当前重点是“局面缓住”。上部不再那么乱，中下部开始承接，后续才更有路。";

  return (
    <section className="fushen-prototype">
      <div className="fushen-prototype__sidebar">
        <div className="fushen-prototype__intro">
          <p className="eyebrow">Prototype</p>
          <h2>茯神法右降路径图原型</h2>
          <p>
            这张原型专门补上扶阳模块里最容易被忽略的一层：不是所有问题都适合立刻开门或归根。
            有些局面需要先把上部躁动收一收、降一降，让系统从“乱”变成“可处理”。
          </p>
        </div>

        <div className="fushen-prototype__controls">
          <div className="fushen-prototype__control-group">
            <div className="fushen-prototype__slider-top">
              <p className="fushen-prototype__control-title">右降力度</p>
              <strong>{descent}</strong>
            </div>
            <input
              aria-label="右降力度"
              className="fushen-prototype__slider"
              max={100}
              min={0}
              onChange={(event) => setDescent(Number(event.target.value))}
              type="range"
              value={descent}
            />
            <div className="fushen-prototype__slider-legend">
              <span>躁动未降</span>
              <span>逐步缓住</span>
            </div>
          </div>

          <div className="fushen-prototype__control-group">
            <p className="fushen-prototype__control-title">讲解焦点</p>
            <div className="fushen-prototype__focus-list">
              {(Object.entries(FOCI) as Array<[FocusId, (typeof FOCI)[FocusId]]>).map(([key, item]) => (
                <button
                  className={`fushen-prototype__focus ${focus === key ? "is-active" : ""}`}
                  key={key}
                  onClick={() => setFocus(key)}
                  type="button"
                >
                  <strong>{item.label}</strong>
                  <span>{item.summary}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="fushen-prototype__notes">
          <article className="fushen-prototype__note-card">
            <p className="fushen-prototype__note-title">当前状态</p>
            <strong>{state.label}</strong>
            <p>{state.summary}</p>
          </article>
          <article className="fushen-prototype__note-card">
            <p className="fushen-prototype__note-title">学习提示</p>
            <strong>{FOCI[focus].label}</strong>
            <p>{insight}</p>
          </article>
          <article className="fushen-prototype__note-card">
            <p className="fushen-prototype__note-title">动作线</p>
            <strong>{state.prompt}</strong>
            <p>{actionLine}</p>
          </article>
        </div>
      </div>

      <div className="fushen-prototype__stage">
        <div className="fushen-prototype__visual-card">
          <svg aria-label="茯神法右降路径图原型" className="fushen-prototype__svg" viewBox="0 0 640 540">
            <ellipse
              cx="312"
              cy="112"
              fill="rgba(198,105,67,0.14)"
              rx={74 + metrics.upperAgitation * 22}
              ry={34 + metrics.upperAgitation * 10}
            />
            <ellipse
              cx="390"
              cy="396"
              fill="rgba(170,135,68,0.14)"
              rx={66 + metrics.groundReceive * 18}
              ry={28 + metrics.groundReceive * 10}
            />

            <path
              d="M 338 138 C 410 186 432 246 414 332 C 404 374 396 394 388 412"
              fill="none"
              opacity={0.18 + metrics.rightFlow * 0.48}
              stroke="rgba(94,130,160,0.82)"
              strokeLinecap="round"
              strokeWidth={6 + metrics.rightFlow * 7}
            />

            <path
              d="M 304 146 C 292 188 292 230 302 270"
              fill="none"
              opacity={0.1 + (1 - metrics.rightFlow) * 0.14}
              stroke="rgba(198,105,67,0.4)"
              strokeDasharray="8 10"
              strokeLinecap="round"
              strokeWidth="3"
            />

            {metrics.rightFlow > 0.12 && (
              <>
                <circle fill="#f7fbff" opacity={0.54 + metrics.rightFlow * 0.28} r={4 + metrics.rightFlow * 2.4}>
                  <animateMotion
                    dur={`${clamp(7.4 - metrics.rightFlow * 3.2, 2.6, 6.8)}s`}
                    path="M 338 138 C 410 186 432 246 414 332 C 404 374 396 394 388 412"
                    repeatCount="indefinite"
                  />
                </circle>
                <circle fill="#fff7ef" opacity={0.38 + metrics.rightFlow * 0.22} r={3 + metrics.rightFlow * 2.1}>
                  <animateMotion
                    begin="-1.2s"
                    dur={`${clamp(7.8 - metrics.rightFlow * 3.1, 2.8, 7.2)}s`}
                    path="M 332 146 C 402 194 426 252 410 332 C 400 374 394 394 390 412"
                    repeatCount="indefinite"
                  />
                </circle>
              </>
            )}

            {metrics.upperAgitation > 0.2 && (
              <>
                <circle cx="274" cy="110" fill="rgba(198,105,67,0.72)" opacity={0.22 + metrics.upperAgitation * 0.34} r={9 + metrics.upperAgitation * 10}>
                  <animate attributeName="r" dur="1.8s" repeatCount="indefinite" values="9;16;9" />
                </circle>
                <circle cx="350" cy="98" fill="rgba(198,105,67,0.68)" opacity={0.2 + metrics.upperAgitation * 0.32} r={8 + metrics.upperAgitation * 10}>
                  <animate attributeName="r" dur="2.2s" repeatCount="indefinite" values="8;15;8" />
                </circle>
              </>
            )}

            <circle cx="320" cy="112" fill="rgba(198,105,67,0.84)" opacity={0.26 + metrics.upperAgitation * 0.42} r={18 + metrics.upperAgitation * 12} />
            <circle cx="388" cy="412" fill="rgba(170,135,68,0.86)" opacity={0.22 + metrics.groundReceive * 0.44} r={16 + metrics.groundReceive * 12} />

            <text className="fushen-prototype__label" textAnchor="middle" x="320" y="62">
              右降缓转
            </text>
            <text className="fushen-prototype__subtext" textAnchor="middle" x="320" y="478">
              {stateId === "agitated" ? "上热未降" : stateId === "descending" ? "火气缓下" : "局面渐稳"}
            </text>

            {focus === "descent" && (
              <>
                <text className="fushen-prototype__callout" textAnchor="start" x="454" y="244">
                  右侧下行
                </text>
                <line
                  opacity="0.46"
                  stroke="rgba(94,130,160,0.74)"
                  strokeWidth="2"
                  x1="440"
                  x2="404"
                  y1="248"
                  y2="230"
                />
              </>
            )}

            {focus === "calm" && (
              <>
                <text className="fushen-prototype__callout" textAnchor="end" x="226" y="166">
                  先把躁动收住
                </text>
                <line
                  opacity="0.46"
                  stroke="rgba(198,105,67,0.74)"
                  strokeWidth="2"
                  x1="238"
                  x2="286"
                  y1="170"
                  y2="132"
                />
              </>
            )}

            {focus === "transition" && (
              <>
                <rect
                  fill="rgba(255,255,255,0.72)"
                  height="108"
                  rx="18"
                  width="194"
                  x="402"
                  y="104"
                />
                <text className="fushen-prototype__compare-title" textAnchor="middle" x="499" y="136">
                  过渡角色
                </text>
                <text className="fushen-prototype__compare-text" textAnchor="middle" x="499" y="166">
                  先右降缓转
                </text>
                <text className="fushen-prototype__compare-text" textAnchor="middle" x="499" y="190">
                  再决定是否开门或归根
                </text>
              </>
            )}
          </svg>
        </div>

        <div className="fushen-prototype__readout">
          <article className="fushen-prototype__readout-card">
            <p className="fushen-prototype__readout-label">上部状态</p>
            <strong>{metrics.upperAgitation > 0.68 ? "躁动明显" : metrics.upperAgitation > 0.34 ? "仍在浮乱" : "上部渐稳"}</strong>
            <span>这一栏专门帮助用户看到：有时问题不是先开或先归，而是先把乱象收住。</span>
          </article>
          <article className="fushen-prototype__readout-card">
            <p className="fushen-prototype__readout-label">右降路径</p>
            <strong>{metrics.rightFlow > 0.68 ? "下行明显" : metrics.rightFlow > 0.34 ? "缓缓带下" : "通路尚弱"}</strong>
            <span>茯神法最值得看懂的是“温和带下”的方向感，而不是猛压或猛推。</span>
          </article>
          <article className="fushen-prototype__readout-card">
            <p className="fushen-prototype__readout-label">承接程度</p>
            <strong>{metrics.groundReceive > 0.68 ? "下部能承" : metrics.groundReceive > 0.34 ? "开始接住" : "承接不足"}</strong>
            <span>它常常是在为后续更明确的处理创造条件，所以“能接住”很关键。</span>
          </article>
        </div>

        <div className="fushen-prototype__link-row">
          <Link className="button button--ghost" href="/prototypes/kan-li-circulation">
            回看坎离交通
          </Link>
          <Link className="button button--ghost" href="/prototypes/guizhi-vs-fuzi">
            回看桂附对照
          </Link>
          <Link className="button button--ghost" href="/prototypes/fu-yang-action-triad">
            查看三动作总览
          </Link>
          <Link className="button button--ghost" href="/storyboards">
            查看分镜说明
          </Link>
        </div>
      </div>
    </section>
  );
}
