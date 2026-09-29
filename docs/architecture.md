# 架构说明

```text
Node CLI / Shell       Browser UI
        |                  |
        v                  v
Node host adapter     Browser host adapter
        \                  /
         +--> Nar / Memory / Inference
                    |
          language / entity / storage
```

## 核心

`src/main/Nar.ts` 编排生命周期和周期推进；`src/language`、`src/entity` 表达 Narsese 与任务值；`src/storage` 管理概念和记忆；`src/inference` 与 `src/control` 执行推理规则；`src/operator` 与 `src/plugin` 提供扩展点。

核心接收字符串、配置文本和宿主能力，不主动读取文件或启动进程。Node 文件读取、argv、标准输入输出和退出码位于 `scripts/` 与 `src/platform/node`；浏览器 Worker 位于 web-demo 仓库并使用 `src/platform/browser` 的 facade。

## 依赖边界

- 领域模块可以依赖项目内 runtime 合同和原生 `Array`、`Map`、`Set`。
- Node 与浏览器差异只能通过明确 adapter 进入核心。
- npm `jree` 只保留在 Node host adapter 的兼容入口；生产核心不导入 `runtime/jree-compat.ts`。
- 公共 API 由 `src/index.ts` 和生成的 `dist/index.d.ts` 定义，不把 Node 文件能力泄漏给浏览器。

## Java 形状的现状

迁移目标是去除共享核心对 jree bridge 的运行时依赖，不是伪装成另一套语义。`RuntimeClassToken`、Java 字符串 hash/compare、异常层级、迭代器和插入顺序仍是为了保持 OpenNARS 3.0.4 行为；它们应集中在项目内 runtime 或宿主 adapter。新增功能应优先使用 TypeScript 原生类型和最小能力接口。

## 构建数据流

```text
src + config
   | npm run build
   v
dist/index.js + dist/index.d.ts + CLI
   | web-demo build:worker
   v
public/nars-worker.js + build-meta.json
```

`build-meta.json.sourceCommit` 是浏览器部署与源码提交的追踪点；部署前必须与主仓库目标提交一致。
