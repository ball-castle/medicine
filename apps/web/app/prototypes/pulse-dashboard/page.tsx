import { PrototypePageLayout, PulseDashboardPrototype } from "@/features/prototypes";

export default function PulseDashboardPrototypePage() {
  return (
    <PrototypePageLayout
      actions={[
        { href: "/modules/diagnostic-judgment", label: "返回诊断模块" },
        { href: "/practice/diagnostic-axis-basic", label: "打开诊断练习", variant: "outline" },
        { href: "/cases/pulse-axis-priority-case", label: "打开脉象病例", variant: "outline" },
      ]}
      eyebrow="Prototype"
      intro="这张图验证的不是“会不会背脉名”，而是用户能不能把判断顺序排对。只要顺序一乱，后面的方药、病例和复盘都会被一并带偏。"
      stats={[
        { value: "4", label: "脉象轮廓" },
        { value: "4", label: "舌象窗口" },
        { value: "3", label: "判断顺序" },
        { value: "MVP", label: "第二批原型" },
      ]}
      subtitle="先抓脉象主轴，再让舌象辅助，最后把病名标签压回后位。"
      title="脉诊总开关面板原型"
    >
      <PulseDashboardPrototype />
    </PrototypePageLayout>
  );
}
