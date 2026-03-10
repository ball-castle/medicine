# medicine

把《圆运动的古中医学》和《火神门系列医易互通》转化成面向大众的交互式学习项目。

当前仓库包含三层内容：

1. 原始资料层
   包括 PDF、OCR 文本、样张图片和摘要文档。

2. 结构化内容层
   把两本书拆成模块、知识点、图表清单和开发路线图。

3. Web 产品骨架
   一个基于 Next.js 的首页学习地图、模块页和分镜页，用来承载后续动态图表、课程和 3D 场景。

## 目录

```text
apps/web/                  Next.js 前端骨架
content/books/             书目元数据
content/cases/             病例推演数据
content/concepts/          核心知识点
content/diagrams/          图表重绘清单
content/modules/           学习模块
content/paths/             学习路线
content/practices/         练习题库
content/storyboards/       第一轮图表分镜数据
content/roadmap/           开发路线图
docs/core_curriculum.md    人读版知识点与图表清单
docs/content_coverage_map.md 两本书内容覆盖地图
docs/project_direction.md  产品方向规划
docs/terminology_glossary.md 统一术语表
docs/master_delivery_roadmap.md 项目总路线
docs/storyboards_round1.md 第一轮重点图分镜文档
packages/content-schema/   内容 schema 类型
tools/check-content.mjs    内容一致性校验脚本
tools/ocr_pdf.py           OCR 脚本
```

## 内容现状

- OCR 提取：
  - `.ocr/yy_full/combined.txt`
  - `.ocr/hs_full/combined.txt`
- 摘要：
  - `tcm_reading_summary.md`
- 结构化产品底盘：
  - `content/`
  - `docs/core_curriculum.md`
  - `docs/storyboards_round1.md`
  - `content/cases/case-studies.json`

## 前端命令

在仓库根目录执行：

```bash
npm install
npm run dev
```

其他命令：

```bash
npm run typecheck
npm run build
npm run content:check
```

## 当前页面

- `/`
  吸引力优先的首页门面
- `/experiences/intro-journey`
  60-90 秒沉浸式短体验入口
- `/modules/foundations`
  第一版模块页样例
- `/modules/fu-yang-core`
  扶阳模块页样例
- `/diagrams`
  图表目录页
- `/progress`
  学习进度页
- `/paths`
  学习路线目录
- `/paths/pulse-formula-case-loop`
  脉 -> 方 -> 案 首条学习闭环
- `/cases`
  病例推演目录
- `/cases/fu-yang-three-step-case`
  扶阳三步病例推演
- `/cases/warm-disease-protect-center-case`
  温病护中三段推演
- `/cases/pulse-axis-priority-case`
  脉象主轴优先病例推演
- `/practice/foundations-direction-basic`
  圆运动方向判断练习
- `/practice/fu-yang-triage-basic`
  扶阳病例分流练习
- `/practice/warm-disease-root-basic`
  温病与儿科根气判断练习
- `/practice/diagnostic-axis-basic`
  脉舌主次判断练习
- `/practice/formula-direction-basic`
  方药方向判断练习
- `/practice/cases-stage-rhythm-basic`
  医案先后手判断练习
- `/prototypes/circle-flow-map`
  圆运动总图交互原型
- `/prototypes/kan-li-circulation`
  坎离水火交通图交互原型
- `/prototypes/guizhi-gate-animation`
  桂枝法开门动画交互原型
- `/prototypes/fuzi-root-return`
  附子法归根动画交互原型
- `/prototypes/guizhi-vs-fuzi`
  桂枝法与附子法双图对照页
- `/prototypes/fushen-right-descend`
  茯神法右降路径图交互原型
- `/prototypes/fu-yang-action-triad`
  扶阳三动作总览页
- `/prototypes/formula-direction-compass`
  方剂方向罗盘交互原型
- `/prototypes/pulse-dashboard`
  脉诊总开关面板交互原型
- `/prototypes/case-stage-timeline`
  医案分阶段时间线交互原型
- `/prototypes/fu-yang-triage-practice`
  旧的扶阳练习别名页，会跳转到动态练习路由
- `/storyboards`
  第一轮重点图表分镜页

## 当前建议的产品路线

第一版不要直接做大型游戏，而是先做：

1. 首页吸引力入口
2. 60-90 秒沉浸式短体验
3. 首条完整学习路线
4. 圆运动总图动态图
5. 坎离水火交通图演示
6. 方剂方向罗盘与脉诊面板
7. 医案分阶段时间线与病例推演

等内容和图表结构稳定后，再加入病例推演和选择性的 3D 场景。
