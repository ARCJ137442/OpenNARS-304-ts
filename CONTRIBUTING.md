# Contributing

感谢参与 OpenNARS-304-ts。提交代码前请先阅读 `AGENTS.md`、`docs/developer-guide.md` 和相关 LeanSpec 规格。

## 本地验证

```bash
npm ci
npm run typecheck
npm test
npm run test:build
npm run test:api:dist
npm run test:release
```

涉及推理、runtime、集合、异常、文本、平台边界或发布产物时，必须补充对应合同、NAL parity 或阶段门证据。性能改动必须记录固定提交、Node 版本、workload、RPS/RSS 和失败分类。

## 提交规则

- 使用 Conventional Commits。
- 只提交本次职责范围内的文件，不使用 `git add -A`。
- 不删除历史 evidence；新增 evidence 应使用唯一前缀并记录 SHA-256。
- 不把 canonical Java artifact 或本机绝对路径加入发布包。

## Pull Request

请说明行为变化、合同依据、测试命令、性能数据和未完成边界。涉及公开 API、许可证、依赖或宿主能力时，请同时更新中英文文档。
