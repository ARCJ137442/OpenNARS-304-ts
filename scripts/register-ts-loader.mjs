import { pathToFileURL } from "node:url";
import { register } from "node:module";

register("./scripts/ts-loader.mjs", pathToFileURL("./"));
