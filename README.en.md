# OpenNARS 3.0.4 TypeScript

<img src="brand/opennars-ts-logo.svg" width="260" alt="OpenNARS TypeScript logo" />

[简体中文](README.md)

A TypeScript implementation of OpenNARS 3.0.4. Start with the Web Lab to watch the reasoner enter a Microworld, grid, board game, or shooting arena, or run the local Shell as a Narsese reasoning workbench.

## Start by playing

No installation is needed for the Web Lab: <https://arcj137442.github.io/opennars-304-ts-lab/>.

Open Microworld for the classic embodied scene, Grid Microworld for discrete topologies, NARS × 2048 for cross-round experiments, or Pong and Shot for multiple reasoner roles. The home page is navigation only; a browser Worker starts after you choose a scene.

Each scene exposes perception, goals, inference events, operations, and environment feedback in one timeline. Expand performance diagnostics to inspect FPS, TPS, RPS, concept counts, and queued Workers. The plain Microworld entry uses a random seed and blank exploration; use `microworld.html?seed=19&knowledge=starter` for a reproducible starter run.

## Quick start

Requires Node.js 22 or newer.

```bash
git clone https://github.com/ARCJ137442/OpenNARS-304-ts.git
cd OpenNARS-304-ts
npm ci
npm run build
npm run shell
```

Try:

```text
<bird --> animal>.
<robin --> bird>.
<robin --> animal>?
:cycles 100
:quit
```

Run a NAL file:

```bash
node dist/cli.mjs --cycles 1550 path/to/example.nal
```

Online demo: <https://arcj137442.github.io/opennars-304-ts-lab/>.

## Library

```js
import { Nar, OutputHandler } from "opennars-304-ts";

const nar = new Nar();
const observer = { event(channel, args = []) {
  if (channel === OutputHandler.OUT) console.log(...args.map(String));
} };
nar.on(OutputHandler.OUT, observer);
nar.addInputText("<bird --> animal>.");
nar.cycles(10);
nar.off(OutputHandler.OUT, observer);
nar.stop();
```

## Release bundle

Run `npm run release:bundle` to create a reproducible tarball and SHA-256 manifest under `release/` for a future GitHub download. This project is not published to npm.

## Documentation

- [Getting started](docs/getting-started.en.md)
- [User guide](docs/user-guide.en.md)
- [Integration guide](docs/integration-guide.en.md)
- [Architecture](docs/architecture.en.md)
- [Latest midterm handoff](https://github.com/ARCJ137442/OpenNARS-304-ts/blob/main/docs/midterm-handoff-20261003.md)
- [Release checklist](https://github.com/ARCJ137442/OpenNARS-304-ts/blob/main/docs/release-checklist.en.md)
- [中文文档索引](docs/README.md)

## Attribution and license

This project is a TypeScript rewrite and adaptation of OpenNARS 3.0.4. See [NOTICE](NOTICE) for attribution and [LICENSE](LICENSE) for the MIT License.

The current performance round stopped after repeated low-yield candidates; sustained 20 TPS and strict performance convergence are not claimed. The v1.0.7 fix release is published; the static Pages Lab is deployed separately. The original 2,000,000-cycle TypeScript run completed, while Java was not rerun for that workload.
