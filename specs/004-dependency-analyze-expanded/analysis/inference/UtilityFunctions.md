# src/inference/UtilityFunctions.ts 分析

## 1. 基础信息

| 字段 | 内容 |
| --- | --- |
| TypeScript 文件 | `src/inference/UtilityFunctions.ts` |
| 对应 Java 源文件 | `java-master/src/main/java/org/opennars/inference/UtilityFunctions.java` |
| 模块链路 | `language 基座 -> entity -> inference 推理层` |
| 分析时间 / 执行人 | `2026-01-11 / ChatGPT Codex` |
| 参考资料 | `ts-analysis.json` · `specs/002-ts-progress-report/progress.md` · `deps.xml` |

## 2. 语法检查（`npx tsc src/inference/UtilityFunctions.ts --noEmit`）

- 执行的命令：`npx tsc src/inference/UtilityFunctions.ts --noEmit`
- 关键输出：
  - 无报错
- 总结：命令通过，未触发额外依赖。；已通过 `npx tsc --noEmit` ; 暂无针对性测试

## 3. TypeScript 依赖梳理

### 3.1 结构性依赖

| 符号 | 来源文件 | 触发位置 | 依赖原因 |
| --- | --- | --- | --- |
| `Parameters` | `src/main/Parameters.ts` | import | 结构性：UtilityFunctions 直接使用 Parameters 的主流程 |

### 3.2 表面依赖（常量/调试/枚举等）

| 模块 | 用途 | 备注 |
| --- | --- | --- |
| `jree` | 环境桩 | 提供 Java 兼容运行时 |

### 3.3 缺失符号 / 未决依赖

（无缺失符号，报错均与语法结构相关。）

## 4. Java 依赖对照（`deps.xml`）

- 直接依赖：
- `inference/UtilityFunctions` -> `parameter/Parameters`（deps.xml 第 507 行）
- 交叉校验：
- TS 额外依赖：main/Parameters
- Java graph 额外依赖：parameter/Parameters

## 5. Java 功能说明

- **职责概述**：文件工作：复制规则/真值/预算静态表并完善类型约束与数值校验。
- **关键数据结构**：
- `UtilityFunctions` · 继承：JavaObject · 实现：（无接口）
- **核心流程 / 算法**：
  1. 依赖准备：依赖：main/Parameters.ts
  2. 文件工作：复制规则/真值/预算静态表并完善类型约束与数值校验。
  3. Java-TS 差异：参见《通用转译法.md》 - 推理规则
- **重要不变量 / 约束**：保持 Java 行为一致，注意初始化顺序与线程语义。
- **协作接口**：依赖 `main/Parameters` 衔接上下游。

## 6. 一致性风险

- 主要风险来自尚未补齐的 Java 语义与单元测试缺失。

## 7. 路线图定位

- 1. 依赖准备：依赖：main/Parameters.ts
- 2. 文件工作：复制规则/真值/预算静态表并完善类型约束与数值校验。
- 3. Java-TS 差异：参见《通用转译法.md》 - 推理规则

## 8. 附加记录

- ts-analysis: LOC=93 · TODO=0
- 参考文件：`java-master/src/main/java/org/opennars/inference/UtilityFunctions.java`
