import { FushenRightDescendPrototype, PrototypePageLayout } from "@/features/prototypes";

export default function FushenRightDescendPage() {
  return (
    <PrototypePageLayout
      actions={[
        { href: "/modules/fu-yang-core", label: "返回 fu-yang-core 模块" },
        { href: "/prototypes/guizhi-vs-fuzi", label: "回看桂附对照", variant: "outline" },
        { href: "/prototypes/fu-yang-action-triad", label: "打开三动作总览", variant: "outline" },
      ]}
      eyebrow="Prototype"
      intro="这个页面专门处理一个容易被忽略的问题：不是所有局面都适合立刻开门或归根。很多时候，需要先把上部乱象收下来、右侧带下去，让系统从“太躁太浮”变成“可继续处理”的状态。"
      nextSection={{
        eyebrow: "Next Build",
        title: "如果方向成立，下一步怎么继续",
        description: "缓转动作已经补齐，下一步最值钱的工作是让用户开始用它做判断，而不是继续只看图。",
        items: [
          "把“开、归、缓转”三动作总览页接进具体案例，训练用户何时先稳局面。",
          "把一个“上热下寒、心神不宁”的案例接进来，训练用户先判断更适合哪种动作。",
          "把这些原型进一步收成更短的入门互动脚本，开始为真实用户测试做准备。",
        ],
      }}
      stats={[
        { value: "1", label: "右降滑杆" },
        { value: "3", label: "讲解焦点" },
        { value: "3", label: "过渡状态" },
        { value: "MVP", label: "缓转动作图" },
      ]}
      subtitle="第五张关键原型，负责把“缓转过渡”补进扶阳动作链。"
      title="茯神法右降路径图原型"
      validateSection={{
        eyebrow: "What To Validate",
        title: "这张图当前主要验证什么",
        description: "它主要验证用户能否理解：有些时候最重要的不是猛进，而是先让局面缓下来。",
        items: [
          "用户是否能看出“右降”与“开门”“归根”不是同一个方向动作。",
          "滑杆和路径线是否足够清楚地表达“缓缓带下、先稳局面”的过程感。",
          "用户是否会自然接受它的过渡性角色，而不是误以为它是终局方案。",
        ],
      }}
    >
      <FushenRightDescendPrototype />
    </PrototypePageLayout>
  );
}
