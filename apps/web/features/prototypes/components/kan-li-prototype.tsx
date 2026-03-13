"use client";

import { useId, useMemo, useState } from "react";

import { cn } from "@/lib/utils";

import {
  PrototypeControlGroup,
  PrototypeIntro,
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

type ScenarioId = "connected" | "blocked" | "restoring";
type FocusId = "core" | "surface" | "guizhi" | "fuzi";

const SCENARIOS: Record<
  ScenarioId,
  {
    label: string;
    summary: string;
    prompt: string;
  }
> = {
  connected: {
    label: "上下既济",
    summary: "水火有来有往，重点是先让用户看到“通”的安定感。",
    prompt: "先记住顺畅交通时的状态，后面才看得出阻断到底坏在哪里。",
  },
  blocked: {
    label: "交通中断",
    summary: "上部躁、下部虚，中间通道暗淡，是最典型的教学对照面。",
    prompt: "别只盯上面的热和躁，先看中间为什么接不上、下面为什么守不住。",
  },
  restoring: {
    label: "逐步恢复",
    summary: "用滑杆展示‘恢复交通’不是一瞬间，而是一步步接通。",
    prompt: "观察恢复过程中先变的是哪一层：表象、通道，还是根部稳定。",
  },
};

const FOCI: Record<
  FocusId,
  {
    label: string;
    summary: string;
  }
> = {
  core: {
    label: "核心结构",
    summary: "先看上下之间能不能真正接通，不先被表象带走。",
  },
  surface: {
    label: "表面热象",
    summary: "帮助用户看到“表面热、里面虚”不是矛盾，而是同一结构的两面。",
  },
  guizhi: {
    label: "开门方向",
    summary: "桂枝法偏向让外层与上部重新打开通路。",
  },
  fuzi: {
    label: "归根方向",
    summary: "附子法偏向让散浮之阳重新回到根部。",
  },
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function KanLiPrototype() {
  const [scenario, setScenario] = useState<ScenarioId>("blocked");
  const [restoration, setRestoration] = useState(42);
  const [focus, setFocus] = useState<FocusId>("core");

  const idPrefix = useId().replace(/:/g, "");

  const state = useMemo(() => {
    const baseConnection =
      scenario === "connected" ? 92 : scenario === "blocked" ? 18 : restoration;
    const connection = clamp(baseConnection, 6, 100);
    const rootStrength = clamp((connection + (focus === "fuzi" ? 18 : 0)) / 100, 0.12, 1);
    const gateOpenness = clamp((connection + (focus === "guizhi" ? 18 : 0)) / 100, 0.12, 1);
    const upperHeat = clamp(
      (scenario === "blocked" ? 0.82 : scenario === "restoring" ? 0.58 - restoration / 220 : 0.28) +
        (focus === "surface" ? 0.14 : 0),
      0.18,
      0.92,
    );
    const turbulence = clamp(
      (scenario === "blocked" ? 0.9 : scenario === "restoring" ? 0.72 - restoration / 170 : 0.18) +
        (focus === "surface" ? 0.1 : 0),
      0.08,
      0.96,
    );

    return {
      connection,
      rootStrength,
      gateOpenness,
      upperHeat,
      turbulence,
    };
  }, [focus, restoration, scenario]);

  const insight =
    focus === "core"
      ? "当前先看中间通道和上下关系，不先被表热表寒的字面印象带走。"
      : focus === "surface"
        ? "这一步专门训练用户区分：看起来更热，不代表根里就更有力。"
        : focus === "guizhi"
          ? "这里把注意力放在外层开合和上部开机，让用户理解“开门”这一动作。"
          : "这里把注意力放在根部收纳与回归，让用户理解“归根”不是升温同义词。";

  const branchHint =
    focus === "guizhi"
      ? "更偏向桂枝法的讲法：先把门轴和外层通路拨开。"
      : focus === "fuzi"
        ? "更偏向附子法的讲法：先让快散掉的火重新归根。"
        : "两种后续动作都围绕同一个核心结构：先看交通，再看怎么处理。";

  return (
    <PrototypeShell>
      <PrototypeSidebar>
        <PrototypeIntro
          description={
            <>
              这张原型的目标，是让用户不再把扶阳理解成“上热药”。它先把上下交通画清楚，再让用户看到：
              表面热象、开门、归根，其实都围绕同一条结构主线。
            </>
          }
          title="坎离水火交通图交互原型"
        />

        <div className="space-y-4">
          <PrototypeControlGroup title="当前状态">
            <div className="grid gap-2">
              {(Object.entries(SCENARIOS) as Array<[ScenarioId, (typeof SCENARIOS)[ScenarioId]]>).map(
                ([key, item]) => (
                  <PrototypeSelectableButton active={scenario === key} key={key} onClick={() => setScenario(key)}>
                    <strong className="block font-display text-base text-foreground">{item.label}</strong>
                    <span className="mt-2 block text-sm leading-7 text-muted-foreground">{item.summary}</span>
                  </PrototypeSelectableButton>
                ),
              )}
            </div>
          </PrototypeControlGroup>

          <PrototypeControlGroup>
            <div className={prototypeSliderTopClassName}>
              <p className="font-display text-xs uppercase tracking-[0.24em] text-primary">交通恢复进度</p>
              <strong className={prototypeSliderValueClassName}>
                {scenario === "restoring" ? restoration : state.connection}
              </strong>
            </div>
            <input
              aria-label="交通恢复进度"
              className={cn(prototypeRangeClassName, "disabled:cursor-not-allowed disabled:opacity-40")}
              disabled={scenario !== "restoring"}
              max={100}
              min={0}
              onChange={(event) => setRestoration(Number(event.target.value))}
              type="range"
              value={scenario === "restoring" ? restoration : state.connection}
            />
            <div className={prototypeSliderLegendClassName}>
              <span>未接通</span>
              <span>重新既济</span>
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
          <PrototypeNoteCard description={SCENARIOS[scenario].prompt} label="学习提示" title={SCENARIOS[scenario].label} />
          <PrototypeNoteCard description={insight} label="当前焦点" title={FOCI[focus].label} />
          <PrototypeNoteCard
            description={branchHint}
            label="后续动作"
            title={focus === "guizhi" ? "偏开门" : focus === "fuzi" ? "偏归根" : "仍在看主轴"}
          />
        </div>
      </PrototypeSidebar>

      <PrototypeStage>
        <PrototypeVisualCard className="p-5 md:p-6">
          <svg aria-label="坎离水火交通图原型" className={prototypeSvgClassName} viewBox="0 0 620 560">
            <defs>
              <linearGradient id={`${idPrefix}-channel`} x1="50%" x2="50%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(224,120,68,0.95)" />
                <stop offset="48%" stopColor="rgba(248,235,205,0.84)" />
                <stop offset="100%" stopColor="rgba(67,111,153,0.94)" />
              </linearGradient>
              <radialGradient id={`${idPrefix}-top`} cx="50%" cy="50%" r="62%">
                <stop offset="0%" stopColor="rgba(255,236,217,0.95)" />
                <stop offset="100%" stopColor="rgba(198,105,67,0.92)" />
              </radialGradient>
              <radialGradient id={`${idPrefix}-bottom`} cx="50%" cy="44%" r="64%">
                <stop offset="0%" stopColor="rgba(228,241,255,0.96)" />
                <stop offset="100%" stopColor="rgba(63,105,144,0.94)" />
              </radialGradient>
            </defs>

            <ellipse
              cx="310"
              cy="116"
              fill="rgba(201,107,67,0.08)"
              rx={95 + state.upperHeat * 18}
              ry={46 + state.upperHeat * 10}
            />
            <ellipse
              cx="310"
              cy="448"
              fill="rgba(63,105,144,0.1)"
              rx={92 + state.rootStrength * 18}
              ry={44 + state.rootStrength * 10}
            />

            <path
              d="M 310 158 C 304 228 304 328 310 404"
              fill="none"
              opacity={0.16}
              stroke="rgba(29,45,42,0.18)"
              strokeDasharray="10 12"
              strokeWidth="36"
            />
            <path
              d="M 310 158 C 304 228 304 328 310 404"
              fill="none"
              opacity={0.18 + state.connection / 130}
              stroke={`url(#${idPrefix}-channel)`}
              strokeLinecap="round"
              strokeWidth={16 + state.connection / 9}
            />

            <path
              d="M 234 184 C 188 232 182 310 214 366"
              fill="none"
              opacity={0.18 + state.gateOpenness * 0.28}
              stroke="rgba(201,107,67,0.62)"
              strokeLinecap="round"
              strokeWidth={6 + state.gateOpenness * 4}
            />
            <path
              d="M 386 184 C 432 232 438 310 406 366"
              fill="none"
              opacity={0.18 + state.gateOpenness * 0.28}
              stroke="rgba(63,105,144,0.62)"
              strokeLinecap="round"
              strokeWidth={6 + state.gateOpenness * 4}
            />

            {state.connection > 18 && (
              <>
                <circle fill="#fff8ef" opacity={0.56 + state.connection / 220} r={4 + state.connection / 40}>
                  <animateMotion
                    dur={`${clamp(8 - state.connection / 18, 2.8, 7)}s`}
                    path="M 310 396 C 305 328 305 240 310 166"
                    repeatCount="indefinite"
                  />
                </circle>
                <circle fill="#f3f9ff" opacity={0.52 + state.connection / 220} r={3.6 + state.connection / 48}>
                  <animateMotion
                    begin="-1.8s"
                    dur={`${clamp(8.8 - state.connection / 17, 3.2, 7.4)}s`}
                    path="M 310 166 C 305 240 305 328 310 396"
                    repeatCount="indefinite"
                  />
                </circle>
              </>
            )}

            {state.turbulence > 0.28 && (
              <>
                <circle
                  cx="356"
                  cy="132"
                  fill="rgba(201,107,67,0.84)"
                  opacity={0.34 + state.turbulence * 0.34}
                  r={8 + state.turbulence * 10}
                >
                  <animate attributeName="r" dur="1.8s" repeatCount="indefinite" values="10;16;10" />
                </circle>
                <circle
                  cx="264"
                  cy="120"
                  fill="rgba(201,107,67,0.68)"
                  opacity={0.28 + state.turbulence * 0.3}
                  r={7 + state.turbulence * 9}
                >
                  <animate attributeName="r" dur="2.2s" repeatCount="indefinite" values="8;14;8" />
                </circle>
              </>
            )}

            <ellipse
              cx="310"
              cy="124"
              fill={`url(#${idPrefix}-top)`}
              opacity={0.46 + state.upperHeat * 0.44}
              rx={74 + state.upperHeat * 16}
              ry={46 + state.upperHeat * 12}
            />
            <ellipse
              cx="310"
              cy="436"
              fill={`url(#${idPrefix}-bottom)`}
              opacity={0.48 + state.rootStrength * 0.4}
              rx={70 + state.rootStrength * 18}
              ry={44 + state.rootStrength * 12}
            />

            <circle cx="310" cy="124" fill="#fff9f1" opacity="0.82" r="13" />
            <circle cx="310" cy="436" fill="#f2f8ff" opacity="0.84" r="13" />

            <text style={prototypeSvgStyles.label} textAnchor="middle" x="310" y="128">
              离
            </text>
            <text style={prototypeSvgStyles.label} textAnchor="middle" x="310" y="440">
              坎
            </text>

            <text style={prototypeSvgStyles.callout} textAnchor="middle" x="310" y="56">
              上部宣通 / 表层热象
            </text>
            <text style={prototypeSvgStyles.callout} textAnchor="middle" x="310" y="520">
              下部封藏 / 真阳归根
            </text>

            <text style={prototypeSvgStyles.display} textAnchor="middle" x="310" y="278">
              交通 {state.connection}
            </text>
            <text style={prototypeSvgStyles.subtext} textAnchor="middle" x="310" y="302">
              {scenario === "blocked"
                ? "上下不接"
                : scenario === "connected"
                  ? "上下既济"
                  : "逐步回接"}
            </text>

            {focus === "surface" && (
              <>
                <text style={prototypeSvgStyles.callout} textAnchor="start" x="404" y="110">
                  表热更显
                </text>
                <line
                  opacity="0.46"
                  stroke="rgba(191,108,63,0.72)"
                  strokeWidth="2"
                  x1="392"
                  x2="356"
                  y1="116"
                  y2="124"
                />
              </>
            )}

            {focus === "guizhi" && (
              <>
                <text style={prototypeSvgStyles.callout} textAnchor="end" x="170" y="208">
                  开门
                </text>
                <line
                  opacity="0.46"
                  stroke="rgba(191,108,63,0.72)"
                  strokeWidth="2"
                  x1="182"
                  x2="236"
                  y1="212"
                  y2="206"
                />
              </>
            )}

            {focus === "fuzi" && (
              <>
                <text style={prototypeSvgStyles.callout} textAnchor="start" x="396" y="396">
                  归根
                </text>
                <line
                  opacity="0.46"
                  stroke="rgba(63,105,144,0.74)"
                  strokeWidth="2"
                  x1="384"
                  x2="342"
                  y1="390"
                  y2="414"
                />
              </>
            )}
          </svg>
        </PrototypeVisualCard>

        <div className={prototypeReadoutGridClassName}>
          <PrototypeReadoutCard
            description="帮助用户把“热象”放回结构里，而不是把热直接当作根本判断。"
            label="上部状态"
            title={state.upperHeat > 0.66 ? "表热显著" : state.upperHeat > 0.4 ? "宣通可见" : "表象平稳"}
          />
          <PrototypeReadoutCard
            description="这是一整张图真正的主轴，也是扶阳模块最应该先看懂的地方。"
            label="中间通道"
            title={state.connection > 74 ? "交通顺利" : state.connection > 40 ? "正在回接" : "明显阻断"}
          />
          <PrototypeReadoutCard
            description="这里对应后续“归根”思路，提醒用户不要只盯上面的光和热。"
            label="根部状态"
            title={state.rootStrength > 0.72 ? "归根较稳" : state.rootStrength > 0.44 ? "根气待固" : "根部发虚"}
          />
        </div>
      </PrototypeStage>
    </PrototypeShell>
  );
}
