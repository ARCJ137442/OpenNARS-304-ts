#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const COMMENT_PREFIX = '//! Java source: ';
const MANUAL_SKIP = new Map([
  ['src/types.ts', 'TypeScript-only numeric helpers'],
  ['src/entity/TruthValueTerm.ts', 'Word-term utilities without a direct Java class'],
]);

function toPosix(p) {
  return p.split(path.sep).join('/');
}

async function collectTsFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await collectTsFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.ts')) {
      files.push(fullPath);
    }
  }
  return files;
}

function buildCommentPath(javaPath) {
  const normalized = javaPath.replace(/\\/g, '/');
  const marker = '/org/';
  const idx = normalized.indexOf(marker);
  if (idx === -1) {
    throw new Error(`Cannot locate "/org/" in java path: ${javaPath}`);
  }
  return normalized.slice(idx + marker.length);
}

async function annotateFile(filePath, expectedLine, { dryRun }) {
  let content = await fs.readFile(filePath, 'utf8');
  let hadBom = false;
  if (content.charCodeAt(0) === 0xfeff) {
    hadBom = true;
    content = content.slice(1);
  }
  const newline = content.includes('\r\n') ? '\r\n' : '\n';
  const endedWithNewline = content.endsWith('\r\n') || (!content.includes('\r\n') && content.endsWith('\n'));
  let lines = content.split(/\r?\n/);
  if (endedWithNewline && lines.length && lines[lines.length - 1] === '') {
    lines = lines.slice(0, -1);
  }
  if (lines.length === 0) {
    lines = [''];
  }
  let firstLine = lines[0];
  if (firstLine.startsWith('\ufeff')) {
    firstLine = firstLine.replace(/^\ufeff/, '');
    lines[0] = firstLine;
  }
  if (firstLine === expectedLine) {
    return { changed: false, action: 'clean' };
  }
  let action = 'inserted';
  if (firstLine.startsWith(COMMENT_PREFIX)) {
    lines[0] = expectedLine;
    action = 'replaced';
  } else {
    lines.unshift(expectedLine);
  }
  let newContent = lines.join(newline);
  if (endedWithNewline) {
    newContent += newline;
  }
  if (hadBom) {
    newContent = '\ufeff' + newContent;
  }
  if (!dryRun) {
    await fs.writeFile(filePath, newContent, 'utf8');
  }
  return { changed: true, action };
}

async function loadTsAnalysis(filePath) {
  const text = await fs.readFile(filePath, 'utf8');
  return JSON.parse(text);
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run') || args.includes('--check');
  const checkOnly = args.includes('--check');
  const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const tsAnalysisPath = path.join(repoRoot, 'ts-analysis.json');
  const javaPointerPath = path.join(repoRoot, 'java-master');
  const pointerRaw = (await fs.readFile(javaPointerPath, 'utf8')).trim();
  const javaRoot = path.resolve(repoRoot, pointerRaw);
  await fs.access(javaRoot);
  const analysis = await loadTsAnalysis(tsAnalysisPath);
  const mapping = new Map();
  for (const entry of analysis) {
    const tsRelative = toPosix(path.join('src', entry.ts_path));
    const commentPath = buildCommentPath(entry.java_path);
    mapping.set(tsRelative, { commentPath, javaPath: entry.java_path });
  }
  const tsFiles = await collectTsFiles(path.join(repoRoot, 'src'));
  tsFiles.sort();

  const summary = {
    total: tsFiles.length,
    inserted: [],
    replaced: [],
    clean: [],
    skipped: [],
    missingMapping: [],
  };

  for (const absolutePath of tsFiles) {
    const relativePath = toPosix(path.relative(repoRoot, absolutePath));
    if (MANUAL_SKIP.has(relativePath)) {
      summary.skipped.push({ file: relativePath, reason: MANUAL_SKIP.get(relativePath) });
      continue;
    }
    const mappingEntry = mapping.get(relativePath);
    if (!mappingEntry) {
      summary.missingMapping.push(relativePath);
      continue;
    }
    const expectedLine = `${COMMENT_PREFIX}${mappingEntry.commentPath}`;
    const result = await annotateFile(absolutePath, expectedLine, { dryRun });
    if (!result.changed) {
      summary.clean.push(relativePath);
    } else if (result.action === 'replaced') {
      summary.replaced.push(relativePath);
    } else {
      summary.inserted.push(relativePath);
    }
  }

  console.log(`[annotate] total=${summary.total} updated=${summary.inserted.length + summary.replaced.length} clean=${summary.clean.length} manualSkips=${summary.skipped.length}`);
  if (summary.skipped.length) {
    for (const item of summary.skipped) {
      console.log(`  [skip] ${item.file} -> ${item.reason}`);
    }
  }
  if (summary.missingMapping.length) {
    console.warn('[annotate] missing mappings for:');
    for (const file of summary.missingMapping) {
      console.warn(`  - ${file}`);
    }
  }
  if (summary.inserted.length) {
    console.log('[annotate] inserted headers:');
    for (const file of summary.inserted) {
      console.log(`  + ${file}`);
    }
  }
  if (summary.replaced.length) {
    console.log('[annotate] replaced headers:');
    for (const file of summary.replaced) {
      console.log(`  * ${file}`);
    }
  }
  if (checkOnly && (summary.inserted.length || summary.replaced.length)) {
    process.exitCode = 1;
  }
  if (summary.missingMapping.length) {
    process.exitCode = 2;
  }
}

main().catch((err) => {
  console.error('[annotate] failed:', err);
  process.exit(1);
});
