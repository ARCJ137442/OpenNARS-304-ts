import { readdir, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const sourceRoots = [join(root, "src"), join(root, "test")];

const patterns = [
  {
    id: "constructor-delegation",
    level: "B",
    regex: /\bthis\s*\(/g,
    description: "Java constructor delegation; rewrite with an initializer or factory.",
  },
  {
    id: "java-class-literal",
    level: "B",
    regex: /\.class\b/g,
    description: "Java class literal; map to a deliberate runtime constructor/token.",
  },
  {
    id: "malformed-generic",
    level: "A",
    regex: /<<[A-Za-z]/g,
    description: "Duplicated generic angle bracket.",
  },
  {
    id: "malformed-operator",
    level: "A",
    regex: /\|\s*===|&\s*===/g,
    description: "Java logical operator residue.",
  },
  {
    id: "malformed-new-this",
    level: "B",
    regex: /\.newthis\b/g,
    description: "Generated receiver/inner-class residue; requires owner-aware repair.",
  },
  {
    id: "java-string-method",
    level: "C",
    regex: /\.(?:equals|contains|isEmpty|length)\s*\(/g,
    description: "Java string or collection method; rewrite according to the receiver type.",
  },
  {
    id: "java-collection-method",
    level: "C",
    regex: /\.(?:add|put|get|remove|size|iterator)\s*\(/g,
    description: "Java collection method; preserve collection semantics explicitly.",
  },
  {
    id: "jree-runtime-type",
    level: "C",
    regex: /\bjava\.(?:lang|util|io|net|text)\./g,
    description: "Java runtime type; decide whether to keep jree or use a native Node boundary.",
  },
  {
    id: "static-initializer",
    level: "B",
    regex: /^\s*static\s*\{/gm,
    description: "Static initialization; verify ordering and circular dependencies.",
  },
  {
    id: "anonymous-java-class",
    level: "B",
    regex: /\bnew\s+class\s+extends\b/g,
    description: "Anonymous Java class/enum translation; verify runtime identity and initialization.",
  },
];

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

async function main() {
  const files = (await Promise.all(sourceRoots.map(filesUnder))).flat().sort();
  const counts = patterns.map((pattern) => ({
    id: pattern.id,
    level: pattern.level,
    description: pattern.description,
    occurrences: 0,
    files: 0,
  }));

  for (const file of files) {
    const source = await readFile(file, "utf8");
    for (let i = 0; i < patterns.length; i += 1) {
      const matches = source.match(patterns[i].regex);
      if (matches?.length) {
        counts[i].occurrences += matches.length;
        counts[i].files += 1;
      }
    }
  }

  const report = {
    root,
    scannedFiles: files.length,
    patterns: counts,
  };
  if (process.argv.includes("--json")) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }
  console.log(`scanned files: ${report.scannedFiles}`);
  for (const pattern of counts) {
    console.log(`${pattern.level} ${pattern.id}: ${pattern.occurrences} occurrences in ${pattern.files} files`);
  }
}

main().catch((error) => {
  console.error(error.stack ?? error);
  process.exitCode = 1;
});
