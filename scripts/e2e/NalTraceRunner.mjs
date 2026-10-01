import { readFileSync } from "node:fs";

import { java } from "../../src/platform/node/legacy-runtime-facade.ts";
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
import { javaValuesEqual } from "../../src/platform/node/legacy-runtime-facade.ts";

const eventDefinitions = [
    ["TaskAdd", Events.TaskAdd.class],
    ["ConceptNew", Events.ConceptNew.class],
    ["ConceptDirectProcessedTask", Events.ConceptDirectProcessedTask.class],
    ["TaskImmediateProcess", Events.TaskImmediateProcess.class],
    ["TermLinkAdd", Events.TermLinkAdd.class],
    ["TaskLinkAdd", Events.TaskLinkAdd.class],
    ["TaskLinkRemove", Events.TaskLinkRemove.class],
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

function executionResultText(value, nar) {
    const task = value.getTask();
    const budget = task === null || task === undefined ? null : task.budget;
    const operation = value.operation;
    const args = Array.from(operation.getArguments().term).map(termText).join(", ");
    const operator = termText(operation.getOperator());
    const feedback = value.feedback === null || value.feedback === undefined
        ? "null"
        : `[${Array.from(value.feedback).map((item) => item instanceof Task
            ? String(item.toString())
            : termText(item)).join(", ")}]`;
    return `${budget === null ? "" : `${String(budget.toStringExternal())} `}${operator}([${args}])=${feedback}`;
}

function sentenceText(value, nar) {
    return String(value.sentence.toString(nar, true));
}

function indexText(index) {
    return index === null ? "null" : `[${Array.from(index).join(", ")}]`;
}

function describe(value, nar) {
    if (value === null || value === undefined) return null;
    if (value.constructor?.name === "ExecutionResult"
        && typeof value.getTask === "function"
        && value.operation !== undefined) {
        return executionResultText(value, nar);
    }
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

function contextSummary(args) {
    const targetConcept = args.find((value) => value instanceof Concept
        && String(value.getTerm().name()) === "(^left,{SELF})");
    if (targetConcept !== undefined) {
        const focusedTaskLink = args.find((value) => value instanceof TaskLink);
        const taskLinks = Array.from(targetConcept.taskLinks ?? [])
            .map((taskLink) => `${String(taskLink.getTarget().sentence.term.name())}`
                + ` keyHash=${taskLink.name().hashCode()}`
                + ` equalsFocus=${focusedTaskLink === undefined ? "n/a" : javaValuesEqual(taskLink.name(), focusedTaskLink.name())}`
                + ` sentenceHash=${taskLink.getTarget().sentence.hashCode()}`
                + ` punctuation=${String(taskLink.getTarget().sentence.punctuation)}`
                + ` occurrence=${taskLink.getTarget().sentence.stamp.getOccurrenceTime()}`
                + ` truth=${taskLink.getTarget().sentence.truth === null ? "null" : taskLink.getTarget().sentence.truth.toKey()}`
                + ` records=`
                + `[${Array.from(taskLink.records ?? [])
                    .map((record) => `${String(record.link?.target?.name?.() ?? record.link)}@${record.getTime()}`)
                    .join(", ")}]`);
        return `concept=${String(targetConcept.getTerm().name())}|taskLinks=[${taskLinks.join(", ")}]`;
    }
    const context = args.find((value) => value instanceof DerivationContext);
    if (context === undefined) return null;
    const concept = context.getCurrentConcept?.();
    const link = context.getCurrentTaskLink?.();
    const conceptText = concept === null || concept === undefined
        ? "null"
        : String(concept.getTerm().name());
    if (link === null || link === undefined) return `concept=${conceptText}|taskLink=null`;
    const index = link.index === null || link.index === undefined
        ? "null"
        : `[${Array.from(link.index).join(", ")}]`;
    let summary = `time=${context.getTime()}|noveltyHorizon=${context.narParameters.NOVELTY_HORIZON}`
        + `|concept=${conceptText}|taskLink=${String(link.getTarget().sentence.term.name())}`
        + `|type=${link.type}|index=${index}|priority=${link.getPriority()}`
        + `|durability=${link.getDurability()}|quality=${link.getQuality()}`
        + `|conceptPriority=${concept.getPriority()}|conceptDurability=${concept.getDurability()}`
        + `|conceptQuality=${concept.getQuality()}`;
    if (conceptText === "(^left,{SELF})") {
        const records = Array.from(link.records ?? [])
            .map((record) => `${String(record.link?.target?.name?.() ?? record.link)}@${record.getTime()}`);
        const termLinks = Array.from(concept.termLinks ?? [])
            .map((termLink) => `${String(termLink.target.name())}|type=${termLink.type}`
                + `|index=${indexText(termLink.index)}`);
        summary += `|records=[${records.join(", ")}]|termLinks=[${termLinks.join(", ")}]`;
    }
    return summary;
}

function parseArgs(argv) {
    if (argv.length < 2 || argv.slice(2).some((value) => value !== "--skip-embedded")) {
        throw new Error("usage: node --import ./scripts/register-ts-loader.mjs scripts/e2e/NalTraceRunner.mjs <cycles> <nal-file> [--skip-embedded]");
    }
    const cycles = Number(argv[0]);
    if (!Number.isInteger(cycles) || cycles < 1) throw new Error("cycles must be a positive integer");
    return { cycles, file: argv[1], skipEmbedded: argv.slice(2).includes("--skip-embedded") };
}

function main() {
    const { cycles, file, skipEmbedded } = parseArgs(process.argv.slice(2));
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
                ...(contextSummary(args) === null ? {} : { context: contextSummary(args) }),
            })}\n`);
        },
    };
    nar.event(observer, true, ...eventDefinitions.map(([, eventClass]) => eventClass));

    for (const rawLine of readFileSync(file, "utf8").split(/\r?\n/)) {
        const line = rawLine.trim();
        if (line.length === 0 || line.startsWith("'")) continue;
        if (/^[0-9]+$/.test(line)) {
            if (!skipEmbedded) nar.cycles(Number(line));
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
