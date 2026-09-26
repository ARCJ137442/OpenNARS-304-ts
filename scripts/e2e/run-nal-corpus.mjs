import { createHash } from "node:crypto";
import { appendFileSync, existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { delimiter, dirname, join, relative, resolve } from "node:path";
import { spawn, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const javaRoot = join(projectRoot, "java-master");
const canonicalJavaRoot = join(projectRoot, "..", "OpenNARS-304-java-canonical-fixed-build");
const defaultJavaJar = join(canonicalJavaRoot, "target", "opennars-3.0.4-SNAPSHOT.jar");
const defaultJavaTestClasses = join(canonicalJavaRoot, "target", "test-classes");
const defaultJavaClasses = join(canonicalJavaRoot, "target", "classes");
const LEGACY_JAR_SHA256 = "796A3B20EE6ED7F8F6778367738AD728F0BFCC32CFAD99BACAEBEC41EBC7EB04";
const javaAdapterSource = join(projectRoot, "scripts", "e2e", "NalParityRunner.java");
const DEFAULT_PERFORMANCE_BUDGET_MS_PER_1024_CYCLES = 120_000;
const PROGRESS_INTERVAL_CYCLES = 256;
const LONG_CYCLE_EQUIVALENCE_TARGET = 131_072;
const M1_MINUS_SOURCE_COUNT = 245;
const M1_MINUS_SELECTED_COUNT = 243;
const M1_MINUS_EXCLUDED_FILES = [
  "java-master/src/main/resources/nal/multi_step/nars_multistep_3.nal",
  "java-master/src/main/resources/nal/stability/long_term_stability.nal",
];

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
    processLimitMs: null,
    performanceBudgetMsPer1024Cycles: DEFAULT_PERFORMANCE_BUDGET_MS_PER_1024_CYCLES,
    tsMode: "hot",
    tsCli: null,
    resourceMetrics: false,
    javaJar: defaultJavaJar,
    javaClasses: defaultJavaClasses,
    javaTestClasses: defaultJavaTestClasses,
    javaBaseline: null,
    all: false,
    mMinus: false,
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
    else if (argument === "--process-limit-ms") options.processLimitMs = Number(argv[++i]);
    else if (argument === "--performance-budget-ms-per-1024-cycles"
      || argument === "--performance-budget-ms-per-1024") {
      options.performanceBudgetMsPer1024Cycles = Number(argv[++i]);
    }
    else if (argument === "--ts-mode" || argument === "--ts-process-mode") options.tsMode = argv[++i];
    else if (argument === "--ts-cli") options.tsCli = argv[++i];
    else if (argument === "--resource-metrics") options.resourceMetrics = true;
    else if (argument === "--java-jar") options.javaJar = argv[++i];
    else if (argument === "--java-classes") options.javaClasses = argv[++i];
    else if (argument === "--java-test-classes") options.javaTestClasses = argv[++i];
    else if (argument === "--java-baseline") options.javaBaseline = argv[++i];
    else if (argument === "--all") options.all = true;
    else if (argument === "--m-minus") options.mMinus = true;
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
  if (options.processLimitMs !== null && (!Number.isInteger(options.processLimitMs) || options.processLimitMs < 1)) {
    throw new Error("--process-limit-ms must be a positive integer");
  }
  if (!Number.isInteger(options.performanceBudgetMsPer1024Cycles)
    || options.performanceBudgetMsPer1024Cycles < 1) {
    throw new Error("--performance-budget-ms-per-1024-cycles must be a positive integer");
  }
  if (options.tsMode !== "hot" && options.tsMode !== "cold") {
    throw new Error("--ts-mode must be hot or cold");
  }
  if (options.resume && options.resultFile === null) {
    throw new Error("--resume requires --result-file PATH");
  }
  if (options.mMinus && !options.all) {
    throw new Error("--m-minus requires --all");
  }
  if (options.mMinus && options.limit !== null) {
    throw new Error("--m-minus cannot be combined with --limit");
  }
  if (options.mMinus && options.start !== 0) {
    throw new Error("--m-minus cannot be combined with --start");
  }
  if (options.mMinus && options.filePaths.length > 0) {
    throw new Error("--m-minus cannot be combined with --file");
  }
  if (options.javaBaseline !== null && options.engine !== "ts") {
    throw new Error("--java-baseline requires --engine ts; it is a frozen reference for TS-only runs");
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

function readManifestClassPath(jar) {
  const extractionDirectory = mkdtempSync(join(tmpdir(), "opennars-java-manifest-"));
  try {
    const result = spawnSync("jar", ["xf", jar, "META-INF/MANIFEST.MF"], {
      cwd: extractionDirectory,
      encoding: "utf8",
      maxBuffer: 4 * 1024 * 1024,
    });
    if (result.status !== 0) {
      throw new Error(`jar manifest extraction failed for ${jar}:\n${result.stdout}\n${result.stderr}`);
    }
    const manifestPath = join(extractionDirectory, "META-INF", "MANIFEST.MF");
    if (!existsSync(manifestPath)) return [];
    const manifest = readFileSync(manifestPath, "utf8").replace(/\r?\n[ \t]/g, "");
    const classPathLine = manifest.split(/\r?\n/).find((line) => line.startsWith("Class-Path:"));
    if (!classPathLine) return [];
    return classPathLine.slice("Class-Path:".length).trim().split(/\s+/).filter(Boolean);
  } finally {
    rmSync(extractionDirectory, { recursive: true, force: true });
  }
}

function mavenRepositoryRoots() {
  return [
    process.env.MAVEN_REPO_LOCAL,
    process.env.M2_REPO,
    process.env.USERPROFILE ? join(process.env.USERPROFILE, ".m2", "repository") : null,
    process.env.HOME ? join(process.env.HOME, ".m2", "repository") : null,
  ].filter((path, index, paths) => path !== null && paths.indexOf(path) === index && existsSync(path));
}

function findFileByName(root, name) {
  const pending = [root];
  while (pending.length > 0) {
    const directory = pending.pop();
    let entries;
    try {
      entries = readdirSync(directory, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const entry of entries) {
      const path = join(directory, entry.name);
      if (entry.isFile() && entry.name === name) return path;
      if (entry.isDirectory() && entry.name !== "node_modules") pending.push(path);
    }
  }
  return null;
}

function resolveManifestDependencies(jar) {
  const entries = readManifestClassPath(jar);
  const dependencies = [];
  const missing = [];
  for (const entry of entries) {
    const directPath = resolve(dirname(jar), entry);
    const resolvedPath = existsSync(directPath)
      ? directPath
      : mavenRepositoryRoots().map((root) => findFileByName(root, entry.split(/[\\/]/).pop()))
        .find((path) => path !== null);
    if (resolvedPath === undefined) missing.push(entry);
    else dependencies.push(resolvedPath);
  }
  if (missing.length > 0) {
    throw new Error(`Java artifact manifest dependencies are missing for ${jar}: ${missing.join(", ")}`);
  }
  return { entries, dependencies };
}

function resolveJavaArtifact(options) {
  if (options.engine === "ts") return null;
  const jar = requirePath(options.javaJar, "--java-jar", "file");
  const classes = requirePath(options.javaClasses, "--java-classes", "directory");
  const testClasses = requirePath(options.javaTestClasses, "--java-test-classes", "directory");
  const sha256 = createHash("sha256").update(readFileSync(jar)).digest("hex").toUpperCase();
  if (sha256 === LEGACY_JAR_SHA256) {
    throw new Error(`--java-jar points to the legacy 3.1.0 artifact; use the canonical 3.0.4 artifact: ${jar}`);
  }
  const manifestDependencies = resolveManifestDependencies(jar);
  return {
    jar,
    classes,
    testClasses,
    sha256,
    manifest_class_path: manifestDependencies.entries,
    runtime_classpath: manifestDependencies.dependencies,
  };
}

function projectFileKey(file) {
  const normalized = String(file).replace(/\\/g, "/");
  const javaMasterIndex = normalized.lastIndexOf("/java-master/");
  if (javaMasterIndex >= 0) {
    return resolve(projectRoot, normalized.slice(javaMasterIndex + 1));
  }
  const absolute = resolve(file);
  const projectPrefix = `${resolve(projectRoot)}${delimiter}`;
  return absolute === resolve(projectRoot) || absolute.startsWith(projectPrefix)
    ? absolute
    : resolve(projectRoot, relative(projectRoot, absolute));
}

function loadJavaBaseline(value) {
  const path = requirePath(value, "--java-baseline", "file");
  const sha256 = createHash("sha256").update(readFileSync(path)).digest("hex").toUpperCase();
  const rows = readFileSync(path, "utf8")
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line));
  if (rows.length === 0) throw new Error(`--java-baseline is empty: ${path}`);
  const first = rows[0];
  if (first.schema !== "opennars-304-ts.java-functional-baseline.v1") {
    throw new Error(`--java-baseline has unsupported schema: ${first.schema ?? "missing"}`);
  }
  const byFile = new Map();
  for (const row of rows) {
    if (typeof row.file !== "string" || row.java === null || typeof row.java !== "object") {
      throw new Error(`--java-baseline row is missing file/java: ${JSON.stringify(row)}`);
    }
    const key = projectFileKey(row.file);
    if (byFile.has(key)) throw new Error(`--java-baseline has duplicate file: ${row.file}`);
    if (row.java_artifact_sha256 !== first.java_artifact_sha256) {
      throw new Error(`--java-baseline has inconsistent Java artifact hashes: ${row.file}`);
    }
    byFile.set(key, row);
  }
  return {
    path,
    sha256,
    baseline_id: first.baseline_id ?? null,
    schema: first.schema,
    java_source_commit: first.java_source_commit ?? null,
    java_artifact_sha256: first.java_artifact_sha256 ?? null,
    rows: byFile,
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
  const classpath = [artifact.testClasses, artifact.classes, artifact.jar, ...artifact.runtime_classpath].join(delimiter);
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

function progressIntervalCycles() {
  return PROGRESS_INTERVAL_CYCLES;
}

function timeoutRows(files, cycles, engine, timeoutMs, {
  durationMs = timeoutMs,
  lastProgressCycle = null,
} = {}) {
  return files.map((file) => ({
    file,
    cycles,
    expected: null,
    passed: 0,
    matched: [],
    ok: false,
    error: `${engine} runner stalled: no progress for ${timeoutMs} ms`,
    error_type: "timeout",
    timed_out: true,
    stall_detected: true,
    timeout_reason: "no_progress",
    last_progress_cycle: lastProgressCycle,
    progress_interval_cycles: progressIntervalCycles(),
    duration_ms: durationMs,
  }));
}

function processLimitRows(files, cycles, engine, processLimitMs, {
  durationMs = processLimitMs,
  lastProgressCycle = null,
} = {}) {
  return files.map((file) => ({
    file,
    cycles,
    expected: null,
    passed: 0,
    matched: [],
    ok: false,
    error: `${engine} runner stopped at process safety limit of ${processLimitMs} ms`,
    error_type: "process_limit",
    timed_out: false,
    process_limited: true,
    stall_detected: false,
    termination_reason: "process_limit",
    last_progress_cycle: lastProgressCycle,
    progress_interval_cycles: progressIntervalCycles(),
    duration_ms: durationMs,
  }));
}

function notRunRows(files, cycles, engine, reason) {
  return files.map((file) => ({
    file,
    cycles,
    expected: null,
    passed: 0,
    matched: [],
    ok: false,
    error: `${engine} runner did not run this file: ${reason}`,
    error_type: "not_run",
    exception: false,
    timed_out: false,
    not_run: true,
    marker_missing: false,
    marker_missing_count: 0,
    duration_ms: 0,
  }));
}

function terminateChildProcess(child) {
  if (child?.pid === undefined) return;
  if (process.platform === "win32") {
    spawnSync("taskkill", ["/PID", String(child.pid), "/T", "/F"], {
      windowsHide: true,
      stdio: "ignore",
    });
    return;
  }
  child.kill();
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

function parseProgressLine(line) {
  const match = /^@progress\s+(\{.*\})$/.exec(line.trim());
  if (match === null) return null;
  try {
    const progress = JSON.parse(match[1]);
    return typeof progress.file === "string"
      && Number.isInteger(progress.cycle)
      && progress.cycle >= 0
      ? progress
      : null;
  } catch {
    return null;
  }
}

function isProgressHeartbeat(progress) {
  return progress !== null;
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

function runJavaProcess(file, cycles, timeoutMs, processLimitMs, classpath, resourceMetrics = false) {
  return new Promise((resolveProcess) => {
    const startedAt = Date.now();
    const progressInterval = progressIntervalCycles();
    const child = spawn("java", [
      "-cp", classpath, "NalParityRunner", String(cycles), file,
      ...(timeoutMs === null ? [] : ["--progress-interval", String(progressInterval)]),
      ...(resourceMetrics ? ["--resource-metrics"] : []),
    ], {
      cwd: projectRoot,
      windowsHide: true,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderrBuffer = "";
    const stderrLines = [];
    let processError = null;
    let lastProgressCycle = null;
    let timeoutHandle = null;
    let processLimitHandle = null;
    let stalled = false;
    let processLimited = false;
    let settled = false;

    const consumeStderrLine = (line) => {
      if (line.length === 0) return;
      const progress = parseProgressLine(line);
      if (isProgressHeartbeat(progress) && resolve(progress.file) === resolve(file)) {
        lastProgressCycle = progress.cycle;
        armTimeout();
      } else {
        stderrLines.push(line);
      }
    };
    const armTimeout = () => {
      if (timeoutMs === null || settled) return;
      if (timeoutHandle !== null) clearTimeout(timeoutHandle);
      timeoutHandle = setTimeout(() => {
        stalled = true;
        terminateChildProcess(child);
      }, timeoutMs);
    };
    const armProcessLimit = () => {
      if (processLimitMs === null || settled) return;
      if (processLimitHandle !== null) clearTimeout(processLimitHandle);
      processLimitHandle = setTimeout(() => {
        processLimited = true;
        terminateChildProcess(child);
      }, processLimitMs);
    };

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on("data", (chunk) => {
      stderrBuffer += chunk.toString();
      const lines = stderrBuffer.split(/\r?\n/);
      stderrBuffer = lines.pop() ?? "";
      for (const line of lines) consumeStderrLine(line);
    });
    child.on("error", (error) => {
      processError = error;
    });
    child.on("close", (status, signal) => {
      if (settled) return;
      settled = true;
      if (timeoutHandle !== null) clearTimeout(timeoutHandle);
      if (processLimitHandle !== null) clearTimeout(processLimitHandle);
      if (stderrBuffer.length > 0) consumeStderrLine(stderrBuffer);
      resolveProcess({
        status,
        signal,
        error: processError,
        stdout,
        stderr: stderrLines.join("\n"),
        stalled,
        processLimited,
        lastProgressCycle,
        durationMs: Date.now() - startedAt,
      });
    });
    armTimeout();
    armProcessLimit();
  });
}

async function runJava(
  files,
  cycles,
  timeoutMs,
  processLimitMs,
  artifact,
  adapter = null,
  resourceMetrics = false,
) {
  const activeAdapter = adapter ?? compileJavaAdapter(artifact);
  try {
    const rows = [];
    for (const file of files) {
      const result = await runJavaProcess(
        file,
        cycles,
        timeoutMs,
        processLimitMs,
        activeAdapter.classpath,
        resourceMetrics,
      );
      if (result.stalled) {
        rows.push(...addArtifactMetadata(timeoutRows([file], cycles, "Java", timeoutMs, {
          durationMs: result.durationMs,
          lastProgressCycle: result.lastProgressCycle,
        }), artifact));
        continue;
      }
      if (result.processLimited) {
        rows.push(...addArtifactMetadata(processLimitRows([file], cycles, "Java", processLimitMs, {
          durationMs: result.durationMs,
          lastProgressCycle: result.lastProgressCycle,
        }), artifact));
        continue;
      }
      const parsedOutput = parseJsonLines(result.stdout);
      const parsed = parsedOutput.rows;
      const processResult = {
        status: result.status,
        signal: result.signal,
        error: result.error,
        stderr: result.stderr,
      };
      if (result.status === 0 && parsed.length > 0) {
        rows.push(...addArtifactMetadata(
          withOutputWarning(withDuration(parsed, result.durationMs), parsedOutput.nonJsonLines),
          artifact,
        ));
      } else {
        rows.push(...addArtifactMetadata(
          withDuration(completeProcessFailureRows([file], cycles, parsed, processResult, "Java"), result.durationMs),
          artifact,
        ));
      }
    }
    return rows;
  } finally {
    if (adapter === null) rmSync(activeAdapter.outputDirectory, { recursive: true, force: true });
  }
}

async function runTs(
  files,
  cycles,
  timeoutMs,
  processLimitMs,
  cliPath = join(projectRoot, "scripts", "cli.mjs"),
  resourceMetrics = false,
) {
  if (files.length === 0) return [];
  const cli = cliPath;
  return new Promise((resolveRows) => {
    const startedAt = Date.now();
    const progressInterval = progressIntervalCycles();
    const fileKeys = new Set(files.map((file) => resolve(file)));
    const completedKeys = new Set();
    const parsedRows = [];
    const nonJsonLines = [];
    let stdoutBuffer = "";
    let stderr = "";
    let stderrBuffer = "";
    let lastBoundary = startedAt;
    let lastProgressCycle = null;
    let timeoutHandle = null;
    let processLimitHandle = null;
    let timedOutFile = null;
    let processLimitedFile = null;
    let processLimitedDurationMs = null;
    let timedOutCycle = null;
    let timedOutDurationMs = null;
    let processError = null;
    let settled = false;

    const currentFile = () => files.find((file) => !completedKeys.has(resolve(file)));
    const armTimeout = () => {
      if (timeoutMs === null || settled) return;
      if (timeoutHandle !== null) clearTimeout(timeoutHandle);
      const pendingFile = currentFile();
      if (pendingFile === undefined) return;
      timeoutHandle = setTimeout(() => {
        timedOutFile = pendingFile;
        timedOutCycle = lastProgressCycle;
        timedOutDurationMs = Date.now() - startedAt;
        terminateChildProcess(child);
      }, timeoutMs);
    };
    const armProcessLimit = () => {
      if (processLimitMs === null || settled) return;
      if (processLimitHandle !== null) clearTimeout(processLimitHandle);
      if (currentFile() === undefined) return;
      processLimitHandle = setTimeout(() => {
        processLimitedFile = currentFile();
        processLimitedDurationMs = Date.now() - lastBoundary;
        terminateChildProcess(child);
      }, processLimitMs);
    };
    const consumeProgressLine = (line) => {
      const progress = parseProgressLine(line);
      if (!isProgressHeartbeat(progress)) return false;
      const pendingFile = currentFile();
      if (pendingFile === undefined || resolve(progress.file) !== resolve(pendingFile)) return false;
      lastProgressCycle = progress.cycle;
      armTimeout();
      return true;
    };
    const consumeStderrLine = (line) => {
      if (line.length === 0 || consumeProgressLine(line)) return;
      stderr += `${line}\n`;
    };
    const consumeLine = (line) => {
      if (line.length === 0) return;
      let row;
      try {
        row = JSON.parse(line);
      } catch {
        nonJsonLines.push(line);
        return;
      }
      if (typeof row.file !== "string" || !fileKeys.has(resolve(row.file))) {
        nonJsonLines.push(line);
        return;
      }
      const durationMs = Date.now() - lastBoundary;
      lastBoundary = Date.now();
      lastProgressCycle = null;
      const key = resolve(row.file);
      completedKeys.add(key);
      parsedRows.push({ ...row, duration_ms: durationMs });
      armTimeout();
      armProcessLimit();
    };

    const localCliPaths = new Set([
      resolve(join(projectRoot, "scripts", "cli.mjs")),
      resolve(join(projectRoot, "dist", "cli.mjs")),
    ]);
    const cliInvocation = localCliPaths.has(resolve(cli))
      ? ["--import", "./scripts/register-ts-loader.mjs", cli]
      : [cli];
    const child = spawn(process.execPath, [
      ...cliInvocation, "--cycles", String(cycles),
      ...(timeoutMs === null ? [] : ["--progress-interval", String(progressInterval)]),
      ...files,
    ], {
      cwd: projectRoot,
      windowsHide: true,
      env: resourceMetrics ? { ...process.env, OPENNARS_RESOURCE_METRICS: "1" } : process.env,
      stdio: ["ignore", "pipe", "pipe"],
    });
    child.stdout.on("data", (chunk) => {
      stdoutBuffer += chunk.toString();
      const lines = stdoutBuffer.split(/\r?\n/);
      stdoutBuffer = lines.pop() ?? "";
      for (const line of lines) consumeLine(line);
    });
    child.stderr.on("data", (chunk) => {
      stderrBuffer += chunk.toString();
      const lines = stderrBuffer.split(/\r?\n/);
      stderrBuffer = lines.pop() ?? "";
      for (const line of lines) consumeStderrLine(line);
    });
    child.on("error", (error) => {
      processError = error;
    });
    child.on("close", async (status, signal) => {
      if (settled) return;
      settled = true;
      if (timeoutHandle !== null) clearTimeout(timeoutHandle);
      if (processLimitHandle !== null) clearTimeout(processLimitHandle);
      if (stdoutBuffer.length > 0) consumeLine(stdoutBuffer);
      if (stderrBuffer.length > 0) consumeStderrLine(stderrBuffer);

      const unresolved = files.filter((file) => !completedKeys.has(resolve(file)));
      const rows = [...parsedRows];
      if (timedOutFile !== null) {
        rows.push(...timeoutRows([timedOutFile], cycles, "TypeScript", timeoutMs, {
          durationMs: timedOutDurationMs,
          lastProgressCycle: timedOutCycle,
        }));
        const timedOutIndex = files.indexOf(timedOutFile);
        const remainingFiles = files.slice(timedOutIndex + 1)
          .filter((file) => !completedKeys.has(resolve(file)));
        rows.push(...await runTs(remainingFiles, cycles, timeoutMs, processLimitMs, cli, resourceMetrics));
      } else if (processLimitedFile !== null
        && !completedKeys.has(resolve(processLimitedFile))) {
        rows.push(...processLimitRows([processLimitedFile], cycles, "TypeScript", processLimitMs, {
          durationMs: processLimitedDurationMs,
          lastProgressCycle,
        }));
        const processLimitedIndex = files.indexOf(processLimitedFile);
        const remainingFiles = files.slice(processLimitedIndex + 1)
          .filter((file) => !completedKeys.has(resolve(file)));
        rows.push(...await runTs(remainingFiles, cycles, timeoutMs, processLimitMs, cli, resourceMetrics));
      } else if (unresolved.length > 0) {
        const failedFile = unresolved[0];
        const errorMessage = processError?.message
          || stderr.trim()
          || `TypeScript runner exited with status ${status}${signal ? ` (${signal})` : ""}`;
        rows.push(...completeProcessFailureRows([failedFile], cycles, [], {
          status,
          signal,
          error: { message: errorMessage },
          stderr,
        }, "TypeScript"));
        rows.push(...notRunRows(
          unresolved.slice(1),
          cycles,
          "TypeScript",
          "the TypeScript process exited before this file",
        ));
      }

      const withWarnings = nonJsonLines.length === 0
        ? rows
        : rows.map((row) => parsedRows.includes(row)
          ? { ...row, output_warning: `ignored ${nonJsonLines.length} non-JSON stdout line(s)` }
          : row);
      const rowsByFile = new Map(withWarnings.map((row) => [resolve(row.file), row]));
      resolveRows(files.map((file) => rowsByFile.get(resolve(file))
        ?? notRunRows([file], cycles, "TypeScript", "no result was emitted")[0]));
    });
    armTimeout();
    armProcessLimit();
  });
}

async function runTsCold(
  files,
  cycles,
  timeoutMs,
  processLimitMs,
  cliPath = join(projectRoot, "scripts", "cli.mjs"),
  resourceMetrics = false,
) {
  const rows = [];
  for (const file of files) {
    rows.push(...await runTs([file], cycles, timeoutMs, processLimitMs, cliPath, resourceMetrics));
  }
  return rows;
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
    exit_code: processResult.status ?? null,
    signal: processResult.signal ?? null,
    stderr: processResult.stderr?.trim() || null,
  });
}

function normalizeResult(result, expectedOverride = null) {
  if (result === null || result === undefined) return null;
  const matched = Array.isArray(result.matched) ? result.matched.map(Boolean) : [];
  const expected = Number.isInteger(expectedOverride)
    ? expectedOverride
    : Number.isInteger(result.expected) ? result.expected : matched.length;
  const timedOut = result.timed_out === true || result.error_type === "timeout";
  const notRun = result.not_run === true || result.error_type === "not_run";
  const error = result.error ?? null;
  const errorType = result.error_type ?? (timedOut ? "timeout" : error === null ? "none" : "exception");
  const stallDetected = result.stall_detected === true
    || (timedOut && result.timeout_reason !== "process_limit");
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
    stall_detected: stallDetected,
    not_run: notRun,
    marker_missing: markerMissing,
    marker_missing_count: expected - passed,
  };
}

function evaluateMarkerPerformance(javaResult, tsResult, totalCycles, performanceBudgetMsPer1024Cycles = DEFAULT_PERFORMANCE_BUDGET_MS_PER_1024_CYCLES) {
  const javaTimes = Array.isArray(javaResult?.marker_time_ms) ? javaResult.marker_time_ms : null;
  const tsTimes = Array.isArray(tsResult?.marker_time_ms) ? tsResult.marker_time_ms : null;
  if (javaTimes === null && tsTimes === null) {
    return {
      performance_budget_ms_per_1024_cycles: performanceBudgetMsPer1024Cycles,
      java_marker_time_per_1024_ms: null,
      ts_marker_time_per_1024_ms: null,
      marker_time_delta_ms: null,
      marker_time_delta_per_1024_ms: null,
      java_marker_timing_complete: null,
      ts_marker_timing_complete: null,
      marker_delta_timing_complete: null,
      ts_performance_within_budget: null,
      marker_delta_within_budget: null,
    };
  }
  const scale = Number.isFinite(totalCycles) && totalCycles > 0 ? 1024 / totalCycles : null;
  const count = Math.max(javaTimes?.length ?? 0, tsTimes?.length ?? 0);
  const javaMarkerTimePer1024 = javaTimes === null || scale === null
    ? null
    : javaTimes.map((value) => Number.isFinite(value) ? value * scale : null);
  const tsMarkerTimePer1024 = tsTimes === null || scale === null
    ? null
    : tsTimes.map((value) => Number.isFinite(value) ? value * scale : null);
  const markerTimeDelta = javaTimes !== null && tsTimes !== null
    ? Array.from({ length: count }, (_, index) => {
      const javaTime = javaTimes[index];
      const tsTime = tsTimes[index];
      return Number.isFinite(javaTime) && Number.isFinite(tsTime) ? tsTime - javaTime : null;
    })
    : null;
  const markerTimeDeltaPer1024 = markerTimeDelta === null || scale === null
    ? null
    : markerTimeDelta.map((value) => Number.isFinite(value) ? value * scale : null);
  const observed = (values) => values?.filter((value) => Number.isFinite(value)) ?? [];
  const tsObserved = observed(tsMarkerTimePer1024);
  const deltaObserved = observed(markerTimeDeltaPer1024);
  const timingComplete = (values) => values === null || values.length === 0
    ? null
    : values.every((value) => Number.isFinite(value));
  const javaTimingComplete = timingComplete(javaMarkerTimePer1024);
  const tsTimingComplete = timingComplete(tsMarkerTimePer1024);
  const deltaTimingComplete = timingComplete(markerTimeDeltaPer1024);
  return {
    performance_budget_ms_per_1024_cycles: performanceBudgetMsPer1024Cycles,
    java_marker_time_per_1024_ms: javaMarkerTimePer1024,
    ts_marker_time_per_1024_ms: tsMarkerTimePer1024,
    marker_time_delta_ms: markerTimeDelta,
    marker_time_delta_per_1024_ms: markerTimeDeltaPer1024,
    java_marker_timing_complete: javaTimingComplete,
    ts_marker_timing_complete: tsTimingComplete,
    marker_delta_timing_complete: deltaTimingComplete,
    ts_performance_within_budget: tsTimingComplete !== true || tsObserved.length === 0
      ? null
      : tsObserved.every((value) => value <= performanceBudgetMsPer1024Cycles),
    marker_delta_within_budget: deltaTimingComplete !== true || deltaObserved.length === 0
      ? null
      : deltaObserved.every((value) => Math.abs(value) <= performanceBudgetMsPer1024Cycles),
  };
}

function evaluateRuntimePerformance(javaResult, tsResult, totalCycles, performanceBudgetMsPer1024Cycles = DEFAULT_PERFORMANCE_BUDGET_MS_PER_1024_CYCLES) {
  const javaRuntimeMs = Number.isFinite(javaResult?.duration_ms) ? javaResult.duration_ms : null;
  const tsRuntimeMs = Number.isFinite(tsResult?.duration_ms) ? tsResult.duration_ms : null;
  const javaRuntimeMsPerCycle = javaRuntimeMs !== null && Number.isFinite(totalCycles) && totalCycles > 0
    ? javaRuntimeMs / totalCycles
    : null;
  const tsRuntimeMsPerCycle = tsRuntimeMs !== null && Number.isFinite(totalCycles) && totalCycles > 0
    ? tsRuntimeMs / totalCycles
    : null;
  const runtimeDeltaMs = javaRuntimeMs !== null && tsRuntimeMs !== null
    ? tsRuntimeMs - javaRuntimeMs
    : null;
  const runtimeDeltaMsPerCycle = javaRuntimeMsPerCycle !== null && tsRuntimeMsPerCycle !== null
    ? tsRuntimeMsPerCycle - javaRuntimeMsPerCycle
    : null;
  const tsRuntimeSlowdownRatio = javaRuntimeMs !== null && javaRuntimeMs > 0 && tsRuntimeMs !== null
    ? tsRuntimeMs / javaRuntimeMs
    : null;
  const tsRuntimeObservation = tsResult?.stall_detected === true
    || (tsResult?.timed_out === true && tsResult?.timeout_reason !== "process_limit")
    ? "stalled_lower_bound"
    : tsResult?.process_limited === true
      ? "process_limited"
    : tsResult?.exception === true
      ? "exception"
    : tsRuntimeMs === null
      ? "missing"
      : "completed";
  const javaRuntimeObservation = javaResult?.stall_detected === true
    || (javaResult?.timed_out === true && javaResult?.timeout_reason !== "process_limit")
    ? "stalled_lower_bound"
    : javaResult?.process_limited === true
      ? "process_limited"
    : javaResult?.exception === true
      ? "exception"
    : javaRuntimeMs === null
      ? "missing"
      : "completed";
  return {
    java_runtime_ms: javaRuntimeMs,
    ts_runtime_ms: tsRuntimeMs,
    java_runtime_observation: javaRuntimeObservation,
    ts_runtime_observation: tsRuntimeObservation,
    reasoning_cycles: Number.isFinite(totalCycles) ? totalCycles : null,
    runtime_budget_ms_per_cycle: performanceBudgetMsPer1024Cycles / 1024,
    java_runtime_ms_per_cycle: javaRuntimeMsPerCycle,
    ts_runtime_ms_per_cycle: tsRuntimeMsPerCycle,
    runtime_delta_ms: runtimeDeltaMs,
    runtime_delta_ms_per_cycle: runtimeDeltaMsPerCycle,
    ts_runtime_slowdown_ratio: tsRuntimeSlowdownRatio,
    ts_runtime_within_budget: tsRuntimeObservation === "completed"
      && tsRuntimeMsPerCycle !== null
      && tsRuntimeMsPerCycle <= performanceBudgetMsPer1024Cycles / 1024,
  };
}

function classifyTimeoutObservation({ timeoutMs = null, java = null, ts = null } = {}) {
  const processLimited = java?.process_limited === true || ts?.process_limited === true;
  const timedOut = java?.timed_out === true || ts?.timed_out === true || processLimited;
  if (!timedOut) {
    return { performance_warning: false, timeout_classification: null };
  }
  const hasException = java?.exception === true || ts?.exception === true;
  if (hasException) {
    return { performance_warning: false, timeout_classification: "timeout_with_exception" };
  }
  const stalled = !processLimited && (java?.stall_detected === true || ts?.stall_detected === true
    || java?.timeout_reason === "no_progress" || ts?.timeout_reason === "no_progress"
    || (timedOut && java?.timeout_reason !== "process_limit" && ts?.timeout_reason !== "process_limit"));
  return stalled
    ? { performance_warning: false, timeout_classification: "stalled_no_progress" }
    : {
      performance_warning: processLimited,
      timeout_classification: processLimited
        ? "process_limit"
        : Number.isFinite(timeoutMs) ? "process_limit" : "timeout_budget_unknown",
    };
}

function canonicalizeTraceValue(value) {
  if (Array.isArray(value)) return value.map(canonicalizeTraceValue);
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalizeTraceValue(value[key])]));
  }
  return value;
}

function cleanResultForLongCycle(result) {
  return result !== null && result !== undefined
    && result.ok === true
    && result.exception !== true
    && result.timed_out !== true
    && result.not_run !== true;
}

function evaluateLongCycleEquivalence({
  cycles,
  expectedCount,
  java,
  ts,
  javaEvents = null,
  tsEvents = null,
} = {}) {
  const observedCycles = Number.isInteger(cycles) ? cycles : null;
  const expected = Number.isInteger(expectedCount) && expectedCount >= 0 ? expectedCount : null;
  const javaMatched = Array.isArray(java?.matched) ? java.matched.map(Boolean) : null;
  const tsMatched = Array.isArray(ts?.matched) ? ts.matched.map(Boolean) : null;
  const markerStandard = expected === null
    ? "unverified"
    : cleanResultForLongCycle(java) && cleanResultForLongCycle(ts)
      && javaMatched !== null && tsMatched !== null
      && javaMatched.length === expected
      && tsMatched.length === expected
      && javaMatched.every(Boolean)
      && tsMatched.every(Boolean)
      && JSON.stringify(javaMatched) === JSON.stringify(tsMatched)
      ? expected === 0 ? "not_applicable" : "passed"
      : "failed";
  const internalEventsAvailable = Array.isArray(javaEvents) && Array.isArray(tsEvents);
  const internalEventStandard = !internalEventsAvailable
    ? "unverified"
    : JSON.stringify(canonicalizeTraceValue(javaEvents)) === JSON.stringify(canonicalizeTraceValue(tsEvents))
      ? "passed"
      : "failed";
  const cycleTargetReached = observedCycles !== null && observedCycles >= LONG_CYCLE_EQUIVALENCE_TARGET;
  // Marker-bearing fixtures use marker parity; marker-free fixtures use the long-cycle trace route.
  const markerRoute = expected !== null && expected > 0 && markerStandard === "passed";
  const cycleRoute = expected === 0 && cycleTargetReached && internalEventStandard === "passed";
  const equivalent = markerRoute || cycleRoute;
  const equivalenceRoute = markerRoute ? "marker" : cycleRoute ? "cycle" : "unverified";
  let status = "not_reached";
  if (equivalent) {
    status = "equivalent";
  } else if (expected !== null && expected > 0) {
    status = markerStandard === "failed" ? "marker_failed" : "marker_unverified";
  } else if (expected === 0 && cycleTargetReached) {
    status = internalEventStandard !== "passed"
      ? internalEventsAvailable ? "internal_event_failed" : "internal_event_unverified"
      : "not_reached";
  }
  return {
    target_cycles: LONG_CYCLE_EQUIVALENCE_TARGET,
    observed_cycles: observedCycles,
    cycle_target_reached: cycleTargetReached,
    marker_standard: markerStandard,
    internal_event_standard: internalEventStandard,
    equivalence_route: equivalenceRoute,
    equivalent,
    status,
  };
}

function evaluateRow(file, expected, javaResult, tsResult, engine, totalCycles = null, timeoutMs = null,
  performanceBudgetMsPer1024Cycles = DEFAULT_PERFORMANCE_BUDGET_MS_PER_1024_CYCLES) {
  const expectedCount = Array.isArray(expected)
    ? expected.length
    : Number.isInteger(expected) ? expected : null;
  const java = normalizeResult(javaResult, expectedCount);
  const ts = normalizeResult(tsResult, expectedCount);
  const parity = java && ts
    ? java.ok === ts.ok
      && java.expected === ts.expected
      && java.passed === ts.passed
      && JSON.stringify(java.matched) === JSON.stringify(ts.matched)
    : null;
  const bothWrong = java && ts ? java.ok === false && ts.ok === false : null;
  const javaTsDiff = java && ts ? parity !== true : null;
  const hasJavaReference = javaResult !== null;
  const functionalPass = engine === "java"
    ? java?.ok === true
    : engine === "ts"
      ? hasJavaReference ? parity === true && bothWrong !== true : ts?.ok === true
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
    long_cycle_equivalence: evaluateLongCycleEquivalence({
      cycles: totalCycles,
      expectedCount,
      java,
      ts,
    }),
    ...evaluateMarkerPerformance(java, ts, totalCycles, performanceBudgetMsPer1024Cycles),
    ...evaluateRuntimePerformance(java, ts, totalCycles, performanceBudgetMsPer1024Cycles),
    ...classifyTimeoutObservation({ timeoutMs, java, ts }),
    java_thread_mode: java?.thread_mode ?? null,
    ts_thread_mode: ts?.thread_mode ?? null,
    java_exception: java?.exception ?? null,
    java_timeout: java?.timed_out ?? null,
    java_stalled: java?.stall_detected ?? null,
    java_timeout_reason: java?.timeout_reason ?? null,
    java_last_progress_cycle: java?.last_progress_cycle ?? null,
    java_not_run: engine === "ts" ? null : java?.not_run ?? null,
    java_marker_missing: java?.marker_missing ?? null,
    ts_exception: ts?.exception ?? null,
    ts_timeout: ts?.timed_out ?? null,
    ts_stalled: ts?.stall_detected ?? null,
    ts_timeout_reason: ts?.timeout_reason ?? null,
    ts_last_progress_cycle: ts?.last_progress_cycle ?? null,
    ts_not_run: ts?.not_run ?? null,
    ts_marker_missing: ts?.marker_missing ?? null,
    process_limited: java?.process_limited === true || ts?.process_limited === true,
    java_process_limited: java?.process_limited ?? false,
    ts_process_limited: ts?.process_limited ?? false,
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

function assertUniqueFiles(files) {
  const seen = new Set();
  for (const file of files) {
    const key = resolve(file);
    if (seen.has(key)) throw new Error(`duplicate input file: ${key}`);
    seen.add(key);
  }
}

function selectCorpusFiles(files, options) {
  if (options.filePaths.length > 0) return files;
  if (options.mMinus) {
    if (files.length !== M1_MINUS_SOURCE_COUNT) {
      throw new Error(`M1-- requires exactly ${M1_MINUS_SOURCE_COUNT} source files; found ${files.length}`);
    }
    const excluded = new Set();
    const selected = files.filter((file) => {
      const normalized = String(file).replace(/\\/g, "/");
      const match = M1_MINUS_EXCLUDED_FILES.find((candidate) =>
        normalized === candidate || normalized.endsWith(`/${candidate}`));
      if (match === undefined) return true;
      excluded.add(match);
      return false;
    });
    const missing = M1_MINUS_EXCLUDED_FILES.filter((file) => !excluded.has(file));
    if (missing.length > 0) {
      throw new Error(`M1-- exclusion files are missing: ${missing.join(", ")}`);
    }
    if (selected.length !== M1_MINUS_SELECTED_COUNT) {
      throw new Error(`M1-- must select ${M1_MINUS_SELECTED_COUNT} files; selected ${selected.length}`);
    }
    return selected;
  }
  let selected = files.slice(options.start);
  if (options.limit !== null) selected = selected.slice(0, options.limit);
  else if (!options.all) selected = selected.slice(0, 10);
  return selected;
}

function resultKey(options, javaArtifact) {
  return JSON.stringify({
    engine: options.engine,
    cycles: options.cycles,
    timeoutMs: options.timeoutMs,
    processLimitMs: options.processLimitMs,
    tsMode: options.engine === "java" ? null : options.tsMode,
    tsCli: options.engine === "java" ? null : options.tsCli,
    resourceMetrics: options.resourceMetrics,
    corpusProfile: options.mMinus ? "m1--" : "default",
    excludedFiles: options.mMinus ? M1_MINUS_EXCLUDED_FILES : [],
    javaArtifactSha256: javaArtifact?.sha256 ?? null,
    javaBaselineSha256: options.javaBaseline?.sha256 ?? null,
  });
}

function loadCheckpoint(resultFile, runKey) {
  if (resultFile === null || !existsSync(resultFile)) return new Map();
  const rows = readFileSync(resultFile, "utf8")
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line));
  const checkpoint = new Map();
  for (const row of rows) {
    if (row.run_key !== runKey || typeof row.file !== "string") continue;
    const key = resolve(row.file);
    if (checkpoint.has(key)) {
      throw new Error(`duplicate checkpoint row for run key and file: ${key}`);
    }
    checkpoint.set(key, row);
  }
  return checkpoint;
}

function appendCheckpoint(resultFile, runKey, rows) {
  if (resultFile === null || rows.length === 0) return;
  const keys = new Set();
  for (const row of rows) {
    if (typeof row.file !== "string") throw new Error("checkpoint row is missing file");
    const key = resolve(row.file);
    if (keys.has(key)) throw new Error(`duplicate rows in checkpoint batch: ${key}`);
    keys.add(key);
  }
  appendFileSync(resultFile, rows
    .map((row) => JSON.stringify({ ...row, run_key: runKey }))
    .join("\n") + "\n", "utf8");
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.javaBaseline !== null) options.javaBaseline = loadJavaBaseline(options.javaBaseline);
  const javaArtifact = resolveJavaArtifact(options);
  if (options.engine !== "java") {
    options.tsCli = options.tsCli === null
      ? resolve(join(projectRoot, "scripts", "cli.mjs"))
      : requirePath(options.tsCli, "--ts-cli", "file");
  }
  const javaAdapter = javaArtifact === null ? null : compileJavaAdapter(javaArtifact);
  const resultFile = options.resultFile === null ? null : resolve(options.resultFile);
  if (resultFile !== null && existsSync(resultFile) && !options.resume) {
    throw new Error(`--result-file already exists; use --resume to continue: ${resultFile}`);
  }
  const runKey = resultKey(options, javaArtifact);
  const checkpoint = loadCheckpoint(resultFile, runKey);
  const discoveredFiles = options.filePaths.length > 0
    ? options.filePaths.map((file) => requirePath(file, "--file", "file"))
    : (await Promise.all(corpusDirectories.map(findNalFiles))).flat().sort();
  const files = selectCorpusFiles(discoveredFiles, options);
  if (files.length === 0) throw new Error("No NAL files found");
  assertUniqueFiles(files);

  const sources = new Map();
  for (const file of files) sources.set(file, extractNalMetadata(await readFile(file, "utf8")));
  if (options.javaBaseline !== null) {
    for (const file of files) {
      const baseline = options.javaBaseline.rows.get(projectFileKey(file));
      if (baseline === undefined) {
        throw new Error(`--java-baseline has no row for file: ${file}`);
      }
      if (JSON.stringify(baseline.expected_markers ?? [])
        !== JSON.stringify(sources.get(file).expected)) {
        throw new Error(`--java-baseline expectations do not match the current fixture: ${file}`);
      }
    }
  }

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
      if (options.engine !== "ts") {
        javaResults.push(...await runJava(
          pending,
          options.cycles,
          options.timeoutMs,
          options.processLimitMs,
          javaArtifact,
          javaAdapter,
          options.resourceMetrics,
        ));
      }
      if (options.engine !== "java") {
        const runTsFiles = options.tsMode === "cold" ? runTsCold : runTs;
        tsResults.push(...await runTsFiles(
          pending,
          options.cycles,
          options.timeoutMs,
          options.processLimitMs,
          options.tsCli,
          options.resourceMetrics,
        ));
      }
      const javaByFile = new Map(javaResults.map((row) => [resolve(row.file), row]));
      const tsByFile = new Map(tsResults.map((row) => [resolve(row.file), row]));
      const completedRows = pending.map((file) => {
        const key = resolve(file);
        const frozenJava = options.javaBaseline?.rows.get(projectFileKey(file))?.java ?? null;
        return {
          ...evaluateRow(
            key,
            sources.get(file).expected,
            javaByFile.get(key) ?? frozenJava,
            tsByFile.get(key) ?? null,
            options.engine,
            sources.get(file).embeddedCycles + options.cycles,
            options.timeoutMs,
            options.performanceBudgetMsPer1024Cycles,
          ),
          java_process_mode: options.engine === "ts"
            ? options.javaBaseline === null ? null : "frozen-baseline"
            : "cold",
          ts_process_mode: options.engine === "java" ? null : options.tsMode,
          chunk_index: index,
          sequence: files.indexOf(file),
          timeout_ms: options.timeoutMs,
          process_limit_ms: options.processLimitMs,
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
    const frozenJava = options.javaBaseline?.rows.get(projectFileKey(file))?.java ?? null;
    return checkpoint.get(key) ?? {
      ...evaluateRow(key, expected, frozenJava, null, options.engine),
      java_process_mode: options.engine === "ts"
        ? options.javaBaseline === null ? null : "frozen-baseline"
        : "cold",
      ts_process_mode: options.engine === "java" ? null : options.tsMode,
      chunk_index: null,
      sequence: files.indexOf(file),
      timeout_ms: options.timeoutMs,
      process_limit_ms: options.processLimitMs,
      embedded_cycles: sources.get(file).embeddedCycles,
      extra_cycles: options.cycles,
    };
  });

  const failures = rows.filter((row) => row.functional_pass !== true);
  const summary = {
    engine: options.engine,
    cycles: options.cycles,
    timeoutMs: options.timeoutMs,
    processLimitMs: options.processLimitMs,
    tsProcessMode: options.engine === "java" ? null : options.tsMode,
    ts_cli: options.engine === "java" ? null : options.tsCli,
    resource_metrics: options.resourceMetrics,
    corpus_profile: options.mMinus ? "m1--" : "default",
    excluded_files: options.mMinus ? M1_MINUS_EXCLUDED_FILES : [],
    files: rows.length,
    passed: rows.length - failures.length,
    failed: failures.length,
    java_artifact: javaArtifact,
    java_baseline: options.javaBaseline === null ? null : {
      path: options.javaBaseline.path,
      sha256: options.javaBaseline.sha256,
      baseline_id: options.javaBaseline.baseline_id,
      schema: options.javaBaseline.schema,
      java_source_commit: options.javaBaseline.java_source_commit,
      java_artifact_sha256: options.javaBaseline.java_artifact_sha256,
    },
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
      processLimitMs: summary.processLimitMs,
      ts_cli: summary.ts_cli,
      corpus_profile: summary.corpus_profile,
      excluded_files: summary.excluded_files,
      files: summary.files,
      passed: summary.passed,
      failed: summary.failed,
      java_artifact: summary.java_artifact,
      java_baseline: summary.java_baseline,
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

export {
  appendCheckpoint,
  assertUniqueFiles,
  completeProcessFailureRows,
  evaluateRow,
  evaluateMarkerPerformance,
  evaluateRuntimePerformance,
  evaluateLongCycleEquivalence,
  extractNalMetadata,
  loadJavaBaseline,
  isProcessTimeout,
  loadCheckpoint,
  normalizeResult,
  parseArgs,
  parseProgressLine,
  isProgressHeartbeat,
  runTs,
  selectCorpusFiles,
  parseJsonLines,
  classifyTimeoutObservation,
  projectFileKey,
};

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error.stack ?? error);
    process.exitCode = 1;
  });
}
