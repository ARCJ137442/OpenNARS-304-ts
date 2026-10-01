# v1.0.2 Open-source readiness

## Recommendation

`v1.0.2` is suitable for public research and integration use. The Node package, CLI, ESM API, browser Worker and Demo Lab have reproducible release checks, and the current browser build no longer resolves the core `host-adapter` boundary to Node-only modules.

## Evidence

- GitHub Release/tag `v1.0.2` is tied to the final host-boundary fix commit.
- TS M2 `496 pass / 0 fail / 2 skipped`; Java M2 `498 pass / 0 fail / 0 skipped`.
- Current M1-prime: `243/243`, #25, #245 65536 fixture, #246, and both strict markerless digests.
- Demo: worker build, Astro check, 28 tests, static artifact check, and real browser smoke pass; Pages metadata is bound to the release commit.
- Root `LICENSE`, `NOTICE`, bilingual README, `CONTRIBUTING.md`, `SECURITY.md`, and attribution files are present.

## Disclosures

- The original 2,000,000-cycle stability workload remains a system bottleneck; the daily gate uses the approved 65536-cycle fixture.
- Demo TPS still falls below the desired 20 TPS target after concept growth and GC pressure; the project does not claim Java-equivalent performance.
- 023/025 strict host closure and 031 Java-shape cleanup remain active follow-up work. Java-compatible text, exceptions, class tokens, collections and host facades remain where behavior is observable.
- The repository contains historical evidence and older local-path references in archival docs. They are not included in the npm package, but maintainers should review repository history, Actions logs, Pages artifacts and issue data before changing visibility.

## Release decision

Publish as a transparent research/integration release. Keep the production-performance and strict host-boundary limitations visible in the README and release notes; raise the product guarantee only after 023/025/031 and the concept-growth performance line close.
