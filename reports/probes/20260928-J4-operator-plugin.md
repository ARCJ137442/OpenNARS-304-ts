# J4 Operator and Plugin Probe

## Checkpoint

- Date: 2026-09-28 (Asia/Shanghai)
- Probe scope: `J4-operator-plugin`
- Current test work is J3 M2; no J4 production edit has been made.
- Current source scan finds no direct `from "jree"` imports under `src/operator/**` or `src/plugin/**`. J4 therefore starts as a semantic boundary cluster, not a direct-import removal batch.

## Remaining contracts

- `Operator.ts` and `Operation.ts`: Java text/name boundaries, feedback `List/null/empty` shape, exception identity, and execution result ordering.
- `operator/mental/**` and `plugin/mental/**`: random call order, plugin class identity, feedback task ownership, and null truth/error paths.
- `plugin/perception/SensoryChannel.ts` and `VisionChannel.ts`: ordered channel registration, native result arrays, host logger/input boundaries, and constructor argument order.
- `Anticipate`/feedback paths: iterator removal and value equality for predictions, plus event lifecycle registration/unregistration.

## Cohesive implementation direction

1. Confirm the existing project-owned `PluginName`, exception, string, collection, and host capability contracts against all J4 callers.
2. Run direct operator/plugin boundary tests and canonical sentinel NALs before changing code; use one combined batch for any remaining semantic mismatch.
3. Preserve operator feedback ownership and host control boundaries while removing any residual compatibility bridge use discovered by exact source scan.

## Validation plan

- Direct tests: operator/plugin boundary, system operator, sensory/vision channel, feedback and exception tests.
- Affected NALs: `nal9.believe1.nal`, `nal9.wonder1.nal`, `vision.nal`, and `simpleOperationTest.nal`.
- Close only after TS-only M2, affected NALs, audits, and one PC full M1 on an immutable J4 commit. J4, 023, 024, and release readiness are not complete.

## Supported claims

- J4 direct-import scan is currently clean; semantic responsibility and test boundary are recorded.
- No J4 implementation or completion claim has been made.
