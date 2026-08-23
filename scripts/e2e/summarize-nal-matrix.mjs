import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const CLUSTER_CATALOG = [
  "startup_overhead",
  "correct_but_slower",
  "cross_file_state_leak",
  "scheduler_divergence",
  "task_explosion",
  "term_link_divergence",
  "rule_dispatch_divergence",
  "numeric_ordering_divergence",
  "unsupported_operator",
  "unknown",
];

function parseArgs(argv) {
  const resultFiles = [];
  const extraFiles = [];
  const supplementFiles = [];
  let output = null;
  let manifestOutput = null;
  let summaryOutput = null;
  let javaProcessMode = null;
  let tsProcessMode = null;
  let evidenceVersion = null;
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--result-file") resultFiles.push(argv[++index]);
    else if (argument === "--extra-file") extraFiles.push(argv[++index]);
    else if (argument === "--supplement-file") supplementFiles.push(argv[++index]);
    else if (argument === "--output") output = argv[++index];
    else if (argument === "--manifest-output") manifestOutput = argv[++index];
    else if (argument === "--summary-output") summaryOutput = argv[++index];
    else if (argument === "--java-process-mode") javaProcessMode = argv[++index];
    else if (argument === "--ts-process-mode") tsProcessMode = argv[++index];
    else if (argument === "--evidence-version") evidenceVersion = argv[++index];
    else throw new Error(`Unknown argument: ${argument}`);
  }
  if (resultFiles.length === 0) throw new Error("at least one --result-file is required");
  return {
    resultFiles,
    extraFiles,
    supplementFiles,
    output,
    manifestOutput,
    summaryOutput,
    javaProcessMode,
    tsProcessMode,
    evidenceVersion,
  };
}

function readJsonl(file) {
  return readFileSync(resolve(file), "utf8")
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function normalizedPath(file) {
  return file.replaceAll("/", "\\").toLowerCase();
}

function scopeFor(file) {
  return normalizedPath(file).includes("\\src\\test\\") ? "extra" : "main";
}

function stratumFor(file) {
  const match = normalizedPath(file).match(/\\nal\\([^\\]+)\\/);
  return match?.[1] ?? (scopeFor(file) === "extra" ? "src_test" : "unknown");
}

function primaryErrorType(row) {
  const java = row.java ?? {};
  const ts = row.ts ?? {};
  if (row.both_wrong === true) return "both_wrong";
  if (java.not_run === true || ts.not_run === true || row.java_not_run === true || row.ts_not_run === true) {
    return "not_run";
  }
  if (java.exception === true || ts.exception === true || row.java_exception === true || row.ts_exception === true) {
    return "exception";
  }
  if (java.process_limited === true || ts.process_limited === true
    || row.process_limited === true || row.java_process_limited === true || row.ts_process_limited === true) {
    return "process_limit";
  }
  if (java.timed_out === true || ts.timed_out === true || row.java_timeout === true || row.ts_timeout === true) {
    return "timeout";
  }
  if (java.marker_missing === true || ts.marker_missing === true
    || row.java_marker_missing === true || row.ts_marker_missing === true) {
    return "marker_missing";
  }
  if (row.java_ts_diff === true) return "difference";
  return "none";
}

function hypothesisFor(row, errorType, supplement) {
  const file = normalizedPath(row.file);
  const java = row.java ?? {};
  const ts = row.ts ?? {};

  if (row.functional_pass === true) return null;

  if (supplement?.functional_pass === true
    && supplement?.parity === true
    && supplement?.ts?.ok === true) {
    return {
      status: "confirmed_long_budget",
      observation: "The TypeScript run satisfies all expected markers under a longer independent budget; the fixed screening row remains a timeout.",
      evidence: supplement.source_file,
      next_experiment: "Compare bounded event counts and per-cycle digests before changing inference semantics.",
      root_cause_cluster: "correct_but_slower",
    };
  }

  if (file.endsWith("\\nal3.subtermmapping1.nal")
    && java.ok === true && ts.timed_out === true) {
    return {
      status: "confirmed",
      observation: "TypeScript reaches the expected marker under a 120-second replay but exceeds the 30-second screening budget.",
      evidence: "reports/evidence/ts-java-parity-20260823-nal3-subterm-120-v1.jsonl",
      next_experiment: "Compare bounded event-count and per-cycle digest at 30, 120 and 300 seconds before changing inference semantics.",
      root_cause_cluster: "correct_but_slower",
    };
  }

  if (file.endsWith("\\nal4.7.nal") || file.endsWith("\\nal4.8.nal")) {
    if (ts.marker_missing === true && java.ok === true) {
      return {
        status: "confirmed_first_divergence",
        observation: "The first relevant TaskDerive term differs in image/product composition while initial TermLink creation and early structural events match.",
        evidence: "reports/evidence/ts-java-parity-20260823-canonical-30s-hot-p1.jsonl and segmented nal4.7/nal4.8 traces",
        next_experiment: "Wrap the Java and TypeScript RuleTables dispatch boundary and compare the first generated image/product term with its component and index.",
        root_cause_cluster: "rule_dispatch_divergence",
      };
    }
  }

  if (errorType === "timeout") {
    return {
      status: "unverified",
      observation: "TypeScript did not finish within the 30-second screening budget.",
      evidence: "30-second canonical hot matrix row; timeout does not establish semantic mismatch.",
      next_experiment: "Run one representative with bounded event counters and a longer budget; compare the last completed stage and output digest before changing code.",
      root_cause_cluster: "unknown",
    };
  }
  if (errorType === "process_limit") {
    return {
      status: "unverified",
      observation: "The runner stopped the active process at an explicit resource safety limit; this is neither a no-progress timeout nor a semantic verdict.",
      evidence: "30-second canonical hot matrix row with an explicit process safety limit.",
      next_experiment: "Replay the sample with bounded event counters and a larger safety limit, then compare marker and stage digests.",
      root_cause_cluster: "unknown",
    };
  }
  if (errorType === "marker_missing" || errorType === "difference") {
    return {
      status: "unverified",
      observation: "The engines expose different marker outcomes or output terms.",
      evidence: "30-second canonical hot matrix row.",
      next_experiment: "Replay the smallest input with normalized TermLink, RuleTables and derived-task events until the first non-equal state is observed.",
      root_cause_cluster: "unknown",
    };
  }
  if (errorType === "exception" || errorType === "both_wrong") {
    return {
      status: "unverified",
      observation: "At least one engine failed before satisfying the marker contract.",
      evidence: "30-second canonical hot matrix row.",
      next_experiment: "Separate canonical Java exception, TypeScript timeout and marker state, then replay with the same input and bounded diagnostics.",
      root_cause_cluster: "unknown",
    };
  }
  return {
    status: "unverified",
    observation: "The row is not a functional parity pass.",
    evidence: "30-second canonical hot matrix row.",
    next_experiment: "Add the smallest direct contract test that reproduces the row before changing shared inference code.",
    root_cause_cluster: "unknown",
  };
}

function classify(row, sourceFile, supplement = null, provenance = {}) {
  const source = sourceFile ?? row.file;
  const errorType = primaryErrorType(row);
  const hypothesis = hypothesisFor(row, errorType, supplement);
  const cluster = hypothesis?.root_cause_cluster ?? (row.functional_pass === true ? "none" : "unknown");
  return {
    file: row.file,
    scope: scopeFor(source),
    stratum: stratumFor(source),
    expected_count: Array.isArray(row.expected) ? row.expected.length : null,
    passed: row.functional_pass === true,
    matched: row.parity === true,
    ok: row.functional_pass === true,
    error_type: errorType,
    exception: row.java_exception === true || row.ts_exception === true,
    timed_out: row.java_timeout === true || row.ts_timeout === true,
    not_run: row.java_not_run === true || row.ts_not_run === true,
    marker_missing: row.java_marker_missing === true || row.ts_marker_missing === true,
    java_exception: row.java_exception === true,
    java_timeout: row.java_timeout === true,
    java_not_run: row.java_not_run === true,
    java_marker_missing: row.java_marker_missing === true,
    ts_exception: row.ts_exception === true,
    ts_timeout: row.ts_timeout === true,
    ts_not_run: row.ts_not_run === true,
    ts_marker_missing: row.ts_marker_missing === true,
    process_limited: row.process_limited === true
      || row.java_process_limited === true
      || row.ts_process_limited === true
      || row.java?.process_limited === true
      || row.ts?.process_limited === true,
    performance_warning: row.performance_warning === true,
    timeout_classification: row.timeout_classification ?? null,
    functional_pass: row.functional_pass === true,
    parity: row.parity === true,
    java_ts_diff: row.java_ts_diff === true,
    both_wrong: row.both_wrong === true,
    timeout_ms: row.timeout_ms ?? null,
    embedded_cycles: row.embedded_cycles ?? null,
    extra_cycles: row.extra_cycles ?? null,
    duration_ms: row.duration_ms ?? null,
    artifact_sha256: row.java?.artifact_sha256 ?? null,
    root_cause_cluster: cluster,
    hypothesis,
    long_budget_evidence: supplement,
    java_process_mode: row.java_process_mode ?? provenance.javaProcessMode ?? null,
    ts_process_mode: row.ts_process_mode ?? provenance.tsProcessMode ?? null,
    evidence_version: row.evidence_version ?? provenance.evidenceVersion ?? null,
    source_row: row,
  };
}

function buildSummary(rows) {
  const counts = Object.fromEntries([...CLUSTER_CATALOG, "none"].map((name) => [name, 0]));
  for (const row of rows) counts[row.root_cause_cluster] = (counts[row.root_cause_cluster] ?? 0) + 1;
  const byError = {};
  for (const row of rows) byError[row.error_type] = (byError[row.error_type] ?? 0) + 1;
  return {
    rows: rows.length,
    scopes: {
      main: rows.filter((row) => row.scope === "main").length,
      extra: rows.filter((row) => row.scope === "extra").length,
    },
    unique_files: new Set(rows.map((row) => row.file.toLowerCase())).size,
    functional_pass: rows.filter((row) => row.functional_pass).length,
    parity: rows.filter((row) => row.parity).length,
    error_type: byError,
    root_cause_cluster: counts,
    unknown_rows: rows.filter((row) => row.root_cause_cluster === "unknown").map((row) => ({
      file: row.file,
      error_type: row.error_type,
      next_experiment: row.hypothesis?.next_experiment ?? null,
    })),
    cluster_catalog: CLUSTER_CATALOG,
  };
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const mainRows = options.resultFiles.flatMap(readJsonl);
  const extraRows = options.extraFiles.flatMap(readJsonl);
  const supplementRows = options.supplementFiles.flatMap((file) => readJsonl(file).map((row) => ({
    source_file: file,
    ...row,
  })));
  const supplements = new Map(supplementRows.map((row) => [normalizedPath(row.file), row]));
  const allRows = [...mainRows, ...extraRows];
  const classified = allRows.map((row, index) => classify(
    row,
    index < mainRows.length ? row.file : row.file,
    supplements.get(normalizedPath(row.file)) ?? null,
    {
      javaProcessMode: options.javaProcessMode,
      tsProcessMode: options.tsProcessMode,
      evidenceVersion: options.evidenceVersion,
    },
  ));
  const mainKeys = mainRows.map((row) => normalizedPath(row.file));
  const allKeys = allRows.map((row) => normalizedPath(row.file));
  if (mainRows.length !== 245) throw new Error(`expected 245 main rows, got ${mainRows.length}`);
  if (new Set(mainKeys).size !== mainRows.length) throw new Error("duplicate main file rows");
  if (new Set(allKeys).size !== allRows.length) throw new Error("duplicate 245+1 file rows");
  if (extraRows.length !== 1) throw new Error(`expected one extra src/test row, got ${extraRows.length}`);

  const manifest = classified.map((row) => ({
    file: row.file,
    scope: row.scope,
    stratum: row.stratum,
    expected_count: row.expected_count,
    root_cause_cluster: row.root_cause_cluster,
  }));
  const summary = buildSummary(classified);
  const document = { schema: "opennars-304-ts.nal-matrix.v1", manifest, rows: classified, summary };
  if (options.output) writeFileSync(resolve(options.output), classified.map((row) => JSON.stringify(row)).join("\n") + "\n", "utf8");
  if (options.manifestOutput) writeFileSync(resolve(options.manifestOutput), JSON.stringify(manifest, null, 2) + "\n", "utf8");
  if (options.summaryOutput) writeFileSync(resolve(options.summaryOutput), JSON.stringify(summary, null, 2) + "\n", "utf8");
  console.log(JSON.stringify({ schema: document.schema, summary }, null, 2));
}

export { CLUSTER_CATALOG, buildSummary, classify, parseArgs, primaryErrorType };

if (process.argv[1] && resolve(process.argv[1]) === resolve(import.meta.filename)) main();
