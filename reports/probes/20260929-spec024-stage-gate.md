# Spec024 Stage Gate Plan

## Current anchor

- Main repository immutable commit: `5d8cae9` after the含 Java M2 loader fix.
- Browser demo adapter commit: `180924f`; the demo build uses explicit `src/browser-adapters/*` modules.
- The final live-Java stage M1 has finished from the immutable stage source state. It contains 245 rows: 244 functional/parity passes and one explicitly classified `process_limit` observation for `stability/long_term_stability.nal`; there are zero timeout, exception, stall, or not-run rows. The extra 246th `simpleOperationTest.nal` row passed separately.
- Evidence hashes: `stage-final-live-m1-20260929.jsonl` = `5022F55E22C90CD2983F74876B88EF9D05025C2C27F6281E4C24DE5414A0EA3`; `stage-final-live-extra-246-20260929.jsonl` = `FD24B3B3CF03CB13E7EE28C18E84202EDCB5162E8226B558791941A5D1A7140A`; `stage-java-m2-20260929.tap` is present and is the fixed-loader run.
- Frozen baseline: `g0-java-baseline-26772af-20260917.jsonl`, SHA-256
  `264A3998076869683B374F65584BAA4C0939BF3567E3FC3B76883789A4AEB954`.

## M1' policy

- User decision: for #245, replace the 2,000,000 embedded-cycle run with a 65,536-cycle version when a bounded short run extrapolates above 30 minutes. Keep the result explicitly labelled as reduced-cycle #245 evidence; do not claim the original 2,000,000-cycle workload completed.
- The 65,536 fixture at `reports/probes/long_term_stability-65536.nal` passed live Java/TS parity: Java `4231 ms`; TS `495117 ms`, peak RSS `464674816`; `67510` actual reasoning cycles; marker, functional and parity passed; no timeout/process limit/exception/stall. Projection from the requested 65,536 steps to 2,000,000 cycles is about `251.83` minutes, above the 30-minute threshold.
- M1' is defined as the 244 ordinary main resources plus this reduced-cycle #245 parity row and the required 246th `simpleOperationTest.nal`. The 14ed360 run produced 244 passing rows before restart; its missing original #245 row is not treated as pass. Revalidate the assembled M1' evidence and #246 on the candidate before stage acceptance.

## What is already true

- P0-P2 and the existing P3 plugin capability work are recorded in spec024.
- P5 browser host adapter slice is implemented and committed in the demo repository: inline `virtualModules`, `nodeShimPlugin`, and `processShim` were replaced by explicit browser adapter modules; default configuration is injected as host data.
- Demo worker build, demo check, five demo unit tests, and real browser Worker verification passed. Browser verification showed `WORKER ONLINE` and an `OUT` result for `<bird --> animal>.`.
- J5 host adapter code is committed in main; its direct contracts, TS-only M2, sentinel NALs, audits, and recovered TS-only 245+1 M1 are recorded in the J5 probe.
- J2 and J3 implementation batches are committed with direct contracts, M2, affected NAL evidence, and bounded M1 records. J3 long samples have frozen-baseline retries; live-Java page-file and transient Windows process failures are separately classified.

## Remaining stage work

1. Preserve the completed live-Java 245+1 M1 classification and hashes above; do not rerun Java unless a later source or runner contract changes.
2. Completed two strict markerless stage-digest validations on `5d8cae9`, one process per engine, `131072` cycles and `1024`-cycle windows. `simpleOperationTest.nal`: Java `5950.9327 ms` / RSS `8577024`, TS `517027.5831 ms` / RSS `609243136`, `equal=true`. `long_term_stability.nal`: first Java attempt hit a Windows JVM `0xc0000005` at about cycle 108544 and is preserved; one retry completed in `10417.6344 ms` / RSS `8585216`, TS completed in `1404033.7363 ms` / RSS `786362368`, both reached `131072` cycles, `128` windows, `2279730` events, `incomplete=false`, comparison `equal=true`.
3. Completed the fixed complete Java M2 rerun: `496/496 passed`, `0 failed`, `0 skipped`, SHA-256 `960A840B2E1380808E5E46EAF8BDF70C99B95B00948008072A979E0E1550AD6F`. The earlier `shell-string-boundary.test.ts` exit `3221225477` (`0xc0000005`) is preserved and its isolated retry passed `2/2`, SHA-256 `9C69F4D33979B159F0935B093F3F5C438540AC4E0A411DAB4D382B945232B504`.
4. Verified Node CLI (`nal1.0.nal`, 2 cycles, marker pass), built API (`cycles=2`, `cycleEnds=2`, `outputSignals=1`, stopped), typecheck, build and dist API.
5. Rebuilt the browser Worker from demo commit `180924f` against main source `5d8cae9` with an explicitly documented dirty-docs override. Demo build/check and five demo unit tests passed. Metadata now binds `sourceCommit=5d8cae944de41fd2a0431cdc7bea64fc0ee2e7a8`; the generated bundle has zero `browser-shim`, `virtualModules`, `nodeShimPlugin`, `processShim`, or direct Node builtin matches. Real browser verification showed `WORKER ONLINE` and `OUT: <bird --> animal>.`.
6. Ran final audits and encoding checks. The jree audit still reports one direct-import production file (`src/runtime/jree-compat.ts`, two occurrences), `41` high-risk items, `23` semantic-review items and one candidate-native item. This is a genuine 023 blocker: the compatibility bridge is still reachable from core/browser paths and must be replaced or explicitly split before stage completion.
7. Only after all of the above pass on one immutable commit may LeanSpec stage 023 and stage 024 be updated to `complete`. Do not update 020 early.

## Current gaps that block completion

- Strict markerless stage evidence is complete and equal on the final immutable stage commit; the raw evidence and retry classification live under `reports/evidence/spec024-markerless-20260929/`.
- The generated browser Worker still contains the jree compatibility bridge by design; removing that bridge from the browser-reachable bundle requires an explicit follow-up only if the stage audit rejects the current adapter boundary.
- Spec024 P3/P4 remain unchecked in the repository README; P5 has a validated implementation slice and the integrated browser checks pass, but the spec cannot close while the 023 jree bridge remains in the shared core.
- This npm version consumes one `--` as npm configuration forwarding. `npm run validation:plan -- -- --base ...` reaches the script correctly; a single `--` strips option names. Direct `node scripts/checking/classify-change-gate.mjs ...` also returns `plan_valid=true` for stage 024. No production behavior depends on this CLI quirk.

## Next falsifiable experiments

- Can the remaining `jree-compat.ts` responsibilities be moved to project-owned runtime modules without changing the 496-test contract or browser worker output?
- After that bridge removal, do stage 023 and stage 024 still pass on one immutable commit without rerunning Java unless the runner contract changes?
