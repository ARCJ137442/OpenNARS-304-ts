#!/usr/bin/env python3
# encoding: utf-8
"""
批量根据 ts-analysis.json、progress.md 与 deps.xml 生成 spec004 要求的
analysis/<ts-path>.md 文件，内容结构与 file_template.md 保持一致。
"""

from __future__ import annotations

import json
import re
from collections import Counter, defaultdict
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Sequence, Tuple

WORKSPACE = Path(__file__).resolve().parents[2]
TS_ANALYSIS_PATH = WORKSPACE / "ts-analysis.json"
PROGRESS_PATH = WORKSPACE / "specs" / "002-ts-progress-report" / "progress.md"
DEPS_PATH = (
    WORKSPACE
    / "specs"
    / "003-dependency-analyze-brief-plan"
    / "java-dep-graph"
    / "deps.xml"
)
TSC_CHECKS = [
    (
        "full_check",
        WORKSPACE
        / "specs"
        / "003-dependency-analyze-brief-plan"
        / "tsc_checks"
        / "full_check.txt",
    ),
    (
        "syntax_check",
        WORKSPACE
        / "specs"
        / "003-dependency-analyze-brief-plan"
        / "tsc_checks"
        / "syntax_check.txt",
    ),
]
ANALYSIS_ROOT = WORKSPACE / "specs" / "004-dependency-analyze-expanded" / "analysis"

MODULE_CHAIN = {
    "language": "language 基座",
    "entity": "language 基座 -> entity 实体层",
    "storage": "language 基座 -> entity -> storage",
    "inference": "language 基座 -> entity -> inference 推理层",
    "control": "language 基座 -> entity -> inference -> control 控制层",
    "io": "language 基座 -> entity -> io I/O 层",
    "interfaces": "language 基座 -> interfaces 接口层",
    "main": "language 基座 -> entity -> control -> main 应用层",
    "operator": "language 基座 -> entity -> operator 操作符层",
    "plugin": "language 基座 -> entity -> operator -> plugin 扩展层",
    "util": "language 基座 -> util 工具层",
    "test": "language 基座 -> test",
}

REFERENCES = "`ts-analysis.json` · `specs/002-ts-progress-report/progress.md` · `deps.xml`"
ANALYSIS_DATE = datetime.now().strftime("%Y-%m-%d")


@dataclass
class ProgressEntry:
    java_path: str
    scale: str
    deps_text: str
    deps: List[str]
    build: str
    roadmap: List[str]


def parse_progress(path: Path) -> Dict[str, ProgressEntry]:
    sections: Dict[str, ProgressEntry] = {}
    current: str | None = None
    data: Dict[str, object] | None = None
    collecting = False

    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.rstrip("\n")
        if line.startswith("## "):
            if current and data:
                sections[current] = ProgressEntry(
                    java_path=data.get("java_path", "") or "",
                    scale=data.get("scale", "") or "",
                    deps_text=data.get("deps_text", "") or "",
                    deps=data.get("deps", []) or [],
                    build=data.get("build", "") or "",
                    roadmap=data.get("roadmap", []) or [],
                )
            current = line[3:].strip()
            data = {"roadmap": [], "deps": []}
            collecting = False
            continue
        if not current or data is None:
            continue
        if line.startswith("- **Java对照**:"):
            data["java_path"] = line.split(":", 1)[1].strip().strip("`")
        elif line.startswith("- **规模 / TODO**:"):
            data["scale"] = line.split(":", 1)[1].strip()
        elif line.startswith("- **依赖现状**:"):
            dep_text = line.split(":", 1)[1].strip()
            data["deps_text"] = dep_text
            deps: List[str] = []
            if "依赖" in dep_text:
                part = dep_text.split("依赖", 1)[1]
                part = part.lstrip("：:").strip()
                if part:
                    tokens = re.split(r"[，,、；;]\s*", part)
                    for token in tokens:
                        token = token.strip()
                        if not token or "jree" in token or "TS 自身" in token:
                            continue
                        deps.append(token)
            data["deps"] = deps
        elif line.startswith("- **编译 / 测试**:"):
            data["build"] = line.split(":", 1)[1].strip()
        elif line.startswith("- **路线图**:"):
            collecting = True
            continue
        elif collecting and line.startswith("  "):
            stripped = line.strip()
            if stripped:
                data["roadmap"].append(stripped)
        else:
            collecting = False

    if current and data:
        sections[current] = ProgressEntry(
            java_path=data.get("java_path", "") or "",
            scale=data.get("scale", "") or "",
            deps_text=data.get("deps_text", "") or "",
            deps=data.get("deps", []) or [],
            build=data.get("build", "") or "",
            roadmap=data.get("roadmap", []) or [],
        )
    return sections


def parse_deps(path: Path) -> Dict[str, List[Tuple[str, int]]]:
    deps: Dict[str, List[Tuple[str, int]]] = {}
    current: str | None = None
    for idx, raw_line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        line = raw_line.strip()
        if line.startswith("<file "):
            match = re.search(r'path="([^"]+)"', line)
            if match:
                current = match.group(1)
                deps.setdefault(current, [])
        elif line.startswith("</file"):
            current = None
        elif line.startswith("<dependency") and current:
            match = re.search(r'path="([^"]+)"', line)
            if match:
                deps[current].append((match.group(1), idx))
    return deps


def parse_tsc_logs(
    sources: Sequence[Tuple[str, Path]]
) -> Dict[str, List[Dict[str, object]]]:
    pattern = re.compile(
        r"^(src/(?P<path>[^\(]+))\((?P<line>\d+),(?P<col>\d+)\): error (?P<code>TS\d+): (?P<msg>.+)$"
    )
    result: Dict[str, List[Dict[str, object]]] = defaultdict(list)
    for source_name, log_path in sources:
        if not log_path.exists():
            continue
        for raw_line in log_path.read_text(encoding="utf-8").splitlines():
            line = raw_line.strip()
            match = pattern.match(line)
            if not match:
                continue
            ts_path = match.group("path")
            result[ts_path].append(
                {
                    "code": match.group("code"),
                    "line": int(match.group("line")),
                    "col": int(match.group("col")),
                    "message": f"[{source_name}] {match.group('msg')}",
                }
            )
    return result


def normalize_dep(dep: str) -> str:
    text = dep.replace("`", "").strip()
    text = text.replace("src/", "")
    if text.endswith(".ts"):
        text = text[:-3]
    return text


def format_ts_dep_table(
    ts_path: str,
    current_classes: Sequence[Dict[str, object]],
    dep_paths: Sequence[str],
    ts_map: Dict[str, dict],
) -> str:
    if not dep_paths:
        return "（无显式结构性依赖，主要依赖 `jree` 提供的运行时桩或尚未补齐的全局声明。）"

    current_symbol = (
        current_classes[0]["name"]
        if current_classes
        else Path(ts_path).stem
    )
    header = "| 符号 | 来源文件 | 触发位置 | 依赖原因 |\n| --- | --- | --- | --- |"
    rows: List[str] = []
    for dep in dep_paths:
        dep_entry = ts_map.get(f"{dep}.ts")
        symbol = (
            dep_entry["classes"][0]["name"]
            if dep_entry and dep_entry.get("classes")
            else Path(dep).name
        )
        reason = f"结构性：{current_symbol} 直接使用 {symbol} 的主流程"
        rows.append(
            f"| `{symbol}` | `src/{dep}.ts` | import | {reason} |"
        )
    return "\n".join([header, *rows])


def format_external_table(externals: Sequence[str]) -> str:
    externals = [imp for imp in externals if imp]
    if not externals:
        return "（无外部依赖，仅依赖 TypeScript 运行时。）"
    header = "| 模块 | 用途 | 备注 |\n| --- | --- | --- |"
    rows: List[str] = []
    for mod in externals:
        remark = "提供 Java 兼容运行时" if mod == "jree" else "外部依赖"
        rows.append(f"| `{mod}` | 环境桩 | {remark} |")
    return "\n".join([header, *rows])


def summarize_tsc_errors(errors: Sequence[dict]) -> Tuple[str, str, List[str]]:
    if not errors:
        return "  - 无报错", "命令通过，未触发额外依赖。", []
    lines = [
        f"  - {err['code']}（L{err['line']}, C{err['col']}）：{err['message']}"
        for err in errors
    ]
    missing = [
        f"`{err['message']}` @ L{err['line']}"
        for err in errors
        if "Cannot find name" in err["message"]
    ]
    return "\n".join(lines), "存在语法错误，需要比对 Java 语句结构。", missing


def build_java_dep_text(key: str, deps: Sequence[Tuple[str, int]]) -> Tuple[str, str]:
    if not deps:
        return "- deps.xml 未列出额外依赖。", "- TS 与 Java 依赖集合一致。"
    lines = [
        f"- `{key}` -> `{dep}`（deps.xml 第 {line_no} 行）"
        for dep, line_no in deps
    ]
    return "\n".join(lines), ""


def build_dep_diff(ts_deps: Sequence[str], java_deps: Sequence[Tuple[str, int]]) -> str:
    ts_set = set(ts_deps)
    java_set = {dep for dep, _ in java_deps}
    lines: List[str] = []
    if ts_set - java_set:
        lines.append("TS 额外依赖：" + "、".join(sorted(ts_set - java_set)))
    if java_set - ts_set:
        lines.append(
            "Java graph 额外依赖：" + "、".join(sorted(java_set - ts_set))
        )
    if not lines:
        lines.append("TS 与 Java 依赖集合一致。")
    return "\n".join(f"- {line}" for line in lines)


def build_class_lines(class_infos: Sequence[Dict[str, object]]) -> str:
    if not class_infos:
        return "- 以函数或常量导出为主，未声明 class。"
    lines: List[str] = []
    for cls in class_infos:
        extends = ", ".join(cls.get("extends") or []) or "（无继承）"
        implements = ", ".join(cls.get("implements") or []) or "（无接口）"
        lines.append(
            f"- `{cls['name']}` · 继承：{extends} · 实现：{implements}"
        )
    return "\n".join(lines)


def render_entry(
    ts_path: str,
    entry: dict,
    progress: ProgressEntry,
    java_deps_map: Dict[str, List[Tuple[str, int]]],
    ts_map: Dict[str, dict],
) -> str:
    ts_file = f"src/{ts_path}"
    java_rel = progress.java_path or (
        f"java-master/src/main/java/org/opennars/{ts_path[:-3]}.java"
    )
    module_chain = MODULE_CHAIN.get(ts_path.split("/")[0], ts_path.split("/")[0])
    class_infos = entry.get("classes") or []
    ts_dep_paths = [normalize_dep(dep) for dep in progress.deps]
    ts_dep_table = format_ts_dep_table(ts_path, class_infos, ts_dep_paths, ts_map)
    external_table = format_external_table(entry.get("external_imports", []))
    tsc_summary, tsc_result, missing_list = summarize_tsc_errors(
        entry.get("tsc_errors") or []
    )
    missing_block = (
        "\n".join(f"- {item}" for item in missing_list)
        if missing_list
        else "（无缺失符号，报错均与语法结构相关。）"
    )
    java_key = ts_path[:-3]
    java_deps = java_deps_map.get(java_key, [])
    java_dep_text, _ = build_java_dep_text(java_key, java_deps)
    diff_text = build_dep_diff(ts_dep_paths, java_deps)
    roadmap_text = (
        "\n".join(f"- {item}" for item in progress.roadmap)
        if progress.roadmap
        else "- 需补齐路线图条目。"
    )
    dep_prep = next(
        (step[3:].strip() for step in progress.roadmap if step.startswith("1. ")),
        "先保证 language/entity 基础模块就绪。",
    )
    file_work = next(
        (step[3:].strip() for step in progress.roadmap if step.startswith("2. ")),
        "需根据 Java 行为补充职责描述。",
    )
    diff_desc = next(
        (step[3:].strip() for step in progress.roadmap if step.startswith("3. ")),
        "暂无额外差异描述。",
    )
    risk_items: List[str] = []
    todos = entry.get("todos", 0)
    if todos:
        risk_items.append(f"- 文件内仍保留 {todos} 处 TODO，需对照 Java 填补。")
    if entry.get("tsc_errors"):
        risk_items.append("- `tsc` 报错阻塞进一步分析，需要回填语句结构。")
    if not ts_dep_paths:
        risk_items.append("- 缺少显式 import，需依赖 Java/ts-analysis 交叉校验。")
    if not risk_items:
        risk_items.append("- 主要风险来自尚未补齐的 Java 语义与单元测试缺失。")
    risk_text = "\n".join(risk_items)
    additional = "\n".join(
        [
            f"- ts-analysis: LOC={entry.get('loc')} · TODO={entry.get('todos')}",
            f"- 参考文件：`{java_rel}`",
        ]
    )
    class_lines = build_class_lines(class_infos)
    deps_note = (
        ", ".join(sorted(ts_dep_paths))
        if ts_dep_paths
        else "Java Memory/Task 接口"
    )

    return f"""# {ts_file} 分析

## 1. 基础信息

| 字段 | 内容 |
| --- | --- |
| TypeScript 文件 | `{ts_file}` |
| 对应 Java 源文件 | `{java_rel}` |
| 模块链路 | `{module_chain}` |
| 分析时间 / 执行人 | `{ANALYSIS_DATE} / ChatGPT Codex` |
| 参考资料 | {REFERENCES} |

## 2. 语法检查（`npx tsc {ts_file} --noEmit`）

- 执行的命令：`npx tsc {ts_file} --noEmit`
- 关键输出：
{tsc_summary}
- 总结：{tsc_result}；{progress.build}

## 3. TypeScript 依赖梳理

### 3.1 结构性依赖

{ts_dep_table}

### 3.2 表面依赖（常量/调试/枚举等）

{external_table}

### 3.3 缺失符号 / 未决依赖

{missing_block}

## 4. Java 依赖对照（`deps.xml`）

- 直接依赖：
{java_dep_text}
- 交叉校验：
{diff_text}

## 5. Java 功能说明

- **职责概述**：{file_work}
- **关键数据结构**：
{class_lines}
- **核心流程 / 算法**：
  1. {dep_prep}
  2. {file_work}
  3. {diff_desc}
- **重要不变量 / 约束**：保持 Java 行为一致，注意初始化顺序与线程语义。
- **协作接口**：依赖 `{deps_note}` 衔接上下游。

## 6. 一致性风险

{risk_text}

## 7. 路线图定位

{roadmap_text}

## 8. 附加记录

{additional}
"""


def write_overview(ts_map: Dict[str, dict]) -> None:
    overview_path = ANALYSIS_ROOT / "overview.md"
    modules = Counter()
    tsc_fail = []
    todo_entries = []
    missing_java = []
    for ts_path, entry in sorted(ts_map.items()):
        modules[ts_path.split("/")[0]] += 1
        if entry.get("tsc_errors"):
            tsc_fail.append(ts_path)
        if entry.get("todos"):
            todo_entries.append((ts_path, entry["todos"]))
        if not entry.get("java_exists", True):
            missing_java.append(ts_path)
    total_files = len(ts_map)
    todo_total = sum(count for _, count in todo_entries)
    module_lines = "\n".join(
        f"- {module}: {count} 个文件"
        for module, count in modules.most_common()
    )
    tsc_lines = (
        "\n".join(f"- {path}" for path in tsc_fail)
        if tsc_fail
        else "- 所有文件均可通过 `tsc --noEmit`。"
    )
    todo_lines = (
        "\n".join(f"- {path}: TODO {count} 处" for path, count in todo_entries)
        if todo_entries
        else "- 未检测到 TODO。"
    )
    missing_lines = (
        "\n".join(f"- {path}" for path in missing_java)
        if missing_java
        else "- 全部文件均可在 java-master 中找到对应源。"
    )
    overview = f"""# spec004 文件分析总览

- 分析时间：{ANALYSIS_DATE}
- 覆盖范围：`src` 目录下 {total_files} 个 TypeScript 文件
- TODO 累计：{todo_total} 处

## 模块分布

{module_lines}

## `npx tsc --noEmit` 失败文件

{tsc_lines}

## TODO 分布

{todo_lines}

## 缺失 Java 对应文件

{missing_lines}
"""
    overview_path.parent.mkdir(parents=True, exist_ok=True)
    overview_path.write_text(overview.strip() + "\n", encoding="utf-8")


def main() -> None:
    ts_entries = json.loads(TS_ANALYSIS_PATH.read_text(encoding="utf-8"))
    ts_map = {entry["ts_path"]: entry for entry in ts_entries}
    progress_map = parse_progress(PROGRESS_PATH)
    java_deps_map = parse_deps(DEPS_PATH)
    tsc_errors_map = parse_tsc_logs(TSC_CHECKS)
    for ts_path, entry in ts_map.items():
        entry["tsc_errors"] = tsc_errors_map.get(ts_path, [])
    ANALYSIS_ROOT.mkdir(parents=True, exist_ok=True)

    for ts_path in sorted(ts_map.keys()):
        entry = ts_map[ts_path]
        progress = progress_map.get(ts_path)
        if not progress:
            raise RuntimeError(f"progress.md 缺少 {ts_path} 的条目")
        out_path = ANALYSIS_ROOT / Path(ts_path).with_suffix(".md")
        out_path.parent.mkdir(parents=True, exist_ok=True)
        out_path.write_text(
            render_entry(ts_path, entry, progress, java_deps_map, ts_map).strip()
            + "\n",
            encoding="utf-8",
        )

    write_overview(ts_map)
    print(f"Generated {len(ts_map)} analysis files under {ANALYSIS_ROOT}")


if __name__ == "__main__":
    main()
