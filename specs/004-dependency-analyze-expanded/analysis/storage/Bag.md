# src/storage/Bag.ts 分析

## 1. 基础信息

| 字段 | 内容 |
| --- | --- |
| TypeScript 文件 | `src/storage/Bag.ts` |
| 对应 Java 源文件 | `java-master/src/main/java/org/opennars/storage/Bag.java` |
| 模块链路 | `language 基座 -> entity -> storage` |
| 分析时间 / 执行人 | `2026-01-11 / ChatGPT Codex` |
| 参考资料 | `ts-analysis.json` · `specs/002-ts-progress-report/progress.md` · `deps.xml` |

## 2. 语法检查（`npx tsc src/storage/Bag.ts --noEmit`）

- 执行的命令：`npx tsc src/storage/Bag.ts --noEmit`
- 关键输出：
  - 无报错
- 总结：命令通过，未触发额外依赖。；已通过 `npx tsc --noEmit` ; 暂无针对性测试

## 3. TypeScript 依赖梳理

### 3.1 结构性依赖

| 符号 | 来源文件 | 触发位置 | 依赖原因 |
| --- | --- | --- | --- |
| `Item` | `src/entity/Item.ts` | import | 结构性：Bag 直接使用 Item 的主流程 |
| `Distributor` | `src/storage/Distributor.ts` | import | 结构性：Bag 直接使用 Distributor 的主流程 |
| `Parameters` | `src/main/Parameters.ts` | import | 结构性：Bag 直接使用 Parameters 的主流程 |

### 3.2 表面依赖（常量/调试/枚举等）

| 模块 | 用途 | 备注 |
| --- | --- | --- |
| `jree` | 环境桩 | 提供 Java 兼容运行时 |

### 3.3 缺失符号 / 未决依赖

（无缺失符号，报错均与语法结构相关。）

## 4. Java 依赖对照（`deps.xml`）

- 直接依赖：
- `storage/Bag` -> `inference/BudgetFunctions`（deps.xml 第 1364 行）
- `storage/Bag` -> `entity/Item`（deps.xml 第 1365 行）
- `storage/Bag` -> `storage/Distributor`（deps.xml 第 1366 行）
- `storage/Bag` -> `storage/Memory`（deps.xml 第 1367 行）
- `storage/Bag` -> `parameter/Parameters`（deps.xml 第 1368 行）
- 交叉校验：
- TS 额外依赖：main/Parameters
- Java graph 额外依赖：inference/BudgetFunctions、parameter/Parameters、storage/Memory

## 5. Java 功能说明

- **职责概述**：文件工作：验证 Bag/Memory/Distributor 的容量、顺序与线程安全，补完断言和测试。；TODO 2 处
- **关键数据结构**：
- 以函数或常量导出为主，未声明 class。
- **核心流程 / 算法**：
  1. 依赖准备：依赖：entity/Item.ts, storage/Distributor.ts, main/Parameters.ts
  2. 文件工作：验证 Bag/Memory/Distributor 的容量、顺序与线程安全，补完断言和测试。；TODO 2 处
  3. Java-TS 差异：参见《通用转译法.md》 - 存储结构
- **重要不变量 / 约束**：保持 Java 行为一致，注意初始化顺序与线程语义。
- **协作接口**：依赖 `entity/Item, main/Parameters, storage/Distributor` 衔接上下游。

## 6. 一致性风险

- 文件内仍保留 2 处 TODO，需对照 Java 填补。

## 7. 路线图定位

- 1. 依赖准备：依赖：entity/Item.ts, storage/Distributor.ts, main/Parameters.ts
- 2. 文件工作：验证 Bag/Memory/Distributor 的容量、顺序与线程安全，补完断言和测试。；TODO 2 处
- 3. Java-TS 差异：参见《通用转译法.md》 - 存储结构

## 8. 附加记录

- ts-analysis: LOC=356 · TODO=2
- 参考文件：`java-master/src/main/java/org/opennars/storage/Bag.java`
