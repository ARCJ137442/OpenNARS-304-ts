#!/usr/bin/env node

import { createInterface } from "node:readline";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { Events } from "../src/io/events/Events.ts";
import { OutputHandler } from "../src/io/events/OutputHandler.ts";
import { TextOutputHandler } from "../src/io/events/TextOutputHandler.ts";
import { Nar } from "../src/main/Nar.ts";
import { Debug } from "../src/main/Debug.ts";
import { createNodeRuntimeCapabilities } from "../src/platform/node/SystemCommandCapabilities.ts";

Debug.TEST = true;

const CYCLE_COMMAND = /^:(?:cycle|cycles|step)\s+(\d+)$/i;

function parseArgs(argv) {
  const options = { config: null, autoCycles: null, prompt: true };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--config") {
      options.config = resolve(argv[++index]);
    } else if (argument === "--cycles") {
      options.autoCycles = Number(argv[++index]);
    } else if (argument === "--no-prompt") {
      options.prompt = false;
    } else if (argument === "--help" || argument === "-h") {
      options.help = true;
    } else {
      throw new Error(`unknown argument: ${argument}`);
    }
  }
  if (options.autoCycles !== null
    && (!Number.isInteger(options.autoCycles) || options.autoCycles < 1)) {
    throw new Error("--cycles must be a positive integer");
  }
  return options;
}

function parseCommand(line) {
  const trimmed = line.trim();
  if (trimmed === ":help") return { kind: "help" };
  if (trimmed === ":quit" || trimmed === ":exit") return { kind: "quit" };
  if (trimmed === ":reset" || trimmed === "*reset") return { kind: "reset" };
  const cycleMatch = CYCLE_COMMAND.exec(trimmed);
  if (cycleMatch !== null) return { kind: "cycles", count: Number(cycleMatch[1]) };
  if (trimmed === ":status") return { kind: "status" };
  return { kind: "narsese", text: trimmed };
}

function printHelp() {
  console.log("NARSese lines are submitted to the reasoner without implicit cycles.");
  console.log(":cycles N  run N inference cycles (aliases: :cycle N, :step N)");
  console.log(":status    show the current cycle clock and running state");
  console.log(":reset     reset memory and the cycle clock");
  console.log(":quit      exit the shell");
  console.log("--cycles N runs N cycles after each NARSese line; --config PATH loads a Java XML config.");
}

function renderSignal(channel, signal, nar) {
  try {
    const rendered = TextOutputHandler.getOutputString(channel, signal, true, true, nar);
    return rendered === null ? null : String(rendered);
  } catch (error) {
    return `[render-error] ${error instanceof Error ? error.message : String(error)}`;
  }
}

function attachOutput(nar) {
  const channels = [
    OutputHandler.OUT,
    OutputHandler.EXE,
    OutputHandler.ERR,
    OutputHandler.ECHO,
    Events.Answer,
    OutputHandler.ANTICIPATE,
    OutputHandler.CONFIRM,
    OutputHandler.DISAPPOINT,
  ];
  const observer = {
    event(channel, args) {
      const rendered = renderSignal(channel, args[0], nar);
      if (rendered !== null && rendered.length > 0) console.log(rendered);
    },
  };
  for (const channel of channels) nar.on(channel.class, observer);
}

function createNar(config) {
  return config === null
    ? new Nar({ capabilities: createNodeRuntimeCapabilities() })
    : new Nar({
      configText: readFileSync(config, "utf8"),
      configSource: config,
      capabilities: createNodeRuntimeCapabilities(),
    });
}

async function run(argv = process.argv.slice(2), input = process.stdin) {
  const options = parseArgs(argv);
  if (options.help) {
    printHelp();
    return 0;
  }

  const nar = createNar(options.config ?? null);
  attachOutput(nar);
  const terminal = options.prompt && input.isTTY && process.stdout.isTTY;
  const readline = createInterface({
    input,
    output: process.stdout,
    terminal,
    crlfDelay: Infinity,
  });

  if (terminal) {
    console.log("OpenNARS 3.0.4 TypeScript shell (single-threaded step mode)");
    console.log("Type :help for commands; Narsese input is followed by :cycles N.");
    readline.setPrompt("nars> ");
    readline.prompt();
  }

  try {
    for await (const rawLine of readline) {
      const command = parseCommand(rawLine);
      try {
        if (command.kind === "help") {
          printHelp();
        } else if (command.kind === "quit") {
          break;
        } else if (command.kind === "reset") {
          nar.reset();
          console.log("[shell] reset");
        } else if (command.kind === "cycles") {
          nar.cycles(command.count);
          console.log(`[shell] cycles=${command.count} time=${String(nar.time())}`);
        } else if (command.kind === "status") {
          console.log(`[shell] time=${String(nar.time())} running=${nar.isRunning()}`);
        } else {
          nar.addInput(command.text);
          if (options.autoCycles !== null) nar.cycles(options.autoCycles);
        }
      } catch (error) {
        console.error(`[shell-error] ${error instanceof Error ? error.stack ?? error.message : String(error)}`);
      }
      if (terminal) readline.prompt();
    }
  } finally {
    readline.close();
    nar.stop();
  }
  return 0;
}

export { attachOutput, parseArgs, parseCommand, printHelp, run };

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  run().then((code) => {
    process.exitCode = code;
  }).catch((error) => {
    console.error(error instanceof Error ? error.stack ?? error.message : String(error));
    process.exitCode = 1;
  });
}
