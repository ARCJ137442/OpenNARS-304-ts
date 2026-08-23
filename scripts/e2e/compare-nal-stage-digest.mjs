import { readFileSync } from "node:fs";

export function parseStageDigest(text) {
  const lines = text.trim().split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line));
  const summary = lines.findLast((row) => row.kind === "summary") ?? {
    kind: "summary",
    incomplete: true,
    records: [],
  };
  const streamedRecords = lines.filter((row) => row.kind === "pre" || row.kind === "window");
  const parsed = lines.length === 1 ? summary : {
    ...summary,
    records: streamedRecords.length > 0 ? streamedRecords : (summary.records ?? []),
  };
  if (parsed.kind !== "summary" || !Array.isArray(parsed.records)) {
    throw new Error("stage digest must contain a summary with records");
  }
  return parsed;
}

export function compareStageDigestPrefix(javaDigest, tsDigest) {
  const left = typeof javaDigest === "string" ? parseStageDigest(javaDigest) : javaDigest;
  const right = typeof tsDigest === "string" ? parseStageDigest(tsDigest) : tsDigest;
  const leftWindows = left.records.filter((record) => record.kind === "window");
  const rightWindows = right.records.filter((record) => record.kind === "window");
  const common = Math.min(leftWindows.length, rightWindows.length);
  const leftPrefix = {
    ...left,
    records: [...left.records.filter((record) => record.kind === "pre"), ...leftWindows.slice(0, common)],
  };
  const rightPrefix = {
    ...right,
    records: [...right.records.filter((record) => record.kind === "pre"), ...rightWindows.slice(0, common)],
  };
  const comparison = compareStageDigests(leftPrefix, rightPrefix);
  return {
    ...comparison,
    prefix_equal: comparison.equal,
    observed_windows: rightWindows.length,
    expected_windows: leftWindows.length,
    complete: right.incomplete !== true && rightWindows.length === leftWindows.length,
  };
}

export function compareStageDigests(javaDigest, tsDigest) {
  const left = typeof javaDigest === "string" ? parseStageDigest(javaDigest) : javaDigest;
  const right = typeof tsDigest === "string" ? parseStageDigest(tsDigest) : tsDigest;
  const leftPres = left.records.filter((record) => record.kind === "pre");
  const rightPres = right.records.filter((record) => record.kind === "pre");
  if (leftPres.length !== rightPres.length) {
    return { equal: false, first_difference: { reason: "pre_count", java: leftPres.length, ts: rightPres.length } };
  }
  for (let index = 0; index < leftPres.length; index += 1) {
    const preDifference = compareStageRecord(leftPres[index], rightPres[index], -1);
    if (preDifference !== null) return { equal: false, first_difference: { pre_index: index, ...preDifference } };
  }
  const leftRecords = left.records.filter((record) => record.kind === "window");
  const rightRecords = right.records.filter((record) => record.kind === "window");
  const windowCount = Math.max(leftRecords.length, rightRecords.length);
  for (let index = 0; index < windowCount; index += 1) {
    const javaWindow = leftRecords[index];
    const tsWindow = rightRecords[index];
    if (javaWindow === undefined || tsWindow === undefined) {
      return { equal: false, first_difference: { window_index: index, reason: "window_count" } };
    }
    for (const field of ["start_cycle", "end_cycle", "cycle_count", "total_events"]) {
      if (javaWindow[field] !== tsWindow[field]) {
        return { equal: false, first_difference: { window_index: index, reason: "window", field, java: javaWindow[field], ts: tsWindow[field] } };
      }
    }
    const difference = compareStageRecord(javaWindow, tsWindow, index);
    if (difference !== null) return { equal: false, first_difference: difference };
  }
  return { equal: true, first_difference: null };
}

function compareStageRecord(javaRecord, tsRecord, windowIndex) {
  if (javaRecord.total_events !== tsRecord.total_events) {
    return { window_index: windowIndex, reason: "total_events", java: javaRecord.total_events, ts: tsRecord.total_events };
  }
  for (const stage of Object.keys(javaRecord.stages)) {
    const javaStage = javaRecord.stages[stage];
    const tsStage = tsRecord.stages[stage];
    if (tsStage === undefined) return { window_index: windowIndex, reason: "stage_missing", stage };
    for (const field of ["event_count", "cycles_with_events", "first_event", "last_event", "digest"]) {
      if (javaStage[field] !== tsStage[field]) {
        return {
          window_index: windowIndex,
          ...(windowIndex >= 0 ? {
            start_cycle: javaRecord.start_cycle,
            end_cycle: javaRecord.end_cycle,
          } : {}),
          stage,
          field,
          java: javaStage[field],
          ts: tsStage[field],
        };
      }
    }
  }
  return null;
}

export function compareStageDigestFiles(javaPath, tsPath) {
  return compareStageDigests(readFileSync(javaPath, "utf8"), readFileSync(tsPath, "utf8"));
}

if (process.argv[1]?.endsWith("compare-nal-stage-digest.mjs")) {
  const [javaPath, tsPath] = process.argv.slice(2);
  if (!javaPath || !tsPath) throw new Error("usage: compare-nal-stage-digest.mjs <java-json> <ts-json>");
  process.stdout.write(`${JSON.stringify(compareStageDigestFiles(javaPath, tsPath))}\n`);
}
