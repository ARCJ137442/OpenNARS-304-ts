import { pathToFileURL } from "node:url";
import { register } from "node:module";

import { ensureJreePackage } from "./ensure-jree-package.mjs";

await ensureJreePackage();
register("./scripts/ts-loader.mjs", pathToFileURL("./"));
