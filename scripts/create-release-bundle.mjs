import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const releaseDirectory = resolve(projectRoot, "release");
mkdirSync(releaseDirectory, { recursive: true });

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const npmOptions = {
  cwd: projectRoot,
  shell: process.platform === "win32",
};
execFileSync(npmCommand, ["run", "build"], { ...npmOptions, stdio: "inherit" });
const packOutput = execFileSync(npmCommand, ["pack", "--ignore-scripts", "--pack-destination", releaseDirectory, "--json"], {
  ...npmOptions,
  encoding: "utf8",
  stdio: ["ignore", "pipe", "inherit"],
});
const packRecords = JSON.parse(packOutput);
const packRecord = packRecords.at(-1);
if (!packRecord?.filename) throw new Error("npm pack did not return a tarball filename");

const tarballPath = resolve(releaseDirectory, packRecord.filename);
const tarballSha256 = createHash("sha256").update(readFileSync(tarballPath)).digest("hex");
const sourceCommit = execFileSync("git", ["rev-parse", "HEAD"], { cwd: projectRoot, encoding: "utf8" }).trim();
const packageManifest = JSON.parse(readFileSync(resolve(projectRoot, "package.json"), "utf8"));
const manifest = {
  package: packageManifest.name,
  version: packageManifest.version,
  tarball: packRecord.filename,
  tarballSha256,
  sourceCommit,
  generatedAt: new Date().toISOString(),
  install: `npm install ./${packRecord.filename}`,
};
writeFileSync(resolve(releaseDirectory, "release-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

console.log(JSON.stringify({ ok: true, releaseDirectory, ...manifest }, null, 2));
