"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type LensId = "mechanics" | "movement" | "result";

const LENSES: Record<
  LensId,
  {
    label: string;
    summary: string;
  }
> = {
  mechanics: {
    label: "看动作机制",
    summary: "先区分门轴有没有打开，和根部有没有收住，这两件事不是同一动作。",
  },
  movement: {
    label: "看运动方向",
    summary: "桂枝法更像向外开路，附子法更像向下回潜，方向相反。",
  },
  result: {
    label: "看最后结果",
    summary: "一个把路打开，一个把根守住；都在扶阳，但终点感受不同。",
  },
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function GuizhiFuziCompare() {
  const [progress, setProgress] = useState(54);
  const [lens, setLens] = useState<LensId>("mechanics");

  const state = useMemo(() => {
    const ratio = clamp(progress / 100, 0.02, 1);
    const gateOpen = clamp(ratio + (lens === "mechanics" ? 0.08 : 0), 0.02, 1);
    const gateFlow = clamp(ratio + (lens === "movement" ? 0.1 : 0), 0.02, 1);
    const rootPull = clamp(ratio + (lens === "movement" ? 0.08 : 0), 0.02, 1);
    const rootGlow = clamp(ratio + (lens === "result" ? 0.1 : 0), 0.02, 1);
    const upperScatter = clamp(1 - ratio + (lens === "mechanics" ? 0.05 : 0), 0.08, 1);

    return { gateOpen, gateFlow, rootPull, rootGlow, upperScatter };
  }, [lens, progress]);

  const insight =
    lens === "mechanics"
      ? "先看问题发生在门轴还是根部。桂枝法主要在处理‘没开’，附子法主要在处理‘没守住’。"
      : lens === "movement"
        ? "先看方向差异：桂枝法是拨开接轨，附子法是下潜归根。一个向外接，一个向下收。"
        : "先看最后的感受差异：桂枝法让系统有路，附子法让系统有根。";

  return (
    <section className="compare-prototype">
      <div className="compare-prototype__sidebar">
        <div className="compare-prototype__intro">
          <p className="eyebrow">Comparison</p>
          <h2>桂枝 vs 附子</h2>
          <p>
            这张对照页的任务只有一个：让用户在同一页面里直接看到“开门”和“归根”不是同一种扶阳动作。
            不再靠文字硬记，而是靠并排观察建立稳定直觉。
          </p>
        </div>

        <div className="compare-prototype__controls">
          <div className="compare-prototype__control-group">
            <div className="compare-prototype__slider-top">
              <p className="compare-prototype__control-title">动作推进</p>
              <strong>{progress}</strong>
            </div>
            <input
              aria-label="动作推进"
              className="compare-prototype__slider"
              max={100}
              min={0}
              onChange={(event) => setProgress(Number(event.target.value))}
              type="range"
              value={progress}
            />
            <div className="compare-prototype__slider-legend">
              <span>起手辨问题</span>
              <span>动作完成</span>
            </div>
          </div>

          <div className="compare-prototype__control-group">
            <p className="compare-prototype__control-title">对照视角</p>
            <div className="compare-prototype__lens-list">
              {(Object.entries(LENSES) as Array<[LensId, (typeof LENSES)[LensId]]>).map(([key, item]) => (
                <button
                  className={`compare-prototype__lens ${lens === key ? "is-active" : ""}`}
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

        <div className="compare-prototype__notes">
          <article className="compare-prototype__note-card">
            <p className="compare-prototype__note-title">当前视角</p>
            <strong>{LENSES[lens].label}</strong>
            <p>{insight}</p>
          </article>
          <article className="compare-prototype__note-card">
            <p className="compare-prototype__note-title">一句话记忆</p>
            <strong>桂枝法：有路了</strong>
            <p>附子法：守住了。两者都在扶阳，但解决的问题不一样。</p>
          </article>
        </div>
      </div>

      <div className="compare-prototype__stage">
        <div className="compare-prototype__board">
          <article className="compare-prototype__panel">
            <div className="compare-prototype__panel-head">
              <p className="eyebrow">Guizhi</p>
              <h3>桂枝法：开门拨机</h3>
            </div>
            <svg aria-label="桂枝法对照视图" className="compare-prototype__svg" viewBox="0 0 360 300">
              <rect fill="rgba(29,45,42,0.05)" height="186" rx="24" width="180" x="90" y="56" />
              <line
                opacity="0.18"
                stroke="rgba(29,45,42,0.2)"
                strokeDasharray="8 10"
                strokeWidth="2"
                x1="180"
                x2="180"
                y1="64"
                y2="234"
              />
              <rect
                fill="rgba(191,108,63,0.92)"
                height="176"
                rx="12"
                transform={`translate(${106 - state.gateOpen * 30} ${60 + state.gateOpen * 3}) rotate(${-(state.gateOpen * 15)} 74 88)`}
                width="70"
              />
              <rect
                fill="rgba(170,95,58,0.64)"
                height="176"
                rx="12"
                transform={`translate(${180 + state.gateOpen * 30} ${60 + state.gateOpen * 3}) rotate(${state.gateOpen * 15} 286 88)`}
                width="70"
              />
              <path
                d="M 48 142 C 94 142 120 144 152 150"
                fill="none"
                opacity={0.18 + state.gateFlow * 0.52}
                stroke="rgba(95,139,67,0.76)"
                strokeLinecap="round"
                strokeWidth={4 + state.gateFlow * 5}
              />
              <path
                d="M 208 152 C 242 160 270 162 316 162"
                fill="none"
                opacity={0.18 + state.gateFlow * 0.52}
                stroke="rgba(63,105,144,0.76)"
                strokeLinecap="round"
                strokeWidth={4 + state.gateFlow * 5}
              />
              <text className="compare-prototype__label" textAnchor="middle" x="180" y="266">
                {progress < 36 ? "门未开" : progress < 72 ? "门轴松动" : "内外接轨"}
              </text>
            </svg>
          </article>

          <article className="compare-prototype__panel">
            <div className="compare-prototype__panel-head">
              <p className="eyebrow">Fuzi</p>
              <h3>附子法：归根回阳</h3>
            </div>
            <svg aria-label="附子法对照视图" className="compare-prototype__svg" viewBox="0 0 360 300">
              <ellipse
                cx="180"
                cy="72"
                fill="rgba(198,105,67,0.2)"
                rx={42 + state.upperScatter * 16}
                ry={18 + state.upperScatter * 8}
              />
              <ellipse
                cx="180"
                cy="228"
                fill="rgba(63,105,144,0.2)"
                rx={38 + state.rootGlow * 18}
                ry={18 + state.rootGlow * 8}
              />
              <line
                opacity="0.18"
                stroke="rgba(29,45,42,0.2)"
                strokeDasharray="8 10"
                strokeWidth="2"
                x1="180"
                x2="180"
                y1="84"
                y2="218"
              />
              <path
                d="M 180 92 C 180 132 178 172 180 212"
                fill="none"
                opacity={0.2 + state.rootPull * 0.5}
                stroke="rgba(71,114,160,0.82)"
                strokeLinecap="round"
                strokeWidth={5 + state.rootPull * 5}
              />
              <circle cx="180" cy="72" fill="rgba(198,105,67,0.86)" opacity={0.18 + state.upperScatter * 0.44} r={12 + state.upperScatter * 10} />
              <circle cx="180" cy="228" fill="rgba(63,105,144,0.86)" opacity={0.18 + state.rootGlow * 0.48} r={12 + state.rootGlow * 10} />
              <text className="compare-prototype__label" textAnchor="middle" x="180" y="266">
                {progress < 36 ? "阳浮于上" : progress < 72 ? "开始回根" : "真阳归根"}
              </text>
            </svg>
          </article>
        </div>

        <div className="compare-prototype__matrix">
          <article className="compare-prototype__matrix-card">
            <p className="compare-prototype__matrix-label">起始问题</p>
            <strong>桂枝：门没打开</strong>
            <span>附子：根没守住</span>
          </article>
          <article className="compare-prototype__matrix-card">
            <p className="compare-prototype__matrix-label">核心方向</p>
            <strong>桂枝：向外开路</strong>
            <span>附子：向下回潜</span>
          </article>
          <article className="compare-prototype__matrix-card">
            <p className="compare-prototype__matrix-label">用户记忆</p>
            <strong>桂枝：有路了</strong>
            <span>附子：守住了</span>
          </article>
        </div>

        <div className="compare-prototype__link-row">
          <Link className="button button--ghost" href="/prototypes/guizhi-gate-animation">
            查看桂枝细版
          </Link>
          <Link className="button button--ghost" href="/prototypes/fuzi-root-return">
            查看附子细版
          </Link>
          <Link className="button button--ghost" href="/prototypes/fu-yang-action-triad">
            查看三动作总览
          </Link>
          <Link className="button button--ghost" href="/prototypes/kan-li-circulation">
            回看坎离结构
          </Link>
        </div>
      </div>
    </section>
  );
}
