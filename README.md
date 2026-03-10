# medicine

把《圆运动的古中医学》和《火神门系列医易互通》转化成面向大众的交互式学习项目。

当前仓库包含三层内容：

1. 原始资料层
   包括 PDF、OCR 文本、样张图片和摘要文档。

2. 结构化内容层
   把两本书拆成模块、知识点、图表清单和开发路线图。

3. Web 产品骨架
   一个基于 Next.js 的首页学习地图，用来承载后续动态图表、课程和 3D 场景。

## 目录

```text
apps/web/                  Next.js 前端骨架
content/books/             书目元数据
content/concepts/          核心知识点
content/diagrams/          图表重绘清单
content/modules/           学习模块
content/roadmap/           开发路线图
docs/core_curriculum.md    人读版知识点与图表清单
docs/project_direction.md  产品方向规划
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

## 当前建议的产品路线

第一版不要直接做大型游戏，而是先做：

1. 首页学习地图
2. 圆运动基础模块
3. 圆运动总图动态图
4. 坎离水火交通图演示
5. 方剂方向罗盘练习

等内容和图表结构稳定后，再加入病例推演和选择性的 3D 场景。
