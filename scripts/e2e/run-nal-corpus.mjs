import { createHash } from "node:crypto";
import { appendFileSync, existsSync, mkdtempSync, readFileSync, rmSync, statSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { delimiter, dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const javaRoot = join(projectRoot, "java-master");
const defaultJavaJar = join(javaRoot, "target", "opennars-3.1.0-SNAPSHOT.jar");
const defaultJavaTestClasses = join(javaRoot, "target", "test-classes");
const defaultJavaClasses = join(javaRoot, "target", "classes");
const javaAdapterSource = join(projectRoot, "scripts", "e2e", "NalParityRunner.java");

const corpusDirectories = [
  join(javaRoot, "src", "main", "resources", "nal", "single_step"),
  join(javaRoot, "src", "main", "resources", "nal", "multi_step"),
  join(javaRoot, "src", "main", "resources", "nal", "application"),
  join(javaRoot, "src", "main", "resources", "nal", "stability"),
];

function parseArgs(argv) {
  const options = {
    engine: "java",
    cycles: 1550,
    start: 0,
    limit: null,
    chunkSize: null,
    timeoutMs: null,
    javaJar: defaultJavaJar,
    javaClasses: defaultJavaClasses,
    javaTestClasses: defaultJavaTestClasses,
    all: false,
    summary: false,
    resultFile: null,
    resume: false,
    filePaths: [],
  };
  for (let i = 0; i < argv.length; i += 1) {
    const argument = argv[i];
    if (argument === "--engine") options.engine = argv[++i];
    else if (argument === "--cycles") options.cycles = Number(argv[++i]);
    else if (argument === "--start") options.start = Number(argv[++i]);
    else if (argument === "--limit") options.limit = Number(argv[++i]);
    else if (argument === "--chunk-size") options.chunkSize = Number(argv[++i]);
    else if (argument === "--timeout-ms") options.timeoutMs = Number(argv[++i]);
    else if (argument === "--java-jar") options.javaJar = argv[++i];
    else if (argument === "--java-classes") options.javaClasses = argv[++i];
    else if (argument === "--java-test-classes") options.javaTestClasses = argv[++i];
    else if (argument === "--all") options.all = true;
    else if (argument === "--summary") options.summary = true;
    else if (argument === "--result-file") options.resultFile = argv[++i];
    else if (argument === "--resume") options.resume = true;
    else if (argument === "--file") options.filePaths.push(argv[++i]);
    else throw new Error(`Unknown argument: ${argument}`);
  }
  if (!Number.isInteger(options.cycles) || options.cycles < 1) {
    throw new Error("--cycles must be a positive integer");
  }
  if (!Number.isInteger(options.start) || options.start < 0) {
    throw new Error("--start must be a non-negative integer");
  }
  if (options.limit !== null && (!Number.isInteger(options.limit) || options.limit < 1)) {
    throw new Error("--limit must be a positive integer");
  }
  if (options.chunkSize !== null && (!Number.isInteger(options.chunkSize) || options.chunkSize < 1)) {
    throw new Error("--chunk-size must be a positive integer");
  }
  if (options.timeoutMs !== null && (!Number.isInteger(options.timeoutMs) || options.timeoutMs < 1)) {
    throw new Error("--timeout-ms must be a positive integer");
  }
  if (options.resume && options.resultFile === null) {
    throw new Error("--resume requires --result-file PATH");
  }
  return options;
}

function requirePath(value, option, kind) {
  const path = resolve(value);
  let stats;
  try {
    stats = statSync(path);
  } catch {
    throw new Error(`${option} path does not exist: ${path}`);
  }
  if (kind === "file" && !stats.isFile()) throw new Error(`${option} path is not a file: ${path}`);
  if (kind === "directory" && !stats.isDirectory()) throw new Error(`${option} path is not a directory: ${path}`);
  return path;
}

function resolveJavaArtifact(options) {
  if (options.engine === "ts") return null;
  const jar = requirePath(options.javaJar, "--java-jar", "file");
  const classes = requirePath(options.javaClasses, "--java-classes", "directory");
  const testClasses = requirePath(options.javaTestClasses, "--java-test-classes", "directory");
  return {
    jar,
    classes,
    testClasses,
    sha256: createHash("sha256").update(readFileSync(jar)).digest("hex").toUpperCase(),
  };
}

async function findNalFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await findNalFiles(path));
    else if (entry.isFile() && entry.name.endsWith(".nal")) files.push(path);
  }
  return files;
}

function extractExpectations(source) {
  return extractNalMetadata(source).expected;
}

function extractNalMetadata(source) {
  const marker = "''outputMustContain('";
  const expectations = [];
  let embeddedCycles = 0;
  for (const rawLine of source.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (/^\d+$/.test(line)) {
      embeddedCycles += Number(line);
      continue;
    }
    if (line.startsWith(marker) && line.endsWith("')")) {
      expectations.push(line.slice(marker.length, -2));
    }
  }
  return { expected: expectations, embeddedCycles };
}

function compileJavaAdapter(artifact) {
  const outputDirectory = mkdtempSync(join(tmpdir(), "opennars-java-parity-"));
  const classpath = [artifact.testClasses, artifact.classes, artifact.jar].join(delimiter);
  const result = spawnSync("javac", ["-encoding", "UTF-8", "-cp", classpath, "-d", outputDirectory, javaAdapterSource], {
    cwd: projectRoot,
    encoding: "utf8",
    maxBuffer: 4 * 1024 * 1024,
  });
  if (result.status !== 0) {
    rmSync(outputDirectory, { recursive: true, force: true });
    throw new Error(`javac failed:\n${result.stdout}\n${result.stderr}`);
  }
  return { outputDirectory, classpath: [outputDirectory, classpath].join(delimiter) };
}

function timeoutRows(files, cycles, engine, timeoutMs) {
  return files.map((file) => ({
    file,
    cycles,
    expected: null,
    passed: 0,
    matched: [],
    ok: false,
    error: `${engine} runner timed out after ${timeoutMs} ms`,
    error_type: "timeout",
    timed_out: true,
    duration_ms: timeoutMs,
  }));
}

function isProcessTimeout(result) {
  return result?.error?.code === "ETIMEDOUT"
    || result?.error?.message?.includes("ETIMEDOUT") === true;
}

function withDuration(rows, durationMs) {
  return rows.map((row) => ({ ...row, duration_ms: durationMs }));
}

function parseJsonLines(stdout) {
  const rows = [];
  const nonJsonLines = [];
  for (const line of stdout.split(/\r?\n/).filter(Boolean)) {
    try {
      rows.push(JSON.parse(line));
    } catch {
      nonJsonLines.push(line);
    }
  }
  return { rows, nonJsonLines };
}

function withOutputWarning(rows, nonJsonLines) {
  if (nonJsonLines.length === 0) return rows;
  return rows.map((row) => ({
    ...row,
    output_warning: `ignored ${nonJsonLines.length} non-JSON stdout line(s)`,
  }));
}

function addArtifactMetadata(rows, artifact) {
  return rows.map((row) => ({
    ...row,
    artifact_path: artifact.jar,
    artifact_sha256: artifact.sha256,
  }));
}

function runJava(files, cycles, timeoutMs, artifact, adapter = null) {
  const activeAdapter = adapter ?? compileJavaAdapter(artifact);
  try {
    return files.flatMap((file) => {
      const startedAt = Date.now();
      const result = spawnSync("java", ["-cp", activeAdapter.classpath, "NalParityRunner", String(cycles), file], {
        cwd: projectRoot,
        encoding: "utf8",
        maxBuffer: 32 * 1024 * 1024,
        ...(timeoutMs === null ? {} : { timeout: timeoutMs }),
      });
      if (isProcessTimeout(result)) {
        return addArtifactMetadata(timeoutRows([file], cycles, "Java", timeoutMs), artifact);
      }
      const durationMs = Date.now() - startedAt;
      const stdout = typeof result.stdout === "string" ? result.stdout : "";
      const parsedOutput = parseJsonLines(stdout);
      const parsed = parsedOutput.rows;
      if (result.signal != null) return addArtifactMetadata(withDuration(completeProcessFailureRows([file], cycles, parsed, result, "Java"), durationMs), artifact);
      if (result.status === 0 && parsed.length > 0) return addArtifactMetadata(withOutputWarning(withDuration(parsed, durationMs), parsedOutput.nonJsonLines), artifact);
      return addArtifactMetadata(withDuration(completeProcessFailureRows([file], cycles, parsed, result, "Java"), durationMs), artifact);
    });
  } finally {
    if (adapter === null) rmSync(activeAdapter.outputDirectory, { recursive: true, force: true });
  }
}

function runTs(files, cycles, timeoutMs) {
  const cli = join(projectRoot, "scripts", "cli.mjs");
  return files.flatMap((file) => {
    const startedAt = Date.now();
    const result = spawnSync(process.execPath, ["--loader", "./scripts/ts-loader.mjs", cli, "--cycles", String(cycles), file], {
      cwd: projectRoot,
      encoding: "utf8",
      maxBuffer: 32 * 1024 * 1024,
      ...(timeoutMs === null ? {} : { timeout: timeoutMs }),
    });
    if (isProcessTimeout(result)) {
      return timeoutRows([file], cycles, "TypeScript", timeoutMs);
    }
    const durationMs = Date.now() - startedAt;
    const stdout = typeof result.stdout === "string" ? result.stdout : "";
    const parsedOutput = parseJsonLines(stdout);
    const parsed = parsedOutput.rows;
    if (result.signal != null) return withDuration(completeProcessFailureRows([file], cycles, parsed, result, "TypeScript"), durationMs);
    if (result.status === 0 && parsed.length > 0) return withOutputWarning(withDuration(parsed, durationMs), parsedOutput.nonJsonLines);
    return withDuration(completeProcessFailureRows([file], cycles, parsed, result, "TypeScript"), durationMs);
  });
}

function completeProcessFailureRows(files, cycles, parsed, processResult, engine) {
  const rowsByFile = new Map(parsed.map((row) => [resolve(row.file), row]));
  const processError = processResult.error?.message
    ?? processResult.stderr?.trim()
    ?? `${engine} runner exited with status ${processResult.status}`;
  return files.map((file) => rowsByFile.get(resolve(file)) ?? {
    file,
    cycles,
    expected: null,
    passed: 0,
    matched: [],
    ok: false,
    error: processError,
    error_type: "exception",
    timed_out: false,
  });
}

function normalizeResult(result, expectedOverride = null) {
  if (result === null || result === undefined) return null;
  const matched = Array.isArray(result.matched) ? result.matched.map(Boolean) : [];
  const expected = Number.isInteger(expectedOverride)
    ? expectedOverride
    : Number.isInteger(result.expected) ? result.expected : matched.length;
  const timedOut = result.timed_out === true || result.error_type === "timeout";
  const error = result.error ?? null;
  const errorType = result.error_type ?? (timedOut ? "timeout" : error === null ? "none" : "exception");
  const passed = matched.filter(Boolean).length;
  const markerMissing = passed < expected;
  return {
    ...result,
    expected,
    passed,
    matched,
    ok: !timedOut && error === null && !markerMissing,
    error_type: errorType,
    exception: errorType === "exception",
    timed_out: timedOut,
    marker_missing: markerMissing,
    marker_missing_count: expected - passed,
  };
}

function evaluateRow(file, expected, javaResult, tsResult, engine) {
  const java = normalizeResult(javaResult, expected);
  const ts = normalizeResult(tsResult, expected);
  const parity = java && ts
    ? java.ok === ts.ok
      && java.expected === ts.expected
      && java.passed === ts.passed
      && JSON.stringify(java.matched) === JSON.stringify(ts.matched)
    : null;
  const bothWrong = java && ts ? java.ok === false && ts.ok === false : null;
  const javaTsDiff = java && ts ? parity !== true : null;
  const functionalPass = engine === "java"
    ? java?.ok === true
    : engine === "ts"
      ? ts?.ok === true
      : parity === true && bothWrong !== true;
  return {
    file,
    expected,
    timeout_ms: null,
    embedded_cycles: null,
    extra_cycles: null,
    duration_ms: (java?.duration_ms ?? 0) + (ts?.duration_ms ?? 0) || null,
    java,
    ts,
    parity,
    java_ts_diff: javaTsDiff,
    both_wrong: bothWrong,
    functional_pass: functionalPass,
    java_exception: java?.exception ?? null,
    java_timeout: java?.timed_out ?? null,
    java_marker_missing: java?.marker_missing ?? null,
    ts_exception: ts?.exception ?? null,
    ts_timeout: ts?.timed_out ?? null,
    ts_marker_missing: ts?.marker_missing ?? null,
  };
}

function splitIntoChunks(files, chunkSize) {
  if (chunkSize === null) return [files];
  const chunks = [];
  for (let index = 0; index < files.length; index += chunkSize) {
    chunks.push(files.slice(index, index + chunkSize));
  }
  return chunks;
}

function resultKey(options, javaArtifact) {
  return JSON.stringify({
    engine: options.engine,
    cycles: options.cycles,
    timeoutMs: options.timeoutMs,
    javaArtifactSha256: javaArtifact?.sha256 ?? null,
  });
}

function loadCheckpoint(resultFile, runKey) {
  if (resultFile === null || !existsSync(resultFile)) return new Map();
  const rows = readFileSync(resultFile, "utf8")
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line));
  return new Map(rows
    .filter((row) => row.run_key === runKey && typeof row.file === "string")
    .map((row) => [resolve(row.file), row]));
}

function appendCheckpoint(resultFile, runKey, rows) {
  if (resultFile === null || rows.length === 0) return;
  appendFileSync(resultFile, rows
    .map((row) => JSON.stringify({ ...row, run_key: runKey }))
    .join("\n") + "\n", "utf8");
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const javaArtifact = resolveJavaArtifact(options);
  const javaAdapter = javaArtifact === null ? null : compileJavaAdapter(javaArtifact);
  const resultFile = options.resultFile === null ? null : resolve(options.resultFile);
  if (resultFile !== null && existsSync(resultFile) && !options.resume) {
    throw new Error(`--result-file already exists; use --resume to continue: ${resultFile}`);
  }
  const runKey = resultKey(options, javaArtifact);
  const checkpoint = loadCheckpoint(resultFile, runKey);
  let files = options.filePaths.length > 0
    ? options.filePaths.map((file) => requirePath(file, "--file", "file"))
    : (await Promise.all(corpusDirectories.map(findNalFiles))).flat().sort();
  if (options.filePaths.length === 0) {
    files = files.slice(options.start);
    if (options.limit !== null) files = files.slice(0, options.limit);
    else if (!options.all) files = files.slice(0, 10);
  }
  if (files.length === 0) throw new Error("No NAL files found");

  const sources = new Map();
  for (const file of files) sources.set(file, extractNalMetadata(await readFile(file, "utf8")));

  const javaResults = [];
  const tsResults = [];
  const chunks = splitIntoChunks(files, options.chunkSize);
  try {
    for (const [index, chunk] of chunks.entries()) {
      const pending = options.resume
        ? chunk.filter((file) => !checkpoint.has(resolve(file)))
        : chunk;
      if (pending.length === 0) continue;
      if (options.chunkSize !== null) {
        console.error(`running chunk ${index + 1}/${chunks.length} (${pending.length} files)`);
      }
      if (options.engine !== "ts") javaResults.push(...runJava(pending, options.cycles, options.timeoutMs, javaArtifact, javaAdapter));
      if (options.engine !== "java") tsResults.push(...runTs(pending, options.cycles, options.timeoutMs));
      const javaByFile = new Map(javaResults.map((row) => [resolve(row.file), row]));
      const tsByFile = new Map(tsResults.map((row) => [resolve(row.file), row]));
      const completedRows = pending.map((file) => {
        const key = resolve(file);
        return {
          ...evaluateRow(
            key,
            sources.get(file).expected,
            javaByFile.get(key) ?? null,
            tsByFile.get(key) ?? null,
            options.engine,
          ),
          timeout_ms: options.timeoutMs,
          embedded_cycles: sources.get(file).embeddedCycles,
          extra_cycles: options.cycles,
        };
      });
      appendCheckpoint(resultFile, runKey, completedRows);
      for (const row of completedRows) checkpoint.set(resolve(row.file), { ...row, run_key: runKey });
    }
  } finally {
    if (javaAdapter !== null) rmSync(javaAdapter.outputDirectory, { recursive: true, force: true });
  }
  const rows = files.map((file) => {
    const key = resolve(file);
    const expected = sources.get(file).expected;
    return checkpoint.get(key) ?? {
      ...evaluateRow(key, expected, null, null, options.engine),
      timeout_ms: options.timeoutMs,
      embedded_cycles: sources.get(file).embeddedCycles,
      extra_cycles: options.cycles,
    };
  });

  const failures = rows.filter((row) => row.functional_pass !== true);
  const summary = {
    engine: options.engine,
    cycles: options.cycles,
    timeoutMs: options.timeoutMs,
    files: rows.length,
    passed: rows.length - failures.length,
    failed: failures.length,
    java_artifact: javaArtifact,
    rows,
  };
  if (options.summary) {
    const compact = (result) => result === null ? null : {
      expected: result.expected,
      passed: result.passed,
      matched: result.matched,
      ok: result.ok,
      ...(result.error ? { error: result.error } : {}),
    };
    console.log(JSON.stringify({
      engine: summary.engine,
      cycles: summary.cycles,
      timeoutMs: summary.timeoutMs,
      files: summary.files,
      passed: summary.passed,
      failed: summary.failed,
      java_artifact: summary.java_artifact,
      failures: failures.map((row) => ({
        ...row,
        java: compact(row.java),
        ts: compact(row.ts),
      })),
    }, null, 2));
  } else {
    console.log(JSON.stringify(summary, null, 2));
  }
  if (failures.length > 0) process.exitCode = 1;
}

export { evaluateRow, extractNalMetadata, isProcessTimeout, normalizeResult, parseArgs, parseJsonLines };

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error.stack ?? error);
    process.exitCode = 1;
  });
}
