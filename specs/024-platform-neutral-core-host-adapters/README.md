---
status: complete
created: 2026-08-26
priority: high
tags:
- platform-neutral host-adapter milestone
depends_on:
- 019-tsc-zero-error-build
created_at: 2026-08-26T07:13:29.019152500Z
updated_at: 2026-09-29T17:11:27.178609400Z
completed_at: 2026-09-29T17:11:27.178609400Z
transitions:
- status: in-progress
  at: 2026-08-26T07:14:22.376590200Z
- status: complete
  at: 2026-09-29T17:11:27.178609400Z
---

# 平台中立核心与宿主适配

## 概述

建立不依赖 jree、Node.js 内置模块或终端运行时的推理核心，并由 Node.js 与浏览器分别提供宿主适配层。

## 目标

- 核心配置、Narsese 解析和推理运行在平台中立 TypeScript 中。
- Node.js CLI 负责文件与进程能力；浏览器 Worker 使用同一核心。
- 默认 `new Nar()` 不读取运行时文件，外部配置通过显式文本或宿主适配传入。
- 记录缺少宿主能力和无效配置的稳定错误契约。

## 反目标

- 不重写 NAL 推理算法。
- 不在本规格内进行性能优化。
- 不把浏览器 fake shim 继续作为最终架构。

## 设计约束

- 依赖方向固定为“数据结构与值对象 → 容器 → 推理规则 → 推理引擎 → 宿主入口”；底层模块不得反向导入 Node 或终端能力。
- 核心只接收配置文本、已解析配置对象和显式能力接口；文件、进程、终端和浏览器上传均由宿主层负责。
- 默认配置必须是可由核心直接取得的静态文本或原生对象，不得在 `new Nar()` 期间隐式读取文件。
- 与 023 的去 jree 化分开验收：本规格负责平台边界，023 负责 jree 运行时边界；二者在集成门禁汇合。

## 分阶段验收口径

- P0 必须输出核心、Node CLI、浏览器 Worker 的依赖清单，并区分生产路径、测试工具和开发脚本。
- P1 必须能以纯函数解析配置文本，以原生 TypeScript 类型创建 `Nar`；Node CLI 的文件读取只能发生在适配层。
- P2—P5 必须逐步消除浏览器可达路径上的 Node 内置模块 fake shim，并为缺少能力、无效配置和文件错误保留可诊断的错误类型。
- J/P 集成前不宣称浏览器发布完成；集成后再以 M1 246/246、M2 零诊断/构建/CLI/API 和依赖扫描共同验收。

## 计划

- [x] P0：盘点核心、Node CLI、浏览器入口的 jree 与平台依赖。
- [x] P1：实现纯文本配置解析、原生配置对象和默认配置路径。
- [x] P2：建立 NAL 文件/文本边界并收敛宿主文件能力。
- [x] P3：收敛插件与宿主能力注册契约。
- [x] P4：补齐浏览器配置文本/上传入口。
- [x] P5：移除浏览器可达路径上的 Node 内置模块 shim。

## 测试

- [x] P1 配置解析、默认配置同步、显式配置文本和非法路径单元测试通过。
- [x] P2-P5 的缺失宿主能力、无效配置细分契约和浏览器集成测试通过。
- [x] Node CLI、浏览器 Worker、M1 与 M2 回归不退化。
- [x] 核心生产依赖无 jree、Node fs/path/process/child_process/terminal 泄漏。
- [x] 集成门禁满足 M1-prime 244+1+1、M2 零诊断/构建/CLI/API。

## 备注

该规格与 023 并行推进；M3 性能优化须等待 J/P 集成门禁通过。

截至当前候选 `673d390`，P3 的实现已落地但阶段门仍未关闭：插件注册表已经显式支持 Java 构造参数类型与顺序、float32 边界收窄、非法参数/重复 classpath 诊断、缺少宿主能力与宿主命令异常的区分，并补齐 `Anticipate`、`Emotions`、`InternalExperience` 三个 Java 合法无参构造路径。相关局部测试为 `14/14`，串行单测为 `212/212`，非增量 typecheck 为 0 诊断，build、dist API、局部 parity 和 `vision.nal` 均通过。

P3 仍不能单独宣称完成，因为当前候选的 M1 保护矩阵为 245 个主资源中 244 个实际 marker parity，`long_term_stability.nal` 仍有进程资源上限与空 marker 观测缺口；P4、P5 以及 J/P 同提交集成回归尚未完成。P3 的实现、测试和当前候选证据应在后续与 M1 复验结果一起收口，而不是把局部通过率替代阶段门。

### 2026-09-29：P5 浏览器宿主 adapter 批次

在 web-demo 提交 `180924f` 中，将 Worker 构建脚本内联的 `virtualModules`、
`nodeShimPlugin` 和 `processShim` 替换为显式 `src/browser-adapters/*` 模块；默认配置通过
浏览器宿主 banner 注入，缺少文件/进程能力时抛出明确错误。Worker build、demo check、5 个
demo 单测和真实浏览器 Worker 输入/输出验证通过。

这只完成 P5 的 adapter 结构切片，浏览器 bundle 仍包含 jree 兼容桥，P3/P4、023/024
阶段门和集成 M1/M2 尚未完成，不能据此标记 spec024 complete。

### 2026-09-30：024 P3-P5 与 M1-prime 阶段门收口

P3 插件能力注册、P4 XML 配置上传和 P5 browser facade 已在 web-demo 当前构建中通过；Worker bundle 静态 `jree/node_modules` 命中为 0，Chrome Worker/Narsese smoke、check 和 5 项单测通过。当前阶段门采用显式 M1-prime：244 普通资源 + 正确 65536 降周期 #245 + #246，长期稳定性不运行原始 2M 负载。
