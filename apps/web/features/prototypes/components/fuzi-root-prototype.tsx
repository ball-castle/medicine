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

type StateId = "floating" | "returning" | "rooted";
type FocusId = "root" | "descent" | "compare";

const STATES: Record<
  StateId,
  {
    label: string;
    summary: string;
    prompt: string;
  }
> = {
  floating: {
    label: "阳浮于上",
    summary: "表层躁动、根部发空，是最适合先建立“归根”需求感的状态。",
    prompt: "先看‘上面亮得厉害，下面却收不住’这个结构，不要先把它误当成单纯有热。",
  },
  returning: {
    label: "开始回根",
    summary: "浮散之火开始往下收，系统从外越转向内守，适合表现“收回去”的过程感。",
    prompt: "这里最重要的动作不是往外开，而是往下收、往里归。",
  },
  rooted: {
    label: "真阳归根",
    summary: "根部重新有主，表层不再虚浮乱亮，系统进入可守可藏的状态。",
    prompt: "记住这里的关键词是‘根在下面稳住了’，而不是‘上面没那么热了’。",
  },
};

const FOCI: Record<
  FocusId,
  {
    label: string;
    summary: string;
  }
> = {
  root: {
    label: "看根部",
    summary: "先把注意力放在下部能不能收住真阳，理解为什么叫“归根”。",
  },
  descent: {
    label: "看下潜",
    summary: "用轨迹说明“回去”是附子法的核心动作，不是简单升温。",
  },
  compare: {
    label: "看对照",
    summary: "和桂枝法放在同一坐标里看，强化“开门”和“归根”的区别。",
  },
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getStateFromRoot(root: number): StateId {
  if (root >= 72) {
    return "rooted";
  }
  if (root >= 34) {
    return "returning";
  }
  return "floating";
}

export function FuziRootPrototype() {
  const [rootPull, setRootPull] = useState(26);
  const [focus, setFocus] = useState<FocusId>("root");

  const stateId = getStateFromRoot(rootPull);
  const state = STATES[stateId];

  const metrics = useMemo(() => {
    const rootRatio = clamp((rootPull - 10) / 88, 0.02, 1);
    const descent = clamp(rootRatio * 1.08 + (focus === "descent" ? 0.14 : 0), 0.08, 1);
    const upperScatter = clamp(1 - rootRatio + (stateId === "floating" ? 0.12 : 0), 0.08, 1);
    const rootGlow = clamp(rootRatio + (focus === "root" ? 0.08 : 0), 0.12, 1);

    return { rootRatio, descent, upperScatter, rootGlow };
  }, [focus, rootPull, stateId]);

  const insight =
    focus === "root"
      ? "这里先看下面有没有根、有无收纳能力，因为附子法最关键的不是外开，而是把真阳收回根部。"
      : focus === "descent"
        ? "这里把视线放到向下回潜的轨迹上，训练用户看到‘回去’这件事。"
        : "这里故意和桂枝法形成并排对照，防止用户把扶阳的两个动作混成一个概念。";

  const actionLine =
    stateId === "floating"
      ? "现在的重点是识别‘浮’。看起来上面亮，但下面守不住。"
      : stateId === "returning"
        ? "现在的重点是‘收回’。阳开始往下潜、往里归，根部逐渐接住。"
        : "现在的重点是‘守住’。真阳已归根，系统开始可藏可守。";

  return (
    <PrototypeShell>
      <PrototypeSidebar>
        <PrototypeIntro
          description={
            <>
              这张原型专门解决另一个常见误解：附子法不是把火再往上顶，而是把浮散无根的阳重新收回去、
              归到根部。这里的重点是“往下回”“收得住”，不是“更热了”。
            </>
          }
          title="附子法归根动画原型"
        />

        <div className="space-y-4">
          <PrototypeControlGroup>
            <div className={prototypeSliderTopClassName}>
              <p className="font-display text-xs uppercase tracking-[0.24em] text-primary">归根力度</p>
              <strong className={prototypeSliderValueClassName}>{rootPull}</strong>
            </div>
            <input
              aria-label="归根力度"
              className={prototypeRangeClassName}
              max={100}
              min={0}
              onChange={(event) => setRootPull(Number(event.target.value))}
              type="range"
              value={rootPull}
            />
            <div className={prototypeSliderLegendClassName}>
              <span>浮散</span>
              <span>归根</span>
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
          <svg aria-label="附子法归根动画原型" className={prototypeSvgClassName} viewBox="0 0 640 540">
            <ellipse
              cx="320"
              cy="122"
              fill="rgba(198,105,67,0.12)"
              rx={94 + metrics.upperScatter * 20}
              ry={42 + metrics.upperScatter * 12}
            />
            <ellipse
              cx="320"
              cy="438"
              fill="rgba(63,105,144,0.1)"
              rx={86 + metrics.rootGlow * 24}
              ry={44 + metrics.rootGlow * 12}
            />

            <line
              opacity="0.18"
              stroke="rgba(29,45,42,0.18)"
              strokeDasharray="9 12"
              strokeWidth="4"
              x1="320"
              x2="320"
              y1="116"
              y2="430"
            />

            <path
              d="M 320 154 C 320 230 316 300 320 402"
              fill="none"
              opacity={0.18 + metrics.descent * 0.44}
              stroke="rgba(71,114,160,0.82)"
              strokeLinecap="round"
              strokeWidth={8 + metrics.descent * 7}
            />

            {metrics.descent > 0.16 && (
              <>
                <circle fill="#f7fbff" opacity={0.56 + metrics.descent * 0.3} r={4 + metrics.descent * 2.4}>
                  <animateMotion
                    dur={`${clamp(7.2 - metrics.descent * 3.4, 2.6, 6.6)}s`}
                    path="M 320 154 C 320 230 316 300 320 402"
                    repeatCount="indefinite"
                  />
                </circle>
                <circle fill="#fff5eb" opacity={0.42 + metrics.descent * 0.2} r={3 + metrics.descent * 2.2}>
                  <animateMotion
                    begin="-1.1s"
                    dur={`${clamp(7.6 - metrics.descent * 3.5, 2.8, 6.8)}s`}
                    path="M 320 138 C 324 214 320 282 320 390"
                    repeatCount="indefinite"
                  />
                </circle>
              </>
            )}

            {metrics.upperScatter > 0.18 && (
              <>
                <circle
                  cx="266"
                  cy="114"
                  fill="rgba(198,105,67,0.74)"
                  opacity={0.2 + metrics.upperScatter * 0.3}
                  r={8 + metrics.upperScatter * 10}
                >
                  <animate attributeName="r" dur="2s" repeatCount="indefinite" values="9;16;9" />
                </circle>
                <circle
                  cx="372"
                  cy="126"
                  fill="rgba(198,105,67,0.7)"
                  opacity={0.18 + metrics.upperScatter * 0.28}
                  r={8 + metrics.upperScatter * 10}
                >
                  <animate attributeName="r" dur="2.3s" repeatCount="indefinite" values="8;15;8" />
                </circle>
              </>
            )}

            <ellipse
              cx="320"
              cy="122"
              fill="rgba(201,107,67,0.82)"
              opacity={0.22 + metrics.upperScatter * 0.42}
              rx={66 + metrics.upperScatter * 18}
              ry={34 + metrics.upperScatter * 10}
            />
            <ellipse
              cx="320"
              cy="430"
              fill="rgba(63,105,144,0.84)"
              opacity={0.22 + metrics.rootGlow * 0.48}
              rx={62 + metrics.rootGlow * 18}
              ry={34 + metrics.rootGlow * 12}
            />

            <circle cx="320" cy="122" fill="#fff7f0" opacity="0.82" r="11" />
            <circle cx="320" cy="430" fill="#f3f8ff" opacity="0.84" r="12" />

            <text style={prototypeSvgStyles.display} textAnchor="middle" x="320" y="72">
              真阳归根
            </text>
            <text style={prototypeSvgStyles.subtext} textAnchor="middle" x="320" y="482">
              {stateId === "floating" ? "上浮下虚" : stateId === "returning" ? "正在回潜" : "根部已守"}
            </text>

            {focus === "root" && (
              <>
                <text style={prototypeSvgStyles.callout} textAnchor="start" x="412" y="402">
                  根部接住
                </text>
                <line
                  opacity="0.46"
                  stroke="rgba(63,105,144,0.74)"
                  strokeWidth="2"
                  x1="398"
                  x2="354"
                  y1="396"
                  y2="418"
                />
              </>
            )}

            {focus === "descent" && (
              <>
                <text style={prototypeSvgStyles.callout} textAnchor="end" x="220" y="250">
                  向下回潜
                </text>
                <line
                  opacity="0.46"
                  stroke="rgba(63,105,144,0.74)"
                  strokeWidth="2"
                  x1="234"
                  x2="296"
                  y1="254"
                  y2="286"
                />
              </>
            )}

            {focus === "compare" && (
              <>
                <rect fill="rgba(255,255,255,0.72)" height="116" rx="18" width="188" x="400" y="110" />
                <text style={prototypeSvgStyles.panelTitle} textAnchor="middle" x="494" y="140">
                  对照：桂枝法
                </text>
                <text style={prototypeSvgStyles.panelCopy} textAnchor="middle" x="494" y="170">
                  桂枝法：开门
                </text>
                <text style={prototypeSvgStyles.panelCopy} textAnchor="middle" x="494" y="194">
                  附子法：归根
                </text>
              </>
            )}
          </svg>
        </PrototypeVisualCard>

        <div className={prototypeReadoutGridClassName}>
          <PrototypeReadoutCard
            description="帮助用户看到：上面发亮，不代表根里更稳，反而可能是浮散无守。"
            label="上部状态"
            title={metrics.upperScatter > 0.68 ? "明显虚浮" : metrics.upperScatter > 0.34 ? "仍有外越" : "表层较收"}
          />
          <PrototypeReadoutCard
            description="附子法最值得看懂的，就是这条“往下回”“往里归”的动作轨迹。"
            label="下潜轨迹"
            title={metrics.descent > 0.68 ? "回潜明显" : metrics.descent > 0.34 ? "开始下收" : "仍未回归"}
          />
          <PrototypeReadoutCard
            description="这一栏专门提醒用户：附子法讲的是“守根”，不是把上面推得更亮。"
            label="根部状态"
            title={metrics.rootGlow > 0.68 ? "根部稳住" : metrics.rootGlow > 0.34 ? "根在恢复" : "根部发空"}
          />
        </div>

        <PrototypeLinkRow>
          <PrototypeLinkButton href="/prototypes/guizhi-gate-animation">回看桂枝开门</PrototypeLinkButton>
          <PrototypeLinkButton href="/prototypes/kan-li-circulation">回看坎离交通</PrototypeLinkButton>
          <PrototypeLinkButton href="/storyboards">查看分镜说明</PrototypeLinkButton>
        </PrototypeLinkRow>
      </PrototypeStage>
    </PrototypeShell>
  );
}
