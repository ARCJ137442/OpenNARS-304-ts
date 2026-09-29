# Release checklist

## Repository and attribution

- [ ] Confirm the intended GitHub visibility and default branch.
- [ ] Review history, reports, specs, Java baseline paths, and generated artifacts for public disclosure.
- [ ] Keep `LICENSE` and `NOTICE`; the project is a TypeScript rewrite/adaptation of OpenNARS 3.0.4.

## npm artifact

```bash
npm ci
npm run test:release
npm run release:bundle
```

Inspect `release/release-manifest.json`, the tarball contents, the source commit, and the SHA-256 value. The package must not contain reports, crash logs, `.codegraph`, or local absolute paths.

## Browser demo

- [ ] Run the web-demo build, check, and tests.
- [ ] Confirm `build-meta.json.sourceCommit` matches the intended core commit.
- [ ] Verify Worker online status, Narsese input, OUT output, and `:version` in a real browser.

## Agent disclosure

The 2026-09-30 release-preparation changes were implemented by GPT-6 Sol High under the repository's AGENTS.md, LeanSpec, and ARC137 development standards. Test results are machine evidence; human release approval remains a separate decision.
