"use client";

import { useMemo, useState } from "react";

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
  prototypeRangeClassName,
  prototypeReadoutGridClassName,
  prototypeSliderLegendClassName,
  prototypeSliderTopClassName,
  prototypeSliderValueClassName,
  prototypeSvgClassName,
  prototypeSvgStyles,
} from "./prototype-primitives";

type LensId = "problem" | "direction" | "handoff";

const LENSES: Record<LensId, { label: string; summary: string }> = {
  problem: {
    label: "先看问题类型",
    summary: "先分清是在处理没路、没根，还是局面太乱，这一步决定动作入口。",
  },
  direction: {
    label: "再看动作方向",
    summary: "桂枝是向外开，附子是向下收，茯神是向右缓降，三者方向完全不同。",
  },
  handoff: {
    label: "最后看衔接关系",
    summary: "茯神法更像过渡位，常常先把局面稳住，再决定是否继续开门或归根。",
  },
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function FuYangActionTriad() {
  const [progress, setProgress] = useState(58);
  const [lens, setLens] = useState<LensId>("problem");

  const state = useMemo(() => {
    const ratio = clamp(progress / 100, 0.04, 1);
    const gateOpen = clamp(ratio + (lens === "direction" ? 0.08 : 0), 0.04, 1);
    const gateFlow = clamp(ratio + (lens === "direction" ? 0.1 : 0), 0.04, 1);
    const rootPull = clamp(ratio + (lens !== "problem" ? 0.08 : 0), 0.04, 1);
    const rootGlow = clamp(ratio + (lens === "handoff" ? 0.08 : 0), 0.04, 1);
    const rightDescend = clamp(ratio + (lens === "handoff" ? 0.12 : 0), 0.04, 1);
    const settle = clamp(ratio + (lens === "handoff" ? 0.08 : 0), 0.04, 1);
    const upperScatter = clamp(1 - ratio + (lens === "problem" ? 0.08 : 0), 0.08, 1);

    return { gateOpen, gateFlow, rootPull, rootGlow, rightDescend, settle, upperScatter };
  }, [lens, progress]);

  const stageLabel = progress < 34 ? "先分问题" : progress < 72 ? "进入动作" : "看到落点";

  const insight =
    lens === "problem"
      ? "先不要急着记方名，先问一句：现在主要卡在没路、没根，还是整个局面太乱。"
      : lens === "direction"
        ? "把方向看懂比背定义更重要。三种动作的空间方向不同，用户才能真正形成直觉。"
        : "茯神法最容易被忽略，但它常常负责把系统从“太乱”带到“可以继续处理”。";

  return (
    <PrototypeShell>
      <PrototypeSidebar>
        <PrototypeIntro
          description={
            <>
              这一页把扶阳模块里最核心的三种动作压到同一页面里比较。目标不是增加术语，而是让用户稳定地区分：
              什么时候要开门，什么时候要归根，什么时候要先缓转稳局面。
            </>
          }
          eyebrow="Triad"
          title="扶阳三动作对照图"
        />

        <div className="space-y-4">
          <PrototypeControlGroup>
            <div className={prototypeSliderTopClassName}>
              <p className="font-display text-xs uppercase tracking-[0.24em] text-primary">动作阶段</p>
              <strong className={prototypeSliderValueClassName}>{progress}</strong>
            </div>
            <input
              aria-label="动作阶段"
              className={prototypeRangeClassName}
              max={100}
              min={0}
              onChange={(event) => setProgress(Number(event.target.value))}
              type="range"
              value={progress}
            />
            <div className={prototypeSliderLegendClassName}>
              <span>刚辨问题</span>
              <span>动作完成</span>
            </div>
          </PrototypeControlGroup>

          <PrototypeControlGroup title="观察视角">
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
          <PrototypeNoteCard description={insight} label="当前视角" title={LENSES[lens].label} />
          <PrototypeNoteCard
            description="这三件事都能扶阳，但解决的不是同一层问题。"
            label="一句话口诀"
            title="桂枝开路，附子守根，茯神先稳局面"
          />
          <PrototypeNoteCard
            description="把滑杆往前推时，注意观察三张图的起手问题、动作方向和最终落点是怎么分开的。"
            label="当前阶段"
            title={stageLabel}
          />
        </div>
      </PrototypeSidebar>

      <PrototypeStage>
        <PrototypeVisualCard className="space-y-4 p-5 md:p-6">
          <div className="grid gap-4 xl:grid-cols-3">
            <article className="rounded-[24px] border border-border/70 bg-background/60 p-4">
              <div className="space-y-1">
                <PrototypeEyebrow>Open</PrototypeEyebrow>
                <h3 className="font-display text-2xl text-foreground">桂枝法</h3>
              </div>
              <svg aria-label="桂枝法开门动作" className={prototypeSvgClassName} viewBox="0 0 320 300">
                <rect fill="rgba(29,45,42,0.05)" height="180" rx="24" width="168" x="76" y="58" />
                <rect
                  fill="rgba(191,108,63,0.9)"
                  height="170"
                  rx="12"
                  transform={`translate(${94 - state.gateOpen * 24} ${62 + state.gateOpen * 3}) rotate(${-(state.gateOpen * 15)} 68 82)`}
                  width="64"
                />
                <rect
                  fill="rgba(170,95,58,0.64)"
                  height="170"
                  rx="12"
                  transform={`translate(${162 + state.gateOpen * 24} ${62 + state.gateOpen * 3}) rotate(${state.gateOpen * 15} 252 82)`}
                  width="64"
                />
                <path
                  d="M 36 146 C 82 146 112 148 142 154"
                  fill="none"
                  opacity={0.18 + state.gateFlow * 0.52}
                  stroke="rgba(95,139,67,0.78)"
                  strokeLinecap="round"
                  strokeWidth={4 + state.gateFlow * 5}
                />
                <path
                  d="M 178 154 C 212 160 240 162 286 162"
                  fill="none"
                  opacity={0.18 + state.gateFlow * 0.52}
                  stroke="rgba(63,105,144,0.76)"
                  strokeLinecap="round"
                  strokeWidth={4 + state.gateFlow * 5}
                />
                <text style={prototypeSvgStyles.display} textAnchor="middle" x="160" y="270">
                  {progress < 34 ? "先辨门卡" : progress < 72 ? "门轴拨开" : "内外接轨"}
                </text>
              </svg>
            </article>

            <article className="rounded-[24px] border border-border/70 bg-background/60 p-4">
              <div className="space-y-1">
                <PrototypeEyebrow>Return</PrototypeEyebrow>
                <h3 className="font-display text-2xl text-foreground">附子法</h3>
              </div>
              <svg aria-label="附子法归根动作" className={prototypeSvgClassName} viewBox="0 0 320 300">
                <ellipse cx="160" cy="78" fill="rgba(198,105,67,0.2)" rx={40 + state.upperScatter * 16} ry={18 + state.upperScatter * 8} />
                <ellipse cx="160" cy="224" fill="rgba(63,105,144,0.2)" rx={38 + state.rootGlow * 18} ry={18 + state.rootGlow * 8} />
                <line opacity="0.18" stroke="rgba(29,45,42,0.2)" strokeDasharray="8 10" strokeWidth="2" x1="160" x2="160" y1="92" y2="212" />
                <path
                  d="M 160 96 C 160 134 158 170 160 210"
                  fill="none"
                  opacity={0.2 + state.rootPull * 0.5}
                  stroke="rgba(71,114,160,0.82)"
                  strokeLinecap="round"
                  strokeWidth={5 + state.rootPull * 5}
                />
                <circle cx="160" cy="78" fill="rgba(198,105,67,0.86)" opacity={0.18 + state.upperScatter * 0.44} r={12 + state.upperScatter * 10} />
                <circle cx="160" cy="224" fill="rgba(63,105,144,0.86)" opacity={0.18 + state.rootGlow * 0.48} r={12 + state.rootGlow * 10} />
                <text style={prototypeSvgStyles.display} textAnchor="middle" x="160" y="270">
                  {progress < 34 ? "先辨无根" : progress < 72 ? "阳气回潜" : "根部守住"}
                </text>
              </svg>
            </article>

            <article className="rounded-[24px] border border-border/70 bg-background/60 p-4">
              <div className="space-y-1">
                <PrototypeEyebrow>Transition</PrototypeEyebrow>
                <h3 className="font-display text-2xl text-foreground">茯神法</h3>
              </div>
              <svg aria-label="茯神法右降动作" className={prototypeSvgClassName} viewBox="0 0 320 300">
                <ellipse cx="148" cy="78" fill="rgba(198,105,67,0.18)" rx={44 + state.upperScatter * 16} ry={18 + state.upperScatter * 8} />
                <ellipse cx="204" cy="220" fill="rgba(170,135,68,0.2)" rx={40 + state.settle * 16} ry={18 + state.settle * 8} />
                <path
                  d="M 170 102 C 220 138 238 184 222 242"
                  fill="none"
                  opacity={0.18 + state.rightDescend * 0.5}
                  stroke="rgba(94,130,160,0.82)"
                  strokeLinecap="round"
                  strokeWidth={5 + state.rightDescend * 5}
                />
                <circle cx="148" cy="78" fill="rgba(198,105,67,0.82)" opacity={0.18 + state.upperScatter * 0.42} r={12 + state.upperScatter * 10} />
                <circle cx="204" cy="220" fill="rgba(170,135,68,0.84)" opacity={0.2 + state.settle * 0.46} r={12 + state.settle * 10} />
                <text style={prototypeSvgStyles.display} textAnchor="middle" x="160" y="270">
                  {progress < 34 ? "先稳乱象" : progress < 72 ? "右降缓转" : "局面能接"}
                </text>
              </svg>
            </article>
          </div>
        </PrototypeVisualCard>

        <div className={prototypeReadoutGridClassName}>
          <PrototypeReadoutCard description="附子：根没守住，茯神：局面太乱" label="先判断什么" title="桂枝：门没开" />
          <PrototypeReadoutCard
            description="三种动作都不该被压成一种“扶阳加热”的模糊印象。"
            label="方向感"
            title="开门向外，归根向下，缓转向右下"
          />
          <PrototypeReadoutCard
            description="这三个落点，正好对应大众最容易混淆的三种处理任务。"
            label="用户记忆"
            title="有路了，守住了，先稳住了"
          />
        </div>

        <PrototypeLinkRow>
          <PrototypeLinkButton href="/prototypes/guizhi-gate-animation">看桂枝细版</PrototypeLinkButton>
          <PrototypeLinkButton href="/prototypes/fuzi-root-return">看附子细版</PrototypeLinkButton>
          <PrototypeLinkButton href="/prototypes/fushen-right-descend">看茯神细版</PrototypeLinkButton>
          <PrototypeLinkButton href={getPracticeHref("fu-yang-triage-basic")}>去做分流练习</PrototypeLinkButton>
        </PrototypeLinkRow>
      </PrototypeStage>
    </PrototypeShell>
  );
}
