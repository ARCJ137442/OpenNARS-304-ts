import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync, statSync } from "node:fs";
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
  const marker = "''outputMustContain('";
  const expectations = [];
  for (const rawLine of source.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line.startsWith(marker) || !line.endsWith("')")) continue;
    expectations.push(line.slice(marker.length, -2));
  }
  return expectations;
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
  }));
}

function addArtifactMetadata(rows, artifact) {
  return rows.map((row) => ({
    ...row,
    artifact_path: artifact.jar,
    artifact_sha256: artifact.sha256,
  }));
}

function runJava(files, cycles, timeoutMs, artifact) {
  const adapter = compileJavaAdapter(artifact);
  try {
    const result = spawnSync("java", ["-cp", adapter.classpath, "NalParityRunner", String(cycles), ...files], {
      cwd: projectRoot,
      encoding: "utf8",
      maxBuffer: 32 * 1024 * 1024,
      ...(timeoutMs === null ? {} : { timeout: timeoutMs }),
    });
    if (result.error?.code === "ETIMEDOUT" || result.signal != null) {
      return addArtifactMetadata(timeoutRows(files, cycles, "Java", timeoutMs), artifact);
    }
    if (result.status !== 0) {
      throw new Error(`Java parity runner failed:\n${result.stdout}\n${result.stderr}`);
    }
    return addArtifactMetadata(result.stdout.split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line)), artifact);
  } finally {
    rmSync(adapter.outputDirectory, { recursive: true, force: true });
  }
}

function runTs(files, cycles, timeoutMs) {
  const cli = join(projectRoot, "scripts", "cli.mjs");
  const result = spawnSync(process.execPath, ["--loader", "./scripts/ts-loader.mjs", cli, "--cycles", String(cycles), ...files], {
    cwd: projectRoot,
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
    ...(timeoutMs === null ? {} : { timeout: timeoutMs }),
  });
  if (result.error?.code === "ETIMEDOUT" || result.signal != null) {
    return timeoutRows(files, cycles, "TypeScript", timeoutMs);
  }
  if (result.status !== 0) {
    throw new Error(`TypeScript CLI failed:\n${result.stdout}\n${result.stderr}`);
  }
  return result.stdout.split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line));
}

function splitIntoChunks(files, chunkSize) {
  if (chunkSize === null) return [files];
  const chunks = [];
  for (let index = 0; index < files.length; index += chunkSize) {
    chunks.push(files.slice(index, index + chunkSize));
  }
  return chunks;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const javaArtifact = resolveJavaArtifact(options);
  let files = (await Promise.all(corpusDirectories.map(findNalFiles))).flat().sort();
  files = files.slice(options.start);
  if (options.limit !== null) files = files.slice(0, options.limit);
  else if (!options.all) files = files.slice(0, 10);
  if (files.length === 0) throw new Error("No NAL files found");

  const sources = new Map();
  for (const file of files) sources.set(file, extractExpectations(await readFile(file, "utf8")));

  const javaResults = [];
  const tsResults = [];
  const chunks = splitIntoChunks(files, options.chunkSize);
  for (const [index, chunk] of chunks.entries()) {
    if (options.chunkSize !== null) {
      console.error(`running chunk ${index + 1}/${chunks.length} (${chunk.length} files)`);
    }
    if (options.engine !== "ts") javaResults.push(...runJava(chunk, options.cycles, options.timeoutMs, javaArtifact));
    if (options.engine !== "java") tsResults.push(...runTs(chunk, options.cycles, options.timeoutMs));
  }
  const byFile = (rows) => new Map(rows.map((row) => [resolve(row.file), row]));
  const javaByFile = byFile(javaResults);
  const tsByFile = byFile(tsResults);
  const rows = files.map((file) => {
    const key = resolve(file);
    const expected = sources.get(file).length;
    const java = javaByFile.get(key) ?? null;
    const ts = tsByFile.get(key) ?? null;
    const parity = java && ts
      ? java.ok === ts.ok
        && java.expected === ts.expected
        && java.passed === ts.passed
        && JSON.stringify(java.matched ?? []) === JSON.stringify(ts.matched ?? [])
      : null;
    return { file: key, expected, java, ts, parity };
  });

  const failures = rows.filter((row) => options.engine === "java" ? !row.java?.ok : options.engine === "ts" ? !row.ts?.ok : row.parity !== true);
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
        file: row.file,
        expected: row.expected,
        java: compact(row.java),
        ts: compact(row.ts),
        parity: row.parity,
      })),
    }, null, 2));
  } else {
    console.log(JSON.stringify(summary, null, 2));
  }
  if (failures.length > 0) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error.stack ?? error);
  process.exitCode = 1;
});
