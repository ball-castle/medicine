import Link from "next/link";
import { ArrowRight, BookOpen, Clapperboard, Compass, Sparkles } from "lucide-react";
import type { ConceptRecord, DiagramRecord, LearningPathRecord, ModuleRecord } from "@medicine/content-schema";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCaseStudyHref } from "@/lib/cases";
import { getSiteContent } from "@/lib/content";
import { getLearningPathHref } from "@/lib/learning-paths";

function SectionTitle(props: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="space-y-3">
      <p className="font-display text-xs uppercase tracking-[0.24em] text-primary">{props.eyebrow}</p>
      <h2 className="font-display text-3xl leading-tight tracking-[-0.04em] text-foreground md:text-4xl">{props.title}</h2>
      <p className="max-w-3xl text-base leading-8 text-muted-foreground">{props.description}</p>
    </div>
  );
}

function ModuleCard(props: {
  module: ModuleRecord;
  concepts: ConceptRecord[];
  diagrams: DiagramRecord[];
}) {
  return (
    <Link className="group block h-full" href={`/modules/${props.module.id}`}>
      <Card className="flex h-full flex-col justify-between border-border/70 bg-card/85 transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_26px_60px_rgba(49,41,31,0.16)]">
        <CardHeader className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <Badge variant="outline" className="font-display uppercase tracking-[0.2em] text-primary">
              Learning Module
            </Badge>
            <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary" />
          </div>
          <div className="space-y-3">
            <CardTitle className="text-[1.6rem] leading-tight">{props.module.title}</CardTitle>
            <CardDescription className="text-base">{props.module.premise}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
            <span>{props.concepts.length} 个知识点</span>
            <span className="opacity-45">/</span>
            <span>{props.diagrams.length} 张重点图</span>
          </div>
          <p className="text-sm leading-7 text-foreground/85">{props.module.targetOutcome}</p>
          <div className="flex flex-wrap gap-2">
            {props.concepts.slice(0, 4).map((concept) => (
              <Badge className="rounded-full px-3 py-1" key={concept.id} variant="secondary">
                {concept.title}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function DiagramCard(props: { diagram: DiagramRecord }) {
  return (
    <Card className="h-full border-border/70 bg-card/80">
      <CardHeader className="space-y-4">
        <Badge className="w-fit rounded-full px-3 py-1" variant="accent">
          {props.diagram.productionFormat}
        </Badge>
        <div className="space-y-3">
          <CardTitle className="text-[1.5rem]">{props.diagram.title}</CardTitle>
          <CardDescription className="text-base">{props.diagram.purpose}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-7 text-foreground/85">{props.diagram.interactionIdea}</p>
      </CardContent>
    </Card>
  );
}

function LearningPathCard(props: { path: LearningPathRecord }) {
  return (
    <Card className="overflow-hidden border-border/70 bg-[linear-gradient(135deg,rgba(15,118,110,0.08),rgba(255,250,242,0.92))]">
      <CardHeader className="space-y-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-3">
            <p className="font-display text-xs uppercase tracking-[0.24em] text-primary">Learning Path</p>
            <CardTitle className="text-[1.8rem]">{props.path.title}</CardTitle>
          </div>
          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
            <Badge variant="secondary">{props.path.steps.length} 步</Badge>
            <Badge variant="outline">{props.path.estimatedTime}</Badge>
          </div>
        </div>
        <CardDescription className="text-base">{props.path.subtitle}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-sm leading-7 text-foreground/85">{props.path.summary}</p>
        <div className="flex flex-wrap gap-2">
          {props.path.steps.slice(0, 4).map((step) => (
            <Badge className="rounded-full px-3 py-1" key={step.id} variant="outline">
              {step.title}
            </Badge>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="default">
            <Link href={getLearningPathHref(props.path.id)}>打开这条路线</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/progress">查看路线进度</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function CaseStudyCard(props: {
  caseStudy: {
    id: string;
    title: string;
    subtitle: string;
    summary: string;
    stages: number;
    concepts: ConceptRecord[];
  };
  module: ModuleRecord;
}) {
  return (
    <Card className="h-full border-border/70 bg-card/80">
      <CardHeader className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-3">
            <p className="font-display text-xs uppercase tracking-[0.24em] text-primary">Case Study</p>
            <CardTitle className="text-[1.6rem]">{props.caseStudy.title}</CardTitle>
          </div>
          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
            <Badge variant="secondary">{props.caseStudy.stages} 个阶段</Badge>
            <Badge variant="outline">{props.module.title}</Badge>
          </div>
        </div>
        <CardDescription className="text-base">{props.caseStudy.subtitle}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-sm leading-7 text-foreground/85">{props.caseStudy.summary}</p>
        <div className="flex flex-wrap gap-2">
          {props.caseStudy.concepts.slice(0, 3).map((concept) => (
            <Badge className="rounded-full px-3 py-1" key={concept.id} variant="outline">
              {concept.title}
            </Badge>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="default">
            <Link href={getCaseStudyHref(props.caseStudy.id)}>打开病例</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/modules/${props.module.id}`}>回到模块</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ExperienceEntryCard(props: {
  eyebrow: string;
  title: string;
  summary: string;
  href: string;
  label: string;
}) {
  return (
    <Card className="h-full border-border/70 bg-card/84 transition-transform duration-300 hover:-translate-y-1">
      <CardHeader className="space-y-4">
        <p className="font-display text-xs uppercase tracking-[0.24em] text-primary">{props.eyebrow}</p>
        <div className="space-y-3">
          <CardTitle className="text-[1.45rem] leading-tight">{props.title}</CardTitle>
          <CardDescription className="text-base">{props.summary}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Button asChild variant="outline">
          <Link href={props.href}>{props.label}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export default async function HomePage() {
  const { books, concepts, diagrams, modules, phases, storyboards, caseStudies, learningPaths } = await getSiteContent();

  const conceptMap = new Map(concepts.map((concept) => [concept.id, concept]));
  const diagramMap = new Map(diagrams.map((diagram) => [diagram.id, diagram]));
  const moduleMap = new Map(modules.map((module) => [module.id, module]));

  const featuredConcepts = concepts.filter((concept) => concept.tier === "foundation").slice(0, 6);
  const featuredDiagrams = diagrams.filter((diagram) => diagram.visualPriority === "high").slice(0, 6);
  const featuredCaseStudies = caseStudies.slice(0, 3).map((caseStudy) => ({
    ...caseStudy,
    stages: caseStudy.stages.length,
    concepts: caseStudy.focusConceptIds
      .map((conceptId) => conceptMap.get(conceptId))
      .filter(Boolean) as ConceptRecord[],
    module: moduleMap.get(caseStudy.moduleId) ?? null,
  }));
  const featuredPath = learningPaths[0] ?? null;

  return (
    <main className="mx-auto flex w-[min(1200px,calc(100vw-32px))] flex-col gap-6 py-8 md:gap-7 md:py-10">
      <section className="relative overflow-hidden rounded-[36px] border border-border/70 bg-[linear-gradient(135deg,rgba(255,249,240,0.92),rgba(241,233,220,0.78))] p-6 shadow-soft backdrop-blur md:p-8 lg:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(15,118,110,0.16),transparent_32%),radial-gradient(circle_at_top_right,rgba(191,108,63,0.16),transparent_22%)]" />
        <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <div className="space-y-4">
              <Badge className="rounded-full px-3 py-1" variant="accent">
                Immersive TCM World
              </Badge>
              <h1 className="max-w-[11ch] font-display text-4xl leading-[0.94] tracking-[-0.06em] text-foreground md:text-6xl lg:text-[4.7rem]">
                先让人被这个世界吸住，再决定要不要继续学。
              </h1>
              <p className="max-w-3xl text-base leading-8 text-muted-foreground md:text-lg">
                这个网站现在不该先像题库，也不该先像课程后台。它更应该像一个会动的中医世界入口:
                先让用户看到圆运动、水火交通、开门与归根，再把他们自然带进学习版。
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/experiences/intro-journey">开始沉浸式体验</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/prototypes/circle-flow-map">看圆运动</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/prototypes/kan-li-circulation">看水火交通</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/prototypes/guizhi-vs-fuzi">看开门与归根</Link>
              </Button>
            </div>
          </div>

          <Card className="relative overflow-hidden border-white/50 bg-white/22 p-4 shadow-[0_20px_60px_rgba(15,34,31,0.14)]">
            <div className="pointer-events-none absolute left-8 top-8 h-28 w-28 rounded-full bg-primary/18 blur-3xl" />
            <div className="pointer-events-none absolute bottom-8 right-8 h-24 w-24 rounded-full bg-accent/16 blur-3xl" />
            <div className="relative">
              <svg aria-label="首页动态世界入口" className="h-auto w-full" viewBox="0 0 640 520">
                <circle cx="320" cy="260" fill="rgba(255,255,255,0.08)" r="164" />
                <circle cx="320" cy="260" fill="none" opacity="0.3" r="164" stroke="rgba(255,245,224,0.3)" strokeWidth="2" />
                <circle cx="320" cy="260" fill="none" opacity="0.18" r="108" stroke="rgba(107,185,176,0.22)" strokeDasharray="8 12" strokeWidth="2" />
                <path
                  className="animate-pulse"
                  d="M 320 90 C 432 116 510 188 526 260 C 510 334 432 404 320 430"
                  fill="none"
                  opacity="0.8"
                  stroke="rgba(238, 139, 84, 0.78)"
                  strokeLinecap="round"
                  strokeWidth="10"
                />
                <path
                  className="animate-pulse"
                  d="M 320 90 C 208 116 130 188 114 260 C 130 334 208 404 320 430"
                  fill="none"
                  opacity="0.64"
                  stroke="rgba(94, 148, 171, 0.72)"
                  strokeLinecap="round"
                  strokeWidth="10"
                />
                <path
                  d="M 432 160 C 470 208 486 250 478 298 C 470 338 452 370 430 398"
                  fill="none"
                  opacity="0.7"
                  stroke="rgba(238, 139, 84, 0.76)"
                  strokeLinecap="round"
                  strokeWidth="6"
                />
                <path
                  d="M 208 360 C 184 328 170 288 172 248 C 176 206 192 168 214 132"
                  fill="none"
                  opacity="0.7"
                  stroke="rgba(95, 138, 164, 0.82)"
                  strokeLinecap="round"
                  strokeWidth="6"
                />
                <circle cx="430" cy="156" fill="rgba(238, 139, 84, 0.76)" r="18" />
                <circle cx="210" cy="364" fill="rgba(95, 138, 164, 0.82)" r="18" />
                <circle cx="320" cy="260" fill="rgba(245, 230, 201, 0.28)" r="62" />
                <text
                  fill="rgba(24,38,35,0.95)"
                  fontFamily="Avenir Next Condensed, Arial Narrow, Segoe UI, sans-serif"
                  fontSize="34"
                  letterSpacing="-0.05em"
                  textAnchor="middle"
                  x="320"
                  y="250"
                >
                  动态中医世界
                </text>
                <text
                  fill="rgba(78,96,90,0.9)"
                  fontFamily="Palatino Linotype, Noto Serif SC, Source Han Serif SC, serif"
                  fontSize="20"
                  textAnchor="middle"
                  x="320"
                  y="282"
                >
                  先看结构，再进学习
                </text>
              </svg>
            </div>
          </Card>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <ExperienceEntryCard
          eyebrow="Experience 01"
          href="/experiences/intro-journey"
          label="打开短体验"
          summary="把圆运动、水火交通、开门归根压成一条 60-90 秒的入口路径。"
          title="先逛一圈这个会动的中医世界"
        />
        <ExperienceEntryCard
          eyebrow="Experience 02"
          href={featuredPath ? getLearningPathHref(featuredPath.id) : "/paths"}
          label="进入完整路线"
          summary="如果体验完还想继续，就从脉 -> 方 -> 案的首条完整闭环开始。"
          title="再走一条真正能学完的路线"
        />
        <ExperienceEntryCard
          eyebrow="Experience 03"
          href="/diagrams"
          label="浏览图表图谱"
          summary="图表目录保留为深看入口，但不再当首页主角。"
          title="最后才进入图表、模块和练习"
        />
      </section>

      <section className="grid gap-6 rounded-[32px] border border-border/70 bg-[linear-gradient(135deg,rgba(15,118,110,0.06),rgba(191,108,63,0.08))] p-6 shadow-soft backdrop-blur md:grid-cols-[1.15fr_1fr] md:p-8">
        <div className="space-y-4">
          <Badge className="rounded-full px-3 py-1" variant="outline">
            Cinematic Hooks
          </Badge>
          <h2 className="font-display text-3xl leading-tight tracking-[-0.04em] text-foreground md:text-4xl">
            现在最能吸引人的，不是题，而是这些会动的核心画面。
          </h2>
          <p className="text-base leading-8 text-muted-foreground">
            先让用户看到“整体在转”“上下能不能接”“一个开门一个归根”，他们才会愿意继续点进学习版。
          </p>
        </div>
        <div className="grid gap-3">
          {storyboards.map((storyboard, index) => (
            <div
              className="flex items-center justify-between gap-4 rounded-[20px] border border-border/70 bg-white/70 px-4 py-4"
              key={storyboard.id}
            >
              <strong className="font-display text-base font-medium text-foreground">
                {index + 1}. {storyboard.title}
              </strong>
              <span className="text-sm text-muted-foreground">{storyboard.scenes.length} 个镜头节点</span>
            </div>
          ))}
        </div>
      </section>

      <Card className="border-border/70 bg-[linear-gradient(135deg,rgba(15,118,110,0.12),rgba(255,250,242,0.92))]">
        <CardHeader className="space-y-4">
          <Badge className="w-fit rounded-full px-3 py-1" variant="accent">
            Current Product Stance
          </Badge>
          <div className="space-y-3">
            <CardTitle className="text-3xl md:text-4xl">现在首页的任务不是解释完，而是先让用户停下来。</CardTitle>
            <CardDescription className="max-w-4xl text-base">
              题库和课程不是不要，而是应该退到第二层。真正的第一层应该像展览入口，先把世界观、动作感和差异感
              做出来，学习链再接上去。
            </CardDescription>
          </div>
        </CardHeader>
      </Card>

      {featuredPath && (
        <section className="rounded-[32px] border border-border/70 bg-card/78 p-6 shadow-soft backdrop-blur md:p-8">
          <SectionTitle
            eyebrow="Learning Path"
            title="吸引住以后，下一层才是完整学习闭环"
            description="首条路线现在变成第二入口，不再抢首页主位。它负责把被吸引进来的用户接成真正能走完的一条学习链。"
          />
          <div className="mt-6">
            <LearningPathCard path={featuredPath} />
          </div>
        </section>
      )}

      <section className="rounded-[32px] border border-border/70 bg-card/78 p-6 shadow-soft backdrop-blur md:p-8" id="modules">
        <SectionTitle
          eyebrow="Learning Edition"
          title="学习版入口"
          description="真正愿意继续看的人，才会走到这里。此时再进入模块、图表和后续练习，体验会顺很多。"
        />
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {modules.map((module) => (
            <ModuleCard
              key={module.id}
              module={module}
              concepts={module.conceptIds.map((id) => conceptMap.get(id)).filter(Boolean) as ConceptRecord[]}
              diagrams={module.diagramIds.map((id) => diagramMap.get(id)).filter(Boolean) as DiagramRecord[]}
            />
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.85fr]">
        <div className="rounded-[32px] border border-border/70 bg-card/78 p-6 shadow-soft backdrop-blur md:p-8">
          <SectionTitle
            eyebrow="Concepts"
            title="第一批最适合继续产品化的知识点"
            description="用户被吸引进来以后，这些概念才是后续课程和练习最适合继续承接的底层语言。"
          />
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {featuredConcepts.map((concept) => (
              <Card className="h-full border-border/70 bg-card/80" key={concept.id}>
                <CardHeader className="space-y-4">
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline">{concept.visualType}</Badge>
                    <Badge variant="secondary">{concept.chapter}</Badge>
                  </div>
                  <div className="space-y-3">
                    <CardTitle className="text-[1.45rem]">{concept.title}</CardTitle>
                    <CardDescription className="text-base">{concept.plainExplanation}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {concept.keywords.map((keyword) => (
                    <Badge className="rounded-full px-3 py-1" key={keyword} variant="outline">
                      {keyword}
                    </Badge>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Card className="border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,250,242,0.94))]">
          <CardHeader className="space-y-4">
            <Badge className="w-fit rounded-full px-3 py-1" variant="accent">
              Attraction Blueprint
            </Badge>
            <div className="space-y-3">
              <CardTitle className="text-3xl">当前最适合的产品层次</CardTitle>
              <CardDescription className="text-base">
                这样首页就不再像教务系统，而更像一个会把人自然吸进去的动态世界入口。
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="space-y-3 text-base leading-8 text-foreground/85">
              <li className="flex gap-3">
                <Compass className="mt-1 h-4 w-4 text-primary" />
                <span>先看沉浸式短体验</span>
              </li>
              <li className="flex gap-3">
                <Sparkles className="mt-1 h-4 w-4 text-primary" />
                <span>再进首条完整学习路线</span>
              </li>
              <li className="flex gap-3">
                <BookOpen className="mt-1 h-4 w-4 text-primary" />
                <span>再进入模块、图表和练习</span>
              </li>
              <li className="flex gap-3">
                <Clapperboard className="mt-1 h-4 w-4 text-primary" />
                <span>最后才用进度页做复盘</span>
              </li>
            </ol>
          </CardContent>
        </Card>
      </section>

      <section className="rounded-[32px] border border-border/70 bg-card/78 p-6 shadow-soft backdrop-blur md:p-8" id="diagrams">
        <SectionTitle
          eyebrow="Visual Atlas"
          title="继续往深处看时，图表目录仍然是最稳的中层入口"
          description="它现在不再承担首页吸引任务，而是负责承接那些已经被吸引、想继续探索结构的人。"
        />
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {featuredDiagrams.map((diagram) => (
            <DiagramCard key={diagram.id} diagram={diagram} />
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link href="/diagrams">打开图表目录页</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/storyboards">查看重点图分镜</Link>
          </Button>
        </div>
      </section>

      <section className="rounded-[32px] border border-border/70 bg-card/78 p-6 shadow-soft backdrop-blur md:p-8" id="cases">
        <SectionTitle
          eyebrow="Cases"
          title="病例推演继续承担“留下来”的那一层"
          description="吸引层把人拉进来，病例层负责让人继续停留，并第一次真正感到“原来这里不是只讲概念”。"
        />
        <div className="mt-6 grid gap-4 xl:grid-cols-3">
          {featuredCaseStudies.map((caseStudy) =>
            caseStudy.module ? <CaseStudyCard caseStudy={caseStudy} key={caseStudy.id} module={caseStudy.module} /> : null,
          )}
        </div>
        <div className="mt-6">
          <Button asChild variant="outline">
            <Link href="/cases">打开病例推演目录</Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[32px] border border-border/70 bg-card/78 p-6 shadow-soft backdrop-blur md:p-8">
          <SectionTitle
            eyebrow="Books"
            title="内容来源"
            description="两本书仍然是底盘，但前台呈现方式已经从“书摘要”转成“动态世界入口”。"
          />
          <div className="mt-6 grid gap-4">
            {books.map((book) => (
              <Card className="border-border/70 bg-card/80" key={book.id}>
                <CardHeader className="space-y-3">
                  <Badge className="w-fit rounded-full px-3 py-1" variant="outline">
                    {book.shortTitle}
                  </Badge>
                  <div className="space-y-3">
                    <CardTitle className="text-[1.45rem]">{book.title}</CardTitle>
                    <CardDescription className="text-base">{book.focus}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <dl className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1">
                      <dt className="text-sm font-medium text-foreground">适合谁</dt>
                      <dd className="text-sm leading-7 text-muted-foreground">{book.audience}</dd>
                    </div>
                    <div className="space-y-1">
                      <dt className="text-sm font-medium text-foreground">来源文件</dt>
                      <dd className="text-sm leading-7 text-muted-foreground">{book.sourcePdf}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="rounded-[32px] border border-border/70 bg-card/78 p-6 shadow-soft backdrop-blur md:p-8">
          <SectionTitle
            eyebrow="Roadmap"
            title="开发路线"
            description="先把吸引力做强，再决定哪些部分值得继续升级成更重的动画和 3D。"
          />
          <div className="mt-6 grid gap-4">
            {phases.map((phase) => (
              <Card className="border-border/70 bg-card/80" key={phase.id}>
                <CardHeader className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="text-[1.35rem]">{phase.title}</CardTitle>
                    <Badge variant="secondary">{phase.duration}</Badge>
                  </div>
                  <CardDescription className="text-base">{phase.goal}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {phase.deliverables.map((item) => (
                    <Badge className="rounded-full px-3 py-1" key={item} variant="outline">
                      {item}
                    </Badge>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
