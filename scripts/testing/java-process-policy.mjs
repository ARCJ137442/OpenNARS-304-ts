import { basename } from "node:path";

const javaExecutable = /^(?:java|javaw|javac)(?:\.exe|\.cmd|\.bat)?$/i;
const shellExecutable = /^(?:cmd|powershell|pwsh|sh|bash)(?:\.exe|\.cmd)?$/i;
const javaShellCommand = /(?:^|\s|[;&|])["']?(?:[^\s"']*[/\\])?(?:java|javaw|javac)(?:\.exe|\.cmd|\.bat)?["']?(?=\s|$|[;&|])/i;

function executableName(command) {
  return basename(String(command).replaceAll("\\", "/"));
}

export function isJavaProcess(command, args = [], { commandString = false } = {}) {
  if (commandString) return javaShellCommand.test(String(command).trim());
  const name = executableName(command);
  if (javaExecutable.test(name)) return true;
  if (!shellExecutable.test(name)) return false;
  return javaShellCommand.test(args.map(String).join(" ").trim());
}
