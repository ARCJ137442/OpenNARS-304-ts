# OpenNARS-304-ts Midterm Handoff

Date: 2026-10-02
Current HEAD: `445d873` (`perf: 优化复合词项具体类型判等`)
Working tree: code clean for the selected candidate; historical evidence remains untracked unless listed as this stage's evidence.

## Route

```text
OpenNARS 3.0.4 Java parity
          |
          v
  +-----------------------+
  | native runtime/core   |  023/024/025/036 implementation history
  | platform boundaries   |  direct jree audit 0/0
  +-----------------------+
          |
          v
  +-----------------------+
  | Java-shape cleanup    |  text -> constructors -> iterators
  | performance rounds    |  measure, reject regressions
  +-----------------------+
          |
          v
  +-----------------------+
  | M1' + M2 + demo       |  current M1' is in flight
  | release/tag/push      |  midterm save follows M1' classification
  +-----------------------+
```

## Confirmed

- `148149b`: textual template cleanup.
- `fd4735b`: private sentence/truth builders replaced with native fragments and `join`.
- `a033cfa`: internal concrete-class checks use constructors; event identity uses constructor keys, with no production `ClassToken` object or WeakMap cache.
- `01f08e6`: safe read-only iterator call sites use native iteration in `TaskLink` and `Bag`.
- `445d873`: `CompoundTerm.equals` rejects a different concrete constructor before text comparison; same-workload A/B was `2.594 -> 3.661 RPS`.
- TS-only M2 on the committed line: `506/508`, `0 failed`, `2 skipped`.
- Java M2 on the committed line: `508/508`.
- Current 50-tick CartPole probe at `01f08e6`: `3.720 RPS`, median step `2004 ms`, p95 `6759 ms`, peak RSS `333123584` bytes; concepts `1025 -> 3731`.
- Constructor-equality A/B probe (same 20 ticks, 5 cycles): baseline `2.594 RPS`, candidate `3.661 RPS`, candidate peak RSS `330358784` bytes; candidate is protected by M1' below.

## In Flight

```text
M1' result file:
reports/evidence/m1prime-compound-constructor-20261002.jsonl

Profile: TS-only, frozen Java baseline, M1-- 243 files,
         cold process, one file per chunk, 180 s no-progress watchdog,
         3600 s process safety limit, resource metrics, resumable checkpoint.
```

M1' finished with `243/243` functional/parity passes and no failure classification. Extra `nars_multistep_3.nal` and `simpleOperationTest.nal` both passed (`2/2`).

Evidence hashes: M1' `F14E70676275EA41D73D5B2F5CD0F6765E6E6CAB9E0DFA23A885EF6C7121361F`; extra `4502E4A90054ED5B8D45D41BA79C2DF2DBE08B98D51BC559E1D4B227DDACED2A`; jree audit `69AF5E37833B13BFD0E5CF35521C10CB6743CEF9F648A2CE496B3F2864F3A028`; platform audit `DD7271085CA252DE0E1BAB586206EBABA41517BBAB15B5FD03BED96E30E4301D`.

## Remaining Java-shape Map

```text
Removed from production runtime
  ClassToken object / WeakMap cache       [done]
  private one-shot StringBuilder          [done]
  exact getClass comparisons              [done]
  read-only iterator ceremony             [partial]

Still intentional semantic boundaries
  Java UTF-16/hash/ordering helpers       [preserve contract]
  NativeMap/Set/List value equality        [preserve contract]
  Mutable iterator remove/fail-fast        [next high-risk batch]
  Reasoner errors and overload dispatch   [audit separately]
  XML `*.class` type protocol strings     [external config, do not rename]
  original 2,000,000-cycle stability     [resource-limited, unclaimed]
```

## Midterm Gate

```text
[x] text and class-identity batches locally verified
[x] TS-only M2 and Java M2 on committed constructor/event line
[x] direct jree audit 0/0 and dist API smoke
[x] current candidate M1' 243/243 + extra 2/2
[ ] candidate affected-NAL parity and independent performance recheck
[ ] final M2 on selected candidate commit
[ ] neat-freak document reconciliation and generated-output decision
[ ] separate docs/code commits, push main, create dated stage tag
[ ] publish release/demo readiness without claiming unresolved TPS/long-cycle goals
```

## Handoff Rules

- Read this file, `docs/current-status.md`, `docs/probes/20261002-typescript-idiom-survey.md`, and the latest report before changing code.
- Treat Git, the active result file, and test output as authoritative; old sections in the archived status file are historical evidence only.
- Preserve `reports/evidence/**` and root crash logs unless a retention decision explicitly names the path.
- Never call a process-limit or memory-protected long run a semantic pass.

## Next Actions

1. Record SHA-256 hashes for the completed M1' and extra evidence.
2. Run final M2, dist/API, jree/platform audit and affected-NAL checks on `445d873`.
3. Finish neat-freak reconciliation, commit docs/archive cleanup separately from code, push `main`, and create a dated stage tag.
4. Publish the ASCII progress/Java-shape map and release/demo readiness without claiming unresolved TPS or original long-cycle goals.
