import { readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const defaultRoots = [join(root, "src"), join(root, "test")];

// These rules deliberately operate on the narrowest source shape observed in
// the conversion output. They are syntax repairs, not Java API migrations.
const rules = new Map([
  [
    "malformed-generic",
    {
      level: "A",
      description: "Remove duplicated generic angle brackets in exported type aliases.",
      apply(source) {
        return source.replace(
          /^(\s*export\s+type\s+\w+)(<<[^\n]*>>)(\s*=.*)$/gm,
          (_line, name, generic, tail) => `${name}${generic.slice(1, -1)}${tail}`,
        );
      },
    },
  ],
  [
    "malformed-operator",
    {
      level: "A",
      description: "Restore &&/|| where a Java logical operator was split before ===.",
      apply(source) {
        return source.replace(/^(?=.*\b(?:if|while)\s*\()[^\r\n]*$/gm, (line) => {
          if (line.includes("\"") || line.includes("'") || line.trim().startsWith("//")) return line;
          return line
          .replace(/(?<!\|)\|\s*===\s*/g, "|| ")
          .replace(/(?<!&)\&\s*===\s*/g, "&& ");
        });
      },
    },
  ],
  [
    "esm-relative-extension",
    {
      level: "A",
      description: "Add .ts to relative ESM imports that point to TypeScript source files.",
      apply(source) {
        const appendExtension = (match, prefix, path, suffix) => /\.(?:ts|tsx|js|jsx|json)$/.test(path)
          ? match
          : `${prefix}${path}.ts${suffix}`;
        return source
          .replace(
            /(^\s*(?:import|export)\b[^\r\n]*?\bfrom\s*["'])(\.\.?\/[^"']+?)(["'])/gm,
            appendExtension,
          )
          .replace(
            /(^\s*import\s*["'])(\.\.?\/[^"']+?)(["'])/gm,
            appendExtension,
          );
      },
    },
  ],
]);

async function filesUnder(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const result = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) result.push(...await filesUnder(path));
    else if (entry.isFile() && path.endsWith(".ts")) result.push(path);
  }
  return result;
}

function parseArgs(argv) {
  const options = { check: false, write: false, json: false, files: [], patterns: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const argument = argv[i];
    if (argument === "--check") options.check = true;
    else if (argument === "--write") options.write = true;
    else if (argument === "--json") options.json = true;
    else if (argument === "--file") options.files.push(resolve(argv[++i]));
    else if (argument === "--pattern") options.patterns.push(argv[++i]);
    else throw new Error(`Unknown argument: ${argument}`);
  }
  if (options.check && options.write) {
    throw new Error("--check and --write are mutually exclusive");
  }
  if (options.patterns.length === 0) options.patterns = [...rules.keys()];
  for (const pattern of options.patterns) {
    if (!rules.has(pattern)) throw new Error(`Unknown migration pattern: ${pattern}`);
  }
  return options;
}

function applyRules(source, selectedPatterns) {
  let updated = source;
  const matches = [];
  for (const id of selectedPatterns) {
    const rule = rules.get(id);
    const candidate = rule.apply(updated);
    if (candidate !== updated) matches.push(id);
    updated = candidate;
  }
  return { updated, matches };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const files = options.files.length > 0
    ? options.files
    : (await Promise.all(defaultRoots.map(filesUnder))).flat().sort();
  const changed = [];

  for (const file of files) {
    const source = await readFile(file, "utf8");
    const result = applyRules(source, options.patterns);
    if (result.updated === source) continue;
    changed.push({ file, patterns: result.matches });
    if (options.write) await writeFile(file, result.updated, "utf8");
  }

  const report = {
    mode: options.write ? "write" : options.check ? "check" : "preview",
    patterns: options.patterns,
    files: files.length,
    changed,
  };
  if (options.json) console.log(JSON.stringify(report, null, 2));
  else if (changed.length === 0) console.log("migration patterns: no changes");
  else {
    for (const item of changed) console.log(`${report.mode}: ${item.file} (${item.patterns.join(", ")})`);
    if (!options.write) console.log("preview only: pass --write to modify files");
  }

  if (options.check && changed.length > 0) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error.stack ?? error);
  process.exitCode = 1;
});
