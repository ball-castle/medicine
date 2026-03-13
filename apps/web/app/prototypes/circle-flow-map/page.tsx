import { CircleFlowPrototype } from "@/features/prototypes";
import { PrototypePageLayout } from "@/features/prototypes";

export default function CircleFlowMapPrototypePage() {
  return (
    <PrototypePageLayout
      actions={[
        { href: "/modules/foundations", label: "返回 foundations 模块" },
        { href: "/storyboards", label: "看对应分镜", variant: "outline" },
      ]}
      eyebrow="Prototype"
      intro="这个页面的重点不是还原最终美术，而是验证教学动作本身是否成立：用户切换时令、调整中气、比较不同失衡模式后，能不能直觉地说出“先看整体运行，再看局部病名”。"
      nextSection={{
        eyebrow: "Next Build",
        title: "如果这张图方向成立，下一步怎么做",
        description: "不需要一次到位，先在这个原型上逐层加深。",
        items: [
          "把当前静态文字说明收敛成更短的引导脚本，适合真实用户首轮体验。",
          "把异常模式和症状外观做成连动，让用户看到“同病名不同结构”的差异。",
          "决定是否把流线动画进一步升级成更强空间感的 2.5D 或 3D 场景。",
        ],
      }}
      stats={[
        { value: "5", label: "时令焦点" },
        { value: "4", label: "观察模式" },
        { value: "1", label: "中气滑杆" },
        { value: "MVP", label: "首张可玩图" },
      ]}
      subtitle="第一张从“规划文档”真正走到“可操作界面”的图。"
      title="圆运动总图原型"
      validateSection={{
        eyebrow: "What To Validate",
        title: "这张图当前主要验证什么",
        description: "现在先验证学习动作正确，再决定它后面要往 SVG 动画还是轻 3D 场景继续做深。",
        items: [
          "用户能不能区分“该升不升”“该降不降”“中轴偏弱”这三种不同失衡。",
          "用户会不会把注意力自动落回中气和整体流线，而不是只看外圈节点。",
          "季节切换是否真的帮助理解五脏方向，而不是只是视觉换色。",
        ],
      }}
    >
      <CircleFlowPrototype />
    </PrototypePageLayout>
  );
}
