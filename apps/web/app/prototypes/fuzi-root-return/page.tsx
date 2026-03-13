import { FuziRootPrototype } from "@/features/prototypes";
import { PrototypePageLayout } from "@/features/prototypes";

export default function FuziRootReturnPrototypePage() {
  return (
    <PrototypePageLayout
      actions={[
        { href: "/modules/fu-yang-core", label: "返回 fu-yang-core 模块" },
        { href: "/prototypes/guizhi-gate-animation", label: "回看桂枝开门", variant: "outline" },
        { href: "/prototypes/guizhi-vs-fuzi", label: "打开双图对照", variant: "outline" },
        { href: "/prototypes/fu-yang-action-triad", label: "打开三动作总览", variant: "outline" },
      ]}
      eyebrow="Prototype"
      intro="这个页面专门让用户看懂一件事：附子法不是继续把系统往外拨，而是把浮散无根的阳往下收、往里归、让根部重新守住。只要这件事讲清楚，和桂枝法的差别就不再是文字概念。"
      nextSection={{
        eyebrow: "Next Build",
        title: "如果方向成立，下一步怎么继续",
        description: "单图、双图和三动作总览都已经搭起来，接下来该接进判断练习和病例。",
        items: [
          "把“归根题”和“开门题”放到同一组练习里，逼用户真正做动作判断。",
          "把“上热下寒、内外不通”的案例轻度挂进来，开始形成病例式学习入口。",
          "把这张图继续挂回三动作总览页，形成从主图到病例的稳定学习链。",
        ],
      }}
      stats={[
        { value: "1", label: "归根滑杆" },
        { value: "3", label: "讲解焦点" },
        { value: "3", label: "归根状态" },
        { value: "MVP", label: "归根动作图" },
      ]}
      subtitle="第四张关键原型，负责把“归根回阳”讲成和桂枝法完全不同的动作。"
      title="附子法归根动画原型"
      validateSection={{
        eyebrow: "What To Validate",
        title: "这张图当前主要验证什么",
        description: "它主要验证“归根”能不能被直观看懂，而不是继续被用户误解成“更热、更冲”。",
        items: [
          "用户是否能区分“上面发亮”与“根部有主”不是同一个判断。",
          "滑杆和下潜轨迹，是否足够清楚地表达“收回去、守下来”的过程感。",
          "用户是否能把这张图和桂枝法自动配对，形成“开门 vs 归根”的稳定记忆。",
        ],
      }}
    >
      <FuziRootPrototype />
    </PrototypePageLayout>
  );
}
