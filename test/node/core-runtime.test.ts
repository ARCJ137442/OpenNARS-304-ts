import assert from "node:assert/strict";
import test from "node:test";
import type { Interval as IntervalType } from "../../src/language/Interval.ts";
import type { Product as ProductType } from "../../src/language/Product.ts";
import type { Variable as VariableType } from "../../src/language/Variable.ts";

test("translated term and sentence constructors preserve Java delegation contracts", async () => {
    // Load the sentence root first so its existing language-module cycle is initialized once.
    const { Sentence } = await import("../../src/entity/Sentence.ts");
    const { Term } = await import("../../src/language/Term.ts");
    const { TruthValue } = await import("../../src/entity/TruthValue.ts");
    const { Stamp } = await import("../../src/entity/Stamp.ts");
    const { Tense } = await import("../../src/language/Tense.ts");
    const { Parameters } = await import("../../src/main/Parameters.ts");

    const parameters = new Parameters();
    const term = Term.get("A");
    const truth = TruthValue.fromFrequencyConfidence(0.7, 0.6, parameters);
    const stamp = new Stamp(0, Tense.Present, new Stamp.BaseEntry(0, 1), parameters.DURATION);
    const sentence = new Sentence(term, ".", truth, stamp);

    assert.equal(typeof term.name, "function");
    assert.equal(String(term.toString()), "A");
    assert.equal(String(sentence.getTerm().toString()), "A");
    assert.equal(String(sentence.getTruth().toStringExternal()), "%0.70;0.60%");
    assert.match(String(sentence.getKey()), /^A\. %0\.70;0\.60%/);

    const narForSentenceText = {
        time: () => 0,
        narParameters: parameters,
    } as unknown as import("../../src/main/Nar.ts").Nar;
    assert.doesNotThrow(() => String(sentence.toString(narForSentenceText, false)));

    assert.equal(Term.get("a").equals(Term.get("A")), false);
    assert.notEqual(Term.get("a").hashCode(), Term.get("A").hashCode());

    const { Add } = await import("../../src/operator/misc/Add.ts");
    const add = new Add();
    assert.equal(add.equals(add), true);
    assert.equal(add.equals(Term.get("a"), Term.get("A")), 0);

    const { Negation } = await import("../../src/language/Negation.ts");
    const negated = Negation.make([Term.get("a")]);
    assert.ok(negated instanceof Negation);
    assert.equal(negated.term[0], Term.get("a"));

    const { Inheritance } = await import("../../src/language/Inheritance.ts");
    const statement = Inheritance.make(Term.get("A"), Term.get("B"));
    assert.equal(String(statement.toString()), "<A --> B>");
    const { ImageExt } = await import("../../src/language/ImageExt.ts");
    const image = new ImageExt([Term.get("P"), Term.get("A")], 1);
    assert.equal(String(image.toString()), "(/,A,P,_)");

    const { Variable } = await import("../../src/language/Variable.ts");
    const { Product } = await import("../../src/language/Product.ts");
    const { SetInt } = await import("../../src/language/SetInt.ts");
    const { Implication } = await import("../../src/language/Implication.ts");
    const { java } = await import("jree");
    const sharedVariable = new Variable("$1");
    const javaStringVariable = new Variable(new java.lang.String("$1"));
    const generatedVariableName = Variable.getName("$", 16);
    assert.equal(String(generatedVariableName), "$01");
    assert.equal(typeof generatedVariableName, "object");
    assert.equal(javaStringVariable.equals(sharedVariable), true);
    assert.equal(javaStringVariable.hashCode(), sharedVariable.hashCode());
    const condition = Inheritance.make(Product.make([sharedVariable, Term.get("sunglasses")]), Term.get("own"));
    const conclusion = Inheritance.make(sharedVariable, new SetInt(Term.get("aggressive")));
    const rule = Implication.make(condition, conclusion, 0);
    const ruleSentence = new Sentence(rule, ".", TruthValue.fromFrequencyConfidence(1.0, 0.9, parameters), stamp);
    assert.ok(ruleSentence.truth);
    assert.equal(ruleSentence.truth.confidence, 0.9);
    assert.equal(ruleSentence.term.subjectOrPredicateIsIndependentVar(), false);

    const { SetExt } = await import("../../src/language/SetExt.ts");
    const setMember = Term.get("setMember");
    const arrayConstructedSet = new SetExt([setMember]);
    assert.equal(arrayConstructedSet.term[0], setMember);

    const { Conjunction } = await import("../../src/language/Conjunction.ts");
    const conjunction = Conjunction.make([Term.get("a"), Term.get("b")]);
    assert.ok(conjunction instanceof Conjunction);
    const clonedConjunction = conjunction.clone();
    assert.equal(String(clonedConjunction.toString()), "(&&,a,b)");

    const { CompoundTerm } = await import("../../src/language/CompoundTerm.ts");
    const indexedTerm = Term.get("M1[1,0]");
    const rectangle = CompoundTerm.UpdateConvRectangle([indexedTerm]);
    assert.equal(rectangle.index_variable, "M1");
    assert.deepEqual(Array.from(rectangle.term_indices ?? []), [1, 1, 1, 0, 1, 1]);
});

test("compound factories flatten transient Java lists with native arrays", async () => {
    const { Term } = await import("../../src/language/Term.ts");
    const { Conjunction } = await import("../../src/language/Conjunction.ts");
    const { Disjunction } = await import("../../src/language/Disjunction.ts");
    const { IntersectionExt } = await import("../../src/language/IntersectionExt.ts");
    const { IntersectionInt } = await import("../../src/language/IntersectionInt.ts");

    const a = Term.get("factory-a");
    const b = Term.get("factory-b");
    const c = Term.get("factory-c");
    const names = (term: any) => term.term.map((component: any) => String(component.name()));

    const nestedConjunction = Conjunction.make([a, b]);
    if (nestedConjunction === null) throw new Error("conjunction factory returned null");
    const conjunction = Conjunction.make(nestedConjunction, c);
    assert.deepEqual(names(conjunction), ["factory-a", "factory-b", "factory-c"]);

    const nestedDisjunction = Disjunction.make([a, b]);
    if (nestedDisjunction === null) throw new Error("disjunction factory returned null");
    const disjunction = Disjunction.make(nestedDisjunction, c);
    assert.deepEqual(names(disjunction), ["factory-a", "factory-b", "factory-c"]);

    const nestedExtension = IntersectionExt.make([a, b]);
    if (nestedExtension === null) throw new Error("extension factory returned null");
    const extension = IntersectionExt.make(nestedExtension, c);
    assert.deepEqual(names(extension), ["factory-a", "factory-b", "factory-c"]);

    const nestedIntension = IntersectionInt.make([a, b]);
    if (nestedIntension === null) throw new Error("intension factory returned null");
    const intension = IntersectionInt.make(nestedIntension, c);
    assert.deepEqual(names(intension), ["factory-a", "factory-b", "factory-c"]);
});

test("Conjunction interval normalization preserves Java order and sums adjacent intervals", async () => {
    const { Term } = await import("../../src/language/Term.ts");
    const { Conjunction } = await import("../../src/language/Conjunction.ts");
    const { Interval } = await import("../../src/language/Interval.ts");

    const first = Term.get("interval-first");
    const second = Term.get("interval-second");
    const normalized = Conjunction.simplifyIntervals([
        first,
        new Interval(1n),
        new Interval(2n),
        second,
        new Interval(3n),
    ]);

    assert.equal(normalized.length, 4);
    assert.equal(normalized[0], first);
    assert.ok(normalized[1] instanceof Interval);
    assert.equal(Number((normalized[1] as IntervalType).time), 3);
    assert.equal(normalized[2], second);
    assert.ok(normalized[3] instanceof Interval);
    assert.equal(Number((normalized[3] as IntervalType).time), 3);
});

test("Sentence normalization keeps duplicate variables in traversal order", async () => {
    const { Sentence } = await import("../../src/entity/Sentence.ts");
    const { Product } = await import("../../src/language/Product.ts");
    const { Variable } = await import("../../src/language/Variable.ts");
    const { Term } = await import("../../src/language/Term.ts");
    const { TruthValue } = await import("../../src/entity/TruthValue.ts");
    const { Stamp } = await import("../../src/entity/Stamp.ts");
    const { Parameters } = await import("../../src/main/Parameters.ts");
    const { Tense } = await import("../../src/language/Tense.ts");

    const parameters = new Parameters();
    const content = Product.make([new Variable("$x"), Term.get("a"), new Variable("$x")]);
    const sentence = new Sentence(
        content,
        ".",
        TruthValue.fromFrequencyConfidence(1, 0.9, parameters),
        new Stamp(0, Tense.Present, new Stamp.BaseEntry(0, 1), parameters.DURATION),
    );
    const normalized = sentence.term as ProductType;
    const variableNames = normalized.term
        .filter((term): term is VariableType => term instanceof Variable)
        .map((variable) => String(variable.name()));

    assert.equal(normalized.isNormalized(), true);
    assert.deepEqual(variableNames, ["$1", "$1"]);
});

test("decimal perception coordinates remain conceptual like Java Term.get", async () => {
    const { Term } = await import("../../src/language/Term.ts");
    const indexedTerm = Term.get("M1[-1.0,0.0]");

    assert.equal(indexedTerm.term_indices, null);
    assert.equal(indexedTerm.index_variable, "M1");
});

test("countTermRecursively accepts a null accumulator like Java", async () => {
    const { Inheritance } = await import("../../src/language/Inheritance.ts");
    const { Term } = await import("../../src/language/Term.ts");

    const term = Inheritance.make(Term.get("subject"), Term.get("predicate"));
    const counts = term.countTermRecursively(null);

    assert.equal(counts.size(), 3);
    assert.equal(counts.get(term)?.valueOf(), 1);
    assert.equal(counts.get(Term.get("subject"))?.valueOf(), 1);
    assert.equal(counts.get(Term.get("predicate"))?.valueOf(), 1);
});

test("Concept.getBelief returns null when Java belief selection has no candidate", async () => {
    const { Nar } = await import("../../src/main/Nar.ts");
    const { BudgetValue } = await import("../../src/entity/BudgetValue.ts");
    const { Concept } = await import("../../src/entity/Concept.ts");
    const { DerivationContext } = await import("../../src/control/DerivationContext.ts");
    const { Sentence } = await import("../../src/entity/Sentence.ts");
    const { Stamp } = await import("../../src/entity/Stamp.ts");
    const { Task } = await import("../../src/entity/Task.ts");
    const { Term } = await import("../../src/language/Term.ts");
    const { Tense } = await import("../../src/language/Tense.ts");

    const nar = new Nar();
    const stamp = new Stamp(0n, Tense.Present, new Stamp.BaseEntry(0n, 1n), nar.narParameters.DURATION);
    const task = new Task(
        new Sentence(Term.get("query"), "?", null, stamp),
        new BudgetValue(0.5, 0.5, 0.5, nar.narParameters),
        Task.EnumType.INPUT,
    );
    const concept = new Concept(
        new BudgetValue(0.5, 0.5, 0.5, nar.narParameters),
        Term.get("empty-belief"),
        nar.memory,
    );
    const context = new DerivationContext(nar.memory, nar.narParameters, nar);

    assert.equal(concept.getBelief(context, task), null);
});

test("Sentence.getTruth preserves Java's nullable query accessor", async () => {
    const { Nar } = await import("../../src/main/Nar.ts");
    const { Sentence } = await import("../../src/entity/Sentence.ts");
    const { Stamp } = await import("../../src/entity/Stamp.ts");
    const { Term } = await import("../../src/language/Term.ts");
    const { Tense } = await import("../../src/language/Tense.ts");

    const nar = new Nar();
    const stamp = new Stamp(0n, Tense.Present, new Stamp.BaseEntry(0n, 1n), nar.narParameters.DURATION);
    const query = new Sentence(Term.get("query-accessor"), "?", null, stamp);

    assert.equal(query.getTruth(), null);
});

test("DerivationContext currentBeliefLink preserves Java null lifecycle", async () => {
    const { Nar } = await import("../../src/main/Nar.ts");
    const { DerivationContext } = await import("../../src/control/DerivationContext.ts");

    const nar = new Nar();
    const context = new DerivationContext(nar.memory, nar.narParameters, nar);

    assert.equal(context.getCurrentBeliefLink(), null);
    context.setCurrentBeliefLink(null);
    assert.equal(context.getCurrentBeliefLink(), null);
});

test("DerivationContext delayed execution state starts null and requires explicit registration", async () => {
    const { Nar } = await import("../../src/main/Nar.ts");
    const { DerivationContext } = await import("../../src/control/DerivationContext.ts");

    const nar = new Nar();
    const context = new DerivationContext(nar.memory, nar.narParameters, nar);

    assert.equal(context.currentTerm, null);
    assert.equal(context.currentConcept, null);
    assert.equal(context.currentTask, null);
    assert.equal(context.currentTaskLink, null);
    assert.equal(context.getCurrentConcept(), null);
    assert.throws(() => context.requireCurrentTerm());
    assert.throws(() => context.requireCurrentConcept());
    assert.throws(() => context.requireCurrentTask());
    assert.throws(() => context.requireCurrentTaskLink());
});

test("DerivationContext lazily builds and caches the Java newStamp", async () => {
    const { Nar } = await import("../../src/main/Nar.ts");
    const { DerivationContext } = await import("../../src/control/DerivationContext.ts");
    const { Stamp } = await import("../../src/entity/Stamp.ts");
    const { Tense } = await import("../../src/language/Tense.ts");

    const nar = new Nar();
    const context = new DerivationContext(nar.memory, nar.narParameters, nar);
    const first = new Stamp(0n, Tense.Present, new Stamp.BaseEntry(0n, 1n), nar.narParameters.DURATION);
    const second = new Stamp(1n, Tense.Present, new Stamp.BaseEntry(1n, 1n), nar.narParameters.DURATION);

    assert.equal(context.getNewStamp(), null);
    context.setTheNewStamp(first, second, 2n);
    assert.equal(context.getNewStamp(), null);

    const built = context.getTheNewStamp();
    assert.ok(built instanceof Stamp);
    assert.equal(context.getNewStamp(), built);
    assert.equal(context.newStampBuilder, null);
});

test("ProcessGoal executable precondition preserves Java default metadata", async () => {
    const { ProcessGoal } = await import("../../src/control/concept/ProcessGoal.ts");

    const metadata = new ProcessGoal.ExecutablePrecondition();

    assert.equal(metadata.bestOp, null);
    assert.equal(metadata.bestOp_truth, null);
    assert.equal(metadata.executable_precondition, null);
    assert.equal(metadata.bestOp_truthExp, 0);
    assert.equal(metadata.minTime, -1n);
    assert.equal(metadata.maxTime, -1n);
    assert.equal(metadata.timeOffset, 0);
    assert.equal(metadata.substitution, null);
});

test("ProcessGoal question staging preserves the emitted question with a native buffer", async () => {
    const { Nar } = await import("../../src/main/Nar.ts");
    const { BudgetValue } = await import("../../src/entity/BudgetValue.ts");
    const { DerivationContext } = await import("../../src/control/DerivationContext.ts");
    const { ProcessGoal } = await import("../../src/control/concept/ProcessGoal.ts");
    const { Sentence } = await import("../../src/entity/Sentence.ts");
    const { Stamp } = await import("../../src/entity/Stamp.ts");
    const { Task } = await import("../../src/entity/Task.ts");
    const { Term } = await import("../../src/language/Term.ts");
    const { Tense } = await import("../../src/language/Tense.ts");

    const nar = new Nar();
    try {
        nar.narParameters.QUESTION_GENERATION_ON_DECISION_MAKING = true;
        nar.narParameters.HOW_QUESTION_GENERATION_ON_DECISION_MAKING = false;
        const context = new DerivationContext(nar.memory, nar.narParameters, nar);
        const stamp = new Stamp(0n, Tense.Present, new Stamp.BaseEntry(0n, 1n), nar.narParameters.DURATION);
        const task = new Task(
            new Sentence(Term.get("native-question-goal"), "!", null, stamp),
            new BudgetValue(0.5, 0.5, 0.5, nar.narParameters),
            Task.EnumType.INPUT,
        );
        const emitted: Array<InstanceType<typeof Sentence>> = [];
        (context as unknown as {
            singlePremiseTask: (
                sentence: InstanceType<typeof Sentence>,
                budget: InstanceType<typeof BudgetValue>,
            ) => boolean;
        }).singlePremiseTask = (sentence) => {
            emitted.push(sentence);
            return true;
        };

        ProcessGoal.questionFromGoal(task, context);

        assert.equal(emitted.length, 1);
        assert.equal(emitted[0].punctuation, "?");
        assert.equal(String(emitted[0].term.name()), "native-question-goal");
    } finally {
        nar.stop();
    }
});

test("ProcessGoal keeps the native general-precondition buffer iterable", async () => {
    const { Nar } = await import("../../src/main/Nar.ts");
    const { BudgetValue } = await import("../../src/entity/BudgetValue.ts");
    const { Concept } = await import("../../src/entity/Concept.ts");
    const { DerivationContext } = await import("../../src/control/DerivationContext.ts");
    const { ProcessGoal } = await import("../../src/control/concept/ProcessGoal.ts");
    const { Sentence } = await import("../../src/entity/Sentence.ts");
    const { Stamp } = await import("../../src/entity/Stamp.ts");
    const { Task } = await import("../../src/entity/Task.ts");
    const { Term } = await import("../../src/language/Term.ts");
    const { TruthValue } = await import("../../src/entity/TruthValue.ts");
    const { Tense } = await import("../../src/language/Tense.ts");

    const nar = new Nar();
    try {
        const context = new DerivationContext(nar.memory, nar.narParameters, nar);
        const concept = new Concept(
            new BudgetValue(0.5, 0.5, 0.5, nar.narParameters),
            Term.get("native-general-preconditions"),
            nar.memory,
        );
        const stamp = new Stamp(0n, Tense.Present, new Stamp.BaseEntry(0n, 1n), nar.narParameters.DURATION);
        const sentence = new Sentence(
            Term.get("native-general-preconditions"),
            "!",
            TruthValue.fromFrequencyConfidence(1, 0.9, nar.narParameters),
            stamp,
        );
        const task = new Task(
            sentence,
            new BudgetValue(0.5, 0.5, 0.5, nar.narParameters),
            Task.EnumType.INPUT,
        );

        assert.doesNotThrow(() => ProcessGoal.bestReactionForGoal(concept, context, sentence, task));
    } finally {
        nar.stop();
    }
});

test("FunctionOperator emits native array feedback through Operator.call", async () => {
    const { Add } = await import("../../src/operator/misc/Add.ts");
    const { Nar } = await import("../../src/main/Nar.ts");
    const { Operation } = await import("../../src/operator/Operation.ts");
    const { Term } = await import("../../src/language/Term.ts");
    const { Variable } = await import("../../src/language/Variable.ts");

    const nar = new Nar();
    try {
        const add = new Add();
        const makeOperation = () => Operation.make(add, [
            Term.SELF,
            Term.get("1"),
            Term.get("2"),
            new Variable("$1"),
        ], true);
        const operation = makeOperation();
        const directFeedback = (add as any).execute(
            operation,
            operation.getArguments().term,
            nar.memory,
            nar,
        );
        assert.ok(Array.isArray(directFeedback));
        assert.equal(directFeedback.length, 1);
        assert.equal(add.call(makeOperation(), nar.memory, nar), true);
    } finally {
        nar.stop();
    }
});

test("Want emits native array feedback through Operator.call", async () => {
    const { Want } = await import("../../src/operator/mental/Want.ts");
    const { Nar } = await import("../../src/main/Nar.ts");
    const { Operation } = await import("../../src/operator/Operation.ts");
    const { Term } = await import("../../src/language/Term.ts");

    const nar = new Nar();
    try {
        const want = new Want();
        const makeOperation = () => Operation.make(want, [
            Term.SELF,
            Term.get("rain"),
            Term.get("TRUE"),
        ], true);
        const operation = makeOperation();
        const directFeedback = (want as any).execute(
            operation,
            operation.getArguments().term,
            nar.memory,
            nar,
        );
        assert.ok(Array.isArray(directFeedback));
        assert.equal(directFeedback.length, 1);
        assert.equal(want.call(makeOperation(), nar.memory, nar), true);
    } finally {
        nar.stop();
    }
});

test("Evaluate emits native array feedback through Operator.call", async () => {
    const { Evaluate } = await import("../../src/operator/mental/Evaluate.ts");
    const { Nar } = await import("../../src/main/Nar.ts");
    const { Operation } = await import("../../src/operator/Operation.ts");
    const { Term } = await import("../../src/language/Term.ts");

    const nar = new Nar();
    try {
        const evaluate = new Evaluate();
        const makeOperation = () => Operation.make(evaluate, [
            Term.SELF,
            Term.get("cat"),
        ], true);
        const operation = makeOperation();
        const directFeedback = (evaluate as any).execute(
            operation,
            operation.getArguments().term,
            nar.memory,
            nar,
        );
        assert.ok(Array.isArray(directFeedback));
        assert.equal(directFeedback.length, 1);
        assert.equal(evaluate.call(makeOperation(), nar.memory, nar), true);
    } finally {
        nar.stop();
    }
});

test("set factories use native equality-aware intersection and difference", async () => {
    const { DifferenceExt } = await import("../../src/language/DifferenceExt.ts");
    const { DifferenceInt } = await import("../../src/language/DifferenceInt.ts");
    const { IntersectionExt } = await import("../../src/language/IntersectionExt.ts");
    const { IntersectionInt } = await import("../../src/language/IntersectionInt.ts");
    const { SetExt } = await import("../../src/language/SetExt.ts");
    const { SetInt } = await import("../../src/language/SetInt.ts");
    const { Term } = await import("../../src/language/Term.ts");

    const a = Term.get("native-set-a");
    const b = Term.get("native-set-b");
    const equalButDistinctB = b.clone();
    const extLeft = new SetExt([a, b]);
    const extRight = new SetExt([equalButDistinctB]);
    const intLeft = new SetInt([a, b]);
    const intRight = new SetInt([equalButDistinctB]);

    const componentNames = (result: unknown): string[] => {
        assert.ok(result && typeof result === "object" && "term" in result);
        const terms = (result as { term: Array<{ name(): unknown }> }).term;
        return terms.map((term) => String(term.name()));
    };
    assert.deepEqual(componentNames(DifferenceExt.make(extLeft, extRight)), ["native-set-a"]);
    assert.deepEqual(componentNames(IntersectionExt.make(extLeft, extRight)), ["native-set-b"]);
    assert.deepEqual(componentNames(DifferenceInt.make(intLeft, intRight)), ["native-set-a"]);
    assert.deepEqual(componentNames(IntersectionInt.make(intLeft, intRight)), ["native-set-b"]);
});

test("Stamp tense lookup uses Java temporal order constants", async () => {
    const { Stamp } = await import("../../src/entity/Stamp.ts");
    const { Tense } = await import("../../src/language/Tense.ts");
    const { Symbols } = await import("../../src/io/Symbols.ts");

    const stamp = new Stamp(0, Tense.Present, new Stamp.BaseEntry(0, 1), 2);
    stamp.setOccurrenceTime(10);

    assert.equal(String(stamp.getTense(20, 2)), Symbols.TENSE_PAST);
    assert.equal(String(stamp.getTense(0, 2)), Symbols.TENSE_FUTURE);
    assert.equal(String(stamp.getTense(10, 2)), Symbols.TENSE_PRESENT);
});

test("Stamp long time arithmetic preserves bigint inputs at the boundary", async () => {
    const { Stamp } = await import("../../src/entity/Stamp.ts");
    const { Tense } = await import("../../src/language/Tense.ts");

    const past = new Stamp(10n, Tense.Past, new Stamp.BaseEntry(0n, 1n), 2);
    const future = new Stamp(10n, Tense.Future, new Stamp.BaseEntry(1n, 1n), 2);

    assert.equal(past.getCreationTime(), 10n);
    assert.equal(past.getOccurrenceTime(), 8n);
    assert.equal(future.getOccurrenceTime(), 12n);
});

test("mixed runtime long values preserve temporal projection and interval normalization", async () => {
    const { Parameters } = await import("../../src/main/Parameters.ts");
    const { TruthFunctions } = await import("../../src/inference/TruthFunctions.ts");
    const { Sentence } = await import("../../src/entity/Sentence.ts");
    const { Stamp } = await import("../../src/entity/Stamp.ts");
    const { TruthValue } = await import("../../src/entity/TruthValue.ts");
    const { Term } = await import("../../src/language/Term.ts");
    const { Interval } = await import("../../src/language/Interval.ts");
    const { Conjunction } = await import("../../src/language/Conjunction.ts");
    const { TemporalRules } = await import("../../src/inference/TemporalRules.ts");
    const { Tense } = await import("../../src/language/Tense.ts");

    const parameters = new Parameters();
    const projection = TruthFunctions.temporalProjection(10n, 12, 10n, parameters);
    assert.equal(Number.isFinite(Number(projection)), true);

    const content = Conjunction.make([Term.get("a"), new Interval(1n)], TemporalRules.ORDER_FORWARD);
    assert.ok(content instanceof Conjunction);
    const stamp = new Stamp(10, Tense.Present, new Stamp.BaseEntry(0, 1), parameters.DURATION);
    new Sentence(content, ".", TruthValue.fromFrequencyConfidence(0.8, 0.7, parameters), stamp);
    assert.equal(stamp.getOccurrenceTime(), 9);
});

test("Nar explicit long overload accepts JavaScript number and bigint values", async () => {
    const { Nar } = await import("../../src/main/Nar.ts");

    assert.equal(new Nar(0n).memory.narId, 0n);
    assert.equal(new Nar(7).memory.narId, 7);
});

test("CompoundTerm equality preserves Java case-sensitive key identity", async () => {
    const { java } = await import("jree");
    const { Nar } = await import("../../src/main/Nar.ts");
    const { Narsese } = await import("../../src/io/Narsese.ts");
    const { BudgetValue } = await import("../../src/entity/BudgetValue.ts");
    const { Parameters } = await import("../../src/main/Parameters.ts");

    const nar = new Nar(304);
    const parser = new Narsese(nar);
    const lower = parser.parseTerm(new java.lang.String(
        "<cat --> (/,(/,REPRESENT,_,<(*,CAT,FISH) --> FOOD>),_,eat,fish)>",
    ));
    const upper = parser.parseTerm(new java.lang.String(
        "<CAT --> (/,(/,REPRESENT,_,<(*,CAT,FISH) --> FOOD>),_,eat,fish)>",
    ));
    assert.ok(lower);
    assert.ok(upper);

    assert.equal(lower.equals(upper), false);
    assert.notEqual(lower.hashCode(), upper.hashCode());

    const budget = new BudgetValue(0.9, 0.9, 0.9, new Parameters());
    const lowerConcept = nar.memory.conceptualize(budget, lower);
    const upperConcept = nar.memory.conceptualize(budget, upper);
    assert.notEqual(lowerConcept, upperConcept);
    assert.equal(nar.memory.concepts.size(), 2);
});

test("Concept long text preserves Java field labels", async () => {
    const { Nar } = await import("../../src/main/Nar.ts");
    const { Term } = await import("../../src/language/Term.ts");
    const { BudgetValue } = await import("../../src/entity/BudgetValue.ts");
    const { Parameters } = await import("../../src/main/Parameters.ts");

    const nar = new Nar();
    const concept = nar.memory.conceptualize(
        new BudgetValue(0.9, 0.9, 0.9, new Parameters()),
        Term.get("concept"),
    );
    const text = String(concept.toStringLong());

    assert.match(text, /termLinks/);
    assert.match(text, /taskLinks/);
    assert.match(text, /beliefs/);
});

test("Narsese truth parsing preserves Java Float.parseFloat boundaries", async () => {
    const { java } = await import("jree");
    const { Nar } = await import("../../src/main/Nar.ts");
    const { Narsese } = await import("../../src/io/Narsese.ts");

    const nar = new Nar(304);
    const task = new Narsese(nar).parseTask(new java.lang.String(
        "<heated --> pliable>. %1.00;0.90%",
    ));
    assert.ok(task.sentence.truth);

    assert.equal(task.sentence.truth.frequency, Math.fround(1.0));
    assert.equal(task.sentence.truth.confidence, Math.fround(0.9));
    assert.notEqual(task.sentence.truth.confidence, 0.9);
});
