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

四份原始 JSON 分别为 `reports/evidence/bag-records-{baseline,candidate,baseline-recheck,candidate-recheck}-20261002.json`。候选仍是未提交源码，尚未通过完整 M2、M1′、Demo 浏览器门，也未解决目标同步 TPS。后续先运行这些门；通过后才接受本轮收益。
