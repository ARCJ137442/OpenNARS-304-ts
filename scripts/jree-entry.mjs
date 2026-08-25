#!/usr/bin/env node

import { createRequire } from "node:module";

// `jree@1.3.0` exists in the wild with either an extensionless `main` field
// or an explicit `exports` entry. CommonJS resolution handles both forms
// without Node's ESM DEP0151 warning; the published runtime imports this
// adapter instead of depending on either package layout.
const require = createRequire(import.meta.url);
const jree = require("jree");

export const java = jree.java;
export const JavaObject = jree.JavaObject;
export const Class = jree.Class;
export const S = jree.S;
export const closeResources = jree.closeResources;
export const handleResourceError = jree.handleResourceError;
export const throwResourceError = jree.throwResourceError;
