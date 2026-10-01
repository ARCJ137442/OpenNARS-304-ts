# Getting started

OpenNARS-304-ts runs the reasoning core in Node.js. Browser users can open the online demo at https://arcj137442.github.io/opennars-304-ts-lab/ without installing Node.js.

## Install and run

Requires Node.js 22 or newer.

```bash
git clone https://github.com/ARCJ137442/OpenNARS-304-ts.git
cd OpenNARS-304-ts
npm ci
npm run build
npm run shell
```

Enter:

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

Online demo: <https://arcj137442.github.io/opennars-304-ts-lab/>. Use `:version` to see the core commit bound to the Worker.

Continue with the [integration guide](integration-guide.en.md) or [architecture](architecture.en.md).
