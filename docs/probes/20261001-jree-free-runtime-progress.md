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
- Core serial TS-only M2: `496 pass / 0 fail / 2 skipped`; final TAP SHA-256 is `8A4ADA50F51EFC569B4722C012BF1FD00383FD99A9419BB8D6B18023C01E9116` for the first final run. A second final TAP was started after the last display-contract fixes; its summary must be checked before closure.
- Direct maintained-source audit: `0` npm jree import files and `0` occurrences; package dependency version is `null`.
- Platform audit: `0` jree import files and `0` occurrences.
- Demo `npm run check`: typecheck, Astro diagnostics, 28 tests, build and build-tree checks passed; browser smoke passed after restarting the stale Vite server.

## Remaining closure gates

- Re-run and hash the final core M2 after the last native exception/string fixes.
- Run canonical Java M2, affected NAL parity, M1-prime and strict markerless digests on one immutable commit.
- Replace the current placeholder UDP behavior with an explicit Node network capability and direct contract tests.
- Decide whether maintained comments/audit labels should be renamed for a literal-text clean repository; historical evidence remains exempt.
- Only then update the 025 checklist and strict 023 completion status.
