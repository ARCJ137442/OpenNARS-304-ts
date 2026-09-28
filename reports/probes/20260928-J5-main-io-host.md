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
