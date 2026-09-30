import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import test from "node:test";
import { Narsese } from "../../src/io/Narsese.ts";

const projectRoot = fileURLToPath(new URL("../..", import.meta.url));
const codemod = join(projectRoot, "scripts", "converting", "apply-migration-patterns.mjs");
const scanner = join(projectRoot, "scripts", "converting", "scan-migration-patterns.mjs");

type ScriptResult = {
  code: number | null;
  stdout: string;
  stderr: string;
};

function runScript(script: string, args: string[]): Promise<ScriptResult> {
  return new Promise<ScriptResult>((resolve, reject) => {
    const child = spawn(process.execPath, [script, ...args], { cwd: projectRoot });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => { stdout += chunk; });
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.on("error", reject);
    child.on("close", (code) => resolve({ code, stdout, stderr }));
  });
}

function runCodemod(args: string[]): Promise<ScriptResult> {
  return runScript(codemod, args);
}

test("migration codemod repairs only the narrow generic alias shape", async () => {
  const directory = await mkdtemp(join(tmpdir(), "opennars-codemod-"));
  const file = join(directory, "fixture.ts");
  try {
    await writeFile(file, [
      "export type Broken<<T extends Map<string, number>>> = T;",
      "const narsese = '<<a --> b>>';",
    ].join("\n"), "utf8");

    const preview = await runCodemod(["--json", "--file", file, "--pattern", "malformed-generic"]);
    assert.equal(preview.code, 0);
    assert.equal(JSON.parse(preview.stdout).changed.length, 1);
    assert.match(await readFile(file, "utf8"), /Broken<<T/);

    const checkBeforeWrite = await runCodemod(["--check", "--file", file, "--pattern", "malformed-generic"]);
    assert.equal(checkBeforeWrite.code, 1);

    const write = await runCodemod(["--write", "--file", file, "--pattern", "malformed-generic"]);
    assert.equal(write.code, 0);
    const updated = await readFile(file, "utf8");
    assert.match(updated, /export type Broken<T extends Map<string, number>> = T;/);
    assert.match(updated, /const narsese = '<<a --> b>>';/);

    const checkAfterWrite = await runCodemod(["--check", "--file", file, "--pattern", "malformed-generic"]);
    assert.equal(checkAfterWrite.code, 0);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("migration codemod repairs split logical operators", async () => {
  const directory = await mkdtemp(join(tmpdir(), "opennars-codemod-"));
  const file = join(directory, "fixture.ts");
  try {
    await writeFile(file, "if (null === left | === right && null === other & === third) {}\n", "utf8");
    const write = await runCodemod(["--write", "--file", file, "--pattern", "malformed-operator"]);
    assert.equal(write.code, 0);
    assert.equal(await readFile(file, "utf8"), "if (null === left || right && null === other && third) {}\n");
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("migration codemod adds extensions only to relative ESM imports", async () => {
  const directory = await mkdtemp(join(tmpdir(), "opennars-codemod-"));
  const file = join(directory, "fixture.ts");
  try {
    await writeFile(file, [
      "import { Term } from '../language/Term';",
      "import { Texts } from '../io/Texts.ts';",
      "import { java } from '../../src/runtime/native-runtime.ts';",
    ].join("\n"), "utf8");
    const write = await runCodemod(["--write", "--file", file, "--pattern", "esm-relative-extension"]);
    assert.equal(write.code, 0);
    assert.equal(await readFile(file, "utf8"), [
      "import { Term } from '../language/Term.ts';",
      "import { Texts } from '../io/Texts.ts';",
      "import { java } from '../../src/runtime/native-runtime.ts';",
    ].join("\n"));
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("migration scanner ignores Narsese examples in comments, strings, and regex literals", async () => {
  const result = await runScript(scanner, ["--json"]);
  assert.equal(result.code, 0);
  const report = JSON.parse(result.stdout) as {
    patterns: Array<{ id: string; occurrences: number }>;
  };
  const malformedGeneric = report.patterns.find((pattern) => pattern.id === "malformed-generic");
  const malformedOperator = report.patterns.find((pattern) => pattern.id === "malformed-operator");
  assert.ok(malformedGeneric);
  assert.ok(malformedOperator);
  assert.equal(malformedGeneric.occurrences, 0);
  assert.equal(malformedOperator.occurrences, 0);
});

test("Narsese constructor delegation preserves either memory entry point", () => {
  const memory = {};
  assert.equal(new Narsese(memory as never).memory, memory);
  assert.equal(new Narsese({ memory } as never).memory, memory);
});
