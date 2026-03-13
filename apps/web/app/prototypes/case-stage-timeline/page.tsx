import { CaseStageTimelinePrototype, PrototypePageLayout } from "@/features/prototypes";
import { getSiteContent } from "@/lib/content";

export default async function CaseStageTimelinePrototypePage() {
  const { caseStudies } = await getSiteContent();
  const totalStages = caseStudies.reduce((count, caseStudy) => count + caseStudy.stages.length, 0);

  return (
    <PrototypePageLayout
      actions={[
        { href: "/modules/cases-and-application", label: "返回医案模块" },
        { href: "/cases", label: "打开病例目录", variant: "outline" },
        { href: "/practice/cases-stage-rhythm-basic", label: "打开医案练习", variant: "outline" },
      ]}
      eyebrow="Prototype"
      intro="这个页面不是在替代完整病例播放器，而是在验证更核心的一层：用户能不能看懂为什么同一个病例走到不同阶段，主轴、动作和排错逻辑都会跟着变。"
      stats={[
        { value: String(caseStudies.length), label: "病例样本" },
        { value: String(totalStages), label: "阶段节点" },
        { value: "3", label: "观察镜头" },
        { value: "MVP", label: "第二批原型" },
      ]}
      subtitle="把病例里的定主轴、分阶段、转方和排错理由放进同一条时间线。"
      title="医案分阶段时间线原型"
    >
      <CaseStageTimelinePrototype caseStudies={caseStudies} />
    </PrototypePageLayout>
  );
}
