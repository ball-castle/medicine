"use client";

import { type CSSProperties, useMemo, useState } from "react";

import { getPracticeHref } from "@/lib/practice";
import { cn } from "@/lib/utils";

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

type FormulaId =
  | "guizhi-tang"
  | "mahuang-tang"
  | "xiaochaihu-tang"
  | "dachengqi-tang"
  | "sini-tang";

type LensId = "direction" | "layer" | "risk";

const FORMULAS: Record<
  FormulaId,
  {
    label: string;
    shortLabel: string;
    directionLabel: string;
    layerLabel: string;
    summary: string;
    whenToUse: string;
    risk: string;
    x: number;
    y: number;
    accent: string;
  }
> = {
  "guizhi-tang": {
    label: "桂枝汤",
    shortLabel: "桂枝",
    directionLabel: "微开外层，调和营卫",
    layerLabel: "更偏表里交界，不是猛发",
    summary: "重点不是把门撞开，而是轻轻拨动门轴，让里外能接起来。",
    whenToUse: "门口卡住、汗出不畅、胸背拘，像“该通而未通”。",
    risk: "如果根本是下弱无守，只会越开越散。",
    x: 340,
    y: 162,
    accent: "#bf6c3f",
  },
  "mahuang-tang": {
    label: "麻黄汤",
    shortLabel: "麻黄",
    directionLabel: "强力外开，直解闭束",
    layerLabel: "更偏外层郁闭，比桂枝更猛",
    summary: "不是所有表证都用同一种“开”，麻黄代表的是更强的外开与宣发。",
    whenToUse: "闭得更紧、束得更重、需要直接打开外层出口。",
    risk: "底盘本就虚散时，强开容易把系统再掀散。",
    x: 238,
    y: 124,
    accent: "#8f4b2b",
  },
  "xiaochaihu-tang": {
    label: "小柴胡汤",
    shortLabel: "柴胡",
    directionLabel: "和解枢机，转动半表半里",
    layerLabel: "更偏枢纽层，不是单纯升散或下降",
    summary: "它的价值在“转”，把卡在中间的枢机重新拨活。",
    whenToUse: "来回、往复、进退失常，像中间轴卡住了。",
    risk: "若里实已成或阳根太弱，只转不落会悬在中间。",
    x: 320,
    y: 238,
    accent: "#8a7350",
  },
  "dachengqi-tang": {
    label: "大承气汤",
    shortLabel: "承气",
    directionLabel: "重下实积，直解里闭",
    layerLabel: "更偏里实壅塞，方向明确往下",
    summary: "这里讲的是“该下时就下”，不是把所有热象都当成清热题。",
    whenToUse: "里实、燥结、壅塞明确，系统需要开下通降。",
    risk: "若只是虚热上浮或承接不足，强下会伤中败势。",
    x: 320,
    y: 358,
    accent: "#6c5f2f",
  },
  "sini-tang": {
    label: "四逆汤",
    shortLabel: "四逆",
    directionLabel: "收回浮越，守住下根",
    layerLabel: "更偏少阴根部，不是表层问题",
    summary: "它不是把火往上推，而是把已散的阳收回去、守住根。",
    whenToUse: "上亮下空、四末厥冷、像“有火象却没根”。",
    risk: "若门口未开或里实未解，先守根也可能把闭结关在里面。",
    x: 426,
    y: 322,
    accent: "#355f6b",
  },
};

const LENSES: Record<
  LensId,
  {
    label: string;
    summary: string;
  }
> = {
  direction: {
    label: "看方向",
    summary: "先不背功效词，先看这张方在系统里往哪边推。",
  },
  layer: {
    label: "看层次",
    summary: "区分它更偏表层、枢纽、里结还是根部，不把动作压平。",
  },
  risk: {
    label: "看误用风险",
    summary: "学习边界感，避免把“适合这一步”的动作拿去硬套到别处。",
  },
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function FormulaDirectionPrototype() {
  const [formulaId, setFormulaId] = useState<FormulaId>("guizhi-tang");
  const [lens, setLens] = useState<LensId>("direction");
  const [strength, setStrength] = useState(58);

  const formula = FORMULAS[formulaId];
  const intensity = clamp(strength / 100, 0.1, 1);

  const marker = useMemo(() => {
    const centerX = 320;
    const centerY = 240;
    const dx = formula.x - centerX;
    const dy = formula.y - centerY;

    return {
      x: centerX + dx * (0.58 + intensity * 0.42),
      y: centerY + dy * (0.58 + intensity * 0.42),
      radius: 18 + intensity * 12,
      halo: 34 + intensity * 22,
    };
  }, [formula, intensity]);

  const lensCopy =
    lens === "direction"
      ? formula.directionLabel
      : lens === "layer"
        ? formula.layerLabel
        : formula.risk;

  const strengthLabel =
    strength >= 74 ? "动作感更强" : strength >= 42 ? "动作感适中" : "动作感偏轻";

  return (
    <PrototypeShell>
      <PrototypeSidebar>
        <PrototypeIntro
          description={
            <>
              这张原型专门解决一个老问题: 用户一学方子就掉进功效名词表，记住了一堆标签，却没看懂它
              在整体气机里到底是在开、和、下，还是守根。
            </>
          }
          title="方剂方向罗盘"
        />

        <div className="space-y-4">
          <PrototypeControlGroup title="选方">
            <div className="grid gap-2">
              {(Object.entries(FORMULAS) as Array<[FormulaId, (typeof FORMULAS)[FormulaId]]>).map(([key, item]) => (
                <PrototypeSelectableButton
                  active={formulaId === key}
                  className={cn(formulaId === key && "shadow-soft")}
                  key={key}
                  onClick={() => setFormulaId(key)}
                  style={
                    formulaId === key
                      ? ({ borderColor: item.accent, backgroundColor: `${item.accent}18` } as CSSProperties)
                      : undefined
                  }
                  tone="neutral"
                >
                  <strong className="block font-display text-base text-foreground">{item.label}</strong>
                  <span className="mt-2 block text-sm leading-7 text-muted-foreground">{item.summary}</span>
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

          <PrototypeControlGroup>
            <div className={prototypeSliderTopClassName}>
              <p className="font-display text-xs uppercase tracking-[0.24em] text-primary">动作力度</p>
              <strong className={prototypeSliderValueClassName}>{strength}</strong>
            </div>
            <input
              aria-label="动作力度"
              className={prototypeRangeClassName}
              max={100}
              min={0}
              onChange={(event) => setStrength(Number(event.target.value))}
              type="range"
              value={strength}
            />
            <div className={prototypeSliderLegendClassName}>
              <span>轻拨</span>
              <span>强推</span>
            </div>
          </PrototypeControlGroup>
        </div>

        <div className={prototypeCardGridClassName}>
          <PrototypeNoteCard description={formula.whenToUse} label="当前选方" title={formula.label} />
          <PrototypeNoteCard description={lensCopy} label="当前镜头" title={LENSES[lens].label} />
          <PrototypeNoteCard
            description="这里不是在模拟剂量，而是在帮助用户体会不同方义的动作感和边界感。"
            label="力度提示"
            title={strengthLabel}
          />
        </div>
      </PrototypeSidebar>

      <PrototypeStage>
        <PrototypeVisualCard className="p-5 md:p-6">
          <svg aria-label="方剂方向罗盘原型" className={prototypeSvgClassName} viewBox="0 0 640 520">
            <circle cx="320" cy="240" fill="rgba(255,255,255,0.48)" r="164" />
            <circle cx="320" cy="240" fill="none" opacity="0.28" r="164" stroke="rgba(29,45,42,0.22)" strokeWidth="2" />
            <circle cx="320" cy="240" fill="none" opacity="0.18" r="110" stroke="rgba(29,45,42,0.18)" strokeDasharray="8 12" strokeWidth="2" />
            <line opacity="0.2" stroke="rgba(29,45,42,0.28)" strokeWidth="2" x1="320" x2="320" y1="60" y2="420" />
            <line opacity="0.2" stroke="rgba(29,45,42,0.28)" strokeWidth="2" x1="140" x2="500" y1="240" y2="240" />

            <text style={prototypeSvgStyles.label} textAnchor="middle" x="320" y="84">
              外开
            </text>
            <text style={prototypeSvgStyles.label} textAnchor="middle" x="320" y="404">
              通降
            </text>
            <text style={prototypeSvgStyles.label} textAnchor="middle" x="196" y="228">
              宣发
            </text>
            <text style={prototypeSvgStyles.label} textAnchor="middle" x="444" y="228">
              守根
            </text>

            <text style={prototypeSvgStyles.display} textAnchor="middle" x="320" y="230">
              方义不是标签
            </text>
            <text style={prototypeSvgStyles.subtext} textAnchor="middle" x="320" y="254">
              先看动作，再看病名
            </text>

            {(Object.entries(FORMULAS) as Array<[FormulaId, (typeof FORMULAS)[FormulaId]]>).map(([key, item]) => (
              <g key={key}>
                <circle
                  cx={item.x}
                  cy={item.y}
                  fill={item.accent}
                  opacity={formulaId === key ? 0.92 : 0.42}
                  r={formulaId === key ? 16 : 11}
                />
                <text style={prototypeSvgStyles.label} textAnchor="middle" x={item.x} y={item.y + 34}>
                  {item.shortLabel}
                </text>
              </g>
            ))}

            <circle cx={marker.x} cy={marker.y} fill={formula.accent} opacity="0.16" r={marker.halo} />
            <circle cx={marker.x} cy={marker.y} fill={formula.accent} opacity="0.92" r={marker.radius} />
            <line
              opacity="0.34"
              stroke={formula.accent}
              strokeDasharray="10 8"
              strokeWidth="3"
              x1="320"
              x2={marker.x}
              y1="240"
              y2={marker.y}
            />

            <rect fill="rgba(255,255,255,0.72)" height="112" rx="18" width="212" x="386" y="80" />
            <text style={prototypeSvgStyles.panelTitle} textAnchor="middle" x="492" y="112">
              {formula.label}
            </text>
            <text style={prototypeSvgStyles.panelCopy} textAnchor="middle" x="492" y="142">
              {lens === "direction" ? "主方向" : lens === "layer" ? "主层次" : "误用边界"}
            </text>
            <text style={prototypeSvgStyles.panelCopy} textAnchor="middle" x="492" y="170">
              {lensCopy}
            </text>
          </svg>
        </PrototypeVisualCard>

        <div className={prototypeReadoutGridClassName}>
          <PrototypeReadoutCard
            description="把这一步看懂，用户才不会把方剂学成一个个割裂的词条。"
            label="方向主轴"
            title={formula.directionLabel}
          />
          <PrototypeReadoutCard
            description="同样是“动”，发生在表层、枢纽、里部还是根部，完全不是一回事。"
            label="层次位置"
            title={formula.layerLabel}
          />
          <PrototypeReadoutCard
            description="边界感是这张图最值钱的部分，它能防止“见一个热字就猛清”的老问题。"
            label="误用风险"
            title={formula.risk}
          />
        </div>

        <PrototypeLinkRow>
          <PrototypeLinkButton href="/modules/formula-logic">回到方药模块</PrototypeLinkButton>
          <PrototypeLinkButton href={getPracticeHref("formula-direction-basic")}>打开方药练习</PrototypeLinkButton>
          <PrototypeLinkButton href="/diagrams">查看图表目录</PrototypeLinkButton>
        </PrototypeLinkRow>
      </PrototypeStage>
    </PrototypeShell>
  );
}
