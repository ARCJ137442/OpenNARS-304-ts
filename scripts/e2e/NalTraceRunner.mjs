import { readFileSync } from "node:fs";

import { java } from "jree";
import { Concept } from "../../src/entity/Concept.ts";
import { Sentence } from "../../src/entity/Sentence.ts";
import { Task } from "../../src/entity/Task.ts";
import { TaskLink } from "../../src/entity/TaskLink.ts";
import { TermLink } from "../../src/entity/TermLink.ts";
import { DerivationContext } from "../../src/control/DerivationContext.ts";
import { Events } from "../../src/io/events/Events.ts";
import { OutputHandler } from "../../src/io/events/OutputHandler.ts";
import { Debug } from "../../src/main/Debug.ts";
import { Nar } from "../../src/main/Nar.ts";

const eventDefinitions = [
    ["TaskAdd", Events.TaskAdd.class],
    ["ConceptNew", Events.ConceptNew.class],
    ["ConceptDirectProcessedTask", Events.ConceptDirectProcessedTask.class],
    ["TaskImmediateProcess", Events.TaskImmediateProcess.class],
    ["TermLinkAdd", Events.TermLinkAdd.class],
    ["TaskLinkAdd", Events.TaskLinkAdd.class],
    ["ConceptFire", Events.ConceptFire.class],
    ["TermLinkSelect", Events.TermLinkSelect.class],
    ["BeliefSelect", Events.BeliefSelect.class],
    ["BeliefReason", Events.BeliefReason.class],
    ["TaskDerive", Events.TaskDerive.class],
    ["EnactableExplainationAdd", Events.EnactableExplainationAdd.class],
    ["NewTaskExecution", Events.NewTaskExecution.class],
    ["OUT", OutputHandler.OUT.class],
    ["EXE", OutputHandler.EXE.class],
];

function termText(value) {
    if (value !== null && value !== undefined && typeof value.name === "function") {
        return String(value.name());
    }
    return String(value);
}

function sentenceText(value, nar) {
    return String(value.sentence.toString(nar, true));
}

function indexText(index) {
    return index === null ? "null" : `[${Array.from(index).join(", ")}]`;
}

function describe(value, nar) {
    if (value === null || value === undefined) return null;
    if (value instanceof Task) return sentenceText(value, nar);
    if (value instanceof Sentence) return String(value.toString(nar, true));
    if (value instanceof Concept) return termText(value.getTerm());
    if (value instanceof TaskLink) {
        return `${termText(value.getTarget().sentence.term)}|type=${value.type}|index=${indexText(value.index)}`;
    }
    if (value instanceof TermLink) {
        return `${termText(value.target)}|type=${value.type}|index=${indexText(value.index)}`;
    }
    if (value instanceof DerivationContext) {
        const task = value.getCurrentTask();
        return task === null || task === undefined
            ? String(value)
            : termText(task.sentence.term);
    }
    return termText(value);
}

function parseArgs(argv) {
    if (argv.length !== 2) {
        throw new Error("usage: node --loader ./scripts/ts-loader.mjs scripts/e2e/NalTraceRunner.mjs <cycles> <nal-file>");
    }
    const cycles = Number(argv[0]);
    if (!Number.isInteger(cycles) || cycles < 1) throw new Error("cycles must be a positive integer");
    return { cycles, file: argv[1] };
}

function main() {
    const { cycles, file } = parseArgs(process.argv.slice(2));
    Debug.TEST = true;
    const nar = new Nar();
    const classNames = new Map(eventDefinitions.map(([name, eventClass]) => [eventClass, name]));
    let sequence = 0;
    const observer = {
        event(eventClass, args) {
            const values = Array.from(args).slice(0, 4).map((value) => describe(value, nar));
            process.stdout.write(`${JSON.stringify({
                seq: sequence++,
                event: classNames.get(eventClass) ?? String(eventClass),
                args: values,
            })}\n`);
        },
    };
    nar.event(observer, true, ...eventDefinitions.map(([, eventClass]) => eventClass));

    for (const rawLine of readFileSync(file, "utf8").split(/\r?\n/)) {
        const line = rawLine.trim();
        if (line.length === 0 || line.startsWith("'")) continue;
        if (/^[0-9]+$/.test(line)) {
            nar.cycles(Number(line));
            continue;
        }
        nar.addInput(new java.lang.String(line));
    }
    process.stdout.write(`${JSON.stringify({ seq: sequence++, event: "before-cycles", args: [] })}\n`);
    nar.cycles(cycles);
    process.stdout.write(`${JSON.stringify({ seq: sequence++, event: "after-cycles", args: [] })}\n`);
}

try {
    main();
} catch (error) {
    console.error(error?.stack ?? error);
    process.exitCode = 1;
}
