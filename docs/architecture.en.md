# Architecture

```text
Node CLI / Shell       Browser UI
        |                  |
        v                  v
Node host adapter     Browser host adapter
        \                  /
         +--> Nar / Memory / Inference
                    |
          language / entity / storage
```

`src/main/Nar.ts` coordinates lifecycle and cycles. `src/language` and `src/entity` represent Narsese and task values. `src/storage` owns memory containers. `src/inference` and `src/control` implement reasoning. Operators and plugins are explicit extension points.

The core accepts text, configuration text, and explicit host capabilities. File access, argv, standard streams, process exit, and browser Worker wiring stay in host adapters.

The migration removes the shared core's runtime dependency on the legacy jree bridge. Java-compatible UTF-16 strings, hashes, exception hierarchy, class tokens, iterators, and insertion order remain where they preserve OpenNARS 3.0.4 behavior. New code should prefer native TypeScript values and the narrowest capability interface.

The browser build records its source commit in `build-meta.json`; this is the traceability link between a Pages deployment and the core repository.
