# Fix release checklist

`v1.0.4` is the current downloadable release. The next fix release has **not** been created; spec 042 remains in progress. Core production commit `083d7b8` passed M1′, full M2, and strict markerless checks. That does not establish Demo performance convergence or release readiness. Reassess the gates after every new core production change.

## Freeze source and semantics

- [ ] Freeze final core and Demo commits with clean tracked worktrees. Preserve historical untracked evidence; never stage with `git add -A`.
- [ ] On the final core commit, run direct contracts, nonincremental typecheck, build, dist API, and complete TS-only and Java M2; report passed, failed, and skipped separately.
- [ ] Complete the 243-file M1′ body plus #25 and #246. Estimate #245 from 2048 cycles before the 65536-cycle fixture and classify timeouts, process limits, exceptions, stalls, and not-run cases separately.
- [ ] Compare both 131072-cycle strict markerless digests window by window with their correct frozen Java baselines. Disclose the original two-million-cycle workload as `not_run` if it remains unexecuted.
- [ ] Confirm zero direct npm `jree` imports and zero core or mixed platform-boundary findings; inspect shipped source, dist, declarations, and runtime dependencies for leaked host types.

## Performance and Demo

- [ ] Complete and verify specs 045–049 before release: actual reasoner experience, three-topology Grid Microworld, NARS × 2048 with memory retained across games, Pong play modes and multiple reasoners, and the full multiplayer Shot rules. The 044 entry/terminal foundation passed; pending items must not appear as empty public demos.
- [ ] Configure each Demo for a target of at least 20 world ticks per second and report measured-versus-target rates separately. Raising the target is not a performance improvement.

- [ ] Compare RPS, world TPS, FPS, p95 latency, concept growth, and memory with the same browser, seed, input, cycles, mode, and duration. Async world TPS never substitutes for reasoner throughput.
- [ ] Prominently disclose that the Microworld scenario with NARS actions has not sustained 20 TPS: its 30-second average was `15.875 TPS` and its last window `11.776 TPS`. The user stopped this optimization round after repeated low-yield candidates; this is neither a convergence proof nor attainment of the target. Blank exploration speed cannot stand in for the active scenario.
- [ ] Verify default rate and **effective** NARS actions in real browsers. Check BandRobot delivery and late-window rates for TicTacToe, TestChamber, FighterPlane, and Echo Relay.
- [ ] Pass the Demo `npm run check`, Worker build, artifact check, and real Chrome smoke. The index must start no NARS Worker; console, page, and Worker faults must be zero. `build-meta.json.sourceCommit` must match the final core commit.

## Package, site, and attribution

```bash
npm ci
npm run test:release
npm pack --dry-run
npm run release:bundle
```

- [ ] Inspect the tarball, release manifest, and SHA-256. Ship only dist, needed source/configuration, CLI, bilingual public documentation, `LICENSE`, and `NOTICE`; exclude reports, crash logs, `.codegraph`, secrets, and local machine paths.
- [ ] Keep English and Chinese README, getting-started, integration, architecture, operator, and Demo guidance reproducible from a clean clone. Attribute the OpenNARS 3.0.4 rewrite, original Demo code/assets, their licenses, and the actual Agent/model contributions.
- [ ] Sync the Pages `opennars-304-ts-lab/` directory, review its diff, commit and push it, then verify the public index, Worker, representative Demos, and displayed version.
- [ ] Push core and Demo changes in scoped commits. Create a GitHub fix release containing **only this version's tarball and manifest**. Do not publish to npm.
- [x] On 2026-10-03, remove the five misplaced historical `.tgz` assets from v1.0.4 after checking their remote and retained local SHA-256 digests. That release now contains only its 1.0.4 package and manifest; before/after records are referenced in the current-status document.
- [ ] Before making a private repository public, have its owner review Git history, Issues, Actions logs, Pages assets, licenses, third-party media, secrets, and contact channels. Visibility does not change automatically with this checklist.
