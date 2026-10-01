import { Nar, type NarOptions } from "./Nar.ts";
import { HostCapabilityError, ReasonerInputError } from "../runtime/ReasonerErrors.ts";
import type { RuntimeCapabilities } from "../platform/RuntimeCapabilities.ts";
import { TextOutputHandler } from "../io/events/TextOutputHandler.ts";

/** A deliberately small output sink. Hosts decide where lines are displayed. */
export interface ShellOutput {
    println(value: unknown): void;
}

/** Effects needed by the command runner; hosts decide how to provide them. */
export interface ShellHost {
    readonly capabilities?: RuntimeCapabilities;
    readonly output: ShellOutput;
    readTextFile?(path: string): string;
}

export type ShellCommand =
    | { readonly kind: "narsese"; readonly text: string }
    | { readonly kind: "cycles"; readonly count: number }
    | { readonly kind: "reset" }
    | { readonly kind: "status" }
    | { readonly kind: "help" }
    | { readonly kind: "quit" };

/** The platform-neutral command/text runner for a NARS instance. */
export class Shell {
    private readonly nar: Nar;
    private readonly reasonerOutput: TextOutputHandler | null;
    private output: ShellOutput = {
        println: (_value: unknown) => undefined,
    };

    public constructor(nar: Nar, output?: ShellOutput) {
        this.nar = nar;
        if (output !== undefined) this.output = output;
        this.reasonerOutput = typeof (nar as { on?: unknown }).on === "function"
            ? new TextOutputHandler(nar, this.output).setErrors(true)
            : null;
    }

    public static parseCommand(rawLine: string): ShellCommand {
        const line = rawLine.trim();
        if (line === ":help") return { kind: "help" };
        if (line === ":quit" || line === ":exit") return { kind: "quit" };
        if (line === ":reset" || line === "*reset") return { kind: "reset" };
        if (line === ":status") return { kind: "status" };
        const match = /^:(?:cycle|cycles|step)\s+(\d+)$/i.exec(line);
        if (match !== null) return { kind: "cycles", count: Number.parseInt(match[1], 10) };
        return { kind: "narsese", text: line };
    }

    public static argInfo(output: ShellOutput): void {
        output.println("expected arguments: none, or: nar/config/snapshot path, id, input text path, cycles");
    }

    public static createNar(args: readonly string[], host: ShellHost): Nar {
        const narPath = String(args[0] ?? "null");
        const idText = String(args[1] ?? "null");
        const id = idText.toLowerCase() === "null" ? undefined : BigInt(idText);
        if (narPath.toLowerCase() === "null") {
            return new Nar(id === undefined ? { capabilities: host.capabilities } : {
                narId: id,
                capabilities: host.capabilities,
            });
        }
        if (narPath.endsWith(".xml")) {
            if (host.readTextFile === undefined) {
                throw new HostCapabilityError("readTextFile");
            }
            const configText = host.readTextFile(narPath);
            return new Nar({ narId: id, configText, configSource: narPath, capabilities: host.capabilities });
        }
        if (id !== undefined) {
            throw new ReasonerInputError(
                "A loaded reasoner cannot receive a new identity; use a null id for snapshot loading",
            );
        }
        return Nar.LoadFromFile(narPath, host.capabilities);
    }

    public static main(args: readonly string[], host: ShellHost): void {
        const normalized = args.length === 0 ? ["null", "null", "null", "null"] : [...args];
        if (normalized.length !== 4 && (normalized.length < 5 || (normalized.length - 5) % 5 !== 0)) {
            Shell.argInfo(host.output);
            return;
        }
        const nar = Shell.createNar(normalized, host);
        new Shell(nar, host.output).run(normalized, host);
    }

    /** Execute a single parsed command and return whether the session continues. */
    public execute(command: ShellCommand): boolean {
        switch (command.kind) {
            case "help":
                this.output.println(":cycles N  run N inference cycles");
                this.output.println(":status    show the cycle clock and running state");
                this.output.println(":reset     reset memory and the cycle clock");
                this.output.println(":quit      exit the shell");
                return true;
            case "quit":
                return false;
            case "reset":
                this.nar.reset();
                this.output.println("[shell] reset");
                return true;
            case "status":
                this.output.println(`[shell] time=${String(this.nar.time())} running=${this.nar.isRunning()}`);
                return true;
            case "cycles":
                if (!Number.isInteger(command.count) || command.count < 0) {
                    throw new ReasonerInputError("Cycle count must be a non-negative integer");
                }
                this.nar.cycles(command.count);
                this.output.println(`[shell] cycles=${command.count} time=${String(this.nar.time())}`);
                return true;
            case "narsese":
                if (command.text.length > 0) this.nar.addInput(command.text);
                return true;
        }
    }

    /** Run the batch argument shape through injected host capabilities. */
    public run(args: readonly string[], host: ShellHost, inputLines: Iterable<string> = []): void {
        const inputPath = String(args[2] ?? "null");
        const cycleText = String(args[3] ?? "null");
        if (inputPath.toLowerCase() !== "null") {
            if (host.readTextFile === undefined) {
                throw new HostCapabilityError("readTextFile");
            }
            this.nar.addInputText(host.readTextFile(inputPath));
        }
        if (cycleText.toLowerCase() !== "null") {
            const cycles = Number.parseInt(cycleText, 10);
            if (!Number.isInteger(cycles) || cycles < 0) throw new ReasonerInputError("Invalid cycle count");
            this.nar.cycles(cycles);
            return;
        }
        for (const line of inputLines) {
            if (!this.execute(Shell.parseCommand(line))) break;
        }
    }

    public setPrintStream(output: ShellOutput): void {
        this.output = output;
    }
}
