---
status: complete
created: '2026-01-11'
tags: []
priority: medium
created_at: '2026-01-11T21:55:14.000Z'
updated_at: '2026-01-11T22:04:54.442Z'
transitions:
  - status: in-progress
    at: '2026-01-11T22:01:33.116Z'
  - status: complete
    at: '2026-01-11T22:04:54.442Z'
completed_at: '2026-01-11T22:04:54.442Z'
completed: '2026-01-11'
---

# ts-java-source-headers

> **Status**: ✅ Complete · **Priority**: Medium · **Created**: 2026-01-11

## 概述

在 opennars-304-master 下记录并自动化注释每个 TypeScript 源文件及其上游 Java 类路径的过程，以便审阅者可以将任何代码追溯到原始实现。 ts-analysis.json 将充当事实来源，并且自动化必须在无法找到 Java 文件时发出警告。

## 目标

- 构建从 src/*.ts 到 org/opennars/**/*.java 的确定性映射，捕获任何手动异常，例如 types.ts 或 TruthValueTerm.ts。
- 发送一个可重复的脚本，插入或刷新 //! Java source: ... 每个映射的 TypeScript 文件上的标头。
- 通过验证（差异审查加脚本模式）保护工作流程，以便立即报告丢失的标头或不匹配的情况。

## 反目标

- 除了新的标头注释之外，请勿更改任何运行时逻辑或 Java/TypeScript 实现。
- 不要猜测不存在的 Java 文件；跳过没有工作映射的文件并将它们记录在规范/报告中。
- 不要触及自动化脚本或必要元数据之外的测试、文档或包。

## 设计

- 使用 ts-analysis.json 条目将 ts_path 导出到 java_path；去掉 /org/ 之前的所有内容以及前缀 opennars/ 以形成注释路径。
- 通过读取 java-master 文件来解析 java-master 目录，以便工作树始终找到正确的同级存储库。
- 插入表头时，确保其成为第一行；保留现有的换行符，并在存在冲突的注释时退出。
- 为没有 Java 对应项的文件维护一个明确的允许/跳过列表，并在执行期间打印它们以供将来跟踪。

## 计划

- [x] 扫描 ts-analysis.json 和 java-master 以列出每个可映射的 ts_path 以及规范化的 Java 路径。
- [x] 编写例外情况（types.ts、entity/TruthValueTerm.ts、未来的例外）并决定后备注释。
- [x] 实现插入标头、支持空运行模式并输出摘要计数的 Node/TS 脚本。
- [x] 在更新模式下运行脚本，检查差异，并在标记完成之前将结果记录在报告/规范中。

## 测试

- [x] 使用 --check 运行注释脚本以确认每个 TS 文件具有预期的标头。
- [x] 执行 python script/checking/*.py 以确保编码和格式检查保持绿色。

## 备注

- ts-analysis.json 镜像当前的 src 树；如果出现新的 TypeScript 文件，请重新运行生成器。
- 使例外列表与报告保持同步，以便未来的规范知道为什么某些文件缺少注释。
