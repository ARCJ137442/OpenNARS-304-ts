const HIGH_RISK_PATHS = [
  /^src\/(?:control|inference|storage|language|entity|operator|plugin|main|runtime|platform|io)\//,
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
export function isProductionSourceFile(file) {
  const normalized = file.replaceAll("\\", "/");
  if (!normalized.startsWith("src/")) return false;
  const segments = normalized.split("/");
  const basename = segments.at(-1) ?? "";
  if (segments.slice(1, -1).some((segment) => ["test", "tests", "__tests__"].includes(segment))) return false;
  if (/\.(?:test|spec)\./.test(basename)) return false;
  return /\.(?:ts|tsx|mts|cts)$/.test(basename);
}

export function countProductionSourceLines(numstat) {
  return numstat.split(/\r?\n/).filter(Boolean).reduce((total, line) => {
    const [added, deleted, file] = line.split("\t", 3);
    return total + (file && isProductionSourceFile(file) ? (Number(added) || 0) + (Number(deleted) || 0) : 0);
  }, 0);
}

export function runtimeDependencyFingerprint(manifest) {
  return JSON.stringify(Object.fromEntries(
    ["dependencies", "optionalDependencies", "peerDependencies"].map((section) => [
      section,
      Object.fromEntries(Object.entries(manifest[section] ?? {}).sort(([left], [right]) => left.localeCompare(right))),
    ]),
  ));
}

export function classifyChangeGate({ files = [], sourceChangedLines = 0, patch = "", stage = "none", clusterId = null, closeCluster = false, runtimeDependenciesChanged = false } = {}) {
  if (!STAGES.has(stage)) throw new Error(`unknown stage: ${stage}`);
  if (clusterId !== null && (typeof clusterId !== "string" || clusterId.trim() === "")) {
    throw new Error("clusterId must be a non-empty string or null");
  }
  if (closeCluster && clusterId === null) throw new Error("closeCluster requires clusterId");
  if (closeCluster && stage !== "none") throw new Error("cluster close and stage acceptance are separate gates");
  const normalized = [...new Set(files.map((file) => file.replaceAll("\\", "/")))];
  const sourceFiles = normalized.filter(isProductionSourceFile);
  const reasons = [];
  let tier = 0;
  const require = (minimum, reason) => {
    tier = Math.max(tier, minimum);
    reasons.push(reason);
  };

  if (stage !== "none") require(2, `stage:${stage}`);
  if (closeCluster) require(1, `cluster-close:${clusterId}`);
  for (const file of normalized) {
    if (BASELINE_PATHS.some((pattern) => pattern.test(file))) require(2, `baseline-invariant:${file}`);
    else if (HIGH_RISK_PATHS.some((pattern) => pattern.test(file))) require(1, `high-risk-path:${file}`);
  }
  if (runtimeDependenciesChanged) {
    require(2, "runtime-dependency-change:package.json");
  }
  if (sourceFiles.length >= 3) require(1, `source-file-count:${sourceFiles.length}`);
  if (sourceChangedLines > 80 && sourceFiles.length > 0) require(1, `source-line-count:${sourceChangedLines}`);
  if (sourceFiles.length > 0 && SEMANTIC_TOKENS.test(patch)) require(1, "semantic-token-change");
  if (reasons.length === 0) reasons.push(sourceFiles.length === 0 ? "non-production-change" : "bounded-low-risk-source-change");

  const m1MinusReasons = closeCluster ? [`cluster-close:${clusterId}`] : [];

  return {
    tier: `T${tier}`,
    live_java_required: tier === 2,
    m1_minus_required: tier === 1 && m1MinusReasons.length > 0,
    full_m1_required: tier === 2,
    affected_nal_required: tier === 1 && !closeCluster,
    validation_profile: tier === 2 ? "stage" : closeCluster ? "cluster-close" : tier === 1 ? "risk-slice" : "slice",
    cluster_id: clusterId,
    cluster_close: closeCluster,
    m1_minus_reasons: m1MinusReasons,
    source_files: sourceFiles.length,
    source_changed_lines: sourceChangedLines,
    reasons,
    note: "T1 slices use affected NALs; only an enumerated cluster close runs M1-. Observed regressions or an invalid frozen baseline always escalate, and the tool never certifies semantic equivalence.",
  };
}
