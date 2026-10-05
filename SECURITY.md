# Security Policy

## Reporting a vulnerability

请不要在公开 issue 中发布未修复的安全细节。优先通过 GitHub Security Advisories 联系维护者；仓库已启用 secret scanning 与 push protection，疑似密钥不要提交到 Git 历史，也不要把利用代码贴到公开 issue。

报告应包含受影响版本、复现步骤、影响范围和可行的缓解方式。请给维护者合理的修复时间，不要在修复前公开利用代码或用户数据。

维护者会在收到报告后确认收件，评估影响并在修复可用时发布版本说明。当前项目没有后端服务，主要风险边界是 Node 宿主能力、发布包、构建脚本与浏览器 Worker。

## Scope

本项目是本地 Node.js CLI、TypeScript 库和静态浏览器 Demo。Demo 不接收项目后端数据；Node 宿主能力（文件、进程、网络、序列化）由调用者环境负责配置。不要把不受信任输入直接交给系统命令或文件路径能力。
