import { readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const jreePackagePath = join(projectRoot, "node_modules", "jree", "package.json");

async function ensureJreePackage() {
  let packageText;
  try {
    packageText = await readFile(jreePackagePath, "utf8");
  } catch (error) {
    if (error?.code === "ENOENT") return false;
    throw error;
  }

  const packageJson = JSON.parse(packageText);
  if (packageJson.exports?.["."] === "./lib/index.js") return false;

  packageJson.exports = {
    ...(typeof packageJson.exports === "object" && packageJson.exports !== null
      ? packageJson.exports
      : {}),
    ".": "./lib/index.js",
  };
  await writeFile(jreePackagePath, `${JSON.stringify(packageJson, null, 4)}\n`, "utf8");
  return true;
}

export { ensureJreePackage };

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await ensureJreePackage();
}
