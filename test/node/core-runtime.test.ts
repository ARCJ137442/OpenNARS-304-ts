import assert from "node:assert/strict";
import test from "node:test";

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
    assert.equal(negated instanceof Negation, true);
    assert.equal((negated as InstanceType<typeof Negation>).term[0], Term.get("a"));

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
    assert.equal(ruleSentence.truth.confidence, 0.9);
    assert.equal(ruleSentence.term.subjectOrPredicateIsIndependentVar(), false);

    const { SetExt } = await import("../../src/language/SetExt.ts");
    const setMember = Term.get("setMember");
    const arrayConstructedSet = new SetExt([setMember]);
    assert.equal(arrayConstructedSet.term[0], setMember);

    const { Conjunction } = await import("../../src/language/Conjunction.ts");
    const conjunction = Conjunction.make([Term.get("a"), Term.get("b")]) as InstanceType<typeof Conjunction>;
    const clonedConjunction = conjunction.clone();
    assert.equal(String(clonedConjunction.toString()), "(&&,a,b)");

    const { CompoundTerm } = await import("../../src/language/CompoundTerm.ts");
    const indexedTerm = Term.get("M1[1,0]");
    const rectangle = CompoundTerm.UpdateConvRectangle([indexedTerm]);
    assert.equal(rectangle.index_variable, "M1");
    assert.deepEqual(Array.from(rectangle.term_indices ?? []), [1, 1, 1, 0, 1, 1]);
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

test("Nar explicit long overload accepts JavaScript number and bigint values", async () => {
    const { Nar } = await import("../../src/main/Nar.ts");

    assert.equal(new Nar(0n).memory.narId, 0n);
    assert.equal(new Nar(7 as never).memory.narId, 7);
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

    assert.equal(task.sentence.truth.frequency, Math.fround(1.0));
    assert.equal(task.sentence.truth.confidence, Math.fround(0.9));
    assert.notEqual(task.sentence.truth.confidence, 0.9);
});
