import { GuizhiGatePrototype } from "@/features/prototypes";
import { PrototypePageLayout } from "@/features/prototypes";

export default function GuizhiGateAnimationPrototypePage() {
  return (
    <PrototypePageLayout
      actions={[
        { href: "/modules/fu-yang-core", label: "返回 fu-yang-core 模块" },
        { href: "/prototypes/kan-li-circulation", label: "回看坎离交通", variant: "outline" },
        { href: "/prototypes/fuzi-root-return", label: "去看附子归根", variant: "outline" },
        { href: "/prototypes/guizhi-vs-fuzi", label: "打开双图对照", variant: "outline" },
        { href: "/prototypes/fu-yang-action-triad", label: "打开三动作总览", variant: "outline" },
      ]}
      eyebrow="Prototype"
      intro="这个页面不打算把桂枝法讲成药味背诵卡，而是先让用户明白：问题在于门轴卡住、内外不接，桂枝法的动作是把门拨开。只要这件事讲清楚，后面与附子法的区别就能站住。"
      nextSection={{
        eyebrow: "Next Build",
        title: "如果方向成立，下一步怎么继续",
        description: "单图和对照图已经成型，接下来该把它们挂进更真实的学习任务里。",
        items: [
          "把门轴阻力和阈值反馈做得更明显，强化“拨开”的力学感。",
          "把桂枝动作接进三动作总览页后的病例练习，让用户先判断它是否真的是“开门题”。",
          "把这张图重新挂回坎离主图和模块页，形成“先看结构，再做动作分流”的学习链路。",
        ],
      }}
      stats={[
        { value: "1", label: "拨门滑杆" },
        { value: "3", label: "讲解焦点" },
        { value: "3", label: "门轴状态" },
        { value: "MVP", label: "开门动作图" },
      ]}
      subtitle="第三张关键原型，负责把“开门拨机”讲成一眼能懂的动作。"
      title="桂枝法开门动画原型"
      validateSection={{
        eyebrow: "What To Validate",
        title: "这张图当前主要验证什么",
        description: "它主要验证“开门”这个动作能不能被看懂，而不是验证用户记了多少名词。",
        items: [
          "用户会不会自然把注意力放到门轴和开合，而不是直接把桂枝法理解成发汗按钮。",
          "滑杆和门板开启角度，是否足够清楚地表达“拨动”的过程感。",
          "用户是否能在同一张图上接受“开门”和“归根”是两个不同动作这一对照。",
        ],
      }}
    >
      <GuizhiGatePrototype />
    </PrototypePageLayout>
  );
}
