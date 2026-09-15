# 临时诊断产物归档说明

归档日期：2026-09-15

本次整理只处理工作区中未被 Git 追踪的临时产物，以及可重建的 TypeScript 编译缓存。临时产物移至仓库同级目录 `OpenNARS-304-ts-local-archive-20260915`，不进入 Git；已经提交的历史证据不在本次范围内。

## 归档范围

- `reports/20260822-085153.md`、`091238.md`、`092520.md`、`094252.md`：早期未纳入提交的阶段报告，保留用于历史追溯。
- `reports/evidence/` 下 497 个未被 Git 追踪的文件，约 1.23 GB：补充矩阵、原始 trace、标准输出、错误输出、性能剖析、旧日志和诊断编译产物。其中 79 个原本已被全局 `*.log` 规则忽略，11 个是 `.class` 文件；它们同样不属于仓库内容，也一并移出。
- `output/` 下 31 个文件，约 4.56 MB：旧的命令输出和实验摘要。
- `META-INF/MANIFEST.MF`：从 Java 产物或解包目录遗留的 manifest，不是 TypeScript 产品文件。
- 下表 18 个一次性诊断脚本，约 128 KB：脚本源码和对应证据已经足够完成当时的定位，当前主线工具可以重放必要结论。

已有 879 个 `reports/evidence/` 文件已经被 Git 追踪，本次不移动、不删除，也不改写历史。`reports/evidence/` 中的 `.class` 文件属于诊断编译产物，随未被追踪证据一并归档；`.gitignore` 已阻止以后新增同类文件进入工作区候选。

## 一次性诊断脚本

| 脚本 | 诊断用途 | 归档理由 |
| --- | --- | --- |
| `scripts/check-public-api.mjs` | 旧的构建后公共 API 冒烟检查 | 已由 `scripts/check-built-api.mjs` 维护，避免保留重复入口 |
| `scripts/e2e/ConceptBagCycleTraceRunner.java/.mjs` | Java/TS ConceptBag 周期窗口与取出顺序对照 | 一次性调度定位；通用 corpus 和阶段摘要工具已覆盖主线验收 |
| `scripts/e2e/ConceptBagSchedulerProbe.java/.mjs` | ConceptBag 快照、任务取出及调度顺序探针 | 只服务特定周期的选择顺序假设，不是稳定验收接口 |
| `scripts/e2e/ConceptBudgetTraceRunner.java/.mjs` | ConceptBag 预算与 TermLink 轨迹对照 | 只服务 toothbrush2 的预算分叉定位，结论已保存在证据和报告中 |
| `scripts/e2e/JavaDirectUnifyDiagnostic.java` | Java 变量统一假设的直接验证 | 一次性根因探针，不属于可重复的产品测试入口 |
| `scripts/e2e/NalCycleWindowTraceRunner.java/.mjs` | Java/TS 归一化事件的周期窗口对照 | 当前 `NalStageDigestRunner` 与 corpus runner 已提供更稳定的观测面 |
| `scripts/e2e/NalStageCounterRunner.java/.mjs` | 131072 周期计数、窗口和追加周期探针 | 长周期实验脚本，当前基线证据及阶段工具已固定验收口径 |
| `scripts/e2e/NalTargetIntroDebug.mjs` | NAL 目标引入路径临时调试 | 仅为特定目标链添加观测，不应作为长期 runner |
| `scripts/e2e/NalTargetTraceRunner.java/.mjs` | Java/TS 目标任务派发轨迹对照 | 一次性目标派发诊断，通用 runner 已足够重放结果 |
| `scripts/e2e/NalTraceOnProbe.mjs` | NAL `on` 与输出路径探针 | 针对单一输出路径的临时观测，非产品接口 |
| `scripts/e2e/NalTraceRandomProbe.java` | Java `Random` 调用次数与随机分叉假设 | 只验证过渡性假设，不能替代固定输入的 parity 测试 |
| `scripts/e2e/NalTraceVariableProbe.mjs` | TypeScript 变量和随机调用轨迹对照 | 与 Java 随机探针成对的一次性实验，结论已沉淀 |

表中带 `.java/.mjs` 的一行表示两个同名配对脚本，实际归档文件共 18 个。若未来需要重放某一历史诊断，应从归档取回脚本，在隔离目录运行，并把可复用的最小测试、摘要和命令说明审慎移回 Git；不要重新提交原始大 trace。

## 其他清理决策

- `tsconfig.tsbuildinfo` 是 `tsc` 生成的增量缓存，已从 Git 索引移除但保留在本机，今后可由构建重新生成。
- `src/language/Image.ts` 的单行注释空格差异没有语义影响，按当前工作约定保留在工作区，留待后续代码编辑一并处理。
- 本次归档不改变 Java/TypeScript 逻辑、不改变 M1/M2 证据结论，也不启动高内存测试。
