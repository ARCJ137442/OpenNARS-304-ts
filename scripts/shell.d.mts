export type ShellOptions = {
  config: string | null;
  autoCycles: number | null;
  prompt: boolean;
  help?: boolean;
};

export type ShellCommand =
  | { kind: "help" | "quit" | "reset" | "status" }
  | { kind: "cycles"; count: number }
  | { kind: "narsese"; text: string };

export function parseArgs(argv: string[]): ShellOptions;
export function parseCommand(line: string): ShellCommand;
export function printHelp(): void;
export function attachOutput(nar: unknown): void;
export function run(argv?: string[], input?: NodeJS.ReadableStream): Promise<number>;
