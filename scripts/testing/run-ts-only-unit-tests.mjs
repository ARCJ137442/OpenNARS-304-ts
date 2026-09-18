import { readdir } from "node:fs/promises";
import { spawn } from "node:child_process";
import { dirname, join, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const directories = ["test/node", "test/entity"];
const testFiles = (await Promise.all(directories.map(async (directory) => {
  const entries = await readdir(join(projectRoot, directory));
  return entries.filter((entry) => entry.endsWith(".test.ts"))
    .sort().map((entry) => relative(projectRoot, join(projectRoot, directory, entry)));
}))).flat();

if (testFiles.length === 0) throw new Error("TS-only unit test discovery found no test files");

const guardUrl = pathToFileURL(join(projectRoot, "scripts/testing/deny-java-processes.mjs")).href;
const nodeOptions = [process.env.NODE_OPTIONS, `--import=${guardUrl}`].filter(Boolean).join(" ");
const child = spawn(process.execPath, [
  "--import", "./scripts/register-ts-loader.mjs",
  "--test", "--test-concurrency=1", "--experimental-strip-types",
  ...testFiles,
], {
  cwd: projectRoot,
  stdio: "inherit",
  env: { ...process.env, NODE_OPTIONS: nodeOptions, OPENNARS_TEST_MODE: "ts-only" },
});

child.on("error", (error) => { throw error; });
child.on("exit", (code, signal) => {
  if (signal) {
    process.stderr.write(`TS-only unit tests exited from signal ${signal}\n`);
    process.exitCode = 1;
  } else {
    process.exitCode = code ?? 1;
  }
});
