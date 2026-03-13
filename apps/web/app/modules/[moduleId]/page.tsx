import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import type {
  CaseStudyRecord,
  ConceptRecord,
  DiagramRecord,
  ModuleDetailRecord,
  ModuleRecord,
  StoryboardRecord,
} from "@medicine/content-schema";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CaseStudyPlayer } from "@/features/cases";
import { CaseStageTimelinePrototype } from "@/features/prototypes";
import { CircleFlowPrototype } from "@/features/prototypes";
import { FormulaDirectionPrototype } from "@/features/prototypes";
import { PracticeSetPlayer } from "@/features/practice";
import { FuYangActionTriad } from "@/features/prototypes";
import { FushenRightDescendPrototype } from "@/features/prototypes";
import { FuziRootPrototype } from "@/features/prototypes";
import { GuizhiFuziCompare } from "@/features/prototypes";
import { GuizhiGatePrototype } from "@/features/prototypes";
import { KanLiPrototype } from "@/features/prototypes";
import { PulseDashboardPrototype } from "@/features/prototypes";
import { getCaseStudyHref } from "@/lib/cases";
import { getSiteContent } from "@/lib/content";
import { getPracticeHref } from "@/lib/practice";

function SectionTitle(props: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="space-y-3">
      <p className="font-display text-xs uppercase tracking-[0.24em] text-primary">{props.eyebrow}</p>
      <h2 className="font-display text-3xl leading-tight tracking-[-0.04em] text-foreground md:text-4xl">{props.title}</h2>
      <p className="max-w-3xl text-base leading-8 text-muted-foreground">{props.description}</p>
    </div>
  );
}

function pickModuleContent(
  module: ModuleRecord,
  concepts: ConceptRecord[],
  diagrams: DiagramRecord[],
  moduleDetails: ModuleDetailRecord[],
  storyboards: StoryboardRecord[],
) {
  const conceptMap = new Map(concepts.map((concept) => [concept.id, concept]));
  const diagramMap = new Map(diagrams.map((diagram) => [diagram.id, diagram]));

  const moduleConcepts = module.conceptIds.map((conceptId) => conceptMap.get(conceptId)).filter(Boolean) as ConceptRecord[];
  const moduleDiagrams = module.diagramIds.map((diagramId) => diagramMap.get(diagramId)).filter(Boolean) as DiagramRecord[];
  const moduleDetail = moduleDetails.find((detail) => detail.moduleId === module.id) ?? null;
  const moduleStoryboards = storyboards.filter((storyboard) => moduleDiagrams.some((diagram) => diagram.id === storyboard.diagramId));

  return { moduleConcepts, moduleDiagrams, moduleDetail, moduleStoryboards };
}

type PrototypeShowcase = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  buttonLabel: string;
  content: ReactNode;
};

function getPrototypeShowcases(moduleId: string, timelineCaseStudies: CaseStudyRecord[]): PrototypeShowcase[] {
  if (moduleId === "foundations") {
    return [
      {
        id: "circle-flow",
        eyebrow: "Interactive Prototype",
        title: "第一张真正可玩的图已经接进来了",
        description:
          "这张原型用来验证一个关键问题：用户能不能通过切换时令、观察中轴强弱和对比失衡模式，真正把“圆运动”理解成可感知的整体结构。",
        href: "/prototypes/circle-flow-map",
        buttonLabel: "打开独立原型页",
        content: <CircleFlowPrototype />,
      },
    ];
  }

  if (moduleId === "formula-logic") {
    return [
      {
        id: "formula-direction",
        eyebrow: "Interactive Prototype",
        title: "方药模块的主图已经能直接体验",
        description:
          "这张罗盘图不先讲功效，而是先把方剂放回“方向动作”里。这样用户会先分清是开、和、下，还是守根，再去理解为什么同样叫治病，动作却完全不同。",
        href: "/prototypes/formula-direction-compass",
        buttonLabel: "打开方剂罗盘独立页",
        content: <FormulaDirectionPrototype />,
      },
    ];
  }

  if (moduleId === "diagnostic-judgment") {
    return [
      {
        id: "pulse-dashboard",
        eyebrow: "Interactive Prototype",
        title: "脉法模块的判断面板已经能直接体验",
        description:
          "这张面板专门训练“先脉后舌，再压标签”的顺序。它的价值不在于多一个酷炫页面，而在于把诊断最容易乱掉的第一步，做成一个能反复练的总开关。",
        href: "/prototypes/pulse-dashboard",
        buttonLabel: "打开脉诊面板独立页",
        content: <PulseDashboardPrototype />,
      },
    ];
  }

  if (moduleId === "fu-yang-core") {
    return [
      {
        id: "kan-li",
        eyebrow: "Interactive Prototype",
        title: "扶阳模块的核心结构图已经能直接体验",
        description: "这张原型先把“坎离水火”“上下交通”“表面热象”和“归根”放进同一张画面里，让用户先理解结构，再进入具体动作差异。",
        href: "/prototypes/kan-li-circulation",
        buttonLabel: "打开坎离独立原型页",
        content: <KanLiPrototype />,
      },
      {
        id: "guizhi",
        eyebrow: "Action Prototype",
        title: "桂枝法的“开门拨机”也已经被做成动作原型",
        description: "这一张图专门负责把“门没打开”和“把门拨开”讲清楚。它不是补充说明，而是扶阳模块里最需要一眼看懂的动作图之一。",
        href: "/prototypes/guizhi-gate-animation",
        buttonLabel: "打开桂枝独立原型页",
        content: <GuizhiGatePrototype />,
      },
      {
        id: "fuzi",
        eyebrow: "Return Prototype",
        title: "附子法的“归根回阳”也已经被做成动作原型",
        description: "这一张图专门负责把“浮散无根”和“收回归根”讲清楚。它和桂枝法不是同一类动作，必须让用户在视觉上直接看到一个是开门，一个是归根。",
        href: "/prototypes/fuzi-root-return",
        buttonLabel: "打开附子独立原型页",
        content: <FuziRootPrototype />,
      },
      {
        id: "compare",
        eyebrow: "Comparison Prototype",
        title: "现在可以把桂枝和附子放在同一页面直接比较",
        description: "这一页不增加新的理论，而是把“开门”和“归根”并排压到同一个坐标系里，让用户在最短时间内建立动作边界：一个解决没路，一个解决没根。",
        href: "/prototypes/guizhi-vs-fuzi",
        buttonLabel: "打开双图对照页",
        content: <GuizhiFuziCompare />,
      },
      {
        id: "fushen",
        eyebrow: "Transition Prototype",
        title: "茯神法的“右降缓转”也已经能直接体验",
        description: "这一张图专门负责把“先稳局面、再决定后续”的逻辑讲清楚。它让扶阳模块不再只有“开”和“归”，还多出一层很关键的缓冲动作。",
        href: "/prototypes/fushen-right-descend",
        buttonLabel: "打开茯神独立原型页",
        content: <FushenRightDescendPrototype />,
      },
      {
        id: "triad",
        eyebrow: "Triad Prototype",
        title: "扶阳模块现在可以在一页里比较“开、归、缓转”",
        description: "这张总览页把桂枝、附子、茯神三种动作压到同一坐标系里。它的价值不是增加新图，而是让用户第一次真正完成动作分流。",
        href: "/prototypes/fu-yang-action-triad",
        buttonLabel: "打开三动作总览页",
        content: <FuYangActionTriad />,
      },
    ];
  }

  if (moduleId === "cases-and-application") {
    return [
      {
        id: "case-timeline",
        eyebrow: "Interactive Prototype",
        title: "医案模块的时间线主图已经能直接体验",
        description: "这张时间线不是重复病例播放器，而是把“主轴为什么变了、为什么该换手、为什么不是别的路”压缩进同一张教学图里，帮助用户真正学会分阶段判断。",
        href: "/prototypes/case-stage-timeline",
        buttonLabel: "打开医案时间线独立页",
        content: <CaseStageTimelinePrototype caseStudies={timelineCaseStudies} />,
      },
    ];
  }

  return [];
}

export async function generateStaticParams() {
  const { modules } = await getSiteContent();
  return modules.map((module) => ({ moduleId: module.id }));
}

export default async function ModulePage(props: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = await props.params;
  const { modules, concepts, diagrams, moduleDetails, storyboards, practiceSets, caseStudies } = await getSiteContent();

  const module = modules.find((item) => item.id === moduleId);
  if (!module) {
    notFound();
  }

  const { moduleConcepts, moduleDiagrams, moduleDetail, moduleStoryboards } = pickModuleContent(module, concepts, diagrams, moduleDetails, storyboards);
  const conceptMap = new Map(concepts.map((concept) => [concept.id, concept]));

  const relatedModules = moduleDetail ? (moduleDetail.nextModuleIds.map((id) => modules.find((item) => item.id === id)).filter(Boolean) as ModuleRecord[]) : [];
  const modulePracticeSet = practiceSets.find((item) => item.moduleId === module.id) ?? null;
  const moduleCaseStudies = caseStudies.filter((item) => item.moduleId === module.id);
  const featuredCaseStudy = moduleCaseStudies[0] ?? null;
  const timelineCaseStudies = moduleCaseStudies.length ? moduleCaseStudies : caseStudies;
  const prototypeShowcases = getPrototypeShowcases(module.id, timelineCaseStudies);

  return (
    <main className="mx-auto flex w-[min(1200px,calc(100vw-32px))] flex-col gap-6 py-8 md:py-10">
      <section className="grid gap-6 rounded-[36px] border border-border/70 bg-[linear-gradient(135deg,rgba(255,249,240,0.9),rgba(241,233,220,0.74))] p-6 shadow-soft backdrop-blur md:p-8 lg:grid-cols-[1.18fr_0.82fr]">
        <div className="space-y-6">
          <div className="space-y-4">
            <Badge className="rounded-full px-3 py-1" variant="accent">Module</Badge>
            <h1 className="font-display text-4xl leading-[0.96] tracking-[-0.05em] text-foreground md:text-6xl">{module.title}</h1>
            <p className="text-lg leading-8 text-foreground/86">{moduleDetail?.subtitle ?? module.premise}</p>
            <p className="max-w-3xl text-base leading-8 text-muted-foreground">{moduleDetail?.intro ?? module.targetOutcome}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg"><Link href="/">返回学习地图</Link></Button>
            <Button asChild size="lg" variant="outline"><Link href="/storyboards">看分镜页</Link></Button>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="border-border/70 bg-card/78"><CardHeader className="space-y-2"><CardTitle className="text-4xl">{moduleConcepts.length}</CardTitle><CardDescription>知识点</CardDescription></CardHeader></Card>
          <Card className="border-border/70 bg-card/78"><CardHeader className="space-y-2"><CardTitle className="text-4xl">{moduleDiagrams.length}</CardTitle><CardDescription>重点图表</CardDescription></CardHeader></Card>
          <Card className="border-border/70 bg-card/78"><CardHeader className="space-y-2"><CardTitle className="text-4xl">{moduleStoryboards.length}</CardTitle><CardDescription>可直接制作的分镜</CardDescription></CardHeader></Card>
          <Card className="border-border/70 bg-card/78"><CardHeader className="space-y-2"><CardTitle className="text-2xl">{moduleDetail?.estimatedDuration ?? "10-15 分钟"}</CardTitle><CardDescription>推荐学习时长</CardDescription></CardHeader></Card>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[32px] border border-border/70 bg-card/80 p-6 shadow-soft backdrop-blur md:p-8">
          <SectionTitle eyebrow="Premise" title="这个模块到底要教会什么" description={module.targetOutcome} />
          <div className="mt-6 flex flex-wrap gap-2">
            {moduleConcepts.map((concept) => <Badge key={concept.id} variant="accent">{concept.title}</Badge>)}
          </div>
        </div>
        <Card className="border-border/70 bg-card/80">
          <CardHeader className="space-y-4">
            <Badge className="w-fit rounded-full px-3 py-1" variant="outline">Questions</Badge>
            <div className="space-y-3">
              <CardTitle className="text-3xl">建议用这些问题带用户进入</CardTitle>
              <CardDescription className="text-base">先用问题牵引，再把抽象概念和图表结构接进去。</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {(moduleDetail?.learningQuestions ?? [module.premise, module.targetOutcome]).map((question) => (
              <div className="rounded-[20px] border border-border/70 bg-background/60 px-4 py-4 text-sm leading-7 text-foreground/85" key={question}>{question}</div>
            ))}
          </CardContent>
        </Card>
      </section>

      {prototypeShowcases.map((item) => (
        <section className="rounded-[32px] border border-border/70 bg-card/80 p-6 shadow-soft backdrop-blur md:p-8" key={item.id}>
          <SectionTitle eyebrow={item.eyebrow} title={item.title} description={item.description} />
          <div className="mt-6">{item.content}</div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="outline"><Link href={item.href}>{item.buttonLabel}</Link></Button>
          </div>
        </section>
      ))}

      {modulePracticeSet ? (
        <section className="rounded-[32px] border border-border/70 bg-card/80 p-6 shadow-soft backdrop-blur md:p-8">
          <SectionTitle eyebrow="Practice Prototype" title={`${module.title}已经开始进入“能做判断”的练习形态`} description={`这一页不再只是看图，而是用 ${modulePracticeSet.cases.length} 个短案例训练用户先做结构判断。这意味着当前模块已经不只是展示型内容，而开始具有真正的学习闭环。`} />
          <div className="mt-6"><PracticeSetPlayer practiceSet={modulePracticeSet} /></div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="outline"><Link href={getPracticeHref(modulePracticeSet.id)}>打开这组练习</Link></Button>
          </div>
        </section>
      ) : null}

      {featuredCaseStudy ? (
        <section className="rounded-[32px] border border-border/70 bg-card/80 p-6 shadow-soft backdrop-blur md:p-8">
          <SectionTitle eyebrow="Case Study" title={`${module.title}已经开始进入“分阶段病例推演”`} description={`当前模块已经有 ${moduleCaseStudies.length} 组病例推演。重点不是给出标准答案，而是让用户看到：同一个病例里，为什么每一段的主轴都可能变化，下一手也会跟着变化。`} />
          <div className="mt-6"><CaseStudyPlayer caseStudy={featuredCaseStudy} /></div>
          <div className="mt-6 grid gap-4 xl:grid-cols-2">
            {moduleCaseStudies.map((caseStudy) => (
              <Card className="border-border/70 bg-card/82" key={caseStudy.id}>
                <CardHeader className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="space-y-3">
                      <Badge className="w-fit rounded-full px-3 py-1" variant="outline">Case Study</Badge>
                      <CardTitle className="text-[1.45rem]">{caseStudy.title}</CardTitle>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{caseStudy.stages.length} 个阶段</Badge>
                      <Badge variant="outline">{caseStudy.estimatedTime}</Badge>
                    </div>
                  </div>
                  <CardDescription className="text-base">{caseStudy.subtitle}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm leading-7 text-foreground/85">{caseStudy.summary}</p>
                  <div className="flex flex-wrap gap-2">
                    {caseStudy.focusConceptIds.map((conceptId) => conceptMap.get(conceptId)).filter(Boolean).slice(0, 3).map((concept) => (
                      <Badge className="rounded-full px-3 py-1" key={concept?.id} variant="outline">{concept?.title}</Badge>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button asChild variant="outline"><Link href={getCaseStudyHref(caseStudy.id)}>打开完整病例</Link></Button>
                    <Button asChild variant="ghost"><Link href="/cases">查看病例目录</Link></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      ) : null}

      <section className="rounded-[32px] border border-border/70 bg-card/80 p-6 shadow-soft backdrop-blur md:p-8">
        <SectionTitle eyebrow="Course Flow" title="课程结构" description="先从直觉上看懂结构，再进入术语和动作逻辑，这样最适合大众学习。" />
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {(moduleDetail?.sections ?? []).map((section) => {
            const anchorConcepts = section.anchorConceptIds.map((conceptId) => moduleConcepts.find((concept) => concept.id === conceptId)).filter(Boolean) as ConceptRecord[];
            const anchorDiagrams = section.anchorDiagramIds.map((diagramId) => moduleDiagrams.find((diagram) => diagram.id === diagramId)).filter(Boolean) as DiagramRecord[];
            return (
              <Card className="border-border/70 bg-card/82" key={section.id}>
                <CardHeader className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">{section.id}</Badge>
                    <CardTitle className="text-[1.45rem]">{section.title}</CardTitle>
                  </div>
                  <CardDescription className="text-base">{section.summary}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm leading-7 text-foreground/85">{section.body}</p>
                  <div className="flex flex-wrap gap-2">
                    {anchorConcepts.map((concept) => <Badge key={concept.id} variant="outline">{concept.title}</Badge>)}
                    {anchorDiagrams.map((diagram) => <Badge key={diagram.id} variant="accent">{diagram.title}</Badge>)}
                  </div>
                </CardContent>
              </Card>
            );
          })}
          {!moduleDetail ? (
            <Card className="border-border/70 bg-card/82">
              <CardContent className="space-y-4 p-6">
                <p className="text-sm leading-7 text-muted-foreground">这个模块已经有结构化知识点和图表，但还没有写成完整课程脚本。</p>
                <p className="text-sm leading-7 text-foreground/85">下一步最合适的动作，是把当前模块按“概念解释 - 图表动作 - 小练习”拆成 2 到 3 个短章节。</p>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[32px] border border-border/70 bg-card/80 p-6 shadow-soft backdrop-blur md:p-8">
          <SectionTitle eyebrow="Concepts" title="知识点卡片" description="每个概念都已经拆成适合解释和可视化的最小单位。" />
          <div className="mt-6 grid gap-4">
            {moduleConcepts.map((concept) => (
              <Card className="border-border/70 bg-card/82" key={concept.id}>
                <CardHeader className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{concept.visualType}</Badge>
                    <Badge variant="secondary">{concept.chapter}</Badge>
                  </div>
                  <div className="space-y-3">
                    <CardTitle className="text-[1.35rem]">{concept.title}</CardTitle>
                    <CardDescription className="text-base">{concept.plainExplanation}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-7 text-foreground/85">{concept.whyItMatters}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="rounded-[32px] border border-border/70 bg-card/80 p-6 shadow-soft backdrop-blur md:p-8">
          <SectionTitle eyebrow="Diagrams" title="图表与表现形式" description="这里决定的是每个概念更适合 2D、2.5D 还是 3D，而不是先做炫技。" />
          <div className="mt-6 grid gap-4">
            {moduleDiagrams.map((diagram) => {
              const storyboard = moduleStoryboards.find((item) => item.diagramId === diagram.id) ?? null;
              return (
                <Card className="border-border/70 bg-card/82" key={diagram.id}>
                  <CardHeader className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <Badge variant="accent">{diagram.productionFormat}</Badge>
                      {storyboard ? <Badge variant="secondary">已有分镜</Badge> : null}
                    </div>
                    <div className="space-y-3">
                      <CardTitle className="text-[1.35rem]">{diagram.title}</CardTitle>
                      <CardDescription className="text-base">{diagram.purpose}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm leading-7 text-foreground/85">{diagram.interactionIdea}</p>
                    {storyboard ? <p className="text-sm leading-7 text-muted-foreground">已有分镜：{storyboard.scenes.length} 个场景，可直接进入设计讨论。</p> : null}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[32px] border border-border/70 bg-card/80 p-6 shadow-soft backdrop-blur md:p-8">
          <SectionTitle eyebrow="Exercises" title="适合先做的小练习" description="先做判断和对比类练习，不急着上复杂游戏规则。" />
          <div className="mt-6 grid gap-4">
            {(moduleDetail?.exerciseIdeas ?? []).map((exercise) => (
              <Card className="border-border/70 bg-card/82" key={exercise}>
                <CardContent className="p-5 text-sm leading-7 text-foreground/85">{exercise}</CardContent>
              </Card>
            ))}
            {!(moduleDetail?.exerciseIdeas?.length) ? (
              <Card className="border-border/70 bg-card/82"><CardContent className="p-5 text-sm leading-7 text-muted-foreground">当前模块的练习想法还在补，先从图表理解和短病例分流入手最合适。</CardContent></Card>
            ) : null}
          </div>
        </div>

        <div className="rounded-[32px] border border-border/70 bg-card/80 p-6 shadow-soft backdrop-blur md:p-8">
          <SectionTitle eyebrow="Next" title="建议接着学什么" description="这能直接决定后续的模块连接和首页学习路径设计。" />
          <div className="mt-6 grid gap-4">
            {relatedModules.map((relatedModule) => (
              <Link className="block" href={`/modules/${relatedModule.id}`} key={relatedModule.id}>
                <Card className="border-border/70 bg-card/82 transition-transform duration-200 hover:-translate-y-1">
                  <CardHeader className="space-y-3">
                    <Badge className="w-fit rounded-full px-3 py-1" variant="outline">Next Module</Badge>
                    <CardTitle className="text-[1.35rem]">{relatedModule.title}</CardTitle>
                    <CardDescription className="text-base">{relatedModule.premise}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-7 text-foreground/85">{relatedModule.targetOutcome}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
            {!relatedModules.length ? (
              <Card className="border-border/70 bg-card/82"><CardContent className="p-5 text-sm leading-7 text-muted-foreground">这个模块的后续路径还没细化，当前建议从首页继续回到全局学习地图。</CardContent></Card>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}
