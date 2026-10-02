# Bag 词项键判等探查（2026-10-02）

## 已证实的瓶颈

当前核心源码 `17b5fb2`（证据文档提交后 `ba45979`，生产代码相同）在固定 CartPole 20 ticks × 5 cycles 下约 `4.5–4.8 RPS`。`--cpu-prof` 的主线程 13165 个采样中，`Bag.findEquivalentKey` 自耗 2862、`CompoundTerm.equals` 2569、`runtimeValueEquals` 2422、`Bag.putIn` 1695。原始 profile 为 `reports/evidence/cpu-prof-bag-records-20261002/CPU.20261002.225722.24268.0.001.cpuprofile`；带 profiler 的本轮结果为 `reports/evidence/demo-workload-bag-records-profile-20261002.json`，`4.509 RPS`，后 10 ticks 仅 `0.573 TPS`，概念数升至 2296。旧分支计数记录 `findEquivalentKey` 1963438 次调用、649606 次 full scan；这不是本提交现跑计数，仅用于定位。

真实 Chrome 30 秒、固定 seed `3040304`：CartPole 同步 5 cycles/步、目标 20 TPS，实际 `0.532 TPS`、`2.661 wall RPS`、概念数至 2284；Microworld 同步 10 cycles/步、目标 20 TPS，前 15 秒三个窗口依次 `19.77/19.55/19.34 TPS`，后 15 秒降至 `7.39/1.40/0.20 TPS`，概念数至 1949。原始结果在 Demo Lab 的 `test-results/{cartpole,microworld}-sync-bag-clock-20261002.json`；Demo 源码当时未提交，不能当作最终发布测量。画面 FPS 约 56，瓶颈是推理长尾而非画面刷新。

## 合同与候选

`runtimeValueEquals` 对任意对象保留左右两个方向的 `equals` 检查，不能全局删掉其中一个。`Term.equals` 要求**同一具体构造器、相同复杂度、相同 UTF-16 文本**；`CompoundTerm.equals` 要求同一具体构造器与文本；`Variable.equals` 还检查作用域。因此在 Bag 的 full-scan 中，**仅当两端均为 Term 且具体构造器不同**时提前跳过，是两方向均不可能相等的局部 fast path，不改变同类的复杂度或作用域检查。其他键继续走完整 `runtimeValueEquals`。先做同配置 A/B；没有重复超过 5% 的收益或合同回退就撤销。

下一步测量这个候选，随后运行 Bag/Map/Term 直接合同、非增量 typecheck、TS-only 与含 Java M2、受影响 NAL，再决定是否进入最终 M1′/markerless/浏览器门。任何新源码改动都需重新验证；上一提交的 M1′ 证据不能自动迁移。

## 交叉复测与当前出口

在同一 Windows/Node 22.17.0、同一 CartPole 20 ticks × 5 cycles 输入下，按“基线→候选→撤销候选重跑基线→恢复候选重跑”顺序测得：

| 轮次 | 基线 RPS | 候选 RPS | 提升 | 概念数（终点） |
| --- | ---: | ---: | ---: | ---: |
| 1 | 4.043 | 9.316 | 130.4% | 2296 / 2296 |
| 2 | 4.856 | 8.904 | 83.4% | 2296 / 2296 |

原始 JSON 依次为 `reports/evidence/bag-term-fastpath-{baseline,candidate,baseline-recheck,candidate-recheck}-20261002.json`，SHA-256 依次为 `EB4D76BFE7C29B5AEB29965F8283A6594EF7301C413215EF9818FFB3B39C7827`、`32F8958D9101E403883ADA81A7CB9AD535C3997C434F2DF307982F60D5DA0AEA`、`E92D002ECC9BBBF8D5ED30E38DFA6E1082E9467DACA13E25E066C3FEE1D9FE07`、`8FF3461204B1935571460A1DF639E0BF6747010496741DA81A567ECB8E5C650E`。基准脚本只记录 HEAD（此时 `ba45979`），候选为未提交源码；该 dirty-source 身份必须与本文件和 patch 一起阅读，不能把 HEAD 误当候选源码。

`Bag.ts` 的候选只在 full-scan 中对两端均为 `Term` 且构造器不同的对象早退；不同类型的普通键、同构造器的 Term/Variable 和 hash 不同的恢复态键仍走原判等。新增直接合同覆盖“同文本不同具体 Term 类型不相等”和“同构造器、hash 改变的恢复态 Term 仍可取回”；Bag 本文件 18/18、相关直接合同首轮 32/32、非增量 typecheck 通过。尚未跑完整 M2、NAL、M1′ 或浏览器，不能宣称候选已验收。

该候选随后通过正式 build、dist API、jree 审计 `0/0` 与平台审计 `coreCandidateFiles=0`、`mixedBoundaryFiles=0`。TS-only M2 为 `507 passed / 2 skipped / 0 failed`，TAP SHA-256 `F35E8C05644190A71AA7EB405A80AEAFAF61F0345E9E8590A69FCC939B42C6AD`；含 Java M2 为 `509/509 passed`，TAP SHA-256 `A2053AF4A1FA16E44F0E4BBAD7F77008CCD4ABF4B17C7CF0C14BC119B3259109`。原始 TAP 为同前缀 `reports/evidence/bag-term-fastpath-{ts-only,java}-m2-20261002.tap`。此时仍是 dirty-source 候选；需提交固定 SHA 后再跑 M1′、strict markerless、降周期 #245 和浏览器。上一轮 Bag `recordsForView()` 的证据不转移到这个源码变更上。

## 固定提交的保护门（进行中）

候选提交为 `41070c1`，M1′ 243 项主体在该提交上退出码 0、`243/243` functional/parity 通过，timeout、process_limit、exception、stall、not_run 均为 0；逐项耗时合计 `900,996 ms`，单文件峰值 RSS `508,129,280 bytes`。原始 checkpoint `reports/evidence/m1prime-bag-term-fastpath-20261002.jsonl`，SHA-256 `70CAA047B56B349EE80698B112F629A51750E6A4FE16CCB18144BE205A6BCCE5`。#25 已单独启动；#246、#245 降周期、strict markerless 和浏览器仍未在该提交上完成，不能把主体矩阵当作最终发布通过。

#25 `nars_multistep_3.nal` 在同一提交独立退出码 0、functional/parity 通过；`406,699 ms`、实际 `502,562` 周期、峰值 RSS `494,428,160 bytes`，无 timeout/process_limit/exception/stall/not_run。checkpoint `reports/evidence/m1prime-bag-term-fastpath-extra25-20261002.jsonl`，SHA-256 `9702A7E2F7DE81AFF62180F8D2114F2338483817D95E369DF4365AD1AA3CC4CA`。上一候选约 538 秒，本次约短 24%，但这不是交叉 A/B；#246 正在串行运行。

#246 `simpleOperationTest.nal` 退出码 0，functional/parity 通过，`22,115 ms`、实际 `51,564` 周期、峰值 RSS `436,101,120 bytes`，无 timeout/process_limit/exception/stall/not_run。checkpoint `reports/evidence/m1prime-bag-term-fastpath-extra246-20261002.jsonl`，SHA-256 `2AD0AE4F3D1E559AAF53B6824B543CF8E04A495C5E0B90F53478C94269F3B229`。

#245 仍按降周期规则：同一 2048 夹具在该提交的 TS-only 冷进程耗时 `3,180 ms`、实际 `2,473` 周期、峰值 RSS `290,295,808 bytes`，无失败分类；checkpoint `reports/evidence/m1prime-bag-term-fastpath-long-2048-estimate-20261002.jsonl`，SHA-256 `DBBEFC9CE0525260A392492180C56BC93705006DFD0F582947C4E7E3F8B92A63`。按 2048→65536 步线性外推约 `102 s`，低于 `1200 s` 启动阈值，因此已启动完整 65536 降载夹具，仍设置 `1800 s` 安全限；这不是原始 2,000,000 周期验证。

65536 降载夹具已在 `41070c1` 退出码 0，functional/parity `1/1` 通过，TS 实际运行 `110,854 ms`、`67,510` 推理周期、峰值 RSS `398,467,072 bytes`；无 timeout、process_limit、exception、stall、not_run。冻结 Java 本次未重跑，所用 baseline SHA-256 `048C804D91986FBD597593C4CAE174D37DF09AA91D38560C433057945DF2F84E`。checkpoint `reports/evidence/m1prime-bag-term-fastpath-long-65536-20261002.jsonl`，SHA-256 `83DBE2152B57ABB5CDA71F36B51AEAD38A9F2BC7D70DEA4287176B06893C66F7`。2048 步预测约 102 秒，实际约 111 秒；按实际时间外推原始 2,000,000 步约 56 分钟，超过本阶段 30 分钟阈值，故原版仍列 `not_run`，不得以本降载结果代称。

同一提交的 strict markerless 两项均退出码 0、各跑满 `131,072` 周期并与对应冻结 Java 摘要逐窗口 `equal=true`：`simpleOperationTest.nal` 128 窗口、2,535,970 事件，TS JSONL SHA-256 `B71878257F96B82F6F9330F24442934D0F293F1B069B96B9070495536A599140`；`nal6.redundant.nal` 128 窗口、589,572 事件，TS JSONL SHA-256 `08F79BFDB69949DF609A57C12E8F6FAD0AB4EC9FC0B984DEA6D9795904E97ABA`。原始输出为 `reports/evidence/markerless-bag-term-{simple,redundant}-ts-20261002.jsonl`，比较结果为同前缀 `*-compare-20261002.json`，两比较文件 SHA-256 均为 `9631076595A4FAD6432EAA7E18C5B2DB836FA4B7FE37F0369A462BC8BFFA0388`。其中 redundant 必须对比归档的 `g0-nal6-redundant-java-131072-20260917.jsonl`，不能用另一夹具的 `long-java.jsonl`。到这里，本候选的核心语义门已完成；尚未在真实浏览器用当前核心 Worker 验证 Demo 性能与功能，也未证明性能收敛。
