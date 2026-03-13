import { GuizhiFuziCompare, PrototypePageLayout } from "@/features/prototypes";

export default function GuizhiVsFuziPage() {
  return (
    <PrototypePageLayout
      actions={[
        { href: "/modules/fu-yang-core", label: "返回 fu-yang-core 模块" },
        { href: "/prototypes/guizhi-gate-animation", label: "看桂枝细版", variant: "outline" },
        { href: "/prototypes/fuzi-root-return", label: "看附子细版", variant: "outline" },
        { href: "/prototypes/fushen-right-descend", label: "看茯神缓转", variant: "outline" },
        { href: "/prototypes/fu-yang-action-triad", label: "打开三动作总览", variant: "outline" },
      ]}
      eyebrow="Comparison"
      intro="这个页面不是新的知识点，而是把已经做出来的两张动作图压到同一个坐标系里。它的目标很直接：让用户一眼分清桂枝法解决“没路”的问题，附子法解决“没根”的问题。"
      nextSection={{
        eyebrow: "Next Build",
        title: "如果方向成立，下一步怎么继续",
        description: "双图页现在已经接进三动作总览，接下来最值钱的是把它们变成真正的判断训练。",
        items: [
          "把一个典型“上热下寒”的病例接到双图页上，让用户先判断更偏开门还是更偏归根。",
          "把双图页收成三动作总览里的一个对照步骤，而不是让用户在多个页面之间迷路。",
          "把这页收成更短的教学模式，做成真正的 1 分钟入门互动。",
        ],
      }}
      stats={[
        { value: "1", label: "统一进度" },
        { value: "3", label: "对照视角" },
        { value: "2", label: "核心动作" },
        { value: "1", label: "双图记忆入口" },
      ]}
      subtitle="把“开门”和“归根”放进同一页面，直接建立动作差异。"
      title="桂枝 vs 附子"
      validateSection={{
        eyebrow: "What To Validate",
        title: "这张对照页当前主要验证什么",
        description: "这里不是新增理论，而是验证用户能否在最短时间内建立动作边界。",
        items: [
          "用户是否会把“开门”和“归根”自动和不同问题配对，而不是只记成两种热药。",
          "统一进度条是否足够帮助用户看到两个动作的方向差异，而不是只看形状差异。",
          "双图页是否能成为后续病例推演和练习的稳定入口。",
        ],
      }}
    >
      <GuizhiFuziCompare />
    </PrototypePageLayout>
  );
}
