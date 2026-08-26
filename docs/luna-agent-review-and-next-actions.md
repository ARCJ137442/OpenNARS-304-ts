# 致 GPT-5.6 Luna Agent：历史阶段审阅意见

> **封存文档**：本文只反映 2026-08-22、TypeScript `main@b9a9f33` 时的审阅结论。其 40%—45% 估算、问题清单和下一阶段要求均已被后续 Git 历史取代；当前事实见[当前状态](current-status.md)。

- 日期：2026-08-22
- 适用项目：`opennars-304-ts`
- 审阅范围：截至 TypeScript `main@b9a9f33`、Java `master@a2d76a2` 的迁移工作、测试与阶段报告

## 一、审阅结论

你已经把项目从“静态文件转写”推进到“真实 Node 主链可运行、局部 Java/TypeScript 算法可对照、NAL runner 可诊断”的阶段。提交边界清楚，多数局部修复能够追溯到 Java 源码，并且你主动声明不能把局部成功外推为整机等价。这些工作应保留，不建议重写。

目前需要纠正的不是总体方法，而是证据口径和根因收敛速度。当前最可信的总体工程进度约为 **40%—45%**：36项总体退出条件中，16项完成、9项部分完成、11项未验证。旧 LeanSpec 的7/9完成只能说明旧规格生命周期，不能代表整机完成度。

下一阶段请停止扩大无证据的迁移范围，集中处理以下主线：

1. 重建可复现的 Java 3.0.4 行为基线。
2. 修正 runner 的异常、超时和 marker 计数语义。
3. 沿 TermLink/RuleTables 路径定位 `toothbrush.nal` 的结构性崩溃。
4. 形成可重放的245个主资源 NAL 结果矩阵。
5. 在上述门禁通过后，再处理插件、长期稳定性和发布。

## 二、已经完成且应当保留的工作

- 保留 `ce1d0f7`、`458dca5` 及其后续运行时边界修复，不做无证据重写。
- 保留 B13—B15 等迁移模式，但要把“文档模式”和“扫描器已自动检测”分开表述。
- 保留30项当前 Node 回归测试和局部 Java/TS 算法 parity；它们是定位工具，不是整机验收。
- 保留 NAL runner 的逐文件、分块、超时和 `matched[]` 设计方向。
- 保留对 `toothbrush`、`detective2`、`vision` 的失败分类，不把异常、超时和 marker 缺失合并成一个“失败”。
- 保留最小修复原则：先证明偏差，再改动，再补局部测试，最后进入 NAL。

## 三、必须修正的报告口径

### 1. 不再使用旧规格完成率代表总体进度

| 口径 | 当前值 | 可表达的含义 |
| --- | ---: | --- |
| LeanSpec 状态 | 7/9 | 旧规格生命周期 |
| Spec 复选项 | 51/59 | 文档、计划和局部实现事项 |
| 总体退出条件 | 16完成、9部分、11未验证，共36项 | 整机工程进度 |

对外统一报告：严格完成率44.4%，复杂度加权约40%—45%。

### 2. 不再把历史244/244当作当前 NAL 通过率

主资源语料实际为245个：

- `single_step`：215；
- `multi_step`：24；
- `application`：5；
- `stability`：1。

`src/test` 另有1个 `.nal`，当前 corpus runner 不遍历它。历史报告虽曾写“功能性244个对照通过”，但没有保留当前可重放矩阵，且后续 `toothbrush`、`detective2`、`vision` 结果与之冲突。因此，当前通过率应写成“待重跑”，不能沿用244/244。

### 3. 不再把局部 marker 出现解释为根因已经收敛

当前 `toothbrush` 在出现第一个 marker 后仍可能于 `RuleTables.detachmentWithVar` 访问未定义 component 时崩溃。这意味着 TermLink 索引、链接形状、链接构造和任务派发都仍是候选根因。请把“剩余问题只在目标任务派发”降级为待验证假设。

### 4. 单测通过与 TypeScript 可编译必须分列

- `npm test` 当前30/30，但只覆盖 `test/node/*.test.ts`。
- `test/entity/TLink.test.ts` 另有15项，独立执行会因 `TLink` 是运行时不存在的 interface 导出而失败。
- `npx tsc --noEmit` 当前仍有3698条诊断。

后续报告必须分别列出：统一入口发现数、通过数、未纳入测试、编译诊断数和运行时警告。

## 四、最高优先级：重建并验证 Java 3.0.4 基线

### 1. 当前已经确认的事实

- 当前 Java 源码 HEAD：`a2d76a246d830671142c61793e0c6aac058ba033`。
- `git describe`：`v3.0.4-28-ga2d76a24`，即 v3.0.4 之后另有28个提交；它是项目当前304分支，而非未经修改的发行标签。
- 当前 `pom.xml`：`org.opennars:opennars:3.0.4-SNAPSHOT`。
- 当前旧 JAR：`target/opennars-3.1.0-SNAPSHOT.jar`。
- 旧 JAR SHA-256：`796A3B20EE6ED7F8F6778367738AD728F0BFCC32CFAD99BACAEBEC41EBC7EB04`。
- 旧 JAR manifest：`Implementation-Version: 3.1.0-SNAPSHOT`，由 Maven 3.9.6、JDK 18.0.2 构建。
- 粗粒度去注释/空白比较旧 `sources.jar` 与当前源码：52个类近似一致、68个不同、7个只存在于旧 sources JAR。该扫描只能证明不能直接假定源码完全一致，不能代替行为比较。
- 当前 `mvn` 指向 `C:\B\J\mvn.cmd`，执行 `mvn -version` 即非零退出；正式编译前必须先修复 Maven 工具链。

可以采纳“旧 JAR 是此前用于304迁移、预期行为与304大体接近”的判断作为工作假设。不要把它直接判废；但由于版本元数据和源码差异存在，这个假设必须通过新旧 JAR 行为对照确认。

### 2. 编译原则

不得直接在当前 `java-master/target` 中覆盖旧 JAR。应在隔离 worktree 或临时副本中编译当前 `a2d76a2`，同时保留旧 JAR 为不可变历史基线。

推荐流程：

1. 按项目规则先创建专门 spec，例如“重建并验证 Java 304 canonical baseline”，更新到 `in-progress` 后再改代码。
2. 记录旧 JAR、旧 sources JAR、当前 `target/classes` 的路径、时间和哈希。
3. 为 Java 仓库建立指向 `a2d76a2` 的隔离 worktree，不修改现有 symlink 目标。
4. 使用与旧 JAR 相同的 JDK 18.0.2，并优先使用 Maven 3.9.6；先保证 `mvn -version` 正常输出。
5. 在隔离 worktree 执行：

   ```powershell
   mvn -Dmaven.test.failure.ignore=false clean verify
   ```

6. 不能仅依据 Maven 退出码判断测试通过。当前 POM 的 Surefire 配置包含 `testFailureIgnore=true`，还必须检查 `target/surefire-reports` 中的 failures 和 errors。
7. 记录新 JAR 的文件名、manifest、SHA-256、Java commit、JDK、Maven版本和完整命令。

如果构建失败，不要为“先得到一个 JAR”而随意修改 Java 业务源码。先把失败分类为：Maven安装、parent POM、依赖解析、插件/JDK兼容、Java编译或测试失败；只有确认是当前304源码自身的构建缺陷后，才建立独立 spec 修复。

### 3. 让 runner 支持旧、新 JAR 并行选择

当前以下脚本把 Java classpath 固定到 `java-master/target`：

- `scripts/parity/run-local-algorithm-parity.mjs`；
- `scripts/e2e/run-nal-corpus.mjs`。

请增加显式参数或环境变量，例如：

```text
--java-jar <path>
--java-classes <path>
--java-test-classes <path>
```

默认值可以暂时保持旧路径，但每次结果必须打印实际使用的绝对路径、文件哈希和 Java commit。禁止通过复制新 JAR 覆盖旧路径来“切换基线”，否则无法进行同轮 A/B 对照。

### 4. 新旧 JAR 的四层比对

#### 第1层：Java 自身测试

- 当前 Java 仓库有30个测试源文件。
- 新源码构建必须没有未解释的 JUnit failure/error。
- 记录被跳过或被 `testFailureIgnore` 掩盖的测试。

#### 第2层：局部算法快照

分别用旧 JAR 和新 JAR运行 `LocalAlgorithmParityRunner.java`，比较真值、预算和工具函数快照：

- 数值容差沿用 `1e-5`；
- 对象类型、字符串、布尔值和集合形状必须精确一致；
- 任何差异都要定位到 Java commit或版本差异，不能只写“变化不大”。

#### 第3层：代表性 NAL smoke

至少覆盖：

- 一个低成本 `single_step`；
- 一个 `multi_step`；
- `toothbrush.nal`；
- `detective2.nal`；
- `vision.nal` 的有界运行；
- `stability` 的短周期运行。

固定文件内容、内置周期、追加周期、超时、`Debug.TEST`、Nar标识和运行环境。分别保存旧 Java、新 Java、TypeScript三方结构化结果。

#### 第4层：245个主资源全量矩阵

smoke 没有未解释退化后，按215/24/5/1分层运行。每个文件至少记录：

```text
file
engine
artifact_sha256
expected
passed
matched[]
ok
error_type
timeout_ms
embedded_cycles
extra_cycles
duration_ms
```

### 5. 新 JAR 的启用门槛

“行为没有太大变化”必须落实为以下门槛：

- 新源码成功构建；
- Java测试无未解释 failure/error；
- 局部算法快照在既定容差内一致；
- 代表性 NAL 不新增异常、超时或 marker 退化；
- 全量矩阵不存在未解释的新旧 Java 差异；
- 所有允许差异都有明确来源、影响和用户批准。

决策规则：

- 全部门槛满足：将新编译的304 JAR设为 canonical Java 基线，更新 runner 默认配置和文档；旧 JAR继续保留为历史回归基线。
- 只有少量可解释差异：保留双基线，先明确项目选择“当前304源码行为”还是“历史发行行为”，经用户批准后再切换。
- 出现广泛或无法解释差异：不得切换；旧 JAR继续服务历史回归，但报告中必须注明其 manifest 为3.1.0，不能称为已证实的304构建。

生成 JAR 默认属于构建产物，不应自动提交到 Git。优先提交构建说明、哈希清单、runner配置和结构化结果；只有项目明确决定版本化二进制时才提交 JAR。

## 五、其余行动顺序

### P0：先闭合可复现基线

- 修复 Maven 可执行环境。
- 修复 `scripts/annotate-java-sources.mjs --check` 对 `java-master` symlink 报 `EISDIR`。
- 把 `test/entity/TLink.test.ts` 纳入统一入口，并纠正 interface 被当作运行时值的测试设计。
- 在报告中固定 Node、TypeScript、jree、JDK、Maven和操作系统版本。

### P4：再处理推理核心

- 为 `toothbrush` 建立“前提登记→TermLink创建→索引解析→RuleTables→目标派发”的分段事件轨迹。
- 先用 Java旧/新基线确认正确结构，再与TypeScript逐段比较。
- 修复必须有一个直接命中此前崩溃路径的持久回归测试。

### P5：修正 CLI 和 runner 验收语义

- `passed` 必须由最终 `matched[]` 计算，即使运行中途异常也不能丢失已匹配信息。
- 把异常、超时、marker缺失、Java/TS差异设为独立字段。
- 增加 `Nar.ask` 的端到端测试。
- parity 相同但双方都未命中 expected marker 时，不得计为功能通过。

### P6：最后做全量与长期验收

- 重跑245个主资源 NAL；另行处理 `src/test` 的1个夹具。
- `^anticipate` 不得长期停留为未披露的 NullOperator桩。
- stability、保存/加载、插件、感知和性能分别设门禁，不以短周期 smoke 代替长稳结果。

## 六、工作审视报告

### 原定目标

建立一个局部算法、Narsese语义、运行时行为和CLI输出均可与Java基线对照，且迁移错误可沉淀复用的TypeScript OpenNARS。

### 完成情况

- [x] 已完成：真实Node主链、30项局部回归、局部算法parity、NAL runner骨架和迁移模式库。
- [x] 已完成：若干有Java源码依据的空值、重载、继承、时态和变量替换修复。
- [ ] 未完成：Java源码与实际JAR基线的可复现绑定。
- [ ] 未完成：TypeScript全量编译、统一测试入口和完整RuleTables稳定性。
- [ ] 未完成：245+1 NAL、插件、长稳、性能和发布验收。

### 发现的问题

| 严重程度 | 具体问题 | 根本原因 | 改进建议 |
| --- | --- | --- | --- |
| 必须改正 | 报告将局部marker改善进一步解释为根因已收窄到任务派发 | 缺少分段结构轨迹和修复前后控制实验 | 保留多种候选根因，提交持久化链路轨迹 |
| 必须改正 | Java runner使用未与当前源码绑定的预编译JAR | 没有把Java构建产物视为版本化实验输入 | 隔离重编304源码，新旧JAR四层A/B对照后再切换 |
| 必须改正 | 历史244/244没有当前可重放结果矩阵 | 阶段报告替代了机器可读证据 | 保存逐文件JSON矩阵并在每次核心修改后重跑 |
| 应当改正 | `npm test`遗漏15个当前失败的TLink用例 | 测试发现范围没有作为门禁 | 统一入口、明确未纳入测试和运行时类型边界 |
| 应当改正 | 扫描器退出0被描述成迁移风险“通过” | 统计工具和质量门禁未区分 | 为必须为0的模式增加阈值和非零退出 |
| 应当改正 | 3698条tsc诊断没有进入总体完成度 | strip-types可运行被误当成TypeScript可编译 | 编译、运行、语义三条进度线分开报告 |

### 做得好的地方

- 坚持最小修复并保留既有资产。
- 能从NAL失败追溯到Java/TypeScript运行时边界。
- 建立了局部算法和端到端差分的基本工具链。
- 主动承认全量语义等价尚未完成。
- 提交和阶段报告总体可追溯。

### 下次重点关注

- 第一优先级不是继续改TypeScript，而是先完成新旧Java JAR的可重复A/B基线实验。
- 每个结论同时给出artifact hash、commit、命令、环境、样本和结构化结果。
- `toothbrush` 未形成分段轨迹前，不再宣称根因已经锁定。
- 245个NAL没有当前矩阵前，不再报告整库通过率。

## 七、下一批交付物

下一批至少应交付：

- [ ] Java 304基线重建 spec及其阶段提交；
- [ ] Maven/JDK可复现环境记录；
- [ ] 旧JAR、新JAR的manifest和SHA-256清单；
- [ ] 旧Java/新Java/TypeScript三方局部算法结果；
- [ ] 代表性NAL三方smoke矩阵；
- [ ] 是否切换canonical Java基线的明确结论；
- [ ] runner可选择Java artifact的实现和测试；
- [ ] `toothbrush` 分段轨迹及最小回归；
- [ ] 更新后的总体36项进度矩阵；
- [ ] 按项目要求完成检查、报告、约定式提交和推送。

完成上述交付前，请保持 `v0.1.0` 标签不动，也不要把局部测试增加解释为项目版本已经达到新的发布门槛。
