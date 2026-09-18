import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { test } from "node:test";
import { pathToFileURL } from "node:url";
import { isJavaProcess } from "../../scripts/testing/java-process-policy.mjs";

test("TS-only process policy recognizes direct Java and shell launches", () => {
  assert.equal(isJavaProcess("java", ["-version"]), true);
  assert.equal(isJavaProcess("C:\\jdk\\bin\\javac.exe", ["-version"]), true);
  assert.equal(isJavaProcess("cmd.exe", ["/c", "java -version"]), true);
  assert.equal(isJavaProcess("cmd.exe", ["/c", "\"C:\\jdk\\bin\\java.exe\" -version"]), true);
  assert.equal(isJavaProcess("java -version", [], { commandString: true }), true);
  assert.equal(isJavaProcess(process.execPath, ["java-master/file.nal"]), false);
});

test("TS-only preloader rejects Java launch without invoking a real Java binary", () => {
  const guard = join(process.cwd(), "scripts/testing/deny-java-processes.mjs");
  const child = spawnSync(process.execPath, [
    "--import", pathToFileURL(guard).href,
    "--input-type=module",
    "-e", "import { spawnSync } from 'node:child_process'; try { spawnSync('/missing/java.exe'); process.exit(1); } catch (error) { if (!String(error).includes('TS_ONLY_JAVA_PROCESS_BLOCKED')) process.exit(2); }",
  ], { cwd: process.cwd(), encoding: "utf8" });
  assert.equal(child.status, 0, child.stderr || child.stdout);
});
