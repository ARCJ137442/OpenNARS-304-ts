# AI Agent Instructions

<!-- Encoding: UTF-8 -->
<!-- hint: if not specified, assume all of the encoding of code&text files is UTF-8 -->

## 项目信息

- 项目名称：opennars-304-master
- 工作方式：LeanSpec 规格驱动开发（SDD）

## 🚨至关重要：在任何任务之前

**先停下来检查：**

1. **发现上下文** -> 使用 `board` 工具查看项目状态
2. **搜索相关工作** -> 在创建新 spec 前使用 `search` 工具
3. **不要手动创建文件** -> 新 spec 一律用 `create` 工具

> **为什么？** 跳过发现会造成重复工作。手动创建文件会破坏 LeanSpec 工具链。

## 🔧specs 管理方法

### MCP 工具（优先）与 CLI 备用

| 操作 | MCP 工具 | CLI 备用 |
| -------- | ---------- | -------------- |
| 项目状态 | `board` | `lean-spec board` |
| 列出 specs | `list` | `lean-spec list` |
| 搜索 specs | `search` | `lean-spec search "query"` |
| 查看 spec | `view` | `lean-spec view <spec>` |
| 创建 spec | `create` | `lean-spec create <name>` |
| 更新 spec | `update` | `lean-spec update <spec> --status <status>` |
| 关联 specs | `link` | `lean-spec link <spec> --depends-on <other>` |
| 取消关联 | `unlink` | `lean-spec unlink <spec> --depends-on <other>` |
| 依赖关系 | `deps` | `lean-spec deps <spec>` |
| Token 统计 | `tokens` | `lean-spec tokens <spec>` |

## ⚠️核心规则

| 规则 | 细节 |
| ------ | --------- |
| **不要手动编辑 frontmatter** | `status`、`priority`、`tags`、`assignee`、`transitions`、时间戳、`depends_on` 必须用 `update`、`link`、`unlink` |
| **务必链接 spec 引用** | 内容提及其他 spec -> `lean-spec link <spec> --depends-on <other>` |
| **跟踪状态流转** | `planned` -> `in-progress`（编码前）-> `complete`（完成后） |
| **不要嵌套代码块** | 使用缩进替代 |

### 🚫常见错误

| ❌不要做 | ✅应该做 |
| ---------- | --------------- |
| 手动创建 spec 文件 | 使用 `create` 工具 |
| 使用 `create` 工具时在名称中添加序号 | 在使用 `create` 工具创建spec时无须添加序号，只在引用spec时带上序号 |
| 跳过发现 | 先运行 `board` 和 `search` |
| 状态停留在 "planned" | 编码前更新为 `in-progress` |
| 手动改 frontmatter | 使用 `update` 工具 |

## 📋SDD 工作流

```plaintext
BEFORE：运行`lean-spec board` -> 搜索 -> 检查已存在的相关specs，汇总已有经验 -> 创建与当前任务相对应的spec
DURING：更新spec状态到`in-progress` -> 开展实际编码工作 -> 根据文档做决策 -> 链接到所依赖的spec
AFTER： 更新spec状态到`complete` -> 在文档中写入实现spec的经验
```

**状态跟踪实现进度，而不是写 spec 的进度。**

## Spec 依赖

使用 `depends_on` 表达阻塞关系：

- **`depends_on`** = 真正阻塞，执行顺序重要且有方向（A 依赖 B）

当一个 spec 构建在另一个之上，必须先完成另一个才能着手开始时，请建立依赖：

```bash
lean-spec link <spec> --depends-on <other-spec>
```

## 何时需要 spec

| ✅需要写 spec | ❌可跳过 |
| --------------- | -------------- |
| 多阶段功能 | Bug 修复 |
| 破坏性变更 | 微小改动 |
| 设计决策 | 自解释重构 |

## Token 阈值

| Tokens | 状态 |
| -------- | -------- |
| <2,000 | ✅最佳 |
| 2,000-3,500 | ✅良好 |
| 3,500-5,000 | ❗考虑拆分 |
| >5,000 | 🔴必须拆分 |

## 第一性原则（优先级顺序）

1. **上下文经济** - <2,000 最佳，>3,500 需要拆分
2. **信噪比** - 每个词都必须传达决策信息
3. **意图优先于实现** - 记录为什么，让实现自然涌现
4. **弥合认知差距** - 人与 AI 都要能理解
5. **渐进式披露** - 只有在痛点出现时才增加复杂度

---

**记住：** LeanSpec 跟踪你正在构建的内容。保持 spec 与工作同步！

## 任务完成原则与流程表

<!-- 修改时间：2025-12-25 18:24:51 -->

### 完成原则

1. **规格先行**：编码前先确认 spec 目标、Plan 与 Test 都清晰。
2. **复选框闭环**：标记 spec 为完成前，所有 `[ ]` 必须变为 `[x]`，缺项即任务。
3. **测试驱动验收**：spec 的 Test 项必须落实为实际测试并通过。
4. **状态同步**：`planned -> in-progress -> complete` 仅通过 LeanSpec 工具更新。
5. **提交可追溯**：同一 spec 的代码、测试、spec 更新放入同一提交；与spec目标无关的更改，不纳入提交。
6. **阶段提交**：以下情况需遵循 [约定式提交](https://www.conventionalcommits.org/zh-hans/v1.0.0/) 的格式进行一次Git提交
    1. 编写完一系列 spec，开始写代码前：提交一次，领域为spec，内容为「编写了新的 spec，分别有……」
    2. 完成了一个 spec 时：必须提交一次，领域根据spec的内容而定（feat、refactor等），并在提交信息中标明「完成了 spec xxx，内容为」。

### 工作流程表

完成一次工作，有如下流程：

| 阶段 | 操作 | 产出 |
| ------ | ------ | ------ |
| 温习 | 获取并打开最近一次报告，阅读其中的批示，然后搜索并阅读所涉及的spec规格 | 调用`.lean-spec\report-get-latest.py`获知并打开了`reports`目录中最近一次报告，其中用户批示（Human Notes）以方头括号（`【`、`】`）标注，使用`lean-spec board`与`lean-spec search`搜索并阅读了所涉及的spec |
| 起草 | 运行`.lean-spec\report-new.py 【你作为语言模型的名称，如ChatGPT Codex】`，在`reports`目录下创建新报告文件，填写了「上一报告回顾」「用户指令」的内容 |
| 计划 | 理解用户下达的指令，列举并填写「需要完成的任务」 | 任务得到清晰表征与分解，并填写到最新报告中 |
| 实现 | 开始遵照用户指令，按照报告提出的计划逐步完成任务 | 列举的任务得到完成 |
| 检查 | 运行 `scripts/checking` 下的所有Python脚本，确认其输出结果无误 | 所有Python脚本输出结果为「ok」，未出现警告或错误信息 |
| 记录 | 填写「任务主要进展」、「任务过程笔记」、「修改内容汇总」、「其他备注」 | 填写完毕，等待用户审阅与新批示 |

对于某个具体的spec，有如下流程：

| 阶段 | 操作 | 产出 |
| ------ | ------ | ------ |
| 准备 | 阅读 spec；确认依赖；更新为 `in-progress` | 任务范围与顺序确认 |
| 实现 | 完成核心代码或文本；补齐 Plan 事项 | 功能落地/文本完稿、计划完成 |
| 验证 | 编写/更新测试；所有单元测试全部通过，文本得到检查与确认 | 测试覆盖与通过 |
| 收尾 | 勾选所有复选框；更新状态为 `complete`；提交 | 状态一致、提交可追溯 |
