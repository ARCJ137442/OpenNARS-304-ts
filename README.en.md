# OpenNARS 3.0.4 TypeScript

[简体中文](README.md)

A TypeScript implementation of OpenNARS 3.0.4 with a Node.js CLI, interactive shell, ESM library API, and a separate browser Worker demo.

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
  if (channel === OutputHandler.OUT.class) console.log(...args.map(String));
} };
nar.on(OutputHandler.OUT.class, observer);
nar.addInputText("<bird --> animal>.");
nar.cycles(10);
nar.off(OutputHandler.OUT.class, observer);
nar.stop();
```

## Release bundle

Run `npm run release:bundle` to create a reproducible npm tarball and a SHA-256 manifest under `release/`.

## Documentation

- [Getting started](docs/getting-started.en.md)
- [User guide](docs/user-guide.en.md)
- [Integration guide](docs/integration-guide.en.md)
- [Architecture](docs/architecture.en.md)
- [Open-source readiness](docs/open-source-readiness-v1.0.1.md)
- [中文文档索引](docs/README.md)

## Attribution and license

This project is a TypeScript rewrite and adaptation of OpenNARS 3.0.4. See [NOTICE](NOTICE) for attribution and [LICENSE](LICENSE) for the MIT License.
