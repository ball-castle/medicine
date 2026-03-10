"use client";

import { useId, useMemo, useState } from "react";

type SeasonId = "spring" | "summer" | "late-summer" | "autumn" | "winter";
type PatternId = "balanced" | "ascent-blocked" | "descent-blocked" | "middle-weak";
type SegmentKey = "wood" | "fire" | "metal" | "water" | "earth";

const SEASONS: Record<
  SeasonId,
  {
    label: string;
    focus: string;
    accent: string;
    explanation: string;
  }
> = {
  spring: {
    label: "春",
    focus: "木气生发",
    accent: "#5d8b43",
    explanation: "春天最适合强调“升”的感觉，用户会更容易理解肝木与生发的关系。",
  },
  summer: {
    label: "夏",
    focus: "火气宣通",
    accent: "#c96b43",
    explanation: "夏天适合让火的外展和宣通更明显，但不应把它画成单纯亢热。",
  },
  "late-summer": {
    label: "长夏",
    focus: "中土承接",
    accent: "#aa8744",
    explanation: "长夏最适合强调中气为轴，让用户看到为什么中土会被反复提起。",
  },
  autumn: {
    label: "秋",
    focus: "金气肃降",
    accent: "#6a7b8c",
    explanation: "秋天让“降”的方向更直观，能帮助用户看懂肺金与收敛下行。",
  },
  winter: {
    label: "冬",
    focus: "水气封藏",
    accent: "#3f6990",
    explanation: "冬天适合表现“藏”和“归根”，是连接扶阳模块的天然入口。",
  },
};

const PATTERNS: Record<
  PatternId,
  {
    label: string;
    summary: string;
    userPrompt: string;
  }
> = {
  balanced: {
    label: "平衡运转",
    summary: "中气能承接，四向流动有秩序，适合先建立用户的整体直觉。",
    userPrompt: "先看整体怎么转，再去区分每一股方向。",
  },
  "ascent-blocked": {
    label: "该升不升",
    summary: "左侧生发和上达明显发虚，用户会更容易理解为什么同样不舒服，根可能在“升不起来”。",
    userPrompt: "观察木升通道为什么最先发暗，而不是直接去猜症状名称。",
  },
  "descent-blocked": {
    label: "该降不降",
    summary: "右侧肃降与下承变弱，表面容易显得上部更躁、更满、更不顺。",
    userPrompt: "注意右侧卡住时，上部和外围为什么会显得更乱。",
  },
  "middle-weak": {
    label: "中轴偏弱",
    summary: "不是某一边独自出问题，而是中气承接不稳，外围四向都会跟着发飘。",
    userPrompt: "把注意力放回中轴，观察外围问题为什么会一起失序。",
  },
};

const SEGMENT_LABELS: Record<SegmentKey, string> = {
  wood: "木升",
  fire: "火宣",
  metal: "金降",
  water: "水藏",
  earth: "土运",
};

const SEGMENT_COLORS: Record<SegmentKey, string> = {
  wood: "#5d8b43",
  fire: "#c96b43",
  metal: "#6a7b8c",
  water: "#3f6990",
  earth: "#aa8744",
};

const SEGMENT_PATHS: Record<Exclude<SegmentKey, "earth">, string> = {
  wood: "M 148 314 C 158 230 192 168 262 136",
  fire: "M 262 136 C 340 140 390 176 420 244",
  metal: "M 420 244 C 416 322 386 382 320 418",
  water: "M 320 418 C 236 430 184 392 148 314",
};

const NODE_POSITIONS: Record<
  SegmentKey,
  {
    x: number;
    y: number;
    label: string;
  }
> = {
  wood: { x: 128, y: 326, label: "肝木" },
  fire: { x: 262, y: 110, label: "心火" },
  metal: { x: 440, y: 236, label: "肺金" },
  water: { x: 330, y: 442, label: "肾水" },
  earth: { x: 278, y: 276, label: "脾土 / 中气" },
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getSeasonBoost(season: SeasonId): Record<SegmentKey, number> {
  switch (season) {
    case "spring":
      return { wood: 0.26, fire: 0.08, metal: -0.02, water: 0.02, earth: 0.04 };
    case "summer":
      return { wood: 0.06, fire: 0.28, metal: -0.04, water: -0.02, earth: 0.03 };
    case "late-summer":
      return { wood: 0.01, fire: 0.02, metal: 0.01, water: 0.01, earth: 0.26 };
    case "autumn":
      return { wood: -0.04, fire: 0.01, metal: 0.28, water: 0.04, earth: 0.03 };
    case "winter":
      return { wood: -0.03, fire: -0.04, metal: 0.02, water: 0.28, earth: 0.05 };
  }
}

function getPatternBoost(pattern: PatternId): Record<SegmentKey, number> {
  switch (pattern) {
    case "balanced":
      return { wood: 0, fire: 0, metal: 0, water: 0, earth: 0 };
    case "ascent-blocked":
      return { wood: -0.28, fire: -0.08, metal: 0.08, water: 0.02, earth: -0.08 };
    case "descent-blocked":
      return { wood: 0.08, fire: 0.18, metal: -0.26, water: -0.14, earth: -0.08 };
    case "middle-weak":
      return { wood: -0.12, fire: -0.12, metal: -0.12, water: -0.12, earth: -0.34 };
  }
}

function getMarkerPoints(pattern: PatternId) {
  switch (pattern) {
    case "ascent-blocked":
      return [
        { x: 184, y: 210, label: "升阻" },
        { x: 226, y: 164, label: "不达" },
      ];
    case "descent-blocked":
      return [
        { x: 412, y: 292, label: "降阻" },
        { x: 376, y: 362, label: "不收" },
      ];
    case "middle-weak":
      return [
        { x: 278, y: 248, label: "中虚" },
        { x: 278, y: 316, label: "轴摇" },
      ];
    default:
      return [];
  }
}

function getMiddleQiLabel(middleQi: number) {
  if (middleQi >= 82) {
    return "中轴稳定";
  }
  if (middleQi >= 64) {
    return "中轴可承接";
  }
  if (middleQi >= 44) {
    return "中轴偏弱";
  }
  return "中轴摇摆";
}

export function CircleFlowPrototype(props: { compact?: boolean }) {
  const [season, setSeason] = useState<SeasonId>("late-summer");
  const [pattern, setPattern] = useState<PatternId>("balanced");
  const [middleQi, setMiddleQi] = useState(76);

  const idPrefix = useId().replace(/:/g, "");
  const seasonConfig = SEASONS[season];
  const patternConfig = PATTERNS[pattern];

  const intensities = useMemo(() => {
    const seasonBoost = getSeasonBoost(season);
    const patternBoost = getPatternBoost(pattern);
    const axisFactor = (middleQi - 60) / 100;
    const outerBase = 0.72 + axisFactor * 0.26;
    const earthBase = 0.74 + axisFactor * 0.42;

    return {
      wood: clamp(outerBase + seasonBoost.wood + patternBoost.wood, 0.18, 1),
      fire: clamp(outerBase + seasonBoost.fire + patternBoost.fire, 0.18, 1),
      metal: clamp(outerBase + seasonBoost.metal + patternBoost.metal, 0.18, 1),
      water: clamp(outerBase + seasonBoost.water + patternBoost.water, 0.18, 1),
      earth: clamp(earthBase + seasonBoost.earth + patternBoost.earth, 0.18, 1),
    };
  }, [middleQi, pattern, season]);

  const dominantDirection =
    Object.entries(intensities)
      .sort((a, b) => b[1] - a[1])[0]?.[0] ?? "earth";

  const markers = getMarkerPoints(pattern);
  const imbalanceNote =
    pattern === "balanced"
      ? "当前画面用来建立整体直觉。观察中轴和外圈如何同步稳定。"
      : pattern === "middle-weak"
        ? "这里不是某一条边单独出问题，而是中轴承接不足让整个外圈都开始飘。"
        : "先别急着记病名，先看是哪一边的方向出现了明显的卡顿和失序。";

  return (
    <section className={`circle-prototype ${props.compact ? "circle-prototype--compact" : ""}`}>
      <div className="circle-prototype__sidebar">
        <div className="circle-prototype__intro">
          <p className="eyebrow">Prototype</p>
          <h2>圆运动总图交互原型</h2>
          <p>
            这不是最终视觉稿，而是第一版可玩的教学原型。先验证用户能不能通过切换季节、
            观察中气强弱和对比失衡方向，真正理解“先看整体，再看局部”。
          </p>
        </div>

        <div className="circle-prototype__controls">
          <div className="circle-prototype__control-group">
            <p className="circle-prototype__control-title">时令焦点</p>
            <div className="circle-prototype__chip-grid">
              {(Object.entries(SEASONS) as Array<[SeasonId, (typeof SEASONS)[SeasonId]]>).map(([key, item]) => (
                <button
                  className={`circle-prototype__chip ${season === key ? "is-active" : ""}`}
                  key={key}
                  onClick={() => setSeason(key)}
                  style={{ ["--chip-accent" as string]: item.accent }}
                  type="button"
                >
                  <span>{item.label}</span>
                  <small>{item.focus}</small>
                </button>
              ))}
            </div>
          </div>

          <div className="circle-prototype__control-group">
            <p className="circle-prototype__control-title">观察模式</p>
            <div className="circle-prototype__pattern-list">
              {(Object.entries(PATTERNS) as Array<[PatternId, (typeof PATTERNS)[PatternId]]>).map(([key, item]) => (
                <button
                  className={`circle-prototype__pattern ${pattern === key ? "is-active" : ""}`}
                  key={key}
                  onClick={() => setPattern(key)}
                  type="button"
                >
                  <strong>{item.label}</strong>
                  <span>{item.summary}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="circle-prototype__control-group">
            <div className="circle-prototype__slider-top">
              <p className="circle-prototype__control-title">中气强弱</p>
              <strong>{middleQi}</strong>
            </div>
            <input
              aria-label="中气强弱"
              className="circle-prototype__slider"
              max={100}
              min={24}
              onChange={(event) => setMiddleQi(Number(event.target.value))}
              type="range"
              value={middleQi}
            />
            <div className="circle-prototype__slider-legend">
              <span>轴心发虚</span>
              <span>轴心稳定</span>
            </div>
          </div>
        </div>

        <div className="circle-prototype__notes">
          <article className="circle-prototype__note-card">
            <p className="circle-prototype__note-title">当前时令</p>
            <strong>{seasonConfig.focus}</strong>
            <p>{seasonConfig.explanation}</p>
          </article>
          <article className="circle-prototype__note-card">
            <p className="circle-prototype__note-title">当前中轴</p>
            <strong>{getMiddleQiLabel(middleQi)}</strong>
            <p>{imbalanceNote}</p>
          </article>
          <article className="circle-prototype__note-card">
            <p className="circle-prototype__note-title">学习提示</p>
            <strong>{SEGMENT_LABELS[dominantDirection as SegmentKey]}</strong>
            <p>{patternConfig.userPrompt}</p>
          </article>
        </div>
      </div>

      <div className="circle-prototype__stage">
        <div className="circle-prototype__visual-card">
          <svg
            aria-label="圆运动总图可视化"
            className="circle-prototype__svg"
            viewBox="0 0 560 520"
          >
            <defs>
              <radialGradient id={`${idPrefix}-core`} cx="50%" cy="45%" r="65%">
                <stop offset="0%" stopColor="rgba(255,247,232,0.98)" />
                <stop offset="70%" stopColor="rgba(223,190,130,0.82)" />
                <stop offset="100%" stopColor="rgba(157,119,62,0.92)" />
              </radialGradient>
              <filter id={`${idPrefix}-soft`}>
                <feGaussianBlur stdDeviation="10" />
              </filter>
            </defs>

            <ellipse
              cx="280"
              cy="274"
              fill="none"
              filter={`url(#${idPrefix}-soft)`}
              opacity="0.18"
              rx="166"
              ry="150"
              stroke={seasonConfig.accent}
              strokeWidth="18"
            />

            <ellipse
              cx="280"
              cy="274"
              fill="none"
              opacity="0.2"
              rx="172"
              ry="156"
              stroke="rgba(29,45,42,0.18)"
              strokeDasharray="10 12"
              strokeWidth="1.2"
            />

            {(
              Object.entries(SEGMENT_PATHS) as Array<
                [Exclude<SegmentKey, "earth">, string]
              >
            ).map(([segment, path]) => {
              const intensity = intensities[segment];
              const width = 7 + intensity * 8;
              const duration = `${clamp(8 - intensity * 4.2, 2.5, 7.5)}s`;

              return (
                <g key={segment}>
                  <path
                    d={path}
                    fill="none"
                    opacity={0.18}
                    stroke={SEGMENT_COLORS[segment]}
                    strokeLinecap="round"
                    strokeWidth={width + 7}
                  />
                  <path
                    d={path}
                    fill="none"
                    opacity={0.24 + intensity * 0.76}
                    stroke={SEGMENT_COLORS[segment]}
                    strokeLinecap="round"
                    strokeWidth={width}
                  />
                  <circle fill={SEGMENT_COLORS[segment]} opacity={0.2 + intensity * 0.5} r={4 + intensity * 2.6}>
                    <animateMotion dur={duration} path={path} repeatCount="indefinite" rotate="auto" />
                  </circle>
                  <circle fill="#fff7ef" opacity={0.48 + intensity * 0.4} r={2 + intensity * 1.5}>
                    <animateMotion
                      begin="-1.4s"
                      dur={duration}
                      path={path}
                      repeatCount="indefinite"
                      rotate="auto"
                    />
                  </circle>
                </g>
              );
            })}

            <line
              opacity={0.16}
              stroke={SEGMENT_COLORS.earth}
              strokeLinecap="round"
              strokeWidth={24}
              x1="280"
              x2="280"
              y1="170"
              y2="366"
            />
            <line
              opacity={0.32 + intensities.earth * 0.56}
              stroke={SEGMENT_COLORS.earth}
              strokeLinecap="round"
              strokeWidth={10 + intensities.earth * 7}
              x1="280"
              x2="280"
              y1="172"
              y2="362"
            />
            <ellipse
              cx="280"
              cy="274"
              fill={`url(#${idPrefix}-core)`}
              opacity={0.52 + intensities.earth * 0.36}
              rx={48 + intensities.earth * 10}
              ry={64 + intensities.earth * 12}
            />
            <ellipse
              cx="280"
              cy="274"
              fill="none"
              opacity={0.5}
              rx={54 + intensities.earth * 11}
              ry={72 + intensities.earth * 12}
              stroke="rgba(255,250,240,0.72)"
              strokeWidth="2"
            />

            {markers.map((marker) => (
              <g key={`${marker.x}-${marker.y}`}>
                <circle cx={marker.x} cy={marker.y} fill="#bf6c3f" opacity="0.22" r="14">
                  <animate attributeName="r" dur="2s" repeatCount="indefinite" values="8;14;8" />
                  <animate attributeName="opacity" dur="2s" repeatCount="indefinite" values="0.18;0.32;0.18" />
                </circle>
                <circle cx={marker.x} cy={marker.y} fill="#bf6c3f" r="5.5" />
              </g>
            ))}

            {(Object.entries(NODE_POSITIONS) as Array<[SegmentKey, (typeof NODE_POSITIONS)[SegmentKey]]>).map(
              ([segment, node]) => {
                const intensity = intensities[segment];
                const isEarth = segment === "earth";

                return (
                  <g key={segment}>
                    <circle
                      cx={node.x}
                      cy={node.y}
                      fill={SEGMENT_COLORS[segment]}
                      opacity={0.28 + intensity * 0.44}
                      r={isEarth ? 18 : 15}
                    />
                    <circle
                      cx={node.x}
                      cy={node.y}
                      fill="#fffaf2"
                      opacity={0.84}
                      r={isEarth ? 6.4 : 5.2}
                    />
                    <text
                      className="circle-prototype__node-label"
                      textAnchor="middle"
                      x={node.x}
                      y={isEarth ? node.y + 34 : node.y + (segment === "water" ? 28 : segment === "fire" ? -24 : 28)}
                    >
                      {node.label}
                    </text>
                  </g>
                );
              },
            )}

            <text className="circle-prototype__center-text" textAnchor="middle" x="280" y="268">
              {getMiddleQiLabel(middleQi)}
            </text>
            <text className="circle-prototype__center-subtext" textAnchor="middle" x="280" y="292">
              中气 {middleQi}
            </text>
          </svg>
        </div>

        <div className="circle-prototype__readout">
          <article className="circle-prototype__readout-card">
            <p className="circle-prototype__readout-label">当前最亮的方向</p>
            <strong>{SEGMENT_LABELS[dominantDirection as SegmentKey]}</strong>
            <span>提示用户本轮画面最值得先观察哪股力。</span>
          </article>
          <article className="circle-prototype__readout-card">
            <p className="circle-prototype__readout-label">当前模式</p>
            <strong>{patternConfig.label}</strong>
            <span>{patternConfig.summary}</span>
          </article>
          <article className="circle-prototype__readout-card">
            <p className="circle-prototype__readout-label">教学目标</p>
            <strong>先辨方向，再看症状</strong>
            <span>这张图最重要的不是把病名讲全，而是先把观察顺序讲对。</span>
          </article>
        </div>
      </div>
    </section>
  );
}
