import assert from "node:assert/strict";
import test from "node:test";
import { Anticipate } from "../../src/operator/mental/Anticipate.ts";
import { Parameters as NarParameters } from "../../src/main/Parameters.ts";
import { Term } from "../../src/language/Term.ts";
import { EventEmitter } from "../../src/io/events/EventEmitter.ts";
import { Events } from "../../src/io/events/Events.ts";
import { OutputHandler } from "../../src/io/events/OutputHandler.ts";
import { Concept } from "../../src/entity/Concept.ts";
import { BudgetValue } from "../../src/entity/BudgetValue.ts";
import { NativeSet } from "../../src/runtime/NativeSet.ts";
import { NativeMap } from "../../src/runtime/NativeMap.ts";

test("Anticipate keeps a prediction and emits the Java-compatible signal", () => {
    const parameters = new NarParameters();
    const event = new EventEmitter();
    const emitted: unknown[] = [];
    const memory = {
        event,
        narParameters: parameters,
        emit(channel: unknown, ...args: unknown[]) {
            emitted.push([channel, ...args]);
        },
        addNewTask() {
            throw new Error("feedback should be disabled for this local contract");
        },
    };
    const time = { time: () => 10n };
    const anticipate = new Anticipate();
    anticipate.setAnticipationAsOperator(false);

    anticipate.anticipate(Term.SELF, memory as never, 15n, null, time);

    assert.equal(anticipate.anticipations instanceof NativeMap, true);
    assert.equal(anticipate.anticipations.size(), 1);
    const entry = anticipate.anticipations.entrySet().iterator().next();
    assert.equal(entry.getKey().predictionCreationTime, 10n);
    assert.equal(entry.getKey().predictedOccurenceTime, 15n);
    const terms = entry.getValue();
    assert.equal(terms instanceof NativeSet, true);
    const termIterator = terms.iterator();
    assert.equal(termIterator.next(), Term.SELF);
    termIterator.remove();
    assert.equal(terms.isEmpty(), true);
    assert.deepEqual(emitted, [[OutputHandler.ANTICIPATE.class, Term.SELF]]);
});

test("Anticipate keeps Java Prediction identity keys in its outer Map", () => {
    const anticipate = new Anticipate();
    const first = new anticipate.Prediction(10n, 15n);
    const second = new anticipate.Prediction(10n, 15n);
    const firstTerms = new NativeSet<Term>();
    const secondTerms = new NativeSet<Term>();

    anticipate.anticipations.put(first, firstTerms);
    anticipate.anticipations.put(second, secondTerms);

    assert.notEqual(first, second);
    assert.equal(Object.getPrototypeOf(anticipate.Prediction.prototype), Object.prototype);
    assert.equal(Object.getPrototypeOf(first), anticipate.Prediction.prototype);
    assert.equal(anticipate.anticipations.size(), 2);
    assert.equal(anticipate.anticipations.get(first), firstTerms);
    assert.equal(anticipate.anticipations.get(second), secondTerms);
});

test("Anticipate removes a confirmed NativeSet value through its Java iterator path", () => {
    const parameters = new NarParameters();
    const emitted: unknown[] = [];
    const memory = {
        narParameters: parameters,
        emit(channel: unknown, ...args: unknown[]) {
            emitted.push([channel, ...args]);
        },
        addNewTask() {
            throw new Error("feedback should be disabled for this local contract");
        },
    };
    const clock = { time: () => 10n };
    const anticipate = new Anticipate();
    anticipate.setAnticipationAsOperator(false);
    anticipate.anticipate(Term.SELF, memory as never, 15n, null, clock);

    const nal = {
        time: clock,
        memory,
        narParameters: parameters,
    };
    const task = {
        sentence: {
            truth: { getExpectation: () => 1 },
            isJudgment: () => true,
            isEternal: () => false,
        },
        getTerm: () => Term.SELF,
    };
    anticipate.event(Events.TaskDerive.class, [task, nal] as never);
    anticipate.updateAnticipations(nal as never);

    assert.equal(anticipate.anticipations.isEmpty(), true);
    assert.deepEqual(emitted, [
        [OutputHandler.ANTICIPATE.class, Term.SELF],
        [OutputHandler.CONFIRM.class, Term.SELF],
    ]);
});

test("Anticipate subscribes and unsubscribes from its cycle events", () => {
    const parameters = new NarParameters();
    const event = new EventEmitter();
    const nar = { memory: { event }, narParameters: parameters };
    const anticipate = new Anticipate(0.2, 0.3);

    anticipate.setEnabled(nar as never, true);
    assert.equal(event.isActive(Events.InduceSucceedingEvent.class), true);
    assert.equal(event.isActive(Events.CycleEnd.class), true);
    anticipate.setEnabled(nar as never, false);
    assert.equal(event.isActive(Events.InduceSucceedingEvent.class), false);
    assert.equal(event.isActive(Events.CycleEnd.class), false);
});

test("Anticipate deduplicates equal derived terms in its Set boundary", () => {
    const anticipate = new Anticipate();
    const first = Term.get("anticipated");
    const second = first.clone();
    assert.notEqual(first, second);
    assert.equal(first.equals(second), true);

    const nal = {
        narParameters: { DEFAULT_CONFIRMATION_EXPECTATION: 0.5 },
    };
    const makeTask = (term: Term) => ({
        sentence: {
            truth: { getExpectation: () => 1 },
            isJudgment: () => true,
            isEternal: () => false,
        },
        getTerm: () => term,
    });

    anticipate.event(Events.TaskDerive.class, [makeTask(first), nal] as never);
    anticipate.event(Events.TaskDerive.class, [makeTask(second), nal] as never);

    const newTasks = (anticipate as unknown as {
        newTasks: { size(): number; toArray(): Term[] };
    }).newTasks;
    assert.equal(newTasks.size(), 1);
    assert.equal(newTasks.toArray()[0], first);
});

test("Concept stores anticipation entries in a native array", () => {
    const parameters = new NarParameters();
    const memory = { narParameters: parameters } as never;
    const concept = new Concept(
        new BudgetValue(0.5, 0.5, 0.5, parameters),
        Term.get("anticipation"),
        memory,
    );
    const entry = new Concept.AnticipationEntry(0.5, null as never, 0n, 1n);

    assert.equal(Object.getPrototypeOf(Object.getPrototypeOf(entry)), Object.prototype);
    assert.equal(Array.isArray(concept.anticipations), true);
    concept.anticipations.push(entry);
    assert.equal(concept.anticipations.length, 1);
    assert.equal(concept.anticipations[0], entry);
});

test("ProcessAnticipation accepts the native Map substitution boundary", async () => {
    const { Nar } = await import("../../src/main/Nar.ts");
    const { DerivationContext } = await import("../../src/control/DerivationContext.ts");
    const { ProcessAnticipation } = await import("../../src/control/concept/ProcessAnticipation.ts");
    const { Sentence } = await import("../../src/entity/Sentence.ts");
    const { Stamp } = await import("../../src/entity/Stamp.ts");
    const { TruthValue } = await import("../../src/entity/TruthValue.ts");
    const { BudgetValue } = await import("../../src/entity/BudgetValue.ts");
    const { Product } = await import("../../src/language/Product.ts");
    const { Implication } = await import("../../src/language/Implication.ts");
    const { Variable } = await import("../../src/language/Variable.ts");
    const { TemporalRules } = await import("../../src/inference/TemporalRules.ts");
    const { NativeMap } = await import("../../src/runtime/NativeMap.ts");

    const nar = new Nar();
    try {
        const variable = new Variable("$1");
        const grounded = Term.get("grounded-anticipation");
        const predicate = Product.make([Term.get("anticipated-target"), variable]);
        const implication = Implication.make(Term.get("anticipation-condition"), predicate, TemporalRules.ORDER_FORWARD);
        const sentence = new Sentence(
            implication,
            ".",
            TruthValue.fromFrequencyConfidence(1, 0.9, nar.narParameters),
            new Stamp(nar, nar.memory),
        );
        type ProcessSubstitution = Parameters<typeof ProcessAnticipation.anticipate>[6];
        const substitution = new NativeMap<Term, Term>() as unknown as ProcessSubstitution;
        substitution.put(variable, grounded);
        const context = new DerivationContext(nar.memory, nar.narParameters, nar);

        assert.doesNotThrow(() => ProcessAnticipation.anticipate(
            context,
            sentence,
            new BudgetValue(0.9, 0.9, 0.9, nar.narParameters),
            1n,
            2n,
            1.0,
            substitution,
        ));
        const substituted = predicate.applySubstitute(substitution);
        assert.equal(substituted instanceof Product, true);
        assert.equal((substituted as typeof predicate).term[1].equals(grounded), true);
    } finally {
        nar.stop();
    }
});
