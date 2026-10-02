# 下一批性能与集合合同探查（2026-10-02）

## 接手点

- 当前源码提交：`ce448b6`；跟踪文件干净，历史未跟踪证据不清理。
- 已验收中期候选：M1′ 主体 `243/243`、额外两项 `2/2`；TS-only M2 `506/508`（2 skipped）、Java M2 `508/508`。
- Demo 同步 TPS 仍远低于 15，不能由中期门禁推断性能目标完成。
- LeanSpec board 将 020、027、031 标为 complete；这表示历史规格状态，不覆盖本轮更严格的持续性能目标。

## 当前可复核的热点

`reports/evidence/cpu-prof-post-constructor-20261002/CPU.20261002.101249.2148.0.001.cpuprofile` 的 26025 个 CPU 样本中，自耗样本最多的是：`Bag.findEquivalentKey` 6611、`CompoundTerm.equals` 5947、`runtimeValueEquals` 4516、`Bag.putIn` 1965。此为旧候选 `080981f` 的采样，不是当前 HEAD 的实时性能结论；用于选调查方向。

`Bag.findEquivalentKey` 先调用 `NativeMap.get(key)`，再检查当前值的 `name()`；随后查 `equalityBuckets`，最后可能全表遍历 `nameTable.entrySet()`。`NativeMap` 自身已按 `hashCode` 维护候选桶，同时保留无 hash 键的相等扫描。Bag 另有 `equalityBuckets` 和 `itemOrder`，涉及恢复态及插入顺序，不可凭直觉移除。

已否决的命中后直接返回保留键方案见 `docs/probes/20261001-runtime-java-shape-cleanup.md`：同口径短测 `2.542 RPS`，低于已接受的 `2.593 RPS`；没有新证据前不重试。

## 下一次可证伪实验

1. 在唯一临时测量分支中仅统计 `findEquivalentKey` 的 direct、bucket、rebuild、full-scan 分支次数与耗时；固定 CartPole 输入、ticks/cycles、Node 版本，保留基线提交和 RSS。
2. 若 full-scan/重建确实占主要成本，先写出 Java `equals/hashCode`、恢复态键、插入顺序、可变迭代器的直接合同，再设计一个不改变查找语义的批量优化。若非主要成本，转向 `CompoundTerm.equals` 的调用链与概念增长。
3. 候选先做同配置 A/B、直接合同与 typecheck；只有确有收益且无回退，才运行 TS M2、Java M2、受影响 NAL、M1′ 与 Demo 浏览器门。所有长测单进程、独立证据前缀、可恢复。

原始 2,000,000 周期稳定性测试仍不宣称完成。当前尚不能宣称同步 TPS 达到 15，也不能宣称三轮低收益收敛已发生。

## 2026-10-02 受控实验结果

临时分支计数（**dirty-source 诊断，不是可发布性能数字**）：20 ticks × 5 cycles 共调用 `findEquivalentKey` 1,963,438 次，其中 direct 1,313,329、full-scan 649,606、bucket miss 503。10-tick 分类显示 full-scan 键均为具有 `hashCode` 的对象，包括 Term、Inheritance、SetExt、SetInt、TermLink 和 Task；不是字符串键扫描。临时计数代码已从 `Bag.ts` 撤回，原始 stdout 和配置存于 `reports/evidence/bag-lookup-*20261002*`。

安全候选保留全表查找与恢复态语义，只把 `findEquivalentKey` 和 `rebuildEqualityBucket` 的 `entrySet()` 包装遍历改为只读的 `NativeMap.recordsForView()` 遍历；按同一插入顺序读取原始 key，没有改变相等判定。现有 Bag/NativeMap 直接合同 `28/28`、非增量 typecheck 通过。两轮交叉 A/B（20 ticks × 5 cycles、Node 22.17.0、同一输入）如下：

| 次数 | 原版 RPS | 候选 RPS | 候选相对提升 | 原版/候选后 10 ticks TPS |
| --- | ---: | ---: | ---: | ---: |
| 1 | 3.827 | 4.797 | 25.3% | 0.478 / 0.609 |
| 2 | 3.834 | 4.753 | 24.0% | 0.478 / 0.604 |

四份原始 JSON 分别为 `reports/evidence/bag-records-{baseline,candidate,baseline-recheck,candidate-recheck}-20261002.json`。各自 SHA-256：`E5E4DB177C800DB08A5190A3FCAFB96B43D6C3E8DCEE7EFC1508584F87E410B0`、`66542A37E775041D9621255949BCC303C6B4C7FC73DA0CB9711F823A4CA6DC4F`、`0F0230CCEB3A33687F330D884A1E872575C39D9A9C04F562F93193B570C60CDB`、`61E9EA912B54BDF2E7048F51DE68D7B48FB4AEB6D5AF0C3347992423FE3DA4E5`。

本候选的 TS-only M2 `506 pass / 2 skip / 0 fail`；Java M2 `508/508`；build、dist API、jree `0/0` 和平台 `coreCandidateFiles=0`、`mixedBoundaryFiles=0` 通过。M2 TAP SHA-256 分别为 `136C45AD501F58FBFD2463AFF9D50CAA5EDB7A76B9F2AAE041FFF54B2D1159A8` 与 `710E5730219520FDDBEB67C298E3FDB2EC20D5D37C4A5C77163DCA52E484C0A6`。这些检查发生于候选未提交源码；M1′、strict markerless、Demo 浏览器门以及目标同步 TPS 仍未完成，因此不能把候选称为最终发布版本。下一步先提交可追溯的候选源码，再在该不可变提交上运行 M1′。

## 2026-10-02 已提交候选的 M1′ 主体

候选已提交为 `17b5fb2`，当前 `main` 比 `origin/main` 领先两个提交；跟踪源码在 M1′ 期间保持不变。PC 上以冻结 Java baseline `264A3998076869683B374F65584BAA4C0939BF3567E3FC3B76883789A4AEB954` 执行 243 项保护矩阵，进程退出码 0，`243/243` 功能与 parity 通过；timeout、process_limit、exception、stall、not_run 均为 0。逐项耗时合计 `1,129,028 ms`，单项峰值 RSS `475,336,704 bytes`。原始 checkpoint：`reports/evidence/m1prime-bag-records-20261002.jsonl`，SHA-256 `F0EF026199253E2A93BB14657843612FA647768ECC71D089D9C0386CABD63F9C`；标准输出与标准错误为同名前缀 `.stdout.log` / `.stderr.log`。#25、#246、strict markerless 和浏览器门仍未在该提交上完成，不能宣称完整 M1′ 或发布验收完成。

#25 `nars_multistep_3.nal` 随后单独在 `17b5fb2` 运行，退出码 0，functional/parity 均通过；`538,253 ms`，峰值 RSS `460,144,640 bytes`，无 timeout/process_limit/exception/stall/not_run。原始 checkpoint 为 `reports/evidence/m1prime-bag-records-extra25-20261002.jsonl`，SHA-256 `CFE4CF4042DA8D0FA342A577493337710CB0C861F91C2B6DE68C792A778F78A7`。与中期候选的约 624 秒相比缩短，但输入与执行环境差异尚未被控制为 A/B，不能据此归因。#246 正在串行运行。

#246 `simpleOperationTest.nal` 在相同源码提交上退出码 0，functional/parity 均通过；`32,473 ms`，峰值 RSS `357,531,648 bytes`，无 timeout/process_limit/exception/stall/not_run。原始 checkpoint 为 `reports/evidence/m1prime-bag-records-extra246-20261002.jsonl`，SHA-256 `9723E2DD0992399673126F2C53F5FD4FE229221DF0EF225FE7171384DB5C9C62`。M1′ 组合的 243 主体、#25 与 #246 均已通过；严格 markerless 与 #245 估算/降周期实验仍单列，不将它们计入这 245 个通过项。

严格 markerless 两项均在 `17b5fb2` 现跑 TypeScript 131072 周期、128 个窗口、`incomplete=false`：`simpleOperationTest.nal` 为 `2,535,970` 事件，对仓库已存 canonical Java 摘要 `equal=true`；`nal6.redundant.nal` 为 `589,572` 事件，对归档中冻结的 Java 摘要 `equal=true`。TS 原始摘要分别是 `reports/evidence/markerless-bag-records-{simple,long}-ts-20261002.jsonl`，SHA-256 分别为 `B71878257F96B82F6F9330F24442934D0F293F1B069B96B9070495536A599140`、`08F79BFDB69949DF609A57C12E8F6FAD0AB4EC9FC0B984DEA6D9795904E97ABA`。`nal6.redundant.nal` 的 Java 基线是仓库外 `OpenNARS-304-ts-evidence-archive/g0-nal6-redundant-java-131072-20260917.jsonl`，SHA-256 `6E48849B1A46328BEB39D40D4496DA1B6E342879EB94BE311DF0DF1E85037A87`。曾误将它与另一样本的 Java 摘要比较，产生 `markerless-bag-records-long-compare-20261002.json` 的 `pre` 事件数不符；该错误配对不是语义回退，正确比较文件是 `markerless-bag-records-redundant-compare-20261002.json`，`first_difference=null`。#245 降周期估算、Demo 浏览器与最终发布门仍待执行。

#245 使用 `reports/probes/long_term_stability-65536.nal`，先将唯一的内嵌 `65536` 改成 `2048`，生成不纳入产品的估算夹具 `reports/probes/long_term_stability-2048-20261002.nal`（SHA-256 `5C0E235D097AC8590175D27B79490800F8A1739A7FA769172905A63CA8A95873`）。TS-only 冷进程以额外 1 周期执行，观测 `2473` 周期、`4,927 ms`、峰值 RSS `256,053,248 bytes`；没有 timeout/process_limit/exception/stall。按内嵌步数线性外推约 `158 s`，低于启动阈值 `1200 s`，因此已启动完整 65536 夹具；实际耗时可能因概念增长显著超过线性估算，仍以 `1800 s` 为安全上限。Java 对照不重新运行，而从 `reports/evidence/m1-c740c42-long-65536-correct-20260929.jsonl`（SHA-256 `31D7722739C04E63EE220B7362FD7EC3157AC0E8C0A4C3752A559495EA314CA5`）提取既有 canonical Java 行，生成注明来源的单行冻结对照 `reports/evidence/frozen-java-long-65536-from-c740c42-20261002.jsonl`（SHA-256 `048C804D91986FBD597593C4CAE174D37DF09AA91D38560C433057945DF2F84E`）。它是历史结果的格式转换，不是新 Java 实测。

完整 65536 夹具在 `17b5fb2` 上以 TS-only 冷进程完成，退出码 0、functional/parity 通过；实际 `67,510` 周期、`180,667 ms`、峰值 RSS `388,861,952 bytes`，timeout、process_limit、exception、stall、not_run 均为 0。原始 checkpoint 为 `reports/evidence/m1prime-bag-records-long-65536-20261002.jsonl`，SHA-256 `D6A2AC10CAF0134264466E38C4B4E22B7C3F140AC12DDB44FCE38193CD266CBB`。从 65536 外推原始 2,000,000 周期约 `92` 分钟，超过 30 分钟阈值，因此原始长周期本批不运行，状态保持 `not_run`，不能宣称原版完整长期稳定性通过。此时当前候选的 M1′ 组合、降低版 #245 和严格 markerless 均已有证据；真实 Demo 持续性能与发布门仍未闭合。
