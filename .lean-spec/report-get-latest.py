import builtins
import os
import re
import sys
from datetime import datetime
from typing import List, Optional, Tuple


def move_to_workspace_root() -> None:
    """Walk up the directory tree until a .lean-spec folder is found."""
    current = os.getcwd()
    while current and not os.path.exists(os.path.join(current, ".lean-spec")):
        parent = os.path.dirname(current)
        if parent == current:
            break
        os.chdir(parent)
        current = parent


move_to_workspace_root()

REPORTS_DIR = "reports"

if not os.path.exists(REPORTS_DIR):
    os.mkdir(REPORTS_DIR)

CREATED_PATTERN = re.compile(r"^created:\s*['\"]?(.+?)['\"]?\s*$", re.IGNORECASE)
NOTE_PATTERN = re.compile(r"(?<!`)【([^】]+)】(?!`)")

_encoding_warning_emitted = False


def safe_print(*args, sep: str = " ", end: str = "\n") -> None:
    """Print helper that surfaces console encoding issues and provides guidance."""
    global _encoding_warning_emitted
    try:
        builtins.print(*args, sep=sep, end=end)
    except UnicodeEncodeError:
        text = sep.join(str(arg) for arg in args) + end
        buffer = getattr(sys.stdout, "buffer", None)
        if buffer is not None:
            buffer.write(text.encode("utf-8", errors="replace"))
            buffer.flush()
            if not _encoding_warning_emitted:
                warning = (
                    "⚠️ 输出包含当前 PowerShell 编码无法处理的字符。\n"
                    "   请改用 Unicode 模式调用 PowerShell（示例：powershell -Encoding Unicode "
                    "-Command \"python .lean-spec/report-get-latest.py\"）。\n"
                )
                buffer.write(warning.encode("utf-8", errors="replace"))
                buffer.flush()
                _encoding_warning_emitted = True
        else:
            sys.stdout.write(text)
            sys.stdout.flush()
            if not _encoding_warning_emitted:
                sys.stdout.write(
                    "Encoding warning: rerun PowerShell with Unicode output.\n"
                )
                sys.stdout.flush()
                _encoding_warning_emitted = True


def read_report_text(file_name: str) -> str:
    """Read a report file with a UTF-8 fallback strategy."""
    path = os.path.join(REPORTS_DIR, file_name)
    for encoding in ("utf-8", "utf-8-sig"):
        try:
            with open(path, "r", encoding=encoding) as handle:
                return handle.read()
        except UnicodeDecodeError:
            continue
    with open(path, "r", errors="replace") as handle:
        return handle.read()


def extract_created_datetime(content: str) -> Optional[datetime]:
    """Extract the created timestamp from the frontmatter."""
    in_frontmatter = False
    for line in content.splitlines():
        stripped = line.strip()
        if stripped == "---":
            if not in_frontmatter:
                in_frontmatter = True
                continue
            break
        if in_frontmatter:
            match = CREATED_PATTERN.match(stripped)
            if match:
                value = match.group(1).strip().strip("'\"")
                for fmt in ("%Y-%m-%d %H:%M:%S", "%Y-%m-%d %H:%M"):
                    try:
                        return datetime.strptime(value, fmt)
                    except ValueError:
                        continue
                try:
                    return datetime.fromisoformat(value)
                except ValueError:
                    return None
    return None


def parse_filename_datetime(file_name: str) -> Optional[datetime]:
    """Fallback to the YYYYMMDD-HHMMSS portion of the filename."""
    base_name = os.path.splitext(file_name)[0]
    match = re.match(r"(?P<date>\d{8})-(?P<time>\d{6})", base_name)
    if not match:
        return None
    try:
        dt_string = f"{match.group('date')}{match.group('time')}"
        return datetime.strptime(dt_string, "%Y%m%d%H%M%S")
    except ValueError:
        return None


def get_report_datetime(file_name: str) -> Optional[datetime]:
    """Return the best-effort datetime for a report file."""
    content = read_report_text(file_name)
    created = extract_created_datetime(content)
    return created if created is not None else parse_filename_datetime(file_name)


def list_report_files() -> List[str]:
    """List all Markdown reports sorted by name."""
    files = [
        entry
        for entry in os.listdir(REPORTS_DIR)
        if os.path.isfile(os.path.join(REPORTS_DIR, entry))
        and entry.lower().endswith(".md")
    ]
    files.sort()
    return files


def build_report_index() -> Tuple[List[Tuple[str, datetime]], List[str]]:
    """Collect report names with valid datetimes plus a list of invalid ones."""
    valid_entries: List[Tuple[str, datetime]] = []
    invalid_reports: List[str] = []
    for file_name in list_report_files():
        dt_value = get_report_datetime(file_name)
        if dt_value is None:
            invalid_reports.append(file_name)
            continue
        valid_entries.append((file_name, dt_value))
    return valid_entries, invalid_reports


def find_latest_report(
    index: Optional[List[Tuple[str, datetime]]] = None,
) -> Optional[Tuple[str, datetime]]:
    """Return the latest report entry (name, datetime) if available."""
    if index is None:
        index, _ = build_report_index()
    if not index:
        return None
    # `index` only contains reports with valid datetimes, so we can rely on it directly.
    return max(index, key=lambda item: item[1])

if __name__ == "__main__":
    report_index, invalid_reports = build_report_index()
    total_reports = len(report_index) + len(invalid_reports)
    safe_print("Total reports:", total_reports)

    display_rows: List[Tuple[str, Optional[datetime]]] = [
        (name, dt) for name, dt in report_index
    ] + [(name, None) for name in invalid_reports]

    sorted_reports = sorted(
        display_rows,
        key=lambda item: (item[1] is None, item[1] or datetime.min, item[0]),
    )
    for report_name, dt in sorted_reports:
        if dt is not None:
            safe_print(
                f"    Report: '{report_name}'    Time: {dt.strftime('%Y-%m-%d %H:%M:%S')}"
            )
        else:
            safe_print(f"    Report: '{report_name}'    Time: <unknown>")
    safe_print()

    if invalid_reports:
        safe_print("Skipped reports without valid timestamps:")
        for file_name in invalid_reports:
            safe_print(f"    - {file_name}")
        safe_print()

    latest_entry = find_latest_report(report_index)
    if latest_entry is None:
        safe_print("No latest report found.")
        sys.exit(0)

    latest_name, latest_dt = latest_entry
    safe_print("Latest report:", latest_name)
    safe_print("    Created:", latest_dt.strftime("%Y-%m-%d %H:%M:%S"))

    latest_content = read_report_text(latest_name)
    author_match = re.search(r"author:\s*['\"]?([^'\"\\n]+)['\"]?", latest_content, re.IGNORECASE)
    if author_match:
        safe_print("    Author:", author_match.group(1))
    else:
        safe_print("    Author: <unknown>")

    notes = NOTE_PATTERN.findall(latest_content)
    if notes:
        safe_print("    Human Notes:")
        for note in notes:
            safe_print(f"        【{note}】")
    else:
        safe_print("    Human Notes: (none found)")
