import Link from "next/link";
import { notFound } from "next/navigation";
import type { BookRecord, ConceptRecord, DiagramRecord } from "@medicine/content-schema";

import { CaseStudyPlayer } from "@/features/cases";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCaseStudyHref } from "@/lib/cases";
import { getSiteContent } from "@/lib/content";

export async function generateStaticParams() {
  const { caseStudies } = await getSiteContent();
  return caseStudies.map((caseStudy) => ({ caseStudyId: caseStudy.id }));
}

export default async function CaseStudyPage(props: { params: Promise<{ caseStudyId: string }> }) {
  const { caseStudyId } = await props.params;
  const { books, caseStudies, concepts, diagrams, modules } = await getSiteContent();

  const caseStudy = caseStudies.find((item) => item.id === caseStudyId);
  if (!caseStudy) {
    notFound();
  }

  const module = modules.find((item) => item.id === caseStudy.moduleId) ?? null;
  const bookMap = new Map(books.map((book) => [book.id, book]));
  const conceptMap = new Map(concepts.map((concept) => [concept.id, concept]));
  const diagramMap = new Map(diagrams.map((diagram) => [diagram.id, diagram]));

  const focusBooks = caseStudy.bookIds.map((bookId) => bookMap.get(bookId)).filter(Boolean) as BookRecord[];
  const focusConcepts = caseStudy.focusConceptIds.map((conceptId) => conceptMap.get(conceptId)).filter(Boolean) as ConceptRecord[];
  const focusDiagrams = caseStudy.focusDiagramIds.map((diagramId) => diagramMap.get(diagramId)).filter(Boolean) as DiagramRecord[];
  const siblingCases = caseStudies.filter((item) => item.id !== caseStudy.id);

  return (
    <main className="mx-auto flex w-[min(1200px,calc(100vw-32px))] flex-col gap-6 py-8 md:py-10">
      <section className="grid gap-6 rounded-[36px] border border-border/70 bg-[linear-gradient(135deg,rgba(255,249,240,0.9),rgba(241,233,220,0.74))] p-6 shadow-soft backdrop-blur md:p-8 lg:grid-cols-[1.18fr_0.82fr]">
        <div className="space-y-6">
          <div className="space-y-4">
            <Badge className="rounded-full px-3 py-1" variant="accent">
              Case Study
            </Badge>
            <h1 className="font-display text-4xl leading-[0.96] tracking-[-0.05em] text-foreground md:text-6xl">
              {caseStudy.title}
            </h1>
            <p className="text-lg leading-8 text-foreground/86">{caseStudy.subtitle}</p>
            <p className="max-w-3xl text-base leading-8 text-muted-foreground">{caseStudy.summary}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/cases">返回病例目录</Link>
            </Button>
            {module ? (
              <Button asChild size="lg" variant="outline">
                <Link href={`/modules/${module.id}`}>回到 {module.title}</Link>
              </Button>
            ) : null}
            <Button asChild size="lg" variant="outline">
              <Link href="/diagrams">查看相关图表</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="border-border/70 bg-card/78">
            <CardHeader className="space-y-2">
              <CardTitle className="text-4xl">{caseStudy.stages.length}</CardTitle>
              <CardDescription>阶段节点</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-border/70 bg-card/78">
            <CardHeader className="space-y-2">
              <CardTitle className="text-4xl">{focusConcepts.length}</CardTitle>
              <CardDescription>锚点概念</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-border/70 bg-card/78">
            <CardHeader className="space-y-2">
              <CardTitle className="text-4xl">{focusDiagrams.length}</CardTitle>
              <CardDescription>回看图表</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-border/70 bg-card/78">
            <CardHeader className="space-y-2">
              <CardTitle className="text-4xl">{caseStudy.estimatedTime}</CardTitle>
              <CardDescription>建议时长</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      <CaseStudyPlayer caseStudy={caseStudy} />

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[32px] border border-border/70 bg-card/80 p-6 shadow-soft backdrop-blur md:p-8">
          <div className="space-y-3">
            <p className="font-display text-xs uppercase tracking-[0.24em] text-primary">Focus</p>
            <h2 className="font-display text-3xl leading-tight tracking-[-0.04em] text-foreground md:text-4xl">
              这组病例在练什么
            </h2>
            <p className="max-w-3xl text-base leading-8 text-muted-foreground">{caseStudy.targetSkill}</p>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {focusConcepts.map((concept) => (
              <Badge key={concept.id} variant="accent">
                {concept.title}
              </Badge>
            ))}
            {focusDiagrams.map((diagram) => (
              <Badge key={diagram.id} variant="outline">
                {diagram.title}
              </Badge>
            ))}
          </div>
          <div className="mt-6 grid gap-4">
            {focusBooks.map((book) => (
              <Card className="border-border/70 bg-card/82" key={book.id}>
                <CardHeader className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <CardTitle className="text-[1.35rem]">{book.shortTitle}</CardTitle>
                    <Badge variant="outline">{book.author}</Badge>
                  </div>
                  <CardDescription className="text-base">{book.focus}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        <div className="rounded-[32px] border border-border/70 bg-card/80 p-6 shadow-soft backdrop-blur md:p-8">
          <div className="space-y-3">
            <p className="font-display text-xs uppercase tracking-[0.24em] text-primary">Next</p>
            <h2 className="font-display text-3xl leading-tight tracking-[-0.04em] text-foreground md:text-4xl">
              看完这组病例后接着去哪
            </h2>
            <p className="max-w-3xl text-base leading-8 text-muted-foreground">
              当前病例不是孤立页面，它应该把用户重新带回模块、图表和下一组病例里。
            </p>
          </div>
          <div className="mt-6 grid gap-4">
            {module ? (
              <Card className="border-border/70 bg-card/82">
                <CardHeader className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <CardTitle className="text-[1.35rem]">{module.title}</CardTitle>
                    <Badge variant="outline">所属模块</Badge>
                  </div>
                  <CardDescription className="text-base">{module.targetOutcome}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline">
                    <Link href={`/modules/${module.id}`}>回到模块</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : null}
            {siblingCases.slice(0, 2).map((item) => (
              <Card className="border-border/70 bg-card/82" key={item.id}>
                <CardHeader className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <CardTitle className="text-[1.35rem]">{item.title}</CardTitle>
                    <Badge variant="outline">{item.stages.length} 阶段</Badge>
                  </div>
                  <CardDescription className="text-base">{item.summary}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline">
                    <Link href={getCaseStudyHref(item.id)}>打开这组病例</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
