"use client";

import { useMemo, useState } from "react";

import {
  PrototypeControlGroup,
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

type StateId = "stuck" | "unlocking" | "open";
type FocusId = "gate" | "flow" | "compare";

const STATES: Record<
  StateId,
  {
    label: string;
    summary: string;
    prompt: string;
  }
> = {
  stuck: {
    label: "门轴被卡住",
    summary: "外层开合不利，气流在门前反复碰撞，是最适合先建立问题感的状态。",
    prompt: "先看‘没路’这件事，而不是先猜病名或药名。",
  },
  unlocking: {
    label: "正在拨动",
    summary: "门轴开始松动，但还没完全打开，适合表现“拨”的过程感。",
    prompt: "这一段要让用户看到桂枝法的动作是‘拨开’，不是简单加热。",
  },
  open: {
    label: "内外重新接轨",
    summary: "门一开，流线开始有序进出，后续调整才真正有路可走。",
    prompt: "记住这里的核心体验是‘有路了’，而不是‘出了汗’。",
  },
};

const FOCI: Record<
  FocusId,
  {
    label: string;
    summary: string;
  }
> = {
  gate: {
    label: "看门轴",
    summary: "先把注意力放在开合机制本身，理解为什么叫“开门”。",
  },
  flow: {
    label: "看流线",
    summary: "门一开之后，最关键的变化是内外流动重新有路。",
  },
  compare: {
    label: "看对照",
    summary: "把桂枝法和附子法讲成两个动作，而不是两种相似热药。",
  },
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getStateFromPull(pull: number): StateId {
  if (pull >= 72) {
    return "open";
  }
  if (pull >= 34) {
    return "unlocking";
  }
  return "stuck";
}

export function GuizhiGatePrototype() {
  const [pull, setPull] = useState(28);
  const [focus, setFocus] = useState<FocusId>("gate");

  const stateId = getStateFromPull(pull);
  const state = STATES[stateId];

  const metrics = useMemo(() => {
    const gateRatio = clamp((pull - 16) / 84, 0.02, 1);
    const outerFlow = clamp(gateRatio * 1.08 + (focus === "flow" ? 0.14 : 0), 0.06, 1);
    const collision = clamp(1 - gateRatio + (stateId === "stuck" ? 0.12 : 0), 0.08, 1);
    const compareShift = focus === "compare" ? 1 : 0;

    return { gateRatio, outerFlow, collision, compareShift };
  }, [focus, pull, stateId]);

  const insight =
    focus === "gate"
      ? "这里先看‘门有没有打开’，因为桂枝法最核心的教学动作不是补，而是拨开开机。"
      : focus === "flow"
        ? "这里把视线放到门两侧的气流上，训练用户看到‘有路’这件事。"
        : "这里故意把桂枝法和附子法摆在一张图里，防止用户把扶阳理解成一锅热药。";

  const actionLine =
    stateId === "stuck"
      ? "现在的重点是识别‘卡住’。系统不是没能量，而是开合不利。"
      : stateId === "unlocking"
        ? "现在的重点是‘拨动’。气不是瞬间恢复，而是先有一条路开始松开。"
        : "现在的重点是‘接轨’。门一开，内外流动重新建立节奏。";

  return (
    <PrototypeShell>
      <PrototypeSidebar>
        <PrototypeIntro
          description={
            <>
              这张原型专门解决一个常见误解：桂枝法不是普通意义上的“发汗”，而是把卡住的门轴拨开，
              让内外重新有路。这里的重点是动作感，不是药味列表。
            </>
          }
          title="桂枝法开门动画原型"
        />

        <div className="space-y-4">
          <PrototypeControlGroup>
            <div className={prototypeSliderTopClassName}>
              <p className="font-display text-xs uppercase tracking-[0.24em] text-primary">拨门力度</p>
              <strong className={prototypeSliderValueClassName}>{pull}</strong>
            </div>
            <input
              aria-label="拨门力度"
              className={prototypeRangeClassName}
              max={100}
              min={0}
              onChange={(event) => setPull(Number(event.target.value))}
              type="range"
              value={pull}
            />
            <div className={prototypeSliderLegendClassName}>
              <span>卡住</span>
              <span>拨开</span>
            </div>
          </PrototypeControlGroup>

          <PrototypeControlGroup title="讲解焦点">
            <div className="grid gap-2">
              {(Object.entries(FOCI) as Array<[FocusId, (typeof FOCI)[FocusId]]>).map(([key, item]) => (
                <PrototypeSelectableButton active={focus === key} key={key} onClick={() => setFocus(key)}>
                  <strong className="block font-display text-base text-foreground">{item.label}</strong>
                  <span className="mt-2 block text-sm leading-7 text-muted-foreground">{item.summary}</span>
                </PrototypeSelectableButton>
              ))}
            </div>
          </PrototypeControlGroup>
        </div>

        <div className={prototypeCardGridClassName}>
          <PrototypeNoteCard description={state.summary} label="当前状态" title={state.label} />
          <PrototypeNoteCard description={insight} label="学习提示" title={FOCI[focus].label} />
          <PrototypeNoteCard description={actionLine} label="动作线" title={state.prompt} />
        </div>
      </PrototypeSidebar>

      <PrototypeStage>
        <PrototypeVisualCard className="p-5 md:p-6">
          <svg aria-label="桂枝法开门动画原型" className={prototypeSvgClassName} viewBox="0 0 640 520">
            <rect fill="rgba(29,45,42,0.06)" height="340" rx="28" width="336" x="152" y="88" />
            <line
              opacity="0.2"
              stroke="rgba(29,45,42,0.18)"
              strokeDasharray="8 12"
              strokeWidth="3"
              x1="320"
              x2="320"
              y1="94"
              y2="422"
            />

            <g opacity={0.94}>
              <rect
                fill="rgba(191,108,63,0.9)"
                height="304"
                rx="16"
                transform={`translate(${188 - metrics.gateRatio * 74} ${106 + metrics.gateRatio * 6}) rotate(${-(metrics.gateRatio * 18)} 124 152)`}
                width="132"
              />
              <rect
                fill="rgba(170,95,58,0.62)"
                height="304"
                rx="16"
                transform={`translate(${320 + metrics.gateRatio * 74} ${106 + metrics.gateRatio * 6}) rotate(${metrics.gateRatio * 18} 516 152)`}
                width="132"
              />
            </g>

            <circle cx={250 - metrics.gateRatio * 48} cy="260" fill="#fff5e8" opacity="0.74" r="8" />
            <circle cx={390 + metrics.gateRatio * 48} cy="260" fill="#fff5e8" opacity="0.58" r="8" />

            {metrics.collision > 0.22 && (
              <>
                <circle
                  cx="320"
                  cy="214"
                  fill="rgba(191,108,63,0.74)"
                  opacity={0.24 + metrics.collision * 0.34}
                  r={10 + metrics.collision * 12}
                >
                  <animate attributeName="r" dur="1.9s" repeatCount="indefinite" values="11;18;11" />
                </circle>
                <circle
                  cx="320"
                  cy="306"
                  fill="rgba(191,108,63,0.58)"
                  opacity={0.18 + metrics.collision * 0.3}
                  r={8 + metrics.collision * 10}
                >
                  <animate attributeName="r" dur="2.3s" repeatCount="indefinite" values="9;15;9" />
                </circle>
              </>
            )}

            {metrics.outerFlow > 0.16 && (
              <>
                <path
                  d="M 110 210 C 176 210 210 212 270 220"
                  fill="none"
                  opacity={0.2 + metrics.outerFlow * 0.46}
                  stroke="rgba(95,139,67,0.72)"
                  strokeLinecap="round"
                  strokeWidth={5 + metrics.outerFlow * 6}
                />
                <path
                  d="M 370 300 C 430 308 468 310 530 310"
                  fill="none"
                  opacity={0.2 + metrics.outerFlow * 0.46}
                  stroke="rgba(63,105,144,0.72)"
                  strokeLinecap="round"
                  strokeWidth={5 + metrics.outerFlow * 6}
                />
                <circle fill="#f4fff4" opacity={0.52 + metrics.outerFlow * 0.3} r={3.5 + metrics.outerFlow * 2.2}>
                  <animateMotion
                    dur={`${clamp(7.2 - metrics.outerFlow * 3.6, 2.4, 6.4)}s`}
                    path="M 112 210 C 176 210 210 212 270 220"
                    repeatCount="indefinite"
                  />
                </circle>
                <circle fill="#f4f9ff" opacity={0.52 + metrics.outerFlow * 0.3} r={3.5 + metrics.outerFlow * 2.2}>
                  <animateMotion
                    begin="-1.2s"
                    dur={`${clamp(7.2 - metrics.outerFlow * 3.6, 2.4, 6.4)}s`}
                    path="M 370 300 C 430 308 468 310 530 310"
                    repeatCount="indefinite"
                  />
                </circle>
              </>
            )}

            <text style={prototypeSvgStyles.display} textAnchor="middle" x="320" y="66">
              太阳之门
            </text>
            <text style={prototypeSvgStyles.subtext} textAnchor="middle" x="320" y="454">
              {stateId === "stuck" ? "门未开，气难出入" : stateId === "unlocking" ? "门轴松动，流线初通" : "门已开，内外接轨"}
            </text>

            {focus === "gate" && (
              <>
                <text style={prototypeSvgStyles.callout} textAnchor="end" x="166" y="154">
                  拨门轴
                </text>
                <line
                  opacity="0.46"
                  stroke="rgba(191,108,63,0.72)"
                  strokeWidth="2"
                  x1="178"
                  x2="226"
                  y1="158"
                  y2="178"
                />
              </>
            )}

            {focus === "flow" && (
              <>
                <text style={prototypeSvgStyles.callout} textAnchor="start" x="468" y="206">
                  流线有路
                </text>
                <line
                  opacity="0.46"
                  stroke="rgba(95,139,67,0.72)"
                  strokeWidth="2"
                  x1="454"
                  x2="392"
                  y1="210"
                  y2="230"
                />
              </>
            )}

            {focus === "compare" && (
              <>
                <rect fill="rgba(255,255,255,0.7)" height="110" rx="18" width="176" x={404 + metrics.compareShift * 4} y="108" />
                <text style={prototypeSvgStyles.panelTitle} textAnchor="middle" x="492" y="138">
                  对照：附子法
                </text>
                <text style={prototypeSvgStyles.panelCopy} textAnchor="middle" x="492" y="166">
                  桂枝法：开门
                </text>
                <text style={prototypeSvgStyles.panelCopy} textAnchor="middle" x="492" y="190">
                  附子法：归根
                </text>
              </>
            )}
          </svg>
        </PrototypeVisualCard>

        <div className={prototypeReadoutGridClassName}>
          <PrototypeReadoutCard
            description="用来帮助用户先看“开合机制”，而不是直接联想到某个症状标签。"
            label="门轴状态"
            title={state.label}
          />
          <PrototypeReadoutCard
            description="桂枝法真正想恢复的是“有路”，不是把画面单纯变热。"
            label="流线状态"
            title={metrics.outerFlow > 0.68 ? "进出顺畅" : metrics.outerFlow > 0.34 ? "开始贯通" : "反复碰撞"}
          />
          <PrototypeReadoutCard
            description="这张图的任务之一，是给后面的附子法归根做清晰边界。"
            label="动作对照"
            title={focus === "compare" ? "已进入对照视角" : "先看开门动作"}
          />
        </div>

        <PrototypeLinkRow>
          <PrototypeLinkButton href="/prototypes/kan-li-circulation">回看坎离交通</PrototypeLinkButton>
          <PrototypeLinkButton href="/prototypes/fuzi-root-return">去看附子归根</PrototypeLinkButton>
          <PrototypeLinkButton href="/storyboards">查看分镜说明</PrototypeLinkButton>
        </PrototypeLinkRow>
      </PrototypeStage>
    </PrototypeShell>
  );
}
