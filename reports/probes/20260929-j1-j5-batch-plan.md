# J1-J5 runtime bridge batch plan (2026-09-29)

## Current checkpoint

- HEAD: `0dcb7cc` (committed batch).
- The incomplete `jree-compat` facade experiment was restored to a typecheck-clean baseline.
- Historical untracked evidence remains untouched.
- The abandoned `jree-runtime-patches.ts` experiment was removed; the existing bridge remains the sole owner of legacy prototype patching.

## Batch boundary

1. J1/J2/J3/J4: move pure Java-shaped text, long, collection, value and logger contracts into project-owned runtime modules.
2. J5: retain `java`, Java I/O, process exit, network and parity-only patching in the Node host adapter.
3. Keep `jree-compat.ts` as a migration re-export until all callers are migrated; no stage is complete from import-count reduction alone.

## Implemented in this batch

- `java-text.ts` now owns project boxed text, UTF-16 helpers, list input detection and native conversion.
- `java-values.ts` now owns single-value long arithmetic in addition to pair arithmetic.
- `native-host-boundary.ts` owns logger and boxed numeric compatibility without npm imports.
- 50+ language, entity, storage, inference, operator, plugin and interface files now import those contracts directly.
- Node process termination moved to `platform/node/process-boundary.ts`; Java I/O remains explicit in the main/IO host-facing files.
- The Memory event boundary still converts reasons to jree boxed strings because existing Java-facing event consumers require `instanceof java.lang.String`.

## Verification checkpoint

- `npm run typecheck`: passed.
- `npm run build`: passed (`146` source files).
- `npm run test:api:dist`: passed (`cycles=2`, `cycleEnds=2`, `outputSignals=1`, `stopped=true`).
- Direct host/runtime slice: `24/24` passed.
- Full TS-only M2: `494 passed / 0 failed / 2 skipped` out of `496`; TAP SHA-256 `7DAFF51E696931E0CF6BC8875B49FD371D39010805E35CBE6CA4610A4252C1A7`.
- Current static audit before commit: one production npm jree import file (`jree-host-adapter.ts`), one occurrence; remaining hits are Java class identity, host I/O and adapter contracts.

## M1' fallback checkpoint on `4b817bf`

- M1-- protection matrix: `243/243` passed; all failure classes are zero.
- Ordinary #244 `nars_multistep_3.nal`: parity passed, TS `1021011 ms`, peak RSS `732987392`, observed cycles `502562`.
- #245 `long_term_stability.nal` at 65536 requested cycles: Java passed, TS process limit at `1800044 ms`, last progress `217676`, marker missing. The gate therefore falls back to M1-- and records the sustained long-cycle system bottleneck; the original 2M workload remains unrun.
- #246 `simpleOperationTest.nal`: parity passed, TS `61265 ms`, peak RSS `344444928`.
- Summary: `reports/evidence/m1-prime-summary-4b817bf-20260929.json`.

## Exit checks

- typecheck and build remain clean after each mechanical import batch.
- direct contract tests cover native boxed text, long arithmetic and logger/value behavior.
- `audit:jree` and `audit:platform` are rerun before commit.
- Existing equivalent NAL evidence is reused; no duplicate NAL is started for unchanged contracts.
- 023/024 remain `in-progress` until their stage gates pass on one immutable commit.

## Next implementation batch

- Replace pure helper imports across language/entity/storage/inference/operator/plugin files.
- Move remaining host-only imports in `Nar`, `NarNode`, `Shell`, `TextOutputHandler` behind explicit Node adapter contracts.
- Then remove the experimental runtime patch import cycle and validate Node/browser entrypoints.
