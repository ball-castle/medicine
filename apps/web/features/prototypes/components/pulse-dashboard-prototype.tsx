"use client";

import Link from "next/link";
import { type CSSProperties, useMemo, useState } from "react";

import { getCaseStudyHref } from "@/lib/cases";
import { getPracticeHref } from "@/lib/practice";

type PulseProfileId = "floating-scattered" | "middle-empty" | "wiry-constrained" | "replete-heat";
type TongueOverlayId = "neutral" | "red-dry" | "pale-wet" | "greasy";
type FocusId = "axis" | "window" | "label";

const PULSE_PROFILES: Record<
  PulseProfileId,
  {
    label: string;
    summary: string;
    axis: string;
    risk: string;
    floating: number;
    root: number;
    tension: number;
    fullness: number;
    accent: string;
  }
> = {
  "floating-scattered": {
    label: "浮散无承",
    summary: "更像上面亮、下面空，表面热闹，底下接不住。",
    axis: "先防止被热象和焦虑标签带走，优先看承接不足。",
    risk: "如果误判成实火，会越压越散。",
    floating: 84,
    root: 26,
    tension: 34,
    fullness: 38,
    accent: "#bf6c3f",
  },
  "middle-empty": {
    label: "中气偏虚",
    summary: "整体不一定很躁，但中心无力、承上启下弱，像轴心掉了。",
    axis: "先看中气和承接，再看症状怎么分支。",
    risk: "若只追局部症状，会忽略真正的系统中心。",
    floating: 42,
    root: 34,
    tension: 28,
    fullness: 24,
    accent: "#8a7350",
  },
  "wiry-constrained": {
    label: "弦紧郁束",
    summary: "更像中间和两侧都绷着，主问题偏卡住、偏约束。",
    axis: "先判断枢机与郁闭，不要一眼就归到虚证。",
    risk: "若直接当寒热虚实单题处理，会漏掉“卡住”这层。",
    floating: 48,
    root: 52,
    tension: 86,
    fullness: 58,
    accent: "#355f6b",
  },
  "replete-heat": {
    label: "里实热盛",
    summary: "这类脉更偏壅、满、热，像里面顶住了，需要看实结程度。",
    axis: "先看有没有明确的壅塞和实积，再谈用什么手法分解。",
    risk: "若把里实热看成虚热上浮，会错过真正的开下时机。",
    floating: 46,
    root: 68,
    tension: 62,
    fullness: 88,
    accent: "#8f4b2b",
  },
};

const TONGUE_OVERLAYS: Record<
  TongueOverlayId,
  {
    label: string;
    summary: string;
    tone: string;
    coat: string;
    moisture: string;
  }
> = {
  neutral: {
    label: "暂不叠加舌象",
    summary: "先让脉说主轴，再决定舌象要补什么窗口信息。",
    tone: "#f0bf95",
    coat: "rgba(255,255,255,0.32)",
    moisture: "适中",
  },
  "red-dry": {
    label: "红干少津",
    summary: "提示热和津伤窗口更明显，但仍要看是不是实热主导。",
    tone: "#d97566",
    coat: "rgba(255,255,255,0.14)",
    moisture: "偏少",
  },
  "pale-wet": {
    label: "淡胖水滑",
    summary: "提示承接与寒湿窗口更重，适合校验是否根弱中虚。",
    tone: "#e7c8bb",
    coat: "rgba(255,255,255,0.44)",
    moisture: "偏多",
  },
  greasy: {
    label: "腻苔偏重",
    summary: "提示湿浊和壅滞窗口，常帮助确认“不是单纯虚热”。",
    tone: "#d9927c",
    coat: "rgba(216, 212, 166, 0.58)",
    moisture: "黏滞",
  },
};

const FOCI: Record<
  FocusId,
  {
    label: string;
    summary: string;
  }
> = {
  axis: {
    label: "先抓主轴",
    summary: "最先决定判断顺序的，是整体主轴，而不是散碎标签。",
  },
  window: {
    label: "再看窗口",
    summary: "舌象进来是为了补寒热湿燥，不是抢走主位。",
  },
  label: {
    label: "压住标签",
    summary: "病名和症状都能留着，但它们必须退到辅助位。",
  },
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function PulseDashboardPrototype() {
  const [pulseProfileId, setPulseProfileId] = useState<PulseProfileId>("floating-scattered");
  const [tongueOverlayId, setTongueOverlayId] = useState<TongueOverlayId>("neutral");
  const [focus, setFocus] = useState<FocusId>("axis");
  const [labelPressure, setLabelPressure] = useState(34);

  const pulse = PULSE_PROFILES[pulseProfileId];
  const tongue = TONGUE_OVERLAYS[tongueOverlayId];

  const meters = useMemo(() => {
    const labelNoise = labelPressure / 100;
    const axisConfidence = clamp((pulse.root + (100 - labelPressure) * 0.52) / 100, 0.12, 1);
    const tongueWeight = clamp(
      (focus === "window" ? 0.84 : 0.52) * (tongueOverlayId === "neutral" ? 0.54 : 1),
      0.2,
      0.96,
    );

    return {
      floating: pulse.floating / 100,
      root: pulse.root / 100,
      tension: pulse.tension / 100,
      fullness: pulse.fullness / 100,
      axisConfidence,
      tongueWeight,
      labelNoise,
    };
  }, [focus, labelPressure, pulse, tongueOverlayId]);

  const focusMessage =
    focus === "axis"
      ? pulse.axis
      : focus === "window"
        ? `当前舌象窗口: ${tongue.summary}`
        : "标签压力越高，越容易把“浮散无承”和“实热壅塞”混成一团。";

  const recommendation =
    focus === "axis"
      ? "先让脉象说主轴，再决定舌象该怎么进入。"
      : focus === "window"
        ? "舌象现在是补充视角，不是最后裁判。"
        : "把病名放回后位，避免它重新抢走判断顺序。";

  return (
    <section className="pulse-prototype">
      <div className="pulse-prototype__sidebar">
        <div className="pulse-prototype__intro">
          <p className="eyebrow">Prototype</p>
          <h2>脉诊总开关面板</h2>
          <p>
            这张原型的任务很明确: 让用户先学会“用脉抓总开关”，再让舌象作为窗口补进来，最后把病名
            和表面症状压回辅助位置。
          </p>
        </div>

        <div className="pulse-prototype__controls">
          <div className="pulse-prototype__control-group">
            <p className="pulse-prototype__control-title">脉象轮廓</p>
            <div className="pulse-prototype__profile-list">
              {(Object.entries(PULSE_PROFILES) as Array<
                [PulseProfileId, (typeof PULSE_PROFILES)[PulseProfileId]]
              >).map(([key, item]) => (
                <button
                  className={`pulse-prototype__profile ${pulseProfileId === key ? "is-active" : ""}`}
                  key={key}
                  onClick={() => setPulseProfileId(key)}
                  style={{ "--pulse-accent": item.accent } as CSSProperties}
                  type="button"
                >
                  <strong>{item.label}</strong>
                  <span>{item.summary}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pulse-prototype__control-group">
            <p className="pulse-prototype__control-title">舌象窗口</p>
            <div className="pulse-prototype__chip-row">
              {(Object.entries(TONGUE_OVERLAYS) as Array<
                [TongueOverlayId, (typeof TONGUE_OVERLAYS)[TongueOverlayId]]
              >).map(([key, item]) => (
                <button
                  className={`pulse-prototype__chip ${tongueOverlayId === key ? "is-active" : ""}`}
                  key={key}
                  onClick={() => setTongueOverlayId(key)}
                  type="button"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pulse-prototype__control-group">
            <p className="pulse-prototype__control-title">判断顺序</p>
            <div className="pulse-prototype__focus-list">
              {(Object.entries(FOCI) as Array<[FocusId, (typeof FOCI)[FocusId]]>).map(([key, item]) => (
                <button
                  className={`pulse-prototype__focus ${focus === key ? "is-active" : ""}`}
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

          <div className="pulse-prototype__control-group">
            <div className="pulse-prototype__slider-top">
              <p className="pulse-prototype__control-title">标签噪音</p>
              <strong>{labelPressure}</strong>
            </div>
            <input
              aria-label="标签噪音"
              className="pulse-prototype__slider"
              max={100}
              min={0}
              onChange={(event) => setLabelPressure(Number(event.target.value))}
              type="range"
              value={labelPressure}
            />
            <div className="pulse-prototype__slider-legend">
              <span>主轴清楚</span>
              <span>标签压顶</span>
            </div>
          </div>
        </div>

        <div className="pulse-prototype__notes">
          <article className="pulse-prototype__note-card">
            <p className="pulse-prototype__note-title">当前主轴</p>
            <strong>{pulse.label}</strong>
            <p>{pulse.axis}</p>
          </article>
          <article className="pulse-prototype__note-card">
            <p className="pulse-prototype__note-title">窗口说明</p>
            <strong>{tongue.label}</strong>
            <p>{tongue.summary}</p>
          </article>
          <article className="pulse-prototype__note-card">
            <p className="pulse-prototype__note-title">顺序提醒</p>
            <strong>{FOCI[focus].label}</strong>
            <p>{recommendation}</p>
          </article>
        </div>
      </div>

      <div className="pulse-prototype__stage">
        <div className="pulse-prototype__visual-card">
          <svg aria-label="脉诊总开关面板原型" className="pulse-prototype__svg" viewBox="0 0 640 520">
            <rect fill="rgba(255,255,255,0.42)" height="412" rx="24" width="504" x="68" y="56" />
            <text className="pulse-prototype__panel-title" textAnchor="middle" x="320" y="94">
              主轴判断面板
            </text>
            <text className="pulse-prototype__panel-copy" textAnchor="middle" x="320" y="120">
              先脉 后舌 再压标签
            </text>

            {[
              { label: "浮散", value: meters.floating, x: 140, y: 164, accent: "#bf6c3f" },
              { label: "承根", value: meters.root, x: 320, y: 164, accent: "#355f6b" },
              { label: "弦紧", value: meters.tension, x: 500, y: 164, accent: "#8a7350" },
              { label: "壅满", value: meters.fullness, x: 230, y: 322, accent: "#8f4b2b" },
              { label: "标签噪音", value: meters.labelNoise, x: 410, y: 322, accent: "#6e5b7d" },
            ].map((item) => (
              <g key={item.label}>
                <circle cx={item.x} cy={item.y} fill="rgba(29,45,42,0.08)" r="54" />
                <circle
                  cx={item.x}
                  cy={item.y}
                  fill="none"
                  r="54"
                  stroke="rgba(29,45,42,0.16)"
                  strokeWidth="8"
                />
                <circle
                  cx={item.x}
                  cy={item.y}
                  fill="none"
                  r="54"
                  stroke={item.accent}
                  strokeDasharray={`${item.value * 339} 999`}
                  strokeLinecap="round"
                  strokeWidth="8"
                  transform={`rotate(-90 ${item.x} ${item.y})`}
                />
                <text className="pulse-prototype__meter-value" textAnchor="middle" x={item.x} y={item.y + 6}>
                  {Math.round(item.value * 100)}
                </text>
                <text className="pulse-prototype__meter-label" textAnchor="middle" x={item.x} y={item.y + 82}>
                  {item.label}
                </text>
              </g>
            ))}

            <rect fill="rgba(255,255,255,0.74)" height="112" rx="20" width="212" x="398" y="76" />
            <ellipse cx="504" cy="266" fill={tongue.tone} opacity="0.92" rx="78" ry="40" />
            <ellipse cx="504" cy="254" fill={tongue.coat} rx="60" ry="20" />
            <text className="pulse-prototype__panel-title" textAnchor="middle" x="504" y="108">
              舌象窗口
            </text>
            <text className="pulse-prototype__panel-copy" textAnchor="middle" x="504" y="136">
              {tongue.label}
            </text>
            <text className="pulse-prototype__panel-copy" textAnchor="middle" x="504" y="162">
              津液: {tongue.moisture}
            </text>

            <rect fill="rgba(255,255,255,0.72)" height="92" rx="18" width="232" x="86" y="386" />
            <text className="pulse-prototype__panel-title" textAnchor="middle" x="202" y="418">
              当前焦点
            </text>
            <text className="pulse-prototype__panel-copy" textAnchor="middle" x="202" y="446">
              {focusMessage}
            </text>
          </svg>
        </div>

        <div className="pulse-prototype__readout">
          <article className="pulse-prototype__readout-card">
            <p className="pulse-prototype__readout-label">主轴置信度</p>
            <strong>{meters.axisConfidence > 0.7 ? "主轴较清楚" : meters.axisConfidence > 0.46 ? "主轴待校验" : "主轴被噪音压住"}</strong>
            <span>这是这张图最重要的训练目标: 先抓住整体结构，再让细节进来。</span>
          </article>
          <article className="pulse-prototype__readout-card">
            <p className="pulse-prototype__readout-label">舌象权重</p>
            <strong>{meters.tongueWeight > 0.7 ? "窗口信息明显" : "窗口信息辅助"}</strong>
            <span>舌象能帮你看寒热湿燥，但它不该自己变成判决书。</span>
          </article>
          <article className="pulse-prototype__readout-card">
            <p className="pulse-prototype__readout-label">误判风险</p>
            <strong>{pulse.risk}</strong>
            <span>一旦顺序错了，后面的诊断和方药方向都会被连带带偏。</span>
          </article>
        </div>

        <div className="pulse-prototype__link-row">
          <Link className="button button--ghost" href="/modules/diagnostic-judgment">
            回到诊断模块
          </Link>
          <Link className="button button--ghost" href={getPracticeHref("diagnostic-axis-basic")}>
            打开诊断练习
          </Link>
          <Link className="button button--ghost" href={getCaseStudyHref("pulse-axis-priority-case")}>
            打开脉象病例
          </Link>
        </div>
      </div>
    </section>
  );
}
