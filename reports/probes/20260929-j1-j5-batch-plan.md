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
- `Nar`, `NarNode`, `Shell`, and `TextOutputHandler` now import Java/I/O compatibility directly from the Node host adapter; their exception predicates observe both project and jree hierarchies.
- Two legacy bridge consumers remain: `Memory` converts event reasons to jree boxed strings, and `Stamp` returns a jree String for the translated Java-facing API. These are explicit host compatibility boundaries for the next adapter batch.

## Verification checkpoint

- `npm run typecheck`: passed.
- `npm run build`: passed (`146` source files).
- `npm run test:api:dist`: passed (`cycles=2`, `cycleEnds=2`, `outputSignals=1`, `stopped=true`).
- Direct host/runtime slice: `24/24` passed.
- Full TS-only M2: `494 passed / 0 failed / 2 skipped` out of `496`; TAP SHA-256 `7DAFF51E696931E0CF6BC8875B49FD371D39010805E35CBE6CA4610A4252C1A7`.
- Current static audit before commit: one production npm jree import file (`jree-host-adapter.ts`), one occurrence; remaining hits are Java class identity, host I/O and adapter contracts.

## J5 host import closure checkpoint

- `npm run typecheck`: passed.
- Direct host/event slice: `25/25` passed.
- Production `runtime/jree-compat.ts` imports reduced to `Memory.ts` and `Stamp.ts`; direct npm jree remains one Node adapter file.
- Browser work remains open because the worker still imports the legacy bridge and its current build asserts the jree package as a dependency.

## Browser facade checkpoint

- Added a project-owned browser `jree-host-adapter` and browser `jree-compat` facade with no npm import.
- web-demo worker build now resolves both host adapter and legacy bridge imports to the browser facade and no longer requires a jree package assertion.
- Worker bundle static scan found zero `jree` or `node_modules` tokens; bundle SHA-256 `A6649EE4DDE497E45ED7AD12C0A848B3335F2D6EFBA69D084341261961D7C4F1`.
- Real Chrome smoke at `http://127.0.0.1:4178/` showed `WORKER ONLINE`; submitting `<bird --> animal>.` produced `OUT: <bird --> animal>. %1.00;0.90%`. Screenshot SHA-256 `43E7DF0AB4283D8E160F193D8668E81B97C4FA270019C28F13752A060A527BBE`.
- web-demo check and 5 unit tests passed. This is a P5/browser adapter slice; 024 stage gate remains open until the full immutable-commit gate is rerun.

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

## Final current-head validation checkpoint (`16751ea`)

- TS-only M2: `494 passed / 0 failed / 2 skipped` out of `496`; TAP SHA-256 `123750AFE664D649ECB571F045039F6E4DAC8A657E83C64B3CEB9124044047E9`.
- Non-incremental typecheck, build (`148` source files), and dist API passed.
- J5/browser audits are saved as `reports/evidence/j5-browser-facade-audit-jree-20260929.json` and `reports/evidence/j5-browser-facade-audit-platform-20260929.json`.
- The last M1' experiment remains authoritative: M1-- `243/243` passed, #244 and #246 passed, #245 65536 process-limited; no original 2M long-cycle claim.
- The next stage-gate run must use the immutable current head if 023/024 completion is attempted; no LeanSpec status was changed in this batch.

## Bridge closure checkpoint (`cb8330b`)

- Production `runtime/jree-compat.ts` import count is now zero; only `src/platform/node/jree-host-adapter.ts` imports npm `jree`.
- Node host adapter explicitly owns JavaRandom prototype installation, boxed String conversion, and project/jree exception observation.
- Full TS-only M2: `494/496`, zero failures; TAP SHA-256 `D76F6BC4CC73AD0B7DF598CC024E2B613BFF9AB835F95E8079D61339FFC1B0EB`.
- Latest audits: jree `0340276FCA524153B6967C9399D8EB6D1F0B1A195ED6070A3FCC5A380B7D683B`, platform `4A762C50D94F0F75357B389857D84023D543AD35AE1DA86968D566B905E40C79`.
- This closes the implementation-side bridge migration slice. It does not certify stage 023/024, because the stage gate still requires the full immutable-commit Java/M1/markerless/browser integration set.

## Current-head M1 safety checkpoint (`dcb78a9`)

-含 Java M2 在当前 HEAD 已通过 `496/496`。
- PC full M1 已完成并写入前 `244` 个主资源；系统实时内存达到 `33.06/39.16 GiB`（84%），超过 75% 硬停止线后人工终止 runner。
- #245 `long_term_stability.nal` 未产生结果行，分类为 `not_run`；不得把这次运行称为完整 M1 通过。
- 安全停止 JSON 与 checkpoint 路径、SHA-256 已写入 `docs/current-status.md`；当前不启动任何恢复副本，待系统内存回落后再做可证伪续跑。
