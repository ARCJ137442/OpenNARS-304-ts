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

## 下一候选：Term 类局部索引（待实现）

`07aceff`（生产源码仍为 `41070c1`）重新构建 Worker 后，真实 Chrome 30 秒固定 seed `3040304` 测得 Microworld 同步/10 周期/目标 20 TPS：平均 `11.520 TPS`，六个五秒窗口 `19.99/20.18/19.39/7.18/2.00/0.40 TPS`，概念到 2180，末窗 p95 `3178.6 ms`；CartPole 同步/5 周期：平均 `0.732 TPS`，末窗 `0.399 TPS`，概念到 3399，末窗 p95 `2917.2 ms`。原始 JSON 位于相邻 Demo 项目 `test-results/{microworld,cartpole}-sync-bag-term-20261002.json`；Demo 源码仍有未提交改动，只可作诊断。20 ticks × 5 cycles 的 Node `--cpu-prof` 主线程约 7914 采样中，`Bag.findEquivalentKey` 自耗 3413，`Bag.putIn` 1214，`Distributor` 296，`runtimeValueEquals` 159；profile `reports/evidence/cpu-prof-bag-term-20261002/CPU.20261002.235527.35440.0.001.cpuprofile`，对应基准 `reports/evidence/demo-workload-bag-term-profile-20261002.json` 为 `8.560 RPS`、概念终点 2296、峰值 RSS `388534272 bytes`。

下一轮假设：`Bag` 在 hash 桶未命中时仍逐项扫完整 `nameTable`。所有键均为 `Term` 的 Bag 可按具体构造器维护临时原生索引，只迭代同类键，再用原完整 `runtimeValueEquals` 判等；混合键 Bag 必须保持原全扫描，因为非 Term 的自定义 `equals` 可能接受 Term。索引要在增删/清空时同步、旧恢复态缺索引时重建，并保留 hash 不同而文本相等的查找。先测交叉 A/B、检查内存与直接合同；若收益不足 5% 或出现语义回退则撤销。不得从本假设推断浏览器持续 TPS 已可达标。

## Term 类索引候选的首轮实测

候选在 `src/storage/Bag.ts` 为全 Term 键的 Bag 维护只存在于 WeakMap 中的按具体构造器索引；它不进入持久化对象。增删/清空保持索引同步，恢复态首次查找重建。混合键及非 Term 查询仍全扫描；同类候选仍用原完整 value equality。新增直接合同覆盖非 Term 键对 Term 的不对称相等与增删清空。

同一提交 `07aceff` 上以同配置 20 ticks × 5 cycles 顺序“候选→恢复基线→重放候选”测得 `22.625 / 9.488 / 23.525 RPS`，候选对基线分别高 `138.5%` 和 `147.9%`；三次概念终点均 2296。峰值 RSS 分别 `405012480 / 343400448 / 393146368 bytes`，因此收益伴随约 50–62 MB RSS 增量，后续长测必须监测。原始 JSON SHA-256：候选 `E19381B9A27FA1013C1F29D72FEB0D9B8AE95F49A087798AC9608E31DF055FD5`、基线 `9431C0F07092A18B7FA4322227192686D26CAB848E24C630BB4B4AE8740420F7`、候选复测 `557BF447AEB1AF91E43F0DF58EF1D3774457261FE4423593A9299FC68C4EBF8D`；路径分别为 `reports/evidence/bag-term-index-{candidate,baseline,candidate-recheck}-20261003.json`。这些 JSON 的 `git_commit` 仍为 `07aceff`，因为候选当时为 dirty source；准确身份须连同 `reports/evidence/bag-term-index-candidate-20261003.patch` 阅读。直接相关 42/42 测试、非增量 typecheck、build、dist API、jree/platform 审计已通过。TS-only M2 `508 passed / 2 skipped / 0 failed`，TAP SHA-256 `8393FABB8F1A7DA9E774C4F09B8188B4BDFFB75FC88CBC11260D69C29109AECF`；含 Java M2 `510/510`，TAP SHA-256 `56DD99ED78AC77DBA53EE4EE7D127997EB54C908E81AB057204C3FF57B26D692`。原始 TAP 分别为 `reports/evidence/bag-term-index-{ts-only,java}-m2-20261003.tap`。M1′、markerless 与当前候选 Worker 的浏览器实测仍待完成，不得宣称候选已验收。

固定提交 `82469cc` 的 M1′ 243 项主体已串行退出码 0，`243/243` functional/parity 通过，所有行的 timeout、process_limit、exception、stall、not_run 为 0；逐文件耗时合计 `665581 ms`，单文件最大峰值 RSS `860385280 bytes`（`toothbrush2.nal`，该项 `89271 ms`）。原始 checkpoint `reports/evidence/m1prime-bag-term-index-20261003.jsonl` SHA-256 `52EC802E36D13239CB1CF5103B64AEF5949CCD0A14150D07CEC08A82EE3966E7`。上一候选相同主体合计 `900996 ms`、该文件 `212138 ms`/`508129280 bytes`，跨运行不构成交叉 A/B；本候选内存峰值明显上升，尚需后续长测和浏览器资源观察。

#25 `nars_multistep_3.nal` 随后在 `82469cc` 退出码 0、functional/parity 通过：`177474 ms`、实际 `502562` 周期、峰值 RSS `770727936 bytes`，无 timeout/process_limit/exception/stall/not_run。checkpoint `reports/evidence/m1prime-bag-term-index-extra25-20261003.jsonl` SHA-256 `6A6F5C178FC6A81DC6F1877CC392E728502B58357459B6CF772BB618B1D476FA`。#246 `simpleOperationTest.nal` 同样通过：`11066 ms`、`51564` 周期、峰值 RSS `436117504 bytes`，SHA-256 `CC1CAD2273D95114ED06E8295B09AB96F576E14B3D874DB58D7BFF9CB80F5C87`。两项相对上一候选耗时下降，但并非交叉 A/B，且 #25 的 RSS 从约 494 MB 升至约 771 MB，不能省略内存取舍。

#245 先用固定 2048 步 TS-only 夹具估算：`2445 ms`、`2473` 实际周期、峰值 RSS `294203392 bytes`，无失败分类；checkpoint `reports/evidence/m1prime-bag-term-index-long-2048-estimate-20261003.jsonl` SHA-256 `9A40FFFCAABE350865E54A0117B99FF760D6A4BB3FA29D560D6C06474AB7A240`。线性外推 65536 步约 78 秒，低于 1200 秒启动阈值，因此已在相同提交启动完整降载夹具，安全限 1800 秒；原始 200 万步仍为 `not_run`。

65536 降载夹具已在 `82469cc` 退出码 0，functional/parity `1/1`，TS 运行 `41443 ms`、`67510` 推理周期、峰值 RSS `601194496 bytes`，无 timeout/process_limit/exception/stall/not_run。冻结 Java 基线 SHA-256 `048C804D91986FBD597593C4CAE174D37DF09AA91D38560C433057945DF2F84E`，本轮未重复跑 Java。checkpoint `reports/evidence/m1prime-bag-term-index-long-65536-20261003.jsonl` SHA-256 `A3F3A1E0B9DD8931894F3D570F975EF5EC989C8399186640FEE31C0005A68647`。上一候选同夹具 `110854 ms`/`398467072 bytes`，同样是速度换更高内存；按本轮 65536 耗时线性外推原始 200 万步约 21 分钟，但概念增长可能令外推失准。原版仍 `not_run`：本候选尚未完成 markerless、浏览器与下一轮性能剖析，原版只在最终候选并有 RSS 监护及 1800 秒安全限时考虑执行。

两项 strict markerless 随后在 `82469cc` 均退出码 0、各跑满 `131072` 周期、128 窗口，逐窗口与相应冻结 Java 摘要 `equal=true`：`simpleOperationTest.nal` 总事件 `2535970`，TS JSONL SHA-256 `B71878257F96B82F6F9330F24442934D0F293F1B069B96B9070495536A599140`；`nal6.redundant.nal` 总事件 `589572`，TS JSONL SHA-256 `08F79BFDB69949DF609A57C12E8F6FAD0AB4EC9FC0B984DEA6D9795904E97ABA`。原始路径 `reports/evidence/markerless-bag-term-index-{simple,redundant}-ts-20261003.jsonl`，比较结果同前缀 `*-compare-20261003.json`。摘要 SHA 与上一候选相同，不能由此代替当前提交的独立运行事实。

阶段计划工具的旧约束也已修正为“023 仍需 full M1，后续普通/rc 阶段可选 M1′”。策略直接测试 `8/8`，TAP SHA-256 `5516F208B8A289A1B61FDE47B42EF2894F507BF442230DE63A0CAB03995A819C`；`07aceff..82469cc` 的 `--stage rc --m1-profile prime` 只读计划现为 `plan_valid=true`、`T2`、`m1_prime_required=true`、`full_m1_required=false`。这是工具口径修复，不改变 `82469cc` 的生产推理代码或已跑测试；仍需真实浏览器与性能收敛。

## 当前 Worker 的真实浏览器诊断（2026-10-03）

Demo 源码 `d4189e5`，核心 HEAD `bfef6d3`（生产源码 `82469cc`），Chrome 154、seed `3040304`、同步/目标 20 TPS、各 30 秒。Microworld/10 cycles 平均 `12.285 TPS`、`122.848 wall RPS`，六个五秒窗口 `20.15/19.97/19.98/8.60/3.00/2.00 TPS`，概念至 4426，末窗 p95 推理约 `1279.9 ms`。CartPole/5 cycles 平均 `2.062 TPS`、`10.309 wall RPS`，窗口 `2.99/1.80/3.00/1.40/2.00/1.20 TPS`，概念从 46 至 7027，末窗 p95 `989.8 ms`。两项 `pageErrors`、`workerFaults` 均为空，30 秒未观察到非 babble 操作。原始 JSON 分别在相邻 Demo 项目 `test-results/{microworld,cartpole}-sync-bag-term-index-20261003.json`；`demoTrackedSourceClean=false` 是生成 Worker 待提交，不能作为发行版的干净源码证据。Microworld 的平均值掩盖后半段严重下降；下一步在当前核心做 CPU profile，调查热路径与内存代价，继续同配置交叉测量。

当前核心固定 CartPole 20 ticks × 5 cycles 的 Node CPU profile：主线程 3838 采样，`Bag.putIn` 自耗 487、`Distributor` 构造 284、`Bag.findEquivalentKey` 245、`CompoundTerm.equals` 142、`runtimeValueEquals` 141、GC 85。带 profile 的样本为 `21.375 RPS`、峰值 RSS `420974592 bytes`、概念终点 2296；路径 `reports/evidence/cpu-prof-bag-term-index-20261003/CPU.20261003.004841.17624.0.001.cpuprofile` 和 `reports/evidence/demo-workload-bag-term-index-profile-20261003.json`。profile 有 750 idle 和 114 loader hook 采样，所列是原始采样，不可直接当准确 CPU 占比。`Distributor` 在每个 Bag 构造时生成同档位确定性数组；下一候选是按 range 缓存模板，同时为每个实例复制数组以保持公开 `order` 的独立可变合同。先写直接合同并交叉 A/B，若收益不超过 5% 或回退则撤销。

模板缓存候选的独立 `order` 合同测试 `4/4` 通过，非增量 typecheck 先因上一提交遗漏的 `change-gate-policy.d.mts` 声明而失败，补齐声明后通过。固定 CartPole 20 ticks × 5 cycles 顺序候选/基线/候选复测为 `24.03 / 23.20 / 24.25 RPS`，概念终点均 2296，峰值 RSS `417116160 / 420077568 / 426012672 bytes`。候选相对基线仅约 `3.6–4.5%`，未达预设 5% 接受门槛，故已撤销 `Distributor.ts` 与候选测试，保留三份原始 JSON 于 `reports/evidence/distributor-template-*-20261003.json`。这是第一项低收益尝试，但不构成“三轮性能收敛”，因为当前浏览器持续 TPS 仍低且 `Bag.putIn` 有其他明确候选。

随后试验在 Bag 内按 levels 共享整个只读 `Distributor` 实例，避免每个 Bag 重算。`Bag`/`Distributor` 直接合同 `22/22` 通过；同输入候选/基线/候选复测 `23.74 / 24.04 / 23.73 RPS`，概念均 2296，峰值 RSS `410632192 / 418856960 / 411258880 bytes`。此候选吞吐反而约低 1.3%，已撤销源码；原始 JSON 为 `reports/evidence/bag-shared-distributor-*-20261003.json`。这说明 profile 中的构造采样不等于端到端高收益，应继续追踪 Bag 查找与概念增长，而非保留无效缓存。

第三项尝试是 Bag 在 `findEquivalentKey` 已判定不存在时绕过 `NativeMap.put` 的重复查找，调用新插入路径。`Bag`/`NativeMap` 直接合同 `30/30` 与非增量 typecheck 通过；候选/基线/候选复测 `23.28 / 24.05 / 24.46 RPS`，概念均 2296，峰值 RSS `395714560 / 419782656 / 418226176 bytes`。候选波动跨过基线，无法证明 >5% 稳定收益；已撤销该源码，原始 JSON 为 `reports/evidence/native-map-known-absent-*-20261003.json`。这三项局部尝试不构成最终收敛：它们不代表浏览器晚期负载，且当前索引本身可能增加内存与 GC 长尾。

## 新候选：标准 Term 名称预筛（未完成阶段门）

`Bag.findEquivalentKey` 对同具体构造器的词项仍需遍历，以保留恢复态键 hash 变化的合同；此前每个不相等候选都执行双向 `runtimeValueEquals`。项目内 `Term`、`CompoundTerm`、`Variable` 三种标准 `equals` 都以原生 UTF-16 名称相同为必要条件。本候选仅当查询与现存键使用**同一标准方法引用**时，先比较 `name()`；自定义 `equals` 仍走完整双向判等。直接测试覆盖跨名称自定义相等、恢复态不同 hash、名称变化但存储 hash 固定的取回。对“名称变化且 hash 随之变化”的新测试，当前基线和候选均返回 null，这是 `NativeMap` 插入时 hash 桶固定的既有边界，不以性能候选改变。

固定 CartPole 20 ticks × 5 cycles 候选/基线/候选复测 `26.47 / 23.02 / 26.53 RPS`，概念均 2296，峰值 RSS `422146048 / 417992704 / 407166976 bytes`；30 ticks × 5 cycles 为 `27.98 / 25.79 / 28.60 RPS`，概念均 2945，峰值 RSS `447045632 / 473096192 / 473346048 bytes`、p95 `342.01 / 378.76 / 347.68 ms`。两个负载中收益约 8.5–15%，但仍是未提交候选和短 Node 负载，不能宣称浏览器持续 TPS 提升。原始 JSON 为 `reports/evidence/bag-name-prefilter-{candidate,baseline,candidate-recheck,candidate30,baseline30,candidate30-recheck}-20261003.json`；`git_commit` 仍标 `bfef6d3`，须结合本次源码 diff 辨认 dirty-source 候选。下一步跑直接合同、M2、静态审计，提交候选固定 SHA 后再运行 M1′、strict markerless 和真实浏览器。

上述六份 JSON 按 `baseline / candidate / candidate-recheck / baseline30 / candidate30 / candidate30-recheck` 顺序 SHA-256 为 `E48DC86CC544592D2665E43D3155CBD6D1867E2369337197334099D2FE58D5FA / 542B5C061F6A59BB4040B9AF32378797A26A6644655ACCAA524D353441451B15 / 7F316C3E8386D1886BE35C335DE2072FA5AEEF7F9C8910408D787776431C2117 / 02D0475B554BECC7BE79DB7827B7B711F19F36046B04B1B2C45DBAE32F94E483 / 26F1D7AFECD780B9F0E6F9C45D5D30FB13EE5F7BD3ECE8F87D86B65B38F3403A / F4BC365BB4F3C77C13382E4A26FA29F14E18851C7F51BC3A1273E6FA88A5102F`。直接 Bag 合同 `21/21`、非增量 typecheck、build、dist API、jree `0/0` 与平台核心/混合边界 `0/0` 均通过。TS-only M2 `511 passed / 2 skipped / 0 failed`，TAP SHA-256 `B0D22E98C1273C669B56F01DDBC85D8FC68428AD2DB5D98F49A17100B4AABFBA`；含 Java M2 `513/513 passed`，TAP SHA-256 `900CE6287BD7CB94505D00FF571937AC25BD52ABA362769BCAB588BA3FFC4CF1`。原始 TAP 为 `reports/evidence/bag-name-prefilter-{ts-only,java}-m2-20261003.tap`。候选仍是 dirty source，下一步必须固定提交再做 M1′ 和浏览器。

Demo 输入节奏的只读核对：原版 `SimNAR.java` 第 309–321 行用单个 `lastInput` 在六个感受点之间交替记录，TS `microworld-worker.ts` 第 125–132 行用每通道 `Set` 判定变化并每五步重发。两者在多通道同时激活时的重复输入量不同；都维持每环境刻 10 个 NARS 周期。因此 Java `frameRate(50)` 只是请求 50 Hz，不能直接拿来证明当前 TS Worker 应该能持续 50 TPS。CartPole 每刻送入角度感知与复合 `good` 目标，压缩输入频率会改变任务时间与学习条件，若探索须另立有行为验证的 Demo 实验。

固定提交 `708afc5` 的 M1′ 主体已退出码 0，`243/243` functional/parity 通过，failed、timeout、process_limit、exception、stall、not_run 均为 0；逐文件耗时合计 `693624 ms`，最高 RSS `856879104 bytes`（`toothbrush2.nal`）。原始逐文件 checkpoint 为 `reports/evidence/m1prime-bag-name-prefilter-20261003.jsonl`，SHA-256 `4A83E1F391A3B86F6CE14B13771AB8210531619AC80BAF4EF4FC91A705F1087B`。上一候选主体 `665581 ms`，本次略慢；跨运行不可直接归因，但明确不能把 20/30-tick RPS 提升推广到全部 NAL。#25/#246、#245 降周期、strict markerless 与浏览器仍待同提交验证。

#25 `nars_multistep_3.nal` 通过 functional/parity：`502562` 实际周期、`146468 ms`、峰值 RSS `836640768 bytes`，失败分类均为 0；checkpoint `reports/evidence/m1prime-bag-name-prefilter-extra25-20261003.jsonl` SHA-256 `23FD002A7D1479A5A1DCA5A2A71B847CDF7F265058C65DFB79F26473AC7DB8CB`。#246 `simpleOperationTest.nal` 亦通过：`51564` 周期、`9689 ms`、峰值 RSS `461533184 bytes`，SHA-256 `A69F617BA11713E8554AD0F8CEA3FD732A0E18195119A329E4B3B14CF5AEF0E0`。#245 的 2048 步 TS-only 探针 `3532 ms`、实际 `4022` 周期、峰值 RSS `309080064 bytes`，SHA-256 `771EC7FE9A16EA9F097F7AA89DE2D9E04AB0977119D8BB6356E2ACD403185E9E`；按配置步数线性外推 65536 约 `113 s`，符合 ≤1200 s 启动门，因此 65536 夹具正在串行运行，安全上限 `1800 s`。其冻结 Java baseline SHA-256 `048C804D91986FBD597593C4CAE174D37DF09AA91D38560C433057945DF2F84E`。原始 200 万步仍 `not_run`。

65536 降载夹具随后退出码 0，functional/parity `1/1`：TS `33702 ms`、`67510` 实际周期、峰值 RSS `616341504 bytes`，failed、timeout、process_limit、exception、stall、not_run 均为 0。原始 checkpoint `reports/evidence/m1prime-bag-name-prefilter-long-65536-20261003.jsonl` SHA-256 `2B960807E1B4F16A223F6B1F10AB441BD044863552AE0CE484C6C6DD16A4443C`。本轮 2048 外推偏保守；按 65536 实测线性外推原版 200 万步约 17.1 分钟，但概念增长可使线性估计失准。原版仍 `not_run`，只在最终候选有单进程 RSS 监护和 1800 秒安全限时考虑，不把本夹具代称原版。

两项 strict markerless 各独立跑满 `131072` 周期、128 窗口，逐窗口与对应冻结 Java 摘要 `equal=true`。`simpleOperationTest.nal` 为 `2535970` 事件，TS JSONL SHA-256 `B71878257F96B82F6F9330F24442934D0F293F1B069B96B9070495536A599140`；`nal6.redundant.nal` 为 `589572` 事件，SHA-256 `08F79BFDB69949DF609A57C12E8F6FAD0AB4EC9FC0B984DEA6D9795904E97ABA`。原始文件 `reports/evidence/markerless-bag-name-prefilter-{simple,redundant}-ts-20261003.jsonl`；比较文件同前缀 `*-compare-20261003.json`，SHA-256 均 `9631076595A4FAD6432EAA7E18C5B2DB836FA4B7FE37F0369A462BC8BFFA0388`。两条 TS SHA 与上一候选一致，但本轮确实在 `708afc5` 重新运行。下一门是重建 Worker 后的真实浏览器和持续性能收敛。

当前生产提交 `708afc5` 的 Worker 已由文档后继 `edd4036` 重建并通过 Demo `npm run check` 与真实 Chrome smoke（十个游戏、Microworld、首页 canvas、零页面错误）。同 Chrome 154、seed `3040304`、同步目标 20 TPS、30 秒，Microworld/10 cycles 平均 `12.568 TPS`、六窗 `19.98/20.16/19.93/8.98/3.59/2.79`，概念 `9 → 5123`，末窗 p95 `1360.5 ms`，操作来源 `NARS 0 / babble 26 / idle 352`；CartPole/5 cycles 平均 `2.229 TPS`、六窗 `3.19/1.80/2.99/2.20/1.60/1.59`，概念 `46 → 7232`，末窗 p95 `938.1 ms`，来源 `NARS 0 / babble 5 / idle 62`。无 page/Worker fault。原始 JSON 在 Demo 项目 `test-results/{microworld,cartpole}-sync-bag-name-prefilter-20261003.json`，SHA-256 为 `FF0095DD3164A2940A74B12E4209C8CF5CA39EBC45BB0145989CA1987E08A837`、`C6ADFE035390E7C018C9F218CA208B1447884D719B3E81BEFCF1D334E95234FF`。生成 Worker 尚未提交，JSON 的 `demoTrackedSourceClean=false`；这是诊断证据，不是发布门。短 Node RPS 收益未证明持续浏览器目标，优化收敛计数不能开始。

额外异步 CartPole 探针出现 `18.903` 世界 TPS 但采样区间 `0` 个 Worker 完成事件；进一步消息计数显示切换模式后几乎没有再提交推理请求。Demo `src/demo.ts` 原调度在异步世界步进后先把 `nextStep` 更新为未来时刻，随后才要求 `now >= nextStep` 发请求，条件长期为假。已在独立 Demo 工作树修正为每个新世界状态最多发一次、前一请求完成后才发下一次，并添加 Chrome 回归检查；修复后结果仍待重建。原始 JSON `test-results/cartpole-async-bag-name-prefilter-20261003.json` SHA-256 `CFF6515C8A027ED82C130024291D3CE9CF947A93E330A6D63D4BF918690954C4`。不能把 18.9 TPS 说成 NARS 在同步推理。

修复后的 Demo 提交 `25d0bac`、静态 Worker 构建提交 `278956f`；Chrome smoke 增加“异步 CartPole 至少两次新请求及两次完成”后通过。相同 30 秒配置下：`600` 世界刻、`19.952` 世界 TPS、`144` 推理请求完成、`720` NARS 周期、墙钟 `23.942 RPS`，概念 `199 → 5333`，无非 babble 操作或故障。原始 JSON SHA-256 `E17CBE320EB7627D40AD3C7E69FB702E2E4C2D468943B3DF49DB9569935F9A9E`。这是 Demo 调度修复，不是推理器吞吐提高；后台 NARS 只完成了约 24% 的目标 20 TPS × 5 周期对应工作量。

当前生产代码的 Node 60 ticks × 5 cycles 单进程 CPU profile 伴随基准耗时 `9457.28 ms`、`31.722 RPS`、峰值 RSS `497385472 bytes`，概念在第 60 tick 达 `3843`。分段 TPS 为 `5.879/3.663/6.019/5.737/8.307/23.866`，并非单调下降；这与真实浏览器 CartPole 的约 `7232` 概念/67 刻不同。Node 脚本不包含 Demo 的 babble、操作、逐条输入与全部宿主消息，不能把它当作浏览器长尾的同负载 profile。原始 `reports/evidence/demo-workload-bag-name-prefilter-profile60-20261003.json` 与 `reports/evidence/cpu-prof-bag-name-prefilter-60ticks-20261003/` 留存待分析。下一步应剖析实际 Worker 输入/推理路径或构造严格等价的 Node harness。

已在 Demo 项目新增 `scripts/profile-demo-worker.mjs`，直接加载**构建后的 Worker bundle**并复用真实 TypeScript CartPole 世界模型、seed、感知/目标/反馈及 babble 参数。67 刻 × 5 周期得到 `7218` 概念（浏览器同轮 67 刻约 `7232`），末段 `1.047 TPS`、峰值 RSS `873447424 bytes`；它不复现浏览器调度/内存，但输入与概念增长已足够接近，可用于找热路径。原始 JSON `test-results/cartpole-worker-harness-67-20261003.json` SHA-256 `1F7622C51042DBF0FCA362B825EDC3CB0EE49B123E39B40BE1C384042CD27D27`；V8 profile SHA-256 `81346372B3FFEB03E4FF0E4D3BEE227104F2A04ECE6D7459CC6E8720A9667D0F`。19,371 个采样按 minified 函数名合并后，`putIn` 4640、`findEquivalentKey` 3282、`put` 997、`putBack` 899、`addKeyToBucket` 850、`addToHashIndex` 831、GC 571。这是抽样热点线索，不是准确独占 CPU 百分比；下一候选应在 Bag 插入与两层索引维护上提出可证伪的局部改动，并用这份等输入 harness 交叉 A/B，而不能只跑简化 Node 脚本。

## 第五候选：Bag 等价键查找去掉重复的 NativeMap 首查（实验中）

假设：`findEquivalentKey` 先调用 `nameTable.get(key)`，再走 Bag 的 hash 桶/全 Term 索引；对原生键，两条路径重复执行 hash/equals。Bag 的后续 hash 桶先试原 hash，缺桶时全 Term 索引或全表回退均仍完整；返回保留键后 `nameTable.get/put/remove` 继续执行 NativeMap 自身的合同。删掉这一首查可能降低 67 刻等输入 Worker 的总耗时与晚期 p95，而不改变恢复态异 hash、非对称 equals 或插入顺序。若合同失败、概念终点/操作改变，或交叉 A/B 无稳定 ≥5% 收益，就撤销。

实验前干净生产 `708afc5`、Demo bundle `278956f` 的无 profiler 67 刻基线为终点概念 `7218`、末 7 刻 `1.334 TPS`、p95 `1023.16 ms`、峰值 RSS `867250176 bytes`；原始 `test-results/cartpole-worker-lookup-baseline-20261003.json`。候选将只改 `Bag.findEquivalentKey` 的首查块，先跑 Bag/NativeMap/恢复态直接合同，再进行候选→恢复基线→候选复测。该基准不等同浏览器发布门。

结果：删去首查的直接相关测试 `49/49` 和非增量 typecheck 通过，四次 67 刻结果按基线→候选→恢复基线→候选复测为总推理耗时约 `30367/29010/41976/28814 ms`，折算 `11.032/11.548/7.981/11.626 RPS`；概念终点均 `7218`，候选峰值 RSS 约 `868 MB`。第一对候选只快约 `4.7%`，末 7 刻 `1.334 → 1.346 TPS`；第二基线末段遇到异常长尾，`0.641 TPS`、p95 `3922.42 ms`，没有同步的系统资源日志，不能归因于候选。由于对稳定基线的收益未达 5%、晚期改善很小，本候选**已撤销**，生产 `Bag.ts` 与 HEAD 相同，不计入有效优化或收敛三轮。原始 JSON 的 SHA-256 按上述顺序为 `7B44F620BB2DED2E391A50C0E989E654438F4A3767FF104091E082CB82DBB337`、`ED3172933DA0C6B0F281CEDE17371D2861B16D3928CC05F25D730AC3F8279648`、`123EA9358EDD70CAD94DF75DEF0B266168E76B32B737AA6A5AFD9CABBE8DD8C4`、`AEAFFB3F20E6E20681FEAA8B096AB3467A79BDA6F3FC19375CA3DF0DE306AF7B`，存于 Demo `test-results/cartpole-worker-lookup-*-20261003.json`；候选 patch 留在 `reports/evidence/bag-duplicate-native-map-lookup-candidate-20261003.patch`，SHA-256 `8940460CE24EE5F3EFF6BF31C7A178D6A7EA5DC7BC2226C9A321187AAEE3FAF0`。下一次优先测量 Bag 插入时 hash 计算、bucket/term 索引的维护与内存成本，或直接分析未产生非 babble 操作的 Demo 表征；不能把已撤销候选写成生产提速。

只读 `validation:plan` 在 `07aceff..82469cc`、冻结 Java baseline 与唯一证据前缀下输出 `plan_valid=true`、`T1`、J3 推理核心簇、四项受影响 NAL。当前策略脚本却拒绝在 stage `none`/`rc` 用 `--m1-profile prime`（只允许旧 023/024），与本次用户准许 023 之外使用 M1′ 的口径冲突；现阶段使用默认档生成只读风险计划并手工执行本目标的 M1′，后续需修正策略/测试，不能伪称工具已经认可 042 的 prime 档。
