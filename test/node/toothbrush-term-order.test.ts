import assert from "node:assert/strict";
import test from "node:test";

test("commutative conjunction follows Java term ordering for toothbrush goal", async () => {
    const { java } = await import("jree");
    const { Nar } = await import("../../src/main/Nar.ts");
    const { Narsese } = await import("../../src/io/Narsese.ts");

    const parser = new Narsese(new Nar());
    const task = parser.parseTask(new java.lang.String(
        "(&&,<#1 --> object>,<#1 --> [unscrewing]>)!",
    ));
    const term = task.sentence.term as any;

    assert.equal(
        String(term.name()),
        "(&&,<#1 --> [unscrewing]>,<#1 --> object>)",
    );
    assert.ok(term.term[0].compareTo(term.term[1]) < 0);
    assert.notEqual(Number.isNaN(term.term[0].compareTo(term.term[1])), true);
});

test("default NAR loads the internal experience plugin used by Java toothbrush", async () => {
    const { InternalExperience } = await import("../../src/plugin/mental/InternalExperience.ts");
    const { Emotions } = await import("../../src/plugin/mental/Emotions.ts");
    const { Nar } = await import("../../src/main/Nar.ts");

    const nar = new Nar();

    assert.ok(nar.memory.internalExperience instanceof InternalExperience);
    assert.ok(nar.memory.emotion instanceof Emotions);
    assert.equal(nar.memory.emotion.happy(), 0.5);
    assert.equal(nar.memory.emotion.busy(), 0.5);
    assert.equal(InternalExperience.enabled, true);
});

test("tensional sets initialize Java-compatible compound complexity", async () => {
    const { Term } = await import("../../src/language/Term.ts");
    const { SetInt } = await import("../../src/language/SetInt.ts");

    const set = SetInt.make(new Term("busy"));

    assert.equal(set.getComplexity(), 2);
});

test("budget fields narrow at Java float write boundaries", async () => {
    const { BudgetValue } = await import("../../src/entity/BudgetValue.ts");
    const { Parameters } = await import("../../src/main/Parameters.ts");

    const budget = new BudgetValue(0.09, 0.09, 0.09, new Parameters());

    assert.equal(budget.getPriority(), Math.fround(0.09));
    assert.equal(budget.getDurability(), Math.fround(0.09));
    assert.equal(budget.getQuality(), Math.fround(0.09));
    budget.setPriority(0.17);
    assert.equal(budget.getPriority(), Math.fround(0.17));
});

test("compound-condition TermLink overload preserves Java's leading condition index", async () => {
    const { java } = await import("jree");
    const { Nar } = await import("../../src/main/Nar.ts");
    const { Narsese } = await import("../../src/io/Narsese.ts");
    const { TermLink } = await import("../../src/entity/TermLink.ts");

    const parser = new Narsese(new Nar());
    const target = parser.parseTerm(new java.lang.String("<$1 --> [pliable]>"));
    const link = new TermLink(TermLink.COMPOUND_CONDITION, target, 0, 1);

    assert.deepEqual(Array.from(link.index), [0, 0, 1]);
});

test("conditional operation unification substitutes the grounded toothbrush term", async () => {
    const { java } = await import("jree");
    const { Nar } = await import("../../src/main/Nar.ts");
    const { Narsese } = await import("../../src/io/Narsese.ts");
    const { Symbols } = await import("../../src/io/Symbols.ts");
    const { Variables } = await import("../../src/language/Variables.ts");

    const nar = new Nar();
    const parser = new Narsese(nar);
    const premise = parser.parseTerm(new java.lang.String(
        "<(&/,(^lighter,{SELF},$1),(^reshape,{SELF},$1)) =/> <$1 --> [hardened]>>",
    ));
    const operation = parser.parseTerm(new java.lang.String(
        "(^lighter,{SELF},toothbrush)",
    ));
    const component = (premise as any).getSubject().term[0];
    const unified = [premise, operation] as any[];

    assert.equal(
        Variables.unify(
            nar.memory.randomNumber,
            Symbols.VAR_INDEPENDENT,
            component,
            operation,
            unified,
        ),
        true,
    );
    assert.equal(
        String((unified[0] as any).toString()),
        "<(&/,(^lighter,{SELF},toothbrush),(^reshape,{SELF},toothbrush)) =/> <toothbrush --> [hardened]>>",
    );
});

test("grounded toothbrush operation produces Java-style execution feedback", async () => {
    const { java } = await import("jree");
    const { Nar } = await import("../../src/main/Nar.ts");
    const { Narsese } = await import("../../src/io/Narsese.ts");
    const { Events } = await import("../../src/io/events/Events.ts");

    const nar = new Nar(304);
    const parser = new Narsese(nar);
    const task = parser.parseTask(new java.lang.String(
        "(^lighter,{SELF},toothbrush)!",
    ));
    const executed: string[] = [];
    nar.on(Events.TaskAdd.class, {
        event(_channel: unknown, args: unknown[]) {
            if (String(args[1]) === "Executed") {
                executed.push(String((args[0] as any).sentence.toString(nar, true)));
            }
        },
    });

    const operation = task.sentence.term as any;
    assert.equal(operation.getOperator().call(operation, nar.memory, nar), true);
    assert.equal(executed.length, 1);
    assert.ok(executed[0].startsWith("(^lighter,{SELF},toothbrush)."));
});
