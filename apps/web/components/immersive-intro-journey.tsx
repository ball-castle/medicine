"use client";

import Link from "next/link";
import { Pause, Play, SkipForward } from "lucide-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type SceneId = "round-motion" | "kan-li" | "gate-vs-root";

type SceneBeat = {
  id: string;
  kicker: string;
  line: string;
  cue: string;
};

const BEAT_DURATION_MS = 2300;
const TRANSITION_DURATION_MS = 480;

const SCENES: Array<{
  id: SceneId;
  eyebrow: string;
  title: string;
  summary: string;
  caption: string;
  atmosphere: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
  facts: string[];
  beats: SceneBeat[];
}> = [
  {
    id: "round-motion",
    eyebrow: "Scene 01",
    title: "先看整个身体像一个会转动的世界",
    summary:
      "这里不先讲病名。先让用户看到一整个系统如何在四时和升降出入之间持续运转，理解为什么中医很多判断都要从整体开始。",
    caption: "如果这一步没看懂，后面所有局部判断都会重新碎成标签。",
    atmosphere: "圆运动不是概念图，而是世界观入口。",
    primaryHref: "/prototypes/circle-flow-map",
    primaryLabel: "看圆运动总图",
    secondaryHref: "/modules/foundations",
    secondaryLabel: "进入基础模块",
    facts: ["整体先于病名", "中气是轴心", "四向一起动"],
    beats: [
      {
        id: "look-up-first",
        kicker: "旁白 01",
        line: "先别急着找病名，先把镜头拉远，看到整个身体像一个持续运转的系统。",
        cue: "镜头: 外圈缓缓亮起，先建立“整体在转”的感觉。",
      },
      {
        id: "axis-appears",
        kicker: "旁白 02",
        line: "真正要记住的不是哪个点最亮，而是中间这根轴一偏，外围几乎会一起歪。",
        cue: "镜头: 中轴提亮，外圈方向开始跟着响应。",
      },
      {
        id: "pattern-before-label",
        kicker: "旁白 03",
        line: "所以中医很多判断都要先看结构，而不是先把外面的名字贴上去。",
        cue: "镜头: 整体与中轴同时稳定，形成“先看整体”的收束感。",
      },
    ],
  },
  {
    id: "kan-li",
    eyebrow: "Scene 02",
    title: "再看水火能不能真正接起来",
    summary:
      "进入扶阳主线时，最有吸引力的一层不是药名，而是上下交通。水火既济和上下隔绝，在视觉上应该一眼就能分开。",
    caption: "这一步负责让人第一次直觉地感到: 原来“热”和“寒”背后是结构问题。",
    atmosphere: "先看到交通，再谈扶阳。",
    primaryHref: "/prototypes/kan-li-circulation",
    primaryLabel: "看水火交通",
    secondaryHref: "/modules/fu-yang-core",
    secondaryLabel: "进入扶阳模块",
    facts: ["既济 vs 隔绝", "不是单纯冷热", "结构比术语更先"],
    beats: [
      {
        id: "surface-is-not-root",
        kicker: "旁白 01",
        line: "表面看到热、冷、烦、躁，都还只是外观，真正要先问的是上下能不能接得上。",
        cue: "镜头: 上下两端先分开亮起，制造悬而未决的张力。",
      },
      {
        id: "bridge-forms",
        kicker: "旁白 02",
        line: "一旦交通开始恢复，很多看似对立的表象会突然变得能被解释。",
        cue: "镜头: 中间交通线提亮，形成一条正在回接的桥。",
      },
      {
        id: "structure-over-temperature",
        kicker: "旁白 03",
        line: "这时候用户会第一次直觉地明白: 这里不是在讲冷热词，而是在讲结构。",
        cue: "镜头: 上下同时稳定，文字从“冷热”转成“交通”。",
      },
    ],
  },
  {
    id: "gate-vs-root",
    eyebrow: "Scene 03",
    title: "最后把“开门”和“归根”拉成强对照",
    summary:
      "真正让人记住的，不是桂枝和附子两个名词，而是一个动作在把门拨开，另一个动作在把浮散的火收回根部。",
    caption: "当用户能直接看出一个解决没路、一个解决没根，这个网站才开始有辨识度。",
    atmosphere: "动作差异，比药名更抓人。",
    primaryHref: "/prototypes/guizhi-vs-fuzi",
    primaryLabel: "看开门与归根",
    secondaryHref: "/paths/pulse-formula-case-loop",
    secondaryLabel: "进入学习路线",
    facts: ["一个开路", "一个守根", "动作边界最重要"],
    beats: [
      {
        id: "gate-first",
        kicker: "旁白 01",
        line: "有些问题不是没有火，而是门口根本没打开，所以系统一直卡在边上。",
        cue: "镜头: 左侧门轴先亮，强调“先开路”的动作感。",
      },
      {
        id: "root-next",
        kicker: "旁白 02",
        line: "也有些问题不是没路，而是根本守不住，表面亮着，底下却是空的。",
        cue: "镜头: 右侧归根弧线拉亮，强调“收回来”的方向。",
      },
      {
        id: "boundary-matters",
        kicker: "旁白 03",
        line: "当用户能一眼分清这两个动作边界，药名反而退到后面去了。",
        cue: "镜头: 左右并排，同时出现“开路”和“守根”的最终对照。",
      },
    ],
  },
];

function moveToScene(
  nextSceneIndex: number,
  setSceneIndex: (value: number) => void,
  setBeatIndex: (value: number) => void,
  setTransitioning: (value: boolean) => void,
) {
  setTransitioning(true);
  window.setTimeout(() => {
    setSceneIndex(nextSceneIndex);
    setBeatIndex(0);
    setTransitioning(false);
  }, TRANSITION_DURATION_MS);
}

function renderRoundMotionBeat(beatIndex: number) {
  const centerRadius = [44, 58, 74][beatIndex] ?? 44;
  const outerWarmOpacity = [0.26, 0.42, 0.68][beatIndex] ?? 0.26;
  const outerCoolOpacity = [0.18, 0.34, 0.62][beatIndex] ?? 0.18;
  const axisOpacity = [0.22, 0.68, 0.86][beatIndex] ?? 0.22;

  return (
    <svg aria-label="圆运动沉浸画面" className="h-full w-full" viewBox="0 0 640 500">
      <circle cx="320" cy="250" fill="rgba(255,255,255,0.08)" r="168" />
      <circle cx="320" cy="250" fill="none" opacity="0.36" r="168" stroke="rgba(255,245,224,0.34)" strokeWidth="2" />
      <circle cx="320" cy="250" fill="none" opacity="0.24" r="112" stroke="rgba(110,188,178,0.24)" strokeDasharray="8 12" strokeWidth="2" />
      <circle cx="320" cy="250" fill={`rgba(245, 228, 196, ${0.16 + axisOpacity * 0.18})`} r={centerRadius} />
      <line opacity={axisOpacity} stroke="rgba(255,245,224,0.34)" strokeWidth="4" x1="320" x2="320" y1="148" y2="352" />
      <path
        d="M 320 84 C 430 112 504 182 520 250 C 504 318 430 388 320 416"
        fill="none"
        opacity={outerWarmOpacity}
        stroke="rgba(238, 139, 84, 0.78)"
        strokeLinecap="round"
        strokeWidth="10"
      />
      <path
        d="M 320 84 C 210 112 136 182 120 250 C 136 318 210 388 320 416"
        fill="none"
        opacity={outerCoolOpacity}
        stroke="rgba(94, 148, 171, 0.72)"
        strokeLinecap="round"
        strokeWidth="10"
      />
      <text
        fill="rgba(24,38,35,0.95)"
        fontFamily="Avenir Next Condensed, Arial Narrow, Segoe UI, sans-serif"
        fontSize="34"
        letterSpacing="-0.05em"
        textAnchor="middle"
        x="320"
        y="250"
      >
        圆运动
      </text>
      <text
        fill="rgba(78,96,90,0.92)"
        fontFamily="Palatino Linotype, Noto Serif SC, Source Han Serif SC, serif"
        fontSize="20"
        textAnchor="middle"
        x="320"
        y="278"
      >
        {beatIndex === 0 ? "先看整体如何运转" : beatIndex === 1 ? "中轴一偏 外围同动" : "结构先于标签"}
      </text>
    </svg>
  );
}

function renderKanLiBeat(beatIndex: number) {
  const topOpacity = [0.32, 0.44, 0.56][beatIndex] ?? 0.32;
  const bottomOpacity = [0.32, 0.44, 0.56][beatIndex] ?? 0.32;
  const bridgeOpacity = [0.08, 0.46, 0.78][beatIndex] ?? 0.08;
  const fireOpacity = [0.34, 0.56, 0.72][beatIndex] ?? 0.34;
  const waterOpacity = [0.28, 0.52, 0.72][beatIndex] ?? 0.28;

  return (
    <svg aria-label="坎离交通沉浸画面" className="h-full w-full" viewBox="0 0 640 500">
      <ellipse cx="320" cy="114" fill={`rgba(238, 139, 84, ${topOpacity})`} rx="84" ry="42" />
      <ellipse cx="320" cy="380" fill={`rgba(109, 151, 204, ${bottomOpacity})`} rx="88" ry="44" />
      <path
        d="M 320 154 C 376 196 396 246 382 304 C 372 344 352 372 320 396"
        fill="none"
        opacity={fireOpacity}
        stroke="rgba(238, 139, 84, 0.76)"
        strokeLinecap="round"
        strokeWidth="10"
      />
      <path
        d="M 320 344 C 264 302 244 252 258 194 C 268 154 288 126 320 104"
        fill="none"
        opacity={waterOpacity}
        stroke="rgba(95, 138, 164, 0.78)"
        strokeLinecap="round"
        strokeWidth="10"
      />
      <line opacity={bridgeOpacity} stroke="rgba(255,245,233,0.46)" strokeLinecap="round" strokeWidth="7" x1="320" x2="320" y1="176" y2="326" />
      <circle cx="320" cy="118" fill="rgba(238, 139, 84, 0.72)" r={18 + beatIndex * 4} />
      <circle cx="320" cy="382" fill="rgba(109, 151, 204, 0.72)" r={18 + beatIndex * 4} />
      <text
        fill="rgba(24,38,35,0.95)"
        fontFamily="Avenir Next Condensed, Arial Narrow, Segoe UI, sans-serif"
        fontSize="34"
        letterSpacing="-0.05em"
        textAnchor="middle"
        x="320"
        y="248"
      >
        坎离交通
      </text>
      <text
        fill="rgba(78,96,90,0.92)"
        fontFamily="Palatino Linotype, Noto Serif SC, Source Han Serif SC, serif"
        fontSize="20"
        textAnchor="middle"
        x="320"
        y="276"
      >
        {beatIndex === 0 ? "先看表象背后的分裂" : beatIndex === 1 ? "交通线正在回接" : "结构比冷热更重要"}
      </text>
    </svg>
  );
}

function renderGateVsRootBeat(beatIndex: number) {
  const gateOpacity = [0.82, 0.34, 0.76][beatIndex] ?? 0.82;
  const rootOpacity = [0.28, 0.82, 0.76][beatIndex] ?? 0.28;
  const leftCardOpacity = [0.14, 0.08, 0.14][beatIndex] ?? 0.14;
  const rightCardOpacity = [0.08, 0.14, 0.14][beatIndex] ?? 0.08;

  return (
    <svg aria-label="开门与归根沉浸画面" className="h-full w-full" viewBox="0 0 640 500">
      <rect fill={`rgba(255,255,255,${leftCardOpacity})`} height="312" rx="28" width="214" x="76" y="96" />
      <rect fill={`rgba(255,255,255,${rightCardOpacity})`} height="312" rx="28" width="214" x="350" y="96" />
      <path
        d="M 142 330 L 142 150 Q 142 128 164 128 L 214 128 Q 236 128 236 150 L 236 332"
        fill="none"
        opacity={gateOpacity}
        stroke="rgba(238, 139, 84, 0.84)"
        strokeLinecap="round"
        strokeWidth="12"
      />
      <path
        d="M 458 180 C 512 204 534 246 526 296 C 520 334 492 366 456 386"
        fill="none"
        opacity={rootOpacity}
        stroke="rgba(90, 130, 153, 0.84)"
        strokeLinecap="round"
        strokeWidth="12"
      />
      <circle cx="460" cy="170" fill={`rgba(238, 139, 84, ${0.24 + gateOpacity * 0.5})`} r={14 + beatIndex * 2} />
      <circle cx="456" cy="390" fill={`rgba(90, 130, 153, ${0.26 + rootOpacity * 0.5})`} r={14 + beatIndex * 2} />
      <text
        fill="rgba(78,96,90,0.92)"
        fontFamily="Palatino Linotype, Noto Serif SC, Source Han Serif SC, serif"
        fontSize="18"
        textAnchor="middle"
        x="184"
        y="364"
      >
        开门
      </text>
      <text
        fill="rgba(78,96,90,0.92)"
        fontFamily="Palatino Linotype, Noto Serif SC, Source Han Serif SC, serif"
        fontSize="18"
        textAnchor="middle"
        x="458"
        y="364"
      >
        归根
      </text>
      <text
        fill="rgba(24,38,35,0.95)"
        fontFamily="Avenir Next Condensed, Arial Narrow, Segoe UI, sans-serif"
        fontSize="30"
        letterSpacing="-0.05em"
        textAnchor="middle"
        x="320"
        y="76"
      >
        {beatIndex === 0 ? "先看没路" : beatIndex === 1 ? "再看没根" : "最后看动作边界"}
      </text>
    </svg>
  );
}

function renderSceneVisual(sceneId: SceneId, beatIndex: number) {
  if (sceneId === "round-motion") {
    return renderRoundMotionBeat(beatIndex);
  }

  if (sceneId === "kan-li") {
    return renderKanLiBeat(beatIndex);
  }

  return renderGateVsRootBeat(beatIndex);
}

export function ImmersiveIntroJourney() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [beatIndex, setBeatIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [transitioning, setTransitioning] = useState(false);

  const scene = SCENES[sceneIndex];
  const currentBeat = scene.beats[beatIndex] ?? scene.beats[0];
  const nextSceneIndex = (sceneIndex + 1) % SCENES.length;
  const totalBeatCount = SCENES.reduce((sum, item) => sum + item.beats.length, 0);
  const completedBeatCount =
    SCENES.slice(0, sceneIndex).reduce((sum, item) => sum + item.beats.length, 0) + beatIndex + 1;
  const progressValue = (completedBeatCount / totalBeatCount) * 100;

  useEffect(() => {
    if (!autoplay || transitioning) {
      return;
    }

    const isLastBeat = beatIndex >= scene.beats.length - 1;
    let beatTimer: number | null = null;
    let transitionTimer: number | null = null;

    if (isLastBeat) {
      beatTimer = window.setTimeout(() => {
        setTransitioning(true);
        transitionTimer = window.setTimeout(() => {
          setSceneIndex(nextSceneIndex);
          setBeatIndex(0);
          setTransitioning(false);
        }, TRANSITION_DURATION_MS);
      }, BEAT_DURATION_MS);
    } else {
      beatTimer = window.setTimeout(() => {
        setBeatIndex((current) => current + 1);
      }, BEAT_DURATION_MS);
    }

    return () => {
      if (beatTimer) {
        window.clearTimeout(beatTimer);
      }
      if (transitionTimer) {
        window.clearTimeout(transitionTimer);
      }
    };
  }, [autoplay, beatIndex, nextSceneIndex, scene.beats.length, transitioning]);

  function handleSceneSelect(nextIndex: number) {
    setSceneIndex(nextIndex);
    setBeatIndex(0);
    setAutoplay(false);
    setTransitioning(false);
  }

  function handleBeatSelect(nextBeatIndex: number) {
    setBeatIndex(nextBeatIndex);
    setAutoplay(false);
  }

  function handleAdvance() {
    const isLastBeat = beatIndex >= scene.beats.length - 1;

    if (isLastBeat) {
      moveToScene(nextSceneIndex, setSceneIndex, setBeatIndex, setTransitioning);
      setAutoplay(false);
      return;
    }

    setBeatIndex((current) => current + 1);
    setAutoplay(false);
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[1.18fr_0.82fr]">
      <Card className="relative overflow-hidden border-border/70 bg-[linear-gradient(160deg,rgba(17,38,36,0.95),rgba(31,50,45,0.92))] text-white shadow-[0_24px_70px_rgba(17,38,36,0.32)]">
        <div className="pointer-events-none absolute left-10 top-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-10 right-10 h-40 w-40 rounded-full bg-accent/20 blur-3xl" />
        <div className="pointer-events-none absolute right-1/4 top-1/3 h-24 w-24 rounded-full bg-white/10 blur-2xl" />

        <div
          className={cn(
            "pointer-events-none absolute inset-0 flex items-center justify-center bg-[rgba(255,248,238,0.08)] opacity-0 transition-opacity duration-500",
            transitioning && "opacity-100",
          )}
        >
          <div className="rounded-[28px] border border-white/20 bg-white/8 px-6 py-5 text-center backdrop-blur">
            <p className="font-display text-xs uppercase tracking-[0.24em] text-white/70">Transition</p>
            <strong className="mt-2 block font-display text-2xl text-white">下一幕正在接上</strong>
            <span className="mt-2 block text-sm leading-7 text-white/72">{SCENES[nextSceneIndex].title}</span>
          </div>
        </div>

        <CardContent className="relative flex h-full flex-col gap-6 p-6 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <Badge className="rounded-full bg-white/10 px-3 py-1 text-white hover:bg-white/10" variant="outline">
                {scene.eyebrow}
              </Badge>
              <div className="space-y-2">
                <h2 className="font-display text-3xl leading-tight tracking-[-0.04em] text-white md:text-4xl">{scene.title}</h2>
                <p className="text-base leading-8 text-white/70">{scene.atmosphere}</p>
              </div>
            </div>
            <div className="w-full max-w-[240px] space-y-2">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.22em] text-white/60">
                <span>Journey Progress</span>
                <span>{Math.round(progressValue)}%</span>
              </div>
              <Progress className="bg-white/12" value={progressValue} />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/6 p-4 backdrop-blur-sm md:p-6">
            <div className="mx-auto max-w-[680px]">{renderSceneVisual(scene.id, beatIndex)}</div>
          </div>

          <Card className="border-white/12 bg-white/8 text-white shadow-none">
            <CardContent className="space-y-3 p-5">
              <p className="font-display text-xs uppercase tracking-[0.24em] text-white/60">{currentBeat.kicker}</p>
              <strong className="block text-xl leading-8 font-medium text-white">{currentBeat.line}</strong>
              <span className="block text-sm leading-7 text-white/72">{currentBeat.cue}</span>
            </CardContent>
          </Card>

          <div className="grid grid-cols-3 gap-3">
            {SCENES.map((item, index) => (
              <button
                className={cn(
                  "h-2 rounded-full bg-white/14 transition-all duration-300",
                  sceneIndex === index && "bg-white shadow-[0_0_24px_rgba(255,255,255,0.32)]",
                )}
                key={item.id}
                onClick={() => handleSceneSelect(index)}
                type="button"
              >
                <span className="sr-only">{item.title}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className="border-border/70 bg-card/84">
          <CardHeader className="space-y-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="space-y-3">
                <Badge className="rounded-full px-3 py-1" variant="accent">
                  Immersive Route
                </Badge>
                <CardTitle className="text-[1.95rem]">60-90 秒先把人吸住</CardTitle>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => setAutoplay((current) => !current)} type="button" variant="outline">
                  {autoplay ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {autoplay ? "暂停自动演示" : "恢复自动演示"}
                </Button>
                <Button onClick={handleAdvance} type="button" variant="outline">
                  <SkipForward className="h-4 w-4" />
                  {beatIndex >= scene.beats.length - 1 ? "切到下一幕" : "下一镜头"}
                </Button>
              </div>
            </div>
            <CardDescription className="text-base">{scene.summary}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="rounded-[24px] border border-border/70 bg-background/70 px-4 py-4 text-sm leading-7 text-foreground/80">
              {scene.caption}
            </p>

            <div className="flex flex-wrap gap-2">
              {scene.facts.map((fact) => (
                <Badge className="rounded-full px-3 py-1" key={fact} variant="secondary">
                  {fact}
                </Badge>
              ))}
            </div>

            <div className="space-y-3">
              <p className="font-display text-xs uppercase tracking-[0.24em] text-primary">Scene Selector</p>
              <Tabs
                onValueChange={(value) => {
                  const nextIndex = SCENES.findIndex((item) => item.id === value);
                  if (nextIndex >= 0) {
                    handleSceneSelect(nextIndex);
                  }
                }}
                value={scene.id}
              >
                <TabsList className="w-full justify-start overflow-x-auto">
                  {SCENES.map((item) => (
                    <TabsTrigger className="shrink-0" key={item.id} value={item.id}>
                      {item.eyebrow}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div className="space-y-3">
              <p className="font-display text-xs uppercase tracking-[0.24em] text-primary">Beat Cards</p>
              <div className="grid gap-3">
                {scene.beats.map((beat, index) => (
                  <button
                    className={cn(
                      "rounded-[24px] border px-4 py-4 text-left transition-all duration-200",
                      beatIndex === index
                        ? "border-primary/40 bg-primary/10 shadow-soft"
                        : "border-border/70 bg-background/60 hover:bg-background",
                    )}
                    key={beat.id}
                    onClick={() => handleBeatSelect(index)}
                    type="button"
                  >
                    <p className="font-display text-xs uppercase tracking-[0.22em] text-primary">{beat.kicker}</p>
                    <strong className="mt-2 block text-base leading-7 text-foreground">{beat.line}</strong>
                    <span className="mt-2 block text-sm leading-7 text-muted-foreground">{beat.cue}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-3">
              {SCENES.map((item, index) => (
                <button
                  className={cn(
                    "rounded-[24px] border px-4 py-4 text-left transition-all duration-200",
                    sceneIndex === index
                      ? "border-accent/40 bg-accent/10 shadow-soft"
                      : "border-border/70 bg-background/60 hover:bg-background",
                  )}
                  key={item.id}
                  onClick={() => handleSceneSelect(index)}
                  type="button"
                >
                  <p className="font-display text-xs uppercase tracking-[0.24em] text-primary">{item.eyebrow}</p>
                  <strong className="mt-2 block text-lg leading-7 text-foreground">{item.title}</strong>
                  <span className="mt-2 block text-sm leading-7 text-muted-foreground">{item.atmosphere}</span>
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href={scene.primaryHref}>{scene.primaryLabel}</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href={scene.secondaryHref}>{scene.secondaryLabel}</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/paths/pulse-formula-case-loop">进入完整学习版</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
