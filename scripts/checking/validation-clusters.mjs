import { isProductionSourceFile } from "./change-gate-policy.mjs";

const normalize = (file) => file.replaceAll("\\", "/");

const definitions = [
  {
    id: "J1-runtime-compat",
    title: "运行时兼容簇",
    include: [/^src\/runtime\//, /^src\/types\.ts$/, /^src\/util\//],
    exclude: [/^src\/runtime\/NodeStdinInputStream\.ts$/],
    directTests: [
      "test/node/runtime-compat.test.ts",
      "test/node/random-compat.test.ts",
      "test/node/native-interface-boundaries.test.ts",
    ],
    affectedNals: [
      "java-master/src/main/resources/nal/single_step/nal1.0.nal",
      "java-master/src/main/resources/nal/single_step/nal6.17.nal",
      "java-master/src/main/resources/nal/application/toothbrush.nal",
    ],
  },
  {
    id: "J2-language-parser",
    title: "语言与解析簇",
    include: [
      /^src\/language\//,
      /^src\/io\/(?:Narsese|Parser|Symbols|Texts)\.ts$/,
    ],
    exclude: [],
    directTests: [
      "test/node/language-runtime.test.ts",
      "test/node/narsese-boundary.test.ts",
      "test/node/narsese-temporal.test.ts",
    ],
    affectedNals: [
      "java-master/src/main/resources/nal/single_step/nal4.7.nal",
      "java-master/src/main/resources/nal/single_step/nal6.17.nal",
      "java-master/src/main/resources/nal/single_step/nal8.add.nal",
      "java-master/src/main/resources/nal/multi_step/nars_transitivity.nal",
    ],
  },
  {
    id: "J3-inference-core",
    title: "推理核心簇",
    include: [/^src\/(?:control|inference|entity|storage)\//],
    exclude: [],
    directTests: [
      "test/node/bag.test.ts",
      "test/node/tasklink-key.test.ts",
      "test/node/compositional-rules.test.ts",
    ],
    affectedNals: [
      "java-master/src/main/resources/nal/single_step/nal6.17.nal",
      "java-master/src/main/resources/nal/multi_step/nal4.recursion.nal",
      "java-master/src/main/resources/nal/multi_step/nars_transitivity.nal",
      "java-master/src/main/resources/nal/application/toothbrush2.nal",
    ],
  },
  {
    id: "J4-operator-plugin",
    title: "Operator 与 Plugin 簇",
    include: [/^src\/(?:operator|plugin)\//],
    exclude: [],
    directTests: [
      "test/node/operator-boundary.test.ts",
      "test/node/plugin-boundary.test.ts",
      "test/node/vision-channel.test.ts",
    ],
    affectedNals: [
      "java-master/src/main/resources/nal/single_step/nal9.believe1.nal",
      "java-master/src/main/resources/nal/single_step/nal9.wonder1.nal",
      "java-master/src/main/resources/nal/application/vision.nal",
      "java-master/src/test/simpleOperationTest.nal",
    ],
  },
  {
    id: "J5-main-io-host",
    title: "Main、IO 与宿主收口簇",
    include: [
      /^src\/(?:index|public-api\.d)\.ts$/,
      /^src\/interfaces\//,
      /^src\/main\//,
      /^src\/io\/(?:ConfigReader|ConfigParser|ConfigPluginRegistry|DefaultConfig)\.ts$/,
      /^src\/io\/events\//,
      /^src\/platform\//,
      /^src\/runtime\/NodeStdinInputStream\.ts$/,
    ],
    exclude: [],
    directTests: [
      "test/node/config-platform-boundary.test.ts",
      "test/node/shell-boundary.test.ts",
      "test/node/shell-runtime.test.ts",
    ],
    affectedNals: [
      "java-master/src/main/resources/nal/single_step/nal1.0.nal",
      "java-master/src/main/resources/nal/application/toothbrush.nal",
      "java-master/src/test/simpleOperationTest.nal",
    ],
  },
];

export const VALIDATION_CLUSTERS = Object.freeze(definitions.map((cluster) => Object.freeze({
  id: cluster.id,
  title: cluster.title,
  directTests: Object.freeze([...cluster.directTests]),
  affectedNals: Object.freeze([...cluster.affectedNals]),
})));

const definitionById = new Map(definitions.map((cluster) => [cluster.id, cluster]));

export function validationClustersForFile(file) {
  const normalized = normalize(file);
  return definitions.filter((cluster) => cluster.include.some((pattern) => pattern.test(normalized))
    && !cluster.exclude.some((pattern) => pattern.test(normalized))).map((cluster) => cluster.id);
}

export function getValidationCluster(id) {
  const cluster = definitionById.get(id);
  if (cluster === undefined) return null;
  return {
    id: cluster.id,
    title: cluster.title,
    directTests: [...cluster.directTests],
    affectedNals: [...cluster.affectedNals],
  };
}

function nalCommand(javaBaseline, resultFile, files) {
  return [
    "node", "scripts/e2e/run-nal-corpus.mjs",
    "--engine", "ts",
    "--java-baseline", javaBaseline,
    ...files.flatMap((file) => ["--file", file]),
    "--cycles", "1550",
    "--timeout-ms", "180000",
    "--process-limit-ms", "1800000",
    "--ts-mode", "cold",
    "--resource-metrics",
    "--chunk-size", "1",
    "--summary",
    "--result-file", resultFile,
  ];
}

export function buildValidationPlan({
  files = [],
  tier = "T0",
  requestedClusterId = null,
  closeCluster = false,
  javaBaseline = null,
  evidencePrefix = null,
  m1Profile = "full",
} = {}) {
  const sourceFiles = [...new Set(files.map(normalize).filter(isProductionSourceFile))];
  const assignments = sourceFiles.map((file) => ({ file, clusters: validationClustersForFile(file) }));
  const touchedClusters = [...new Set(assignments.flatMap((entry) => entry.clusters))];
  const unassignedSourceFiles = assignments.filter((entry) => entry.clusters.length === 0).map((entry) => entry.file);
  const multiplyAssignedSourceFiles = assignments.filter((entry) => entry.clusters.length > 1).map((entry) => entry.file);
  const errors = [];

  if (requestedClusterId !== null && !definitionById.has(requestedClusterId)) {
    errors.push(`unknown-cluster:${requestedClusterId}`);
  }
  if (tier === "T1" && unassignedSourceFiles.length > 0) {
    errors.push(`unassigned-production-files:${unassignedSourceFiles.join(",")}`);
  }
  if (multiplyAssignedSourceFiles.length > 0) {
    errors.push(`multiply-assigned-production-files:${multiplyAssignedSourceFiles.join(",")}`);
  }
  if (tier === "T1" && requestedClusterId === null && touchedClusters.length > 1) {
    errors.push(`cross-cluster-owner-required:${touchedClusters.join(",")}`);
  }
  if (tier === "T1" && touchedClusters.length > 2) {
    errors.push(`too-many-touched-clusters:${touchedClusters.join(",")}`);
  }
  if (requestedClusterId !== null) {
    if (sourceFiles.length > 0 && !touchedClusters.includes(requestedClusterId)) {
      errors.push(`requested-cluster-not-touched:${requestedClusterId}`);
    }
    const supportingSourceFiles = assignments.filter((entry) => entry.clusters.length === 1
      && !entry.clusters.includes(requestedClusterId)).map((entry) => entry.file);
    if (supportingSourceFiles.length > 2) {
      errors.push(`too-many-supporting-source-files:${supportingSourceFiles.join(",")}`);
    }
  }
  if (closeCluster && requestedClusterId === null) errors.push("cluster-close-requires-explicit-cluster");
  if (tier === "T1" && javaBaseline === null) errors.push("t1-requires-frozen-java-baseline");
  if (tier === "T1" && evidencePrefix === null) errors.push("t1-requires-evidence-prefix");

  const selectedClusterId = requestedClusterId ?? (touchedClusters.length === 1 ? touchedClusters[0] : null);
  const selectedCluster = selectedClusterId === null ? null : getValidationCluster(selectedClusterId);
  const supportingClusterIds = touchedClusters.filter((id) => id !== selectedClusterId);
  const supportingClusters = supportingClusterIds.map(getValidationCluster).filter((cluster) => cluster !== null);
  const validationClusters = [selectedCluster, ...supportingClusters].filter((cluster) => cluster !== null);
  const affectedNals = [];
  for (const cluster of validationClusters) {
    const firstUnique = cluster.affectedNals.find((file) => !affectedNals.includes(file));
    if (firstUnique !== undefined) affectedNals.push(firstUnique);
  }
  for (const cluster of validationClusters) {
    for (const file of cluster.affectedNals) {
      if (!affectedNals.includes(file) && affectedNals.length < 5) affectedNals.push(file);
    }
  }
  const directTests = [...new Set(validationClusters.flatMap((cluster) => cluster.directTests))];
  const commonCommands = sourceFiles.length === 0 ? [] : [
    ["npm", "test"],
    ["npm", "run", "typecheck"],
    ["npm", "run", "test:build"],
    ["npm", "run", "test:api:dist"],
    ["npm", "run", "scan:migration-patterns"],
    ["npm", "run", "audit:jree"],
    ["npm", "run", "audit:platform"],
  ];
  const affectedNalCommand = tier === "T1" && !closeCluster && selectedCluster !== null
    && javaBaseline !== null && evidencePrefix !== null
    ? nalCommand(javaBaseline, `${evidencePrefix}-sentinel.jsonl`, affectedNals)
    : null;
  const m1MinusCommand = tier === "T1" && closeCluster && selectedCluster !== null
    && javaBaseline !== null && evidencePrefix !== null
    ? [
      "node", "scripts/e2e/run-nal-corpus.mjs",
      "--engine", "ts",
      "--java-baseline", javaBaseline,
      "--all", "--m-minus",
      "--cycles", "1550",
      "--timeout-ms", "180000",
      "--process-limit-ms", "1800000",
      "--ts-mode", "cold",
      "--resource-metrics",
      "--chunk-size", "1",
      "--summary",
      "--result-file", `${evidencePrefix}-m1-minus.jsonl`,
    ]
    : null;

  return {
    plan_valid: errors.length === 0,
    validation_profile: tier === "T2" ? "stage" : closeCluster ? "cluster-close" : tier === "T1" ? "risk-slice" : "slice",
    selected_cluster: selectedCluster,
    supporting_clusters: supportingClusters,
    touched_clusters: touchedClusters,
    unassigned_source_files: unassignedSourceFiles,
    multiply_assigned_source_files: multiplyAssignedSourceFiles,
    plan_errors: errors,
    direct_test_hints: directTests,
    affected_nal_files: tier === "T1" && !closeCluster ? affectedNals : [],
    common_commands: commonCommands,
    affected_nal_command: affectedNalCommand,
    m1_minus_command: m1MinusCommand,
    live_java_required: tier === "T2",
    full_m1_required: tier === "T2" && m1Profile === "full",
    m1_prime_required: tier === "T2" && m1Profile === "prime",
    m1_profile: m1Profile,
    strict_markerless_required: tier === "T2",
  };
}
