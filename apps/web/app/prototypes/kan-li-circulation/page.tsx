import { KanLiPrototype } from "@/features/prototypes";
import { PrototypePageLayout } from "@/features/prototypes";

export default function KanLiCirculationPrototypePage() {
  return (
    <PrototypePageLayout
      actions={[
        { href: "/modules/fu-yang-core", label: "返回 fu-yang-core 模块" },
        { href: "/storyboards", label: "看对应分镜", variant: "outline" },
      ]}
      eyebrow="Prototype"
      intro="这个页面先验证一件事：用户能不能在没有大量术语灌输的情况下，看懂“上下既济”“交通中断”“逐步回接”，以及为什么这会自然分出“开门”和“归根”两个不同动作。"
      nextSection={{
        eyebrow: "Next Build",
        title: "如果方向成立，下一步怎么继续",
        description: "不需要立刻做复杂 3D，先把教学动作和导览脚本做顺。",
        items: [
          "把当前状态和后续桂枝法、附子法原型做成强链接，形成完整学习链路。",
          "加入更轻的语音式导览文案，让第一次进入的用户不需要自己摸索界面含义。",
          "决定是否升级成更有层次的 2.5D 视差场景，强化上下空间感和阻断感。",
        ],
      }}
      stats={[
        { value: "3", label: "状态模式" },
        { value: "4", label: "讲解焦点" },
        { value: "1", label: "恢复滑杆" },
        { value: "MVP", label: "扶阳核心图" },
      ]}
      subtitle="第二张真正可玩的核心图，负责把扶阳主线讲成空间结构。"
      title="坎离水火交通图原型"
      validateSection={{
        eyebrow: "What To Validate",
        title: "这张图当前主要验证什么",
        description: "这里先验证“交通”这个概念能不能被直观看懂，而不是先验证术语记忆量。",
        items: [
          "用户是否能区分“上面更热”与“根里更有力”不是同一个判断。",
          "恢复滑杆是否真的能帮助理解“重新接通”是一个过程，而非一个结论。",
          "用户是否会自然理解为什么后续会分出“开门”和“归根”两种不同动作。",
        ],
      }}
    >
      <KanLiPrototype />
    </PrototypePageLayout>
  );
}
