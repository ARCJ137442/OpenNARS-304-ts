# Integration guide

## Node.js / TypeScript

Install the package and import the ESM API:

```bash
npm install opennars-304-ts
```

```ts
import { Nar, OutputHandler } from "opennars-304-ts";

const nar = new Nar();
const observer = {
  event(channel: unknown, args: unknown[] = []) {
    if (channel === OutputHandler.OUT.class) console.log(args.map(String).join(" "));
  },
};
nar.on(OutputHandler.OUT.class, observer);
nar.addInputText("<bird --> animal>.\n<robin --> bird>.");
nar.cycles(10);
nar.off(OutputHandler.OUT.class, observer);
nar.stop();
```

The host reads files and passes configuration text to the core:

```ts
import { readFile } from "node:fs/promises";
import { Nar } from "opennars-304-ts";

const configText = await readFile("config.xml", "utf8");
const nar = new Nar({ configText, configSource: "file" });
nar.stop();
```

## NAL files and browsers

The Node CLI owns file access. Browser hosts should use `File.text()`, `fetch()`, or an equivalent API and then call `addInputText`. Do not import Node file modules into a browser bundle.

The public demo Worker accepts `command` messages and returns `ready`, `output`, `complete`, and `fatal` messages. Custom configuration uses a `config` message with text.

## API boundary

`dist/index.d.ts` is the public type entry point. Java compatibility names remain inside runtime and host boundaries to preserve OpenNARS behavior; the public declarations do not require npm `jree` types.
