# Security Policy

## Reporting a vulnerability

请不要在公开 issue 中发布未修复的安全细节。优先通过 GitHub Security Advisories 联系维护者；如果仓库尚未启用该功能，请先开一个不包含敏感细节的 issue，请求私下联系渠道。

报告应包含受影响版本、复现步骤、影响范围和可行的缓解方式。请给维护者合理的修复时间，不要在修复前公开利用代码或用户数据。

## Scope

本项目是本地 Node.js CLI、TypeScript 库和静态浏览器 Demo。Demo 不接收项目后端数据；Node 宿主能力（文件、进程、网络、序列化）由调用者环境负责配置。不要把不受信任输入直接交给系统命令或文件路径能力。
