---
status: complete
created: '2026-01-11'
tags: []
priority: medium
created_at: '2026-01-11T11:05:49.654Z'
updated_at: '2026-01-11T11:38:22.376Z'
transitions:
  - status: in-progress
    at: '2026-01-11T11:31:42.095Z'
  - status: complete
    at: '2026-01-11T11:38:22.376Z'
completed_at: '2026-01-11T11:38:22.376Z'
completed: '2026-01-11'
---

# dependency-analyze-brief-plan

> **Status**: ✅ Complete · **Priority**: Medium · **Created**: 2026-01-11

> **状态**: 📅 Planned · **优先级**: Medium · **创建**: 2026-01-11

## 概述

代码转写工程量很大，必须先形成稳定、可复用的分析与转写流程。该流程以依赖关系为主线，先建立单文件层面的可靠方法，再据此组织整体转写顺序，避免盲目推进与返工。最终产出应能直接指导后续每个文件的分析与转写，并给出模块级到文件级的路线图。

## 目标

制定一个通用于所有代码文件（单个 TypeScript 源码）的计划，并明确单文件工作流与整体路线图的产出形式与验证方式。

对于一个文件，计划应至少包括以下几个方面，并形成可复用模板：

【ℹ️第一个：使用`npx tsc <文件的路径> --noEmit`检查文件的语法问题，对比其自Java源码转译的准确程度（本身只是一个半成品，绝大多数不能拿来用）】
【ℹ️第二个：基于语法中体现的符号依赖关系，整理各TypeScript文件之间的依赖关系，如`Concept`中报告缺少符号`Term`，则`Concept`依赖于`Term`】
【ℹ️第三个：对比java-dep-graph中的依赖关系描述，确认TypeScript代码的依赖关系（有些模块中可能在代码上依赖，而实际数据结构并不依赖，如`Term`中依赖`Operator`是因为其中几个常量依赖了`Operator`）】
【ℹ️另外，还有代码分析与转写所涉及的相关资源：（Java意义上要纳入在内的）依赖（如转写`Concept`需要参考`Term`）、对应的Java源码（如转写`Concept.ts`要参考对应的`Concept.java`）】
【ℹ️有关代码具体的运作逻辑，以java-master中对应的Java源文件为准。后续可能需要读取Java源文件，简述其中的功能（分析中需要一个「从Java得来的功能描述」小节）】
【❓其他需要在代码分析时要做的、能保证「保持功能不变、运作逻辑不变地将Java代码转写为TypeScript代码」的工作，都要写进这个计划之中，针对具体的文件，步步为营，稳扎稳打】

【ℹ️最后：根据依赖结构，分析出要转写Java代码到TypeScript代码的顺序，形成粗略的「转写路线图」到roadmap.md：从大模块如`io`入手，先给出类似`io`→`entity`这样的依赖链条，再逐步细化到具体的依赖关系】

## 反目标

- ❌不应修改代码，只能读取代码以进行分析
- ❌不应脱离在java-master的源头代码，单独进行分析

## 设计

本 spec 以“方法模板 + 路线图”的形式组织输出：单文件工作流明确可重复的分析步骤，路线图承载模块到文件的转写顺序。依赖依据同时来自 TypeScript 语义与 java-dep-graph 结果，并以 java-master 源文件的功能描述作为语义一致性基准。所有内容只做分析与规划，不涉及代码修改。

## 计划

<!-- 将实现拆分为步骤 -->

<!-- 提示：如果计划超过 6 个阶段或本 spec 接近 400 行，请考虑子 spec：
     - IMPLEMENTATION.md 用于详细实现
     - 参考 .lean-spec\references\sub-spec-files.md 的拆分指南 -->

- [x] 明确输出物清单与归属位置：spec003 的计划/测试补全、可复用单文件方案模板、`specs/003-dependency-analyze-brief-plan/workflow/roadmap.md` 路线图更新。
- [x] 阅读并抽取 spec003 的目标/反目标与用户批示，归纳必须步骤与禁止边界，作为后续模板约束。
- [x] 盘点并归档参考输入源：`specs/003-dependency-analyze/README.md`、`specs/003-dependency-analyze/plan.md`、`specs/003-dependency-analyze/java-dep-graph/deps.xml`。
- [x] 形成单文件“分析与转写方案”固定步骤模板，至少覆盖：
      - `npx tsc <文件路径> --noEmit` 的语法检查要点
      - 基于符号与语义的 TS 依赖梳理
      - 与 `deps.xml` 的依赖对照与“表面依赖”剔除
      - Java 对应源文件定位与“从 Java 得来的功能描述”小节
      - 行为一致性风险点清单与本文件在路线图中的位置
- [x] 汇总“保持功能不变”的检查点清单：常量导致的表面依赖、继承/接口隐式依赖、静态初始化与默认值等。
- [x] 定义路线图产出粒度与格式：先模块链条（如 `io`→`entity`），再细化到具体文件依赖顺序，并标注依赖来源（TS/Java graph）。
- [x] 将模板与清单写入 spec003 的“计划/测试”，并据依赖结构更新 `specs/003-dependency-analyze-brief-plan/workflow/roadmap.md` 与 `specs/003-dependency-analyze-brief-plan/workflow/to_single_file.md`。

## 测试

<!-- 如何验证完成？ -->

- [x] spec003 的“计划”条目能覆盖用户批示中的所有必备环节，且每一步可映射到单文件分析流程。
- [x] 单文件方案模板可独立复用，包含语法检查、TS 依赖梳理、Java 依赖对照、Java 功能描述与一致性风险点。
- [x] `specs/003-dependency-analyze-brief-plan/workflow/roadmap.md` 给出模块级链条并细化到文件级顺序，能被 `deps.xml` 复核。

## 备注

<!-- 可选：调研结论、备选方案、未决问题 -->

- 已将用户批示中的关键步骤整合为单文件工作流与路线图模板，详见 `specs/003-dependency-analyze-brief-plan/workflow/to_single_file.md` 与 `specs/003-dependency-analyze-brief-plan/workflow/roadmap.md`。
