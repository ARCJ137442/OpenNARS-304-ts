import json
from collections import Counter
from pathlib import Path
from typing import Dict, Iterable, List


def escape_non_ascii(text: str) -> str:
    return "".join(f"\\u{ord(ch):04x}" if ord(ch) > 127 else ch for ch in text)


def add_line(lines: List[str], text: str = "") -> None:
    lines.append(escape_non_ascii(text) if text else "")


def load_analysis() -> List[dict]:
    return json.loads(Path("ts-analysis.json").read_text(encoding="utf-8"))


PACKAGE_ORDER = {
    "control": 0,
    "entity": 1,
    "inference": 2,
    "interfaces": 3,
    "io": 4,
    "language": 5,
    "main": 6,
    "operator": 7,
    "plugin": 8,
    "storage": 9,
    "util": 10,
}

ROUTE_GUIDANCE = {
    "control": {
        "focus": "\u91cd\u5efa\u63a8\u7406\u5faa\u73af\u3001\u4efb\u52a1\u8c03\u5ea6\u4e0e\u6682\u505c\u673a\u5236\uff0c\u66ff\u6362 synchronized/wait \u884c\u4e3a\u3002",
        "diff": "\u53c2\u89c1\u300a\u901a\u7528\u8f6c\u8bd1\u6cd5.md\u300b - \u63a7\u5236\u4e0e\u8c03\u5ea6",
    },
    "entity": {
        "focus": "\u4fdd\u6301 Stamp/TruthValue \u7b49\u503c\u5bf9\u8c61\u7684\u4e0d\u53ef\u53d8\u8bed\u4e49\uff0c\u8865\u9f50 clone/equals/hash \u4e0e\u5e8f\u5217\u5316\u3002",
        "diff": "\u53c2\u89c1\u300a\u901a\u7528\u8f6c\u8bd1\u6cd5.md\u300b - \u5b9e\u4f53\u4e0e\u5e8f\u5217\u5316",
    },
    "inference": {
        "focus": "\u590d\u5236\u89c4\u5219/\u771f\u503c/\u9884\u7b97\u9759\u6001\u8868\u5e76\u5b8c\u5584\u7c7b\u578b\u7ea6\u675f\u4e0e\u6570\u503c\u6821\u9a8c\u3002",
        "diff": "\u53c2\u89c1\u300a\u901a\u7528\u8f6c\u8bd1\u6cd5.md\u300b - \u63a8\u7406\u89c4\u5219",
    },
    "interfaces": {
        "focus": "\u4ee5 interface/abstract class \u8fd8\u539f Java \u63a5\u53e3\uff0c\u5728 TS \u5b9e\u73b0\u7c7b\u4e2d\u663e\u5f0f implements\u3002",
        "diff": "\u53c2\u89c1\u300a\u901a\u7528\u8f6c\u8bd1\u6cd5.md\u300b - \u63a5\u53e3\u89c4\u8303",
    },
    "io": {
        "focus": "\u5c06 java.io \u6d41\u4e0e\u4e8b\u4ef6\u8f6c\u63a5\u5230 Node \u6d41 + EventEmitter\uff0c\u8865\u5b8f Parser/Narsese/Events \u94fe\u8def\u3002",
        "diff": "\u53c2\u89c1\u300a\u901a\u7528\u8f6c\u8bd1\u6cd5.md\u300b - I/O \u4e0e\u4e8b\u4ef6",
    },
    "language": {
        "focus": "\u7ef4\u6301 Term/Statement \u5c42\u7684\u6cdb\u578b\u5c42\u6b21\u548c\u4e0d\u53ef\u53d8\u7ed3\u6784\uff0c\u540c\u65f6\u7edf\u4e00\u7f13\u5b58\u7b56\u7565\u3002",
        "diff": "\u53c2\u89c1\u300a\u901a\u7528\u8f6c\u8bd1\u6cd5.md\u300b - \u8bed\u8a00\u5c42",
    },
    "main": {
        "focus": "\u628a Nar/NarNode/Shell \u751f\u547d\u5468\u671f\u3001\u7ebf\u7a0b\u548c CLI \u642d\u5230 Node \u5f02\u6b65\u63a7\u5236\u5668\u4e0a\u3002",
        "diff": "\u53c2\u89c1\u300a\u901a\u7528\u8f6c\u8bd1\u6cd5.md\u300b - \u4e3b\u7a0b\u5e8f",
    },
    "operator": {
        "focus": "\u5c06 Operation \u6ce8\u518c\u4e0e Memory \u4ea4\u4e92\u663e\u5f0f\u5316\uff0c\u8865\u5199\u526f\u4f5c\u7528\u4e0e\u9884\u7b97\u66f4\u65b0\u3002",
        "diff": "\u53c2\u89c1\u300a\u901a\u7528\u8f6c\u8bd1\u6cd5.md\u300b - \u64cd\u4f5c\u7b26",
    },
    "plugin": {
        "focus": "\u4e3a\u5fc3\u7406/\u611f\u77e5\u63d2\u4ef6\u63d0\u4f9b\u4e8b\u4ef6\u901a\u9053\u3001\u72b6\u6001\u7f13\u5b58\u4e0e\u5173\u95ed\u6d41\u7a0b\u3002",
        "diff": "\u53c2\u89c1\u300a\u901a\u7528\u8f6c\u8bd1\u6cd5.md\u300b - \u63d2\u4ef6",
    },
    "storage": {
        "focus": "\u9a8c\u8bc1 Bag/Memory/Distributor \u7684\u5bb9\u91cf\u3001\u987a\u5e8f\u4e0e\u7ebf\u7a0b\u5b89\u5168\uff0c\u8865\u5b8c\u65ad\u8a00\u548c\u6d4b\u8bd5\u3002",
        "diff": "\u53c2\u89c1\u300a\u901a\u7528\u8f6c\u8bd1\u6cd5.md\u300b - \u5b58\u50a8\u7ed3\u6784",
    },
    "util": {
        "focus": "\u6574\u5408 java.util \u5de5\u5177\u5e76\u4fdd\u6301 int/long \u884c\u4e3a\u4e00\u81f4\uff0c\u4e2d\u5fc3\u5b58\u653e\u5de5\u5177\u51fd\u6570\u3002",
        "diff": "\u53c2\u89c1\u300a\u901a\u7528\u8f6c\u8bd1\u6cd5.md\u300b - \u5de5\u5177\u5c42",
    },
}

PLAYBOOK_SECTIONS = [
    {
        "key": "control",
        "title": "Control & Scheduling (\u63a7\u5236\u4e0e\u8c03\u5ea6)",
        "baseline": "Java runtime relies on synchronized/wait/notify and Thread loops; TypeScript must lean on Node's event loop plus Promise control flow.",
        "verify": "Add node:test smoke tests that cover pause/resume cycles and priority switching inside Nar/NarNode/Scheduler.",
    },
    {
        "key": "entity",
        "title": "Entity & Serialization (\u5b9e\u4f53\u4e0e\u5e8f\u5217\u5316)",
        "baseline": "Java uses Serializable, clone, equals/hashCode, and 64-bit primitives for value semantics; TS lacks these built-ins.",
        "verify": "Provide clone/equals/hash fixtures and JSON round-trip cases to match Java's signed width expectations.",
    },
    {
        "key": "inference",
        "title": "Inference Rules (\u63a8\u7406\u89c4\u5219)",
        "baseline": "TruthFunctions, RuleTables, and BudgetFunctions rely on static tables plus overloading in Java.",
        "verify": "Back each rule with node:test regression vectors comparing the TS outputs to the Java baseline.",
    },
    {
        "key": "interfaces",
        "title": "Interface Contracts (\u63a5\u53e3\u89c4\u8303)",
        "baseline": "Java interfaces allow default methods and multiple inheritance; TS needs explicit interface/abstract hierarchies.",
        "verify": "Use tsd/type-guard assertions so every implementation satisfies the expected structural contract.",
    },
    {
        "key": "io",
        "title": "IO & Event Pipelines (I/O \u4e0e\u4e8b\u4ef6\u94fe\u8def)",
        "baseline": "Java depends on java.io plus Observer/EventListener; TS must use Node streams and EventEmitter to transport data.",
        "verify": "Replay parser/event fixtures to ensure Node stream outputs line up with Java InputStream behavior.",
    },
    {
        "key": "language",
        "title": "Language Layer (\u8bed\u8a00\u5c42)",
        "baseline": "Term/Statement/CompoundTerm use Java generics and static caches to enforce type strata.",
        "verify": "Author equals/hash/unify combo tests covering the major term families to guard cache consistency.",
    },
    {
        "key": "main",
        "title": "Main Runtime (\u4e3b\u7a0b\u5e8f)",
        "baseline": "Nar, NarNode, and Shell depend on Java threads, CLI parsing, and sockets.",
        "verify": "Simulate CLI input/output with node:test to confirm lifecycle hooks and worker orchestration mirror Java.",
    },
    {
        "key": "operator",
        "title": "Operators (\u64cd\u4f5c\u7b26)",
        "baseline": "Java registers operations via reflection; TS needs explicit OperatorRegistry wiring and dependency injection.",
        "verify": "Write task-execution samples for each operator to confirm side-effects (task creation, budget updates) match.",
    },
    {
        "key": "plugin",
        "title": "Plugins (\u63d2\u4ef6)",
        "baseline": "Java loads plugins through ServiceLoader and reflection-based factories.",
        "verify": "Drive plugin lifecycle with a fake PluginContext, replaying event/input samples to ensure determinism.",
    },
    {
        "key": "storage",
        "title": "Storage Structures (\u5b58\u50a8\u7ed3\u6784)",
        "baseline": "Bag, Memory, and Distributor enforce capacity/order via synchronized blocks in Java.",
        "verify": "Extend node:test beyond Distributor.ts to assert bag sampling, memory eviction, and distributor ordering.",
    },
    {
        "key": "util",
        "title": "Util Layer (\u5de5\u5177\u5c42)",
        "baseline": "java.util/*, Collections, and Arrays supply helpers missing from TS.",
        "verify": "Exercise edge cases for list/array/number helpers—especially sampling/sorting—to match Java semantics.",
    },
    {
        "key": "testing",
        "title": "Testing & Tooling (\u6d4b\u8bd5\u4e0e\u5de5\u5177\u94fe)",
        "strategy": "\u6bcf\u4e2a\u5305\u81f3\u5c11\u8865\u5145\u4e00\u4e2a smoke test\uff0cCI \u9700\u8981\u56fa\u5b9a `npx tsc --noEmit` + `npm test` \u6d4b\u8bd5\u7ebf\uff0c\u540c\u65f6\u51fa\u5173 hanzi \u7f16\u7801\u62a5\u544a\u3002",
        "diff": "\u5173\u6ce8\u7cfb\u7edf\u8f6c\u8bd1\u4e2d\u7684\u7f16\u7801/\u8bed\u8a00\u73af\u5883\u5dee\u5f02\uff0c\u6bcf\u6b21\u4fee\u6539\u9690\u542b\u4e2d\u6587\u7684 Markdown \u90fd\u8981\u57fa\u4e8e hanzi-report.json \u590d\u68c0\u3002",
        "baseline": "Only storage/Distributor.ts has node:test coverage today; historical Chinese docs suffered mojibake.",
        "verify": "Automate hanzi encoding checks and keep npm scripts green before sending PRs.",
    },
]

DEFAULT_ROUTE = {
    "focus": "\u8865\u9f50\u5269\u4f59\u8f6c\u8bd1\u4e0e\u65ad\u8a00\uff0c\u5efa\u7acb smoke test\u3002",
    "diff": "\u53c2\u89c1\u300a\u901a\u7528\u8f6c\u8bd1\u6cd5.md\u300b - \u6d4b\u8bd5\u4e0e\u5de5\u5177",
}

SPECIAL_JAVA = {
    "main/Parameters.ts": "parameter/Parameters.java",
    "main/Debug.ts": "parameter/Debug.java",
}


def java_rel(path: str) -> str:
    rel = SPECIAL_JAVA.get(path)
    if rel is None:
        rel = f"{path[:-3]}.java"
    return f"java-master/src/main/java/org/opennars/{rel}"


def summarize_deps(row: dict) -> str:
    locals_: List[str] = []
    missing: List[str] = []
    seen: set[str] = set()
    for dep in row["local_imports"]:
        target = dep["path"]
        if target in seen:
            continue
        seen.add(target)
        if dep["exists"]:
            locals_.append(target)
        else:
            missing.append(target)
    parts: List[str] = []
    if locals_:
        text = "\u4f9d\u8d56\uff1a" + ", ".join(locals_[:6])
        if len(locals_) > 6:
            text += " ..."
        parts.append(text)
    if missing:
        text = "\u7f3a\u5931\uff1a" + ", ".join(missing[:4])
        if len(missing) > 4:
            text += " ..."
        parts.append(text)
    if not parts:
        return "\u4ec5\u4f9d\u8d56 jree \u6216 TS \u81ea\u8eab\u9759\u6001\u6210\u5458"
    return " ; ".join(parts)


def summarize_tsc(row: dict) -> str:
    errors = row["tsc_errors"]
    if not errors:
        return "\u5df2\u901a\u8fc7 `npx tsc --noEmit`"
    head = errors[0]
    text = f"{head['code']} @ {head['line']}:{head['col']} {head['message']}"
    if len(errors) > 1:
        text += f"\uff0c\u53e6\u6709 {len(errors) - 1} \u6761"
    return "\u7f16\u8bd1\u5931\u8d25\uff1a" + text


def summarize_tests(row: dict) -> str:
    if row["tests"]:
        joined = ", ".join(f"test/{name}" for name in row["tests"])
        return "\u5df2\u88ab `npm test` \u8986\u76d6\uff1a" + joined
    return "\u6682\u65e0\u9488\u5bf9\u6027\u6d4b\u8bd5"


def route_focus(row: dict, base_focus: str) -> str:
    extras: List[str] = []
    if row["tsc_errors"]:
        head = row["tsc_errors"][0]
        extras.append(
            f"tsc {head['code']} @ {head['line']}:{head['col']} \u9519\u8bef"
        )
    if row["todos"]:
        extras.append(f"TODO {row['todos']} \u5904")
    if extras:
        return base_focus + "\uff1b" + "\uff1b".join(extras)
    return base_focus


def file_sections(rows: Iterable[dict]) -> List[str]:
    lines: List[str] = []
    for row in rows:
        guide = ROUTE_GUIDANCE.get(row["package"], DEFAULT_ROUTE)
        deps_text = summarize_deps(row)
        add_line(lines, f"## {row['ts_path']}")
        add_line(lines, "")
        add_line(lines, f"- **Java\u5bf9\u7167**: `{java_rel(row['ts_path'])}`")
        add_line(
            lines,
            f"- **\u89c4\u6a21 / TODO**: \u7ea6 {row['loc']} \u884c\uff0cTODO {row['todos']} \u5904",
        )
        add_line(lines, f"- **\u4f9d\u8d56\u73b0\u72b6**: {deps_text}")
        add_line(
            lines,
            f"- **\u7f16\u8bd1 / \u6d4b\u8bd5**: {summarize_tsc(row)} ; {summarize_tests(row)}",
        )
        add_line(lines, "- **\u8def\u7ebf\u56fe**:")
        add_line(lines, f"  1. \u4f9d\u8d56\u51c6\u5907\uff1a{deps_text}")
        add_line(lines, f"  2. \u6587\u4ef6\u5de5\u4f5c\uff1a{route_focus(row, guide['focus'])}")
        add_line(lines, f"  3. Java-TS \u5dee\u5f02\uff1a{guide['diff']}")
        add_line(lines)
    return lines


def load_java_counts() -> Counter:
    pointer_file = Path("java-master")
    try:
        pointer = pointer_file.read_text(encoding="utf-8").strip()
    except FileNotFoundError:
        return Counter()
    java_root = (pointer_file.parent / pointer).resolve()
    java_src = java_root / "src" / "main" / "java" / "org" / "opennars"
    counts: Counter = Counter()
    if not java_src.exists():
        return counts
    for path in java_src.rglob("*.java"):
        rel = path.relative_to(java_src).as_posix()
        top = rel.split("/", 1)[0]
        counts[top] += 1
    return counts


def generate_progress(rows: List[dict]) -> List[str]:
    package_counts = Counter(r["package"] for r in rows)
    todo_total = sum(r["todos"] for r in rows)
    error_rows = [r for r in rows if r["tsc_errors"]]
    lines: List[str] = []
    add_line(lines, "# TypeScript \u6587\u4ef6\u8fdb\u5ea6\u603b\u89c8")
    add_line(lines, "")
    add_line(
        lines,
        f"- \u5f53\u524d\u8ffd\u8e2a `src` \u76ee\u5f55\u4e0b {len(rows)} \u4e2a TypeScript \u6587\u4ef6\uff0c\u7d2f\u8ba1\u53d1\u73b0 TODO {todo_total} \u5904\u3002",
    )
    add_line(
        lines,
        f"- `npx tsc --noEmit` \u5728 {len(error_rows)} \u4e2a\u6e90\u4ee3\u7801\u6587\u4ef6 (\u53e6\u542b `test/metrics/AttentionMetric.ts`) \u4e0a\u5931\u8d25\u3002",
    )
    add_line(
        lines,
        "- `npm test` \u4ec5\u6267\u884c `test/node/distributor.test.ts` \u5e76\u901a\u8fc7\u3002",
    )
    add_line(lines, "")
    add_line(lines, "\u5305\u53d7\u76d1\u63a7\uff1a")
    for name in sorted(package_counts, key=lambda p: PACKAGE_ORDER.get(p, 99)):
        add_line(
            lines,
            f"- {name}: {package_counts[name]} \u4e2a TS \u6587\u4ef6",
        )
    add_line(lines, "")
    add_line(
        lines,
        "\u4e0b\u6587\u6309\u5305\u5217\u51fa Java \u5bf9\u7167\u3001\u4f9d\u8d56\u73b0\u72b6\u3001\u7f16\u8bd1/\u6d4b\u8bd5\u548c\u8def\u7ebf\u56fe\u3002",
    )
    add_line(lines, "")
    lines.extend(file_sections(rows))
    return lines


def generate_situation(rows: List[dict], java_counts: Counter) -> List[str]:
    package_counts = Counter(r["package"] for r in rows)
    todo_total = sum(r["todos"] for r in rows)
    error_rows = [r for r in rows if r["tsc_errors"]]
    lines: List[str] = []
    add_line(lines, "# \u73b0\u72b6\u62a5\u544a")
    add_line(lines, "")
    add_line(
        lines,
        "> \u6240\u5c5espec\uff1a[ts-translation-assessment](README.md)",
    )
    add_line(lines, "")
    add_line(lines, "## \u8303\u56f4")
    add_line(
        lines,
        "\u5bf9\u6bd4 java-master/src/main/java/org/opennars \u548c\u5f53\u524d `src` TypeScript \u5b9e\u73b0\uff0c\u4ee5 ts-analysis.json \u4fe1\u606f\u4e3a\u6838\u5fc3\u8d44\u6599\u6765\u7edf\u8ba1\u8986\u76d6\u7387\u3001\u8bed\u6cd5\u53ef\u6267\u884c\u6027\u4e0e\u4f9d\u8d56\u5b8c\u6574\u6027\u3002",
    )
    add_line(lines, "")
    add_line(lines, "## \u6267\u884c\u6458\u8981")
    add_line(
        lines,
        f"- \u89c4\u6a21\uff1a\u5171\u8ba1 {len(rows)} \u4e2a TS \u6587\u4ef6\uff0cTODO {todo_total} \u5904\uff0c\u5168\u90e8\u5df2\u6620\u5c04\u81f3 Java \u6e90\u6587\u4ef6\u3002",
    )
    add_line(
        lines,
        f"- \u7f16\u8bd1\uff1a`npx tsc --noEmit` \u5bf9 {len(error_rows)} \u4e2a TS \u6587\u4ef6\u62a5\u544a\u9519\u8bef\uff0c\u53ca `test/metrics/AttentionMetric.ts` (\u5355\u72ec\u8bbe\u7f6e\u7684\u6d4b\u8bd5) \u9700\u8981\u4e00\u5e76\u4fee\u590d\u3002",
    )
    add_line(
        lines,
        "- \u6d4b\u8bd5\uff1a\u76ee\u524d `npm test` \u53ea\u8986\u76d6 `test/node/distributor.test.ts`\uff0c\u5927\u90e8\u5206\u6838\u5fc3\u6587\u4ef6\u7f3a\u4e4f\u70ed\u70b9\u6d4b\u8bd5\u3002",
    )
    add_line(lines, "- \u6570\u636e\uff1a\u672c\u62a5\u544a\u91c7\u7528 ts-analysis.json + tsc/npm test \u5b9e\u8fd0\u5229\u7528\u7ed3\u679c\u3002")
    add_line(lines, "")
    add_line(lines, "## \u6309\u5305\u7edf\u8ba1")
    packages = sorted(
        set(java_counts.keys()) | set(package_counts.keys()),
        key=lambda p: PACKAGE_ORDER.get(p, 99),
    )
    for name in packages:
        ts_count = package_counts.get(name, 0)
        java_count = java_counts.get(name, 0)
        delta = java_count - ts_count
        if java_count == 0:
            status = f"TS {ts_count} \u4e2a\uff0c\u65e0\u5bf9\u5e94 Java \u76ee\u5f55\u6570\u636e"
        elif delta > 0:
            status = f"TS {ts_count}/{java_count}\uff0c\u4ecd\u7f3a {delta} \u4e2a Java \u6587\u4ef6\u7ffb\u8bd1"
        elif delta < 0:
            status = f"TS {ts_count}/{java_count}\uff0cTS \u6bd4 Java \u989d\u5916 {abs(delta)} \u4e2a\u6587\u4ef6 (\u5982 main/\u63d0\u53d6 Parameter)"
        else:
            status = f"TS {ts_count}/{java_count}\uff0c\u5df2\u5b8c\u5168\u5bf9\u9f50"
        add_line(lines, f"- {name}: {status}")
    add_line(lines, "")
    add_line(lines, "## \u7f16\u8bd1\u4e0e\u6d4b\u8bd5\u73b0\u72b6")
    if error_rows:
        add_line(lines, "\u4ee5\u4e0b\u6587\u4ef6\u9700\u8981\u5148\u4fee\u590d tsc \u9519\u8bef\uff1a")
        for row in error_rows:
            head = row["tsc_errors"][0]
            add_line(
                lines,
                f"- {row['ts_path']}: {head['code']} @ {head['line']}:{head['col']} {head['message']}",
            )
    else:
        add_line(lines, "- `npx tsc --noEmit` \u5df2\u901a\u8fc7")
    add_line(
        lines,
        "- `npm test`: \u5c1a\u4fdd\u7559 `test/node/distributor.test.ts`\uff0c\u9700\u4f9d\u7167\u8def\u7ebf\u56fe\u4e3a\u5176\u4ed6\u6a21\u5757\u589e\u8865 smoke test\u3002",
    )
    add_line(lines, "")
    add_line(lines, "## \u6587\u4ef6\u7ea7\u8bc4\u4f30")
    add_line(
        lines,
        "\u672c\u6bb5\u5bf9\u6bcf\u4e2a TS \u6587\u4ef6\u5efa\u7acb\u201cJava \u5bf9\u7167\u201d\u3001\u201c\u53ef\u6267\u884c\u6027\u201d\u3001\u201c\u8def\u7ebf\u56fe\u201d\u4fe1\u606f\uff0c\u4ee5\u4fa7\u52a9\u540e\u7eed\u8f6c\u8bd1\u6392\u671f\u3002",
    )
    add_line(lines, "")
    lines.extend(file_sections(rows))
    return lines


def generate_playbook() -> List[str]:
    lines: List[str] = []
    add_line(lines, "# \u901a\u7528\u8f6c\u8bd1\u6cd5 (Java -> TypeScript)")
    add_line(
        lines,
        "\u6b64\u8282\u7edf\u62d8 Java \u4e0e TypeScript \u4e4b\u95f4\u7684\u7cfb\u7edf\u5dee\u5f02\uff0c\u4ee5\u4fbf situation.md \u548c progress.md \u7684\u8def\u7ebf\u56fe\u53ef\u4ee5\u5f15\u7528\u56fa\u5b9a\u7684\u57fa\u51c6\u3002",
    )
    add_line(lines, "")
    for section in PLAYBOOK_SECTIONS:
        guide = ROUTE_GUIDANCE.get(section["key"], DEFAULT_ROUTE)
        strategy_text = section.get("strategy", guide["focus"])
        diff_text = section.get("diff", guide["diff"])
        add_line(lines, f"## {section['title']}")
        add_line(lines, f"- Baseline: {section['baseline']}")
        add_line(lines, f"- \u8f6c\u8bd1\u7b56\u7565: {strategy_text}")
        add_line(lines, f"- Java\u2192TS: {diff_text}")
        add_line(lines, f"- Verification: {section['verify']}")
        add_line(lines, "")
    return lines


def main() -> None:
    rows = sorted(
        load_analysis(),
        key=lambda r: (PACKAGE_ORDER.get(r["package"], 99), r["ts_path"]),
    )
    java_counts = load_java_counts()
    progress_lines = generate_progress(rows)
    Path("specs/002-ts-progress-report/progress.md").write_text(
        "\n".join(progress_lines) + "\n",
        encoding="utf-8",
    )
    situation_lines = generate_situation(rows, java_counts)
    Path("specs/001-ts-translation-assessment/situation.md").write_text(
        "\n".join(situation_lines) + "\n",
        encoding="utf-8",
    )
    playbook_lines = generate_playbook()
    Path("specs/002-ts-progress-report/\u901a\u7528\u8f6c\u8bd1\u6cd5.md").write_text(
        "\n".join(playbook_lines) + "\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
