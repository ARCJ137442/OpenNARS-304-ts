import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { delimiter, dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const javaRoot = join(projectRoot, "java-master");
const javaJar = join(javaRoot, "target", "opennars-3.1.0-SNAPSHOT.jar");
const javaTestClasses = join(javaRoot, "target", "test-classes");
const javaClasses = join(javaRoot, "target", "classes");
const javaAdapterSource = join(projectRoot, "scripts", "e2e", "NalParityRunner.java");

const corpusDirectories = [
  join(javaRoot, "src", "main", "resources", "nal", "single_step"),
  join(javaRoot, "src", "main", "resources", "nal", "multi_step"),
  join(javaRoot, "src", "main", "resources", "nal", "application"),
];

function parseArgs(argv) {
  const options = { engine: "java", cycles: 1550, limit: null, all: false };
  for (let i = 0; i < argv.length; i += 1) {
    const argument = argv[i];
    if (argument === "--engine") options.engine = argv[++i];
    else if (argument === "--cycles") options.cycles = Number(argv[++i]);
    else if (argument === "--limit") options.limit = Number(argv[++i]);
    else if (argument === "--all") options.all = true;
    else throw new Error(`Unknown argument: ${argument}`);
  }
  if (!Number.isInteger(options.cycles) || options.cycles < 1) {
    throw new Error("--cycles must be a positive integer");
  }
  return options;
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

function compileJavaAdapter() {
  const outputDirectory = mkdtempSync(join(tmpdir(), "opennars-java-parity-"));
  const classpath = [javaTestClasses, javaClasses, javaJar].join(delimiter);
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

function runJava(files, cycles) {
  const adapter = compileJavaAdapter();
  try {
    const result = spawnSync("java", ["-cp", adapter.classpath, "NalParityRunner", String(cycles), ...files], {
      cwd: projectRoot,
      encoding: "utf8",
      maxBuffer: 32 * 1024 * 1024,
    });
    if (result.status !== 0) {
      throw new Error(`Java parity runner failed:\n${result.stdout}\n${result.stderr}`);
    }
    return result.stdout.split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line));
  } finally {
    rmSync(adapter.outputDirectory, { recursive: true, force: true });
  }
}

function runTs(files, cycles) {
  const cli = join(projectRoot, "scripts", "cli.mjs");
  const result = spawnSync(process.execPath, [cli, "--cycles", String(cycles), ...files], {
    cwd: projectRoot,
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
  });
  if (result.status !== 0) {
    throw new Error(`TypeScript CLI failed:\n${result.stdout}\n${result.stderr}`);
  }
  return result.stdout.split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line));
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  let files = (await Promise.all(corpusDirectories.map(findNalFiles))).flat().sort();
  if (!options.all && options.limit !== null) files = files.slice(0, options.limit);
  if (!options.all && options.limit === null) files = files.slice(0, 10);
  if (files.length === 0) throw new Error("No NAL files found");

  const sources = new Map();
  for (const file of files) sources.set(file, extractExpectations(await readFile(file, "utf8")));

  const javaResults = options.engine === "ts" ? [] : runJava(files, options.cycles);
  const tsResults = options.engine === "java" ? [] : runTs(files, options.cycles);
  const byFile = (rows) => new Map(rows.map((row) => [resolve(row.file), row]));
  const javaByFile = byFile(javaResults);
  const tsByFile = byFile(tsResults);
  const rows = files.map((file) => {
    const key = resolve(file);
    const expected = sources.get(file).length;
    const java = javaByFile.get(key) ?? null;
    const ts = tsByFile.get(key) ?? null;
    const parity = java && ts ? java.ok === ts.ok && java.expected === ts.expected && java.passed === ts.passed : null;
    return { file: key, expected, java, ts, parity };
  });

  const failures = rows.filter((row) => options.engine === "java" ? !row.java?.ok : options.engine === "ts" ? !row.ts?.ok : row.parity !== true);
  const summary = {
    engine: options.engine,
    cycles: options.cycles,
    files: rows.length,
    passed: rows.length - failures.length,
    failed: failures.length,
    rows,
  };
  console.log(JSON.stringify(summary, null, 2));
  if (failures.length > 0) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error.stack ?? error);
  process.exitCode = 1;
});
