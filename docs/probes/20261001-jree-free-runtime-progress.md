# Strict jree-free runtime progress

## Scope

Successor to spec 023. The strict boundary covers maintained source, Node and browser adapters, test fixtures, build and loader scripts, package metadata, dist, and release artifacts. Historical reports and frozen evidence remain archival and are not deleted.

## Implemented in the current working batch

- Added a project-owned native Java facade for boxed values, exceptions, class tokens, collections, and JavaRandom.
- Replaced the Node host adapter's npm runtime import and Random prototype patch with project-owned values and Node file/stream/serialization facades.
- Renamed maintained adapter and compatibility entry files to `native-*` names and migrated maintained test/e2e imports.
- Removed the published `jree-entry` rewrite, the loader resolver, and the package/lockfile dependency. A clean `npm ci --ignore-scripts` followed by `npm ls jree --all --parseable` produced no package path.
- Updated the demo worker build and Browser adapter paths to the native adapter names.

## Evidence

- Core typecheck, build, dist API and release package check passed.
- Core serial TS-only M2: `496 pass / 0 fail / 2 skipped`; final TAP `reports/evidence/m2-native-jree-free-final2-20260930.tap` SHA-256 is `DEBB5C20729910977D1C41525FD38A990C162816A6F44EE41F118C145E34E873`.
- Core serial Java M2: `498 pass / 0 fail / 0 skipped`; TAP `reports/evidence/m2-native-jree-free-java-20261001.tap` SHA-256 is `2F2C14C107810CFCA0096BC3651FFEC41ED142E71F1085E1D129945254A44D46`.
- Direct maintained-source audit: `0` npm jree import files and `0` occurrences; package dependency version is `null`.
- Platform audit: `0` jree import files and `0` occurrences.
- Demo `npm run check`: typecheck, Astro diagnostics, 28 tests, build and build-tree checks passed; browser smoke passed after restarting the stale Vite server.
- Demo native adapter path was pushed as `894a50f`; Pages deployment was pushed as `34e11c7`.

## Remaining closure gates

- Preserve the final core M2 hashes above on the immutable closure commit.
- Run affected NAL parity, M1-prime and strict markerless digests on one immutable commit. The current stage plan for 023 is T2 and also requests full M1; this remains open.
- Replace the current placeholder UDP behavior with an explicit Node network capability and direct contract tests.
- Decide whether maintained comments/audit labels should be renamed for a literal-text clean repository; historical evidence remains exempt.
- Only then update the 025 checklist and strict 023 completion status.
