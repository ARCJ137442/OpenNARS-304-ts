# OpenNARS 3.0.4 TypeScript v1.0.7

## 修订内容

- 发布检查不再依赖未纳入源码仓库的 Java canonical checkout；clean clone 可独立执行 `npm ci` 与 `npm run test:release`。
- 增加版本化 CLI smoke fixture，发布包合同继续检查外部 TypeScript、ESM API、CLI、Shell、配置和临时文件排除。
- Demo Shot 完成 NARust-o 差分感知、相对九宫格接口、OpenNARS 3.0.4 可解析的 `^Forward` 操作适配，并对进化克隆的可变状态做深复制。
- 完成维护文档个人路径脱敏、公开审查记录和人工验收清单。

## 事实边界

- 核心直接 jree 导入/出现为 `0/0`，平台核心混合边界为 `0`。
- Microworld 持续 20 TPS、原始 2,000,000 周期稳定性和 Shot 长期 NARS/记忆克隆等价仍按实测边界披露；它们不阻塞本次修订版收口。
- 本版本不发布 npm；GitHub Release 资产应以最终 tarball 与 manifest 为准。
