# OpenNARS 3.0.4 TypeScript v1.0.0

首个正式发行版，包含：

- OpenNARS 3.0.4 TypeScript 核心、Node CLI、Shell 和公共 ESM API；
- 项目内 Java 文本、异常、类身份、集合和迭代合同；
- Node 与浏览器宿主适配边界；
- 可复现的 M1-prime、M2、M3 与 in-process RPS 验证工具；
- 独立的 OpenNARS 3.0.4 Demo Lab 与 GitHub Pages 公网入口。

本版本的长期稳定性门禁使用 65536 周期降载 fixture。原始 2,000,000 周期在当前 PC 上仍属于持续性系统瓶颈，不作为日常发布门；该限制已在验证记录中单独标注。

性能验证包括 NativeMap 哈希命中路径优化、243 项 M1--、#25、#245 降载、#246、两个 131072 周期 markerless digest、含 Java M2 `498/498`、M3 业务 workload 和 release package 外部消费者检查。
