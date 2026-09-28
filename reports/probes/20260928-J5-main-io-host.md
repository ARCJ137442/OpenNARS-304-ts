# J5 Main IO Host Probe

## Checkpoint

- Date: 2026-09-28 (Asia/Shanghai)
- Probe scope: `J5-main-io-host`
- Current immutable test commit: `a07b235` (J3 production batch); PC full M1 is running from this commit. No J5 production edit has been made.

## Direct dependency inventory

- Remaining direct jree runtime imports in the J5 owner surface are concentrated in `src/main/Nar.ts`, `src/main/NarNode.ts`, and `src/main/Shell.ts`. `ConfigReader.ts` already keeps Node file access explicit, while `TextOutputHandler.ts` still bridges Java streams and StringBuilder behavior.
- `Nar.ts` mixes platform-neutral reasoner state with file serialization, Java Object streams, Java Map declarations, logger/exception observation, and Node capability detection. The migration must keep core `Nar` behavior deterministic while moving irreversible file/network effects to explicit host adapters.
- `NarNode.ts` uses Java network and serialization compatibility objects, UDP receive/send lifecycle, and event forwarding. Preserve resource close/error chaining, packet boundaries, and event class identity.
- `Shell.ts` is a Node CLI host: stdin, stdout, config file reads, Java-like argument parsing, and process exit all belong at the host boundary. Its public behavior is covered by shell and CLI tests.
- `ConfigReader.ts` has an existing Node file adapter and diagnostics for unsupported/missing plugins. Preserve these diagnostics while avoiding new platform access in core code.

## Cohesive implementation direction

1. Split only the host protocol facts that are still spread across `Nar`/`NarNode`/`Shell`; keep reasoner and event semantics in the core.
2. Replace direct exception/string/collection bridge use with project-owned contracts where behavior is already covered; retain explicit Java stream/network adapters where canonical serialization requires them.
3. Verify Node CLI, shell, file persistence, NarNode resource cleanup, and browser-facing entrypoints together before changing the platform-neutral core.

## Validation plan

- Direct tests: `nar-file-boundary`, `nar-input-internal-string-boundary`, `nar-metadata-string-boundary`, `narnode-string-boundary`, `shell-*`, `config-platform-boundary`, `io-boundary-types`, and resource compatibility tests.
- J5 sentinels: `vision.nal`, `simpleOperationTest.nal`, `nal9.wonder1.nal`, and `nal9.believe1.nal`.
- Close only after TS-only M2, Node/real browser checks, audits, affected NALs, and one PC full M1 on an immutable J5 commit. J5, stage 023, stage 024, and release readiness remain incomplete.

## Supported claims

- J5 host boundary responsibilities and remaining direct imports are recorded.
- No J5 implementation or completion claim has been made.

## J5 adapter checkpoint (2026-09-28)

- Moved the four J5 entry modules (`Nar.ts`, `NarNode.ts`, `Shell.ts`, and
  `TextOutputHandler.ts`) from direct npm `jree` imports to the project-owned
  `jree-compat` host boundary. Java IO/network/serialization objects remain inside
  that explicit adapter because their stream and packet contracts are still required.
- Non-incremental typecheck and build passed. J5 host direct contracts are 29/29 passed;
  raw TAP is `reports/evidence/j5-direct-20260928.tap`, SHA-256
  `55B2E43CBA37BBB52A5B0FABEF508576C573F5AAEBF4AB3BCBAB23C884D0D639`.
- Frozen-baseline J5 sentinels passed 4/4 in the shared J4 evidence. The post-batch jree
  audit reports one direct import file, the compatibility adapter itself; platform audit
  exits 0. J5 still needs immutable close evidence and its PC M1 close gate.

## J5 local validation close checkpoint (2026-09-28)

- Validation planner direct contracts passed serially after a transient multi-file runner OOM:
  config platform 16/16, shell boundary 1/1, shell runtime 3/3, runtime compat 9/9, random
  compat 3/3, native interface 1/1.
- Full TS-only M2 is `494 passed / 0 failed / 2 skipped`; TAP SHA-256
  `9B357BD04A9693ABE43430216B38C94512A5AC9EE2D826BE87FDC5802615B857`.
- Planner sentinel evidence remains 4/4 against frozen baseline; SHA-256
  `7E9DB84FC40214242101131D0C7F053D8A0FC86CF3ED869E2E156325196B4394`.
- The J5 adapter batch is locally validated. J5 cluster close, stage 023/024, and release
  readiness remain unclaimed until their immutable full gates and browser/Node integration evidence.

## J5 PC M1 close evidence (2026-09-29)

- After a Windows memory crash interrupted the first run at 24/245, the same JSONL was resumed
  twice without repeating completed rows. Final TS-only frozen-baseline evidence on commit
  `a320464`: `reports/evidence/pc-goal-j5-full-m1-20260928.jsonl`, 245 rows, 244 functional/
  parity passes, 1 process_limit, 0 timeout, 0 exception, 0 stall, 0 not_run. SHA-256:
  `026387A3E863996A7DEB1FD1B281E93A1BCBB5004C202B5806AC95674464ED3C`.
- The only process-limited row is `stability/long_term_stability.nal`; its last bounded run
  used 7,200,050 ms and is a resource observation. No Java process was started during these
  retries; all rows use frozen baseline SHA `264A3998076869683B374F65584BAA4C0939BF3567E3FC3B76883789A4AEB954`.
- Extra #246 TS-only evidence passed: `reports/evidence/pc-goal-j5-extra-simple-20260929.jsonl`,
  86,372 ms, peak RSS 354,512,896 bytes, SHA-256
  `F37E0252FBEF1BBDCE240E0EC7B2FAC3236437FB9B1BDE8C40ECFE64830FD2C0`.
- J5 responsibility evidence is complete for local contracts, M2, sentinels, audits, 245+1
  TS-only M1, and the interrupted-run recovery. Stage 023/024 and browser integration gates
  remain incomplete.
