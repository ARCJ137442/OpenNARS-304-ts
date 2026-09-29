# Operator runbook

## Daily checks

```bash
npm ci
npm run typecheck
npm test
npm run test:build
npm run test:api:dist
npm run test:release
```

Run Java-backed M2, audits, and the stage plan only for a stage or release review.

## M1-prime

The 023/024 stage uses 244 ordinary NAL resources, a 65536-cycle reduced fixture for #245, and #246 `simpleOperationTest.nal`. The original 2,000,000-cycle workload remains a documented system bottleneck, not a routine gate. Keep `passed`, `process_limit`, `timeout`, `exception`, `stall`, and `not_run` separate.

## Demo and release bundle

In the web-demo checkout run `npm run build:worker`, `npm run check`, and `npm test`. Check `public/build-meta.json` and verify the Worker in a real browser.

For a downloadable npm artifact run:

```bash
npm run release:bundle
```

The ignored `release/` directory contains the tarball and a SHA-256 manifest. It is generated from the current commit and is not part of the Git history.
