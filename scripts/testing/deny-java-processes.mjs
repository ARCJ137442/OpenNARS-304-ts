import childProcess from "node:child_process";
import { syncBuiltinESMExports } from "node:module";
import { isJavaProcess } from "./java-process-policy.mjs";

for (const method of ["spawn", "spawnSync", "execFile", "execFileSync", "exec", "execSync"]) {
  const original = childProcess[method];
  childProcess[method] = function guardedChildProcess(command, ...args) {
    if (isJavaProcess(command, Array.isArray(args[0]) ? args[0] : [], {
      commandString: method === "exec" || method === "execSync",
    })) {
      throw new Error(`TS_ONLY_JAVA_PROCESS_BLOCKED: ${String(command)}`);
    }
    return original.call(this, command, ...args);
  };
}

syncBuiltinESMExports();
