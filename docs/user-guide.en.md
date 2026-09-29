# User guide

| Need | Entry point |
| --- | --- |
| Interactive Narsese | `npm run shell` |
| Batch NAL execution | `node dist/cli.mjs --cycles 1550 file.nal` |
| Node/TypeScript integration | `dist/index.js` and `dist/index.d.ts` |
| Browser experience | Online Worker demo |

## Shell commands

```text
:help
:cycles 100
:status
:reset
:quit
```

Input lines do not advance the clock implicitly. Use `:cycles N` to run inference cycles.

## Browser

The browser demo runs the core in an isolated Worker. It accepts Narsese text and explicit configuration text; it does not use Node `fs`, `path`, `process`, or terminal APIs.

## Limits

Node and browser use separate host adapters. File persistence and process capabilities belong to the Node host boundary. The 020 performance milestone is still in progress, and the original 2,000,000-cycle stability workload is not a routine release check.
