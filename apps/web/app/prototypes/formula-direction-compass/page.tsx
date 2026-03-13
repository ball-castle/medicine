import { FormulaDirectionPrototype, PrototypePageLayout } from "@/features/prototypes";

export default function FormulaDirectionCompassPrototypePage() {
  return (
    <PrototypePageLayout
      actions={[
        { href: "/modules/formula-logic", label: "返回方药模块" },
        { href: "/practice/formula-direction-basic", label: "打开方药练习", variant: "outline" },
      ]}
      eyebrow="Prototype"
      intro="这个页面的目标不是讲完所有方，而是验证一个教学动作：用户能不能先在空间里看懂“外开、和解、通降、守根”，再去理解为什么同样叫治病，动作却完全不是一回事。"
      stats={[
        { value: "5", label: "核心方义" },
        { value: "4", label: "罗盘象限" },
        { value: "3", label: "观察镜头" },
        { value: "MVP", label: "第二批原型" },
      ]}
      subtitle="把桂枝、麻黄、承气、四逆先讲成方向动作，而不是功效词表。"
      title="方剂方向罗盘原型"
    >
      <FormulaDirectionPrototype />
    </PrototypePageLayout>
  );
}
