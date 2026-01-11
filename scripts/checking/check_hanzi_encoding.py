#!/usr/bin/env python3
"""Detect potential Chinese text encoding issues in Markdown/text files."""

from __future__ import annotations

import argparse
import json
import re
import sys
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Iterable, List, Sequence

NORMAL_CHINESE = re.compile(r"[\u4e00-\u9fff]+")
'''Typical UTF-8 normal Chinese characters are rendered as single characters.'''
QUESTION_RUN = re.compile(r"\?{4,}")
'''Typical UTF-8 question runs (???) are used for Chinese characters.'''
RAW_UNICODE_SERIES = re.compile(r'\\u([0-9a-fA-F]{4})')
'''Typical UTF-8 raw Unicode series (\\uXXXX) are used instead of normal Chinese characters.'''
MOJIBAKE = re.compile(r"[\u0080-\u00FF]{2,}")
'''Typical UTF-8 mojibake renders as sequences of extended Latin letters (æåéâ).'''

DEFAULT_EXTS: Sequence[str] = (".md", ".markdown", ".mdown", ".txt", ".rst")
DEFAULT_IGNORE_DIRS = {
    ".git",
    ".hg",
    ".svn",
    ".idea",
    ".vscode",
    "node_modules",
    "dist",
    "build",
    "__pycache__",
}


@dataclass
class Issue:
    file: str
    rule: str
    line: int | None
    snippet: str


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Scan Markdown and text files for potential encoding issues."
    )
    parser.add_argument(
        "--root",
        type=Path,
        default=Path.cwd(),
        help="Root directory to scan (default: current working directory).",
    )
    parser.add_argument(
        "--ext",
        nargs="+",
        default=list(DEFAULT_EXTS),
        help="File extensions to include (default: %(default)s).",
    )
    parser.add_argument(
        "--ignore",
        nargs="*",
        default=list(DEFAULT_IGNORE_DIRS),
        help="Directory names to skip entirely.",
    )
    parser.add_argument(
        "--json-output",
        type=Path,
        help="Optional path to write JSON report.",
    )
    parser.add_argument(
        "--max-bytes",
        type=int,
        default=1_000_000,
        help="Skip files larger than this many bytes (default: %(default)s).",
    )
    return parser.parse_args()


def is_ignored(path: Path, ignore_names: set[str]) -> bool:
    return any(part in ignore_names for part in path.parts)


def trim_snippet(text: str, limit: int = 160) -> str:
    text = text.strip()
    if len(text) <= limit:
        return text
    return text[: limit - 1] + "…"


def read_text(path: Path) -> tuple[str, bool]:
    data = path.read_bytes()
    try:
        return data.decode("utf-8"), False
    except UnicodeDecodeError:
        # Keep as much context as possible while signalling decoding failures.
        return data.decode("utf-8", errors="replace"), True


def scan_text(text: str, file_display: str) -> List[Issue]:
    issues: List[Issue] = []
    for idx, line in enumerate(text.splitlines(), 1):
        # 若同行有中文，跳过
        if NORMAL_CHINESE.search(line):
            continue
        # 正则检索
        if QUESTION_RUN.search(line):
            issues.append(
                Issue(
                    file=file_display,
                    rule="question-run",
                    line=idx,
                    snippet=trim_snippet(line),
                )
            )
        if MOJIBAKE.search(line):
            issues.append(
                Issue(
                    file=file_display,
                    rule="latin-mojibake",
                    line=idx,
                    snippet=trim_snippet(line),
                )
            )
        if RAW_UNICODE_SERIES.search(line):
            issues.append(
                Issue(
                    file=file_display,
                    rule="raw-unicode-series",
                    line=idx,
                    snippet=trim_snippet(line),
                )
            )
    return issues


def scan_file(path: Path, root: Path) -> List[Issue]:
    rel_path = path.relative_to(root)
    text, decode_failed = read_text(path)
    issues = scan_text(text, str(rel_path))
    if decode_failed:
        issues.append(
            Issue(
                file=str(rel_path),
                rule="decode-error",
                line=None,
                snippet="File is not valid UTF-8; bytes were replaced during parsing.",
            )
        )
    return issues


def iter_candidate_files(
    root: Path, exts: Sequence[str], ignore_names: set[str], max_bytes: int
) -> Iterable[Path]:
    exts_lower = {ext.lower() for ext in exts}
    for path in root.rglob("*"):
        if not path.is_file():
            continue
        if path.suffix.lower() not in exts_lower:
            continue
        if is_ignored(path.parent, ignore_names):
            continue
        try:
            if path.stat().st_size > max_bytes:
                continue
        except OSError:
            continue
        yield path


def main() -> int:
    args = parse_args()
    root = args.root.resolve()
    if not root.exists():
        print(f"[error] Root directory does not exist: {root}", file=sys.stderr)
        return 2

    all_issues: List[Issue] = []
    files_scanned = 0
    ignore_set = set(args.ignore)
    args.root = root

    for file_path in iter_candidate_files(root, args.ext, ignore_set, args.max_bytes):
        files_scanned += 1
        all_issues.extend(scan_file(file_path, root))
        print(f"[info] Scanned {file_path.relative_to(root)}") # 报告相对路径
    print(f"[info] Scanned {files_scanned} files under {repr(root)}.")
    print()

    issues_by_file: dict[str, List[Issue]] = {}
    for issue in all_issues:
        issues_by_file.setdefault(issue.file, []).append(issue)

    if issues_by_file:
        print(f"[warn] Found potential encoding issues in {len(issues_by_file)} files.")
        for file in sorted(issues_by_file):
            print(f"- {file} ({len(issues_by_file[file])} issues)")
            for issue in issues_by_file[file]:
                location = f"line {issue.line}" if issue.line is not None else "file"
                # 打印snippet也可能出现错误，所以使用try
                snippet = repr(issue.snippet)
                try:
                    print(f"  - [{issue.rule}] {location}: {snippet}")
                except:
                    print(f"  - [{issue.rule}] {location}: <string truncated with len={len(snippet)} can't print>")
    else:
        print(
            f"[ok] No encoding anomalies were found."
        )

    if args.json_output:
        payload = [asdict(issue) for issue in all_issues]
        args.json_output.parent.mkdir(parents=True, exist_ok=True)
        args.json_output.write_text(json.dumps(payload, ensure_ascii=False, indent=2))
        print(f"[info] Wrote JSON report to {args.json_output}")

    return 1 if issues_by_file else 0


if __name__ == "__main__":
    raise SystemExit(main())
