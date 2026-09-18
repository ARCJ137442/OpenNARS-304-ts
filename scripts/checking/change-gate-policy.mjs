const HIGH_RISK_PATHS = [
  /^src\/(?:control|inference|storage|language|entity|operator|plugin|main|runtime|platform|io)\//,
];
const M1_MINUS_HOT_PATHS = [
  /^src\/(?:control|inference|storage)\//,
  /^src\/entity\/(?:Task|TaskLink|TermLink|Concept)\.ts$/,
  /^src\/language\/Variables\.ts$/,
  /^src\/runtime\/(?:Native\w+|jree-compat|Float32)\.ts$/,
  /^src\/main\/Nar\.ts$/,
];
const BASELINE_PATHS = [
  /^java-master\//,
  /^config\/defaultConfig\.xml$/,
  /^scripts\/e2e\/(?:run-nal-corpus|NalTraceRunner)\.mjs$/,
  /^scripts\/e2e\/.*\.java$/,
  /^scripts\/parity\/.*\.java$/,
  /^package-lock\.json$/,
];
const SEMANTIC_TOKENS = /\b(?:equals|hashCode|compareTo|iterator|Map|Set|Random|seed|TermLink|TaskLink|RuleTables|dispatch|instanceof|float|JavaObject|await|async)\b|Math\.fround/;
const STAGES = new Set(["none", "023", "024", "integration", "rc"]);
const SCOPES = new Set(["slice", "responsibility"]);

export function runtimeDependencyFingerprint(manifest) {
  return JSON.stringify(Object.fromEntries(
    ["dependencies", "optionalDependencies", "peerDependencies"].map((section) => [
      section,
      Object.fromEntries(Object.entries(manifest[section] ?? {}).sort(([left], [right]) => left.localeCompare(right))),
    ]),
  ));
}

export function classifyChangeGate({ files = [], changedLines = 0, patch = "", stage = "none", scope = "slice", runtimeDependenciesChanged = false } = {}) {
  if (!STAGES.has(stage)) throw new Error(`unknown stage: ${stage}`);
  if (!SCOPES.has(scope)) throw new Error(`unknown scope: ${scope}`);
  const normalized = [...new Set(files.map((file) => file.replaceAll("\\", "/")))];
  const sourceFiles = normalized.filter((file) => file.startsWith("src/"));
  const reasons = [];
  let tier = 0;
  const require = (minimum, reason) => {
    tier = Math.max(tier, minimum);
    reasons.push(reason);
  };

  if (stage !== "none") require(2, `stage:${stage}`);
  if (scope === "responsibility") require(1, "completed-responsibility");
  for (const file of normalized) {
    if (BASELINE_PATHS.some((pattern) => pattern.test(file))) require(2, `baseline-invariant:${file}`);
    else if (HIGH_RISK_PATHS.some((pattern) => pattern.test(file))) require(1, `high-risk-path:${file}`);
  }
  if (runtimeDependenciesChanged) {
    require(2, "runtime-dependency-change:package.json");
  }
  if (sourceFiles.length >= 3) require(1, `source-file-count:${sourceFiles.length}`);
  if (changedLines > 80 && sourceFiles.length > 0) require(1, `source-line-count:${changedLines}`);
  if (sourceFiles.length > 0 && SEMANTIC_TOKENS.test(patch)) require(1, "semantic-token-change");
  if (reasons.length === 0) reasons.push(sourceFiles.length === 0 ? "non-production-change" : "bounded-low-risk-source-change");

  const m1MinusReasons = [];
  for (const file of sourceFiles) {
    if (M1_MINUS_HOT_PATHS.some((pattern) => pattern.test(file))) m1MinusReasons.push(`hot-path:${file}`);
  }
  if (sourceFiles.length >= 3) m1MinusReasons.push(`source-file-count:${sourceFiles.length}`);
  if (changedLines > 80 && sourceFiles.length > 0) m1MinusReasons.push(`source-line-count:${changedLines}`);
  if (scope === "responsibility") m1MinusReasons.push("completed-responsibility");

  return {
    tier: `T${tier}`,
    live_java_required: tier === 2,
    m1_minus_required: tier === 1 && m1MinusReasons.length > 0,
    m1_minus_reasons: m1MinusReasons,
    source_files: sourceFiles.length,
    changed_lines: changedLines,
    reasons,
    note: "This is a minimum gate. Observed regressions or an invalid frozen baseline always escalate; the tool never certifies semantic equivalence.",
  };
}
