import { execFile } from "node:child_process";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { promisify } from "node:util";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const execFileAsync = promisify(execFile);
const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

const rules = [
  {
    id: "direct-jree-import",
    regex: /(?:from\s*["']jree["']|import\s*["']jree["']|require\s*\(\s*["']jree["']\s*\))/g,
    layer: "boundary",
    status: "inventory-pending",
    alternative: "迁移到项目内原生实现；必要时只保留单一、窄化的兼容适配器。",
    risk: "直接耦合 npm jree，可能把 jree 类型和运行时初始化泄漏到公共模块。",
    contract: ["公共API不得泄漏jree类型", "保留项必须有无法移除的证据和回归测试"],
    modules: ["jree"],
  },
  {
    id: "java-primitive-alias",
    regex: /\btype\s+(?:int|long|float|double|short|byte|char|boolean)\b/g,
    layer: "data-structure",
    status: "candidate-native",
    alternative: "TypeScript原生number、bigint、boolean或项目内明确的Float32/int32边界类型。",
    risk: "删除别名可能掩盖Java float binary32、int32溢出或long精度契约。",
    contract: ["float在每个Java运算操作数处binary32收窄", "long超出安全整数范围时有明确策略"],
    modules: ["jree type aliases"],
  },
  {
    id: "java-util-runtime",
    regex: /\bjava\.util\./g,
    layer: "container",
    status: "inventory-pending",
    alternative: "按具体符号决定原生数组、Map/Set、项目内兼容集合或保留边界。",
    risk: "只看包名不能判定集合是否依赖Java的判等、顺序和迭代契约。",
    contract: ["逐符号归类", "高风险集合必须有行为对照测试"],
    modules: ["java.util", "jree"],
  },
  {
    id: "java-lang-runtime",
    regex: /\bjava\.lang\./g,
    layer: "runtime",
    status: "inventory-pending",
    alternative: "优先使用原生string/number/boolean和显式项目适配器。",
    risk: "wrapper、Object和CharSequence可能携带class、equals或UTF-16语义。",
    contract: ["区分类型标记与运行时行为", "保留项说明兼容边界"],
    modules: ["java.lang", "jree"],
  },
  {
    id: "java-collection",
    regex: /\bjava\.util\.(?:ArrayList|LinkedList|LinkedHashMap|LinkedHashSet|HashMap|HashSet|Map|Set|List|Collection|Iterator|Deque|Queue)\b/g,
    layer: "container",
    status: "semantic-review-required",
    alternative: "原生数组/Map/Set，或项目内NativeLinkedHashMap、NativeLinkedHashSet、NativeDeque及最小接口。",
    risk: "Java equals/hashCode、插入顺序、null、iterator.remove和恢复态bucket可能与JS身份语义不同。",
    contract: ["领域对象key先验证Java equals/hashCode", "插入、替换、删除和迭代顺序有回归测试"],
    modules: ["java.util", "jree"],
  },
  {
    id: "new-array-list",
    regex: /\bnew\s+java\.util\.ArrayList\b/g,
    layer: "container",
    status: "candidate-native",
    alternative: "原生数组，或在需要Java List语义时使用项目内NativeList。",
    risk: "只有确认不依赖equals/hash、iterator.remove和Java边界行为时才能直接替换。",
    contract: ["顺序和可变性保持", "调用点不依赖Java集合方法副作用"],
    modules: ["java.util", "jree"],
  },
  {
    id: "new-linked-hash-map",
    regex: /\bnew\s+java\.util\.LinkedHashMap\b/g,
    layer: "container",
    status: "semantic-review-required",
    alternative: "原生Map仅在key为JS identity等价时使用，否则实现Java equals/hash/order兼容Map。",
    risk: "领域对象key、插入顺序、替换位置和恢复态bucket可能改变推理结果。",
    contract: ["equals/hashCode契约", "插入、替换、删除和遍历顺序"],
    modules: ["java.util", "jree"],
  },
  {
    id: "new-linked-hash-set",
    regex: /\bnew\s+java\.util\.LinkedHashSet\b/g,
    layer: "container",
    status: "semantic-review-required",
    alternative: "原生Set仅在元素身份语义已证明时使用，否则实现Java equals/hash/order兼容Set。",
    risk: "结构项和集合项的Java equals/hashCode与JS对象身份不同。",
    contract: ["元素判等", "插入和删除后的遍历顺序"],
    modules: ["java.util", "jree"],
  },
  {
    id: "java-object",
    regex: /\bJavaObject\b/g,
    layer: "runtime",
    status: "high-risk-runtime",
    alternative: "普通TypeScript类；class identity和clone契约由项目内显式适配器承接。",
    risk: "移除可能改变class、clone、继承和静态初始化的可观察行为。",
    contract: ["class identity/instanceof行为可观察且有测试", "公共类型不暴露jree JavaObject"],
    modules: ["jree", "java.lang"],
  },
  {
    id: "java-string",
    regex: /\b(?:java\.lang\.(?:String|CharSequence)|JavaString)\b/g,
    layer: "runtime",
    status: "semantic-review-required",
    alternative: "原生string；UTF-16 code unit、hash、compare和Java输入边界集中在项目内适配器。",
    risk: "JavaString的UTF-16、hash和compare差异会改变Narsese key与集合判等。",
    contract: ["UTF-16 code unit行为保持", "hash、compare和大小写边界有Java/TS对照测试"],
    modules: ["jree", "java.lang"],
  },
  {
    id: "java-random",
    regex: /\b(?:java\.util\.)?Random\b/g,
    layer: "inference",
    status: "semantic-review-required",
    alternative: "项目内固定Java Random兼容实现；不得直接以Math.random替代。",
    risk: "随机序列改变会影响统一、任务选择、Bag调度和NAL事件顺序。",
    contract: ["固定seed序列与Java一致", "随机调用次数和调用顺序不变"],
    modules: ["java.util", "jree"],
  },
  {
    id: "runtime-class-identity",
    regex: /(?:\.class\b|\bgetClass\s*\(|\binstanceof\s+java\.)/g,
    layer: "runtime",
    status: "high-risk-runtime",
    alternative: "显式构造器/token映射和集中类型判断；不依赖jree的Symbol.hasInstance。",
    risk: "类标识坍缩会误派发事件、规则或插件。",
    contract: ["不同运行时类token保持可区分", "instanceof/事件派发有直接回归测试"],
    modules: ["jree", "java.lang", "runtime adapter"],
  },
  {
    id: "java-iterator",
    regex: /\b(?:java\.util\.)?Iterator\b|\.iterator\s*\(\s*\)/g,
    layer: "container",
    status: "semantic-review-required",
    alternative: "Iterable/Iterator协议或原生for-of；若需要remove，提供显式可变迭代器。",
    risk: "Java iterator.remove、快照时机和并发修改行为不能由for-of自动保证。",
    contract: ["迭代快照时机明确", "remove和修改期间行为有测试"],
    modules: ["java.util", "jree"],
  },
  {
    id: "static-initialization",
    regex: /^\s*static\s*\{/gm,
    layer: "runtime",
    status: "high-risk-runtime",
    alternative: "显式初始化函数、工厂或注册表；按数据结构到入口方向安排依赖。",
    risk: "模块求值顺序和循环依赖可能造成未初始化导出或错误类身份。",
    contract: ["初始化顺序可说明", "循环依赖和首次导入路径有测试"],
    modules: ["ES modules", "jree"],
  },
];

async function filesUnder(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await filesUnder(path));
    else if (entry.isFile() && path.endsWith(".ts")) files.push(path);
  }
  return files;
}

function maskNonCode(source) {
  const masked = [...source];
  let state = "code";
  let quote = "";
  let escaped = false;
  let regexClass = false;
  for (let i = 0; i < source.length; i += 1) {
    const current = source[i];
    const next = source[i + 1];
    if (state === "line-comment") {
      if (current === "\n" || current === "\r") state = "code";
      else masked[i] = " ";
      continue;
    }
    if (state === "block-comment") {
      if (current === "*" && next === "/") {
        masked[i] = " ";
        masked[i + 1] = " ";
        i += 1;
        state = "code";
      } else if (current !== "\n" && current !== "\r") masked[i] = " ";
      continue;
    }
    if (state === "string") {
      if (current === "\n" || current === "\r") {
        state = "code";
        escaped = false;
        continue;
      }
      masked[i] = " ";
      if (escaped) escaped = false;
      else if (current === "\\") escaped = true;
      else if (current === quote) state = "code";
      continue;
    }
    if (state === "regex") {
      if (current === "\n" || current === "\r") {
        state = "code";
        escaped = false;
        regexClass = false;
        continue;
      }
      masked[i] = " ";
      if (escaped) escaped = false;
      else if (current === "\\") escaped = true;
      else if (current === "[") regexClass = true;
      else if (current === "]") regexClass = false;
      else if (current === "/" && !regexClass) state = "code";
      continue;
    }
    if (current === "/" && next === "/") {
      masked[i] = " ";
      masked[i + 1] = " ";
      i += 1;
      state = "line-comment";
    } else if (current === "/" && next === "*") {
      masked[i] = " ";
      masked[i + 1] = " ";
      i += 1;
      state = "block-comment";
    } else if (current === "\"" || current === "'" || current === "`") {
      masked[i] = " ";
      quote = current;
      escaped = false;
      state = "string";
    } else if (current === "/" && !["/", "*"].includes(next)) {
      let previous = i - 1;
      while (previous >= 0 && /\s/.test(source[previous])) previous -= 1;
      if (previous < 0 || /[([{:;,=!?&|]/.test(source[previous])) {
        masked[i] = " ";
        escaped = false;
        regexClass = false;
        state = "regex";
      }
    }
  }
  return masked.join("");
}

function maskCommentsOnly(source) {
  const masked = [...source];
  let state = "code";
  for (let i = 0; i < source.length; i += 1) {
    const current = source[i];
    const next = source[i + 1];
    if (state === "line-comment") {
      if (current === "\n" || current === "\r") state = "code";
      else masked[i] = " ";
      continue;
    }
    if (state === "block-comment") {
      if (current === "*" && next === "/") {
        masked[i] = " ";
        masked[i + 1] = " ";
        i += 1;
        state = "code";
      } else if (current !== "\n" && current !== "\r") masked[i] = " ";
      continue;
    }
    if (current === "/" && next === "/") {
      masked[i] = " ";
      masked[i + 1] = " ";
      i += 1;
      state = "line-comment";
    } else if (current === "/" && next === "*") {
      masked[i] = " ";
      masked[i + 1] = " ";
      i += 1;
      state = "block-comment";
    }
  }
  return masked.join("");
}

function lineNumber(source, index) {
  return source.slice(0, index).split(/\r?\n/).length;
}

function performanceHeat(relativePath) {
  if (/^src[\\/]\s*(?:inference|storage|control|entity)/.test(relativePath)) return "high";
  if (/^src[\\/]\s*(?:main|operator|io)/.test(relativePath)) return "medium";
  return "low";
}

function unique(values) {
  return [...new Set(values)];
}

async function gitCommit() {
  try {
    const { stdout } = await execFileAsync("git", ["rev-parse", "HEAD"], { cwd: root });
    return stdout.trim();
  } catch {
    return null;
  }
}

function parseOptions() {
  const args = process.argv.slice(2);
  const includeTests = args.includes("--include-tests");
  const outputIndex = args.indexOf("--output");
  const output = outputIndex >= 0 ? args[outputIndex + 1] : null;
  if (outputIndex >= 0 && !output) throw new Error("--output requires a file path");
  return { includeTests, output };
}

async function main() {
  const options = parseOptions();
  const sourceRoots = [join(root, "src")];
  if (options.includeTests) sourceRoots.push(join(root, "test"));
  const files = (await Promise.all(sourceRoots.map(filesUnder))).flat().sort();
  const items = [];
  const textualBaseline = {
    directJreeImportFiles: new Set(),
    newArrayListOccurrences: 0,
    newLinkedHashMapOccurrences: 0,
    newLinkedHashSetOccurrences: 0,
    javaObjectFiles: new Set(),
    javaUtilFiles: new Set(),
    javaLangFiles: new Set(),
  };

  for (const file of files) {
    const source = await readFile(file, "utf8");
    const code = maskNonCode(source);
    const codeWithStrings = maskCommentsOnly(source);
    const relativePath = relative(root, file).replaceAll("\\", "/");
    if (/(?:from\s*["']jree["']|import\s*["']jree["']|require\s*\(\s*["']jree["']\s*\))/.test(source)) {
      textualBaseline.directJreeImportFiles.add(relativePath);
    }
    textualBaseline.newArrayListOccurrences += [...source.matchAll(/\bnew\s+java\.util\.ArrayList\b/g)].length;
    textualBaseline.newLinkedHashMapOccurrences += [...source.matchAll(/\bnew\s+java\.util\.LinkedHashMap\b/g)].length;
    textualBaseline.newLinkedHashSetOccurrences += [...source.matchAll(/\bnew\s+java\.util\.LinkedHashSet\b/g)].length;
    if (/\bJavaObject\b/.test(source)) textualBaseline.javaObjectFiles.add(relativePath);
    if (/\bjava\.util\./.test(source)) textualBaseline.javaUtilFiles.add(relativePath);
    if (/\bjava\.lang\./.test(source)) textualBaseline.javaLangFiles.add(relativePath);
    for (const rule of rules) {
      const matches = [...(rule.id === "direct-jree-import" ? codeWithStrings : code).matchAll(rule.regex)];
      if (matches.length === 0) continue;
      const sourceSymbols = unique(matches.map((match) => match[0].trim()).filter(Boolean));
      items.push({
        file: relativePath,
        symbols: sourceSymbols,
        kind: rule.id,
        layer: rule.layer,
        occurrences: matches.length,
        lines: unique(matches.map((match) => lineNumber(source, match.index ?? 0))),
        runtimeUse: `静态命中${rule.id}；需结合调用点确认运行时用途。`,
        alternative: rule.alternative,
        semanticRisk: rule.risk,
        performanceHeat: performanceHeat(relativePath),
        dependencyModules: rule.modules,
        requiredContracts: rule.contract,
        status: rule.status,
      });
    }
  }

  const count = (kind) => items.filter((item) => item.kind === kind);
  const occurrences = (kind) => count(kind).reduce((total, item) => total + item.occurrences, 0);
  const sourceFiles = files.map((file) => relative(root, file).replaceAll("\\", "/"));
  const packageJson = JSON.parse(await readFile(join(root, "package.json"), "utf8"));
  const report = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    gitCommit: await gitCommit(),
    scope: options.includeTests ? ["src", "test"] : ["src"],
    sourceFiles: sourceFiles.length,
    summary: {
      directJreeImportFiles: count("direct-jree-import").length,
      directJreeImportOccurrences: occurrences("direct-jree-import"),
      newArrayListOccurrences: occurrences("new-array-list"),
      newLinkedHashMapOccurrences: occurrences("new-linked-hash-map"),
      newLinkedHashSetOccurrences: occurrences("new-linked-hash-set"),
      javaObjectFiles: count("java-object").length,
      javaUtilFiles: count("java-util-runtime").length,
      javaLangFiles: count("java-lang-runtime").length,
      javaStringFiles: count("java-string").length,
      highRiskItems: items.filter((item) => item.status === "high-risk-runtime").length,
      semanticReviewItems: items.filter((item) => item.status === "semantic-review-required").length,
      candidateNativeItems: items.filter((item) => item.status === "candidate-native").length,
    },
    textualBaseline: {
      directJreeImportFiles: textualBaseline.directJreeImportFiles.size,
      newArrayListOccurrences: textualBaseline.newArrayListOccurrences,
      newLinkedHashMapOccurrences: textualBaseline.newLinkedHashMapOccurrences,
      newLinkedHashSetOccurrences: textualBaseline.newLinkedHashSetOccurrences,
      javaObjectFiles: textualBaseline.javaObjectFiles.size,
      javaUtilFiles: textualBaseline.javaUtilFiles.size,
      javaLangFiles: textualBaseline.javaLangFiles.size,
      note: "包含注释和禁用代码；summary基于去除注释后的代码命中，作为迁移前后计数参照。",
    },
    dependency: {
      package: "jree",
      declaredVersion: packageJson.dependencies?.jree ?? null,
      declaredIn: "package.json",
    },
    classification: {
      A: "可直接原生化候选，但仍需局部契约验证",
      B: "需要Java语义兼容实现",
      C: "高风险运行时边界",
    },
    items,
    limitations: [
      "静态扫描不能证明调用点的真实语义；每条记录仍需局部代码审阅和测试。",
      "集合构造计数需按专用构造表达式另行核对，不能用java.util总命中替代。",
      "本报告只覆盖src；使用--include-tests可生成包含测试代码的辅助盘点。",
    ],
  };
  const serialized = JSON.stringify(report, null, 2);
  if (options.output) await writeFile(resolve(root, options.output), `${serialized}\n`, "utf8");
  console.log(serialized);
}

main().catch((error) => {
  console.error(error.stack ?? error);
  process.exitCode = 1;
});
