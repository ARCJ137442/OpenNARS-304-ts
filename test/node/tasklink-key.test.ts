import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { java } from "jree";
import { Sentence } from "../../src/entity/Sentence.ts";
import { Stamp } from "../../src/entity/Stamp.ts";
import { Narsese } from "../../src/io/Narsese.ts";
import { Debug } from "../../src/main/Debug.ts";
import { Nar } from "../../src/main/Nar.ts";

test("Memory refreshes an input Sentence hash after assigning occurrence", () => {
    Debug.TEST = true;
    const nar = new Nar();
    const task = new Narsese(nar).parseTask(new java.lang.String("(^left,{SELF}). :|:"));
    const initialHash = task.sentence.hashCode();

    assert.equal(task.sentence.stamp.getOccurrenceTime(), -1);
    nar.memory.inputTask(nar, task, false);

    assert.equal(task.sentence.stamp.getOccurrenceTime(), 0);
    assert.notEqual(task.sentence.hashCode(), initialHash);

    const equivalent = new Sentence(
        task.sentence.term,
        task.sentence.punctuation,
        task.sentence.truth,
        new Stamp(task.sentence.stamp, 0),
    );
    assert.equal(task.sentence.hashCode(), equivalent.hashCode());
    assert.equal(task.sentence.equals(equivalent), true);
});

test("Task Bag merges Java-equal derived sentences by TruthValue hash", () => {
    Debug.TEST = true;
    const nar = new Nar();
    const source = readFileSync(
        "java-master/src/main/resources/nal/single_step/nal6.nlp2.nal",
        "utf8",
    );

    for (const rawLine of source.split(/\r?\n/)) {
        const line = rawLine.trim();
        if (line.length === 0 || line.startsWith("'")) continue;
        if (/^[0-9]+$/.test(line)) {
            nar.cycles(Number(line));
            continue;
        }
        nar.addInput(new java.lang.String(line));
    }

    const target = new Narsese(nar).parseTerm(new java.lang.String("<cat --> CAT>"));
    const concept = nar.memory.concept(target);
    assert.ok(concept);
    assert.equal(concept.taskLinks.size(), 3);
});
