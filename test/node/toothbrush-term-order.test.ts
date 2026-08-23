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

test("scoped variable ordering uses Java code-unit order for commutative intersections", async () => {
    const { java } = await import("jree");
    const { Nar } = await import("../../src/main/Nar.ts");
    const { Narsese } = await import("../../src/io/Narsese.ts");
    const { IntersectionInt } = await import("../../src/language/IntersectionInt.ts");

    const parser = new Narsese(new Nar());
    const task = parser.parseTask(new java.lang.String(
        "<(|,#1,#2,cup) --> (|,#1,[unscrewing],cup)>.",
    ));
    const belief = parser.parseTask(new java.lang.String(
        "<(|,#1,#2,cup) --> (|,#1,#2,[heated])>.",
    ));
    const taskVariable = task.sentence.term.getPredicate().term[0];
    const beliefVariable = belief.sentence.term.getPredicate().term[0];

    assert.ok(taskVariable.compareTo(beliefVariable) > 0);
    assert.ok(beliefVariable.compareTo(taskVariable) < 0);
    assert.equal(
        String(IntersectionInt.make(
            task.sentence.term.getPredicate(),
            belief.sentence.term.getPredicate(),
        ).name()),
        "(|,#1,#1,#2,[heated],[unscrewing],cup)",
    );
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

test("novel-task Bag preserves Java float level selection at the 0.8 boundary", async () => {
    const { Bag } = await import("../../src/storage/Bag.ts");
    const { Nar } = await import("../../src/main/Nar.ts");
    const { Narsese } = await import("../../src/io/Narsese.ts");
    const { java } = await import("jree");

    const nar = new Nar();
    const parser = new Narsese(nar);
    const fact = parser.parseTask(new java.lang.String("<toothbrush --> object>."));
    const goal = parser.parseTask(new java.lang.String(
        "(&&,<#1 --> [unscrewing]>,<#1 --> object>)!",
    ));
    const bag = new Bag(100, 1000, nar.narParameters);
    bag.putIn(fact);
    bag.putIn(goal);

    assert.equal(
        String(bag.takeOut().sentence.term.name()),
        "(&&,<#1 --> [unscrewing]>,<#1 --> object>)",
    );
});

test("utility float accumulators narrow at each Java assignment boundary", async () => {
    const { UtilityFunctions } = await import("../../src/inference/UtilityFunctions.ts");

    assert.equal(
        UtilityFunctions.or(Math.fround(0.237), Math.fround(0.379314035)),
        Math.fround(1 - Math.fround(Math.fround(1 - Math.fround(0.237)) * Math.fround(1 - Math.fround(0.379314035)))),
    );
    assert.equal(
        UtilityFunctions.aveAri(Math.fround(0.10480499), Math.fround(0.001283688)),
        Math.fround((Math.fround(0.10480499) + Math.fround(0.001283688)) / 2),
    );
});

test("forgetting narrows Java float parameters before the exponent boundary", async () => {
    const { BudgetFunctions } = await import("../../src/inference/BudgetFunctions.ts");
    const { BudgetValue } = await import("../../src/entity/BudgetValue.ts");
    const { Parameters } = await import("../../src/main/Parameters.ts");

    const budget = new BudgetValue(
        Math.fround(0.240752711892128),
        Math.fround(0.10480499267578125),
        Math.fround(0.7899999618530273),
        new Parameters(),
    );
    BudgetFunctions.applyForgetting(budget, 10, 0.3);

    const quality = Math.fround(Math.fround(0.7899999618530273) * Math.fround(0.3));
    const priority = Math.fround(Math.fround(0.240752711892128) - quality);
    const expected = Math.fround(quality + priority * Math.pow(
        Math.fround(0.10480499267578125),
        1 / Math.fround(Math.fround(10) * priority),
    ));
    assert.equal(budget.getPriority(), expected);
    assert.equal(budget.getPriority(), Math.fround(0.2370000034570694));
});

test("derived task applies Java float leak operands before multiplication", async () => {
    const { java } = await import("jree");
    const { Nar } = await import("../../src/main/Nar.ts");
    const { Narsese } = await import("../../src/io/Narsese.ts");
    const { DerivationContext } = await import("../../src/control/DerivationContext.ts");

    const nar = new Nar(304);
    const task = new Narsese(nar).parseTask(new java.lang.String(
        "<toothbrush --> object>.",
    ));
    task.getBudget().setPriority(Math.fround(0.4));
    task.getBudget().setDurability(Math.fround(0.1));

    const context = new DerivationContext(nar.memory, nar.narParameters, nar);
    assert.equal(context.derivedTask(task, false, true, true, false), true);
    assert.equal(
        task.getBudget().getPriority(),
        Math.fround(Math.fround(0.4) * Math.fround(0.4)),
    );
    assert.equal(
        task.getBudget().getDurability(),
        Math.fround(Math.fround(0.1) * Math.fround(0.4)),
    );
});

test("mental operation feedback does not create a Java operation frame", async () => {
    const { java } = await import("jree");
    const { Nar } = await import("../../src/main/Nar.ts");
    const { Narsese } = await import("../../src/io/Narsese.ts");
    const { ProcessJudgment } = await import("../../src/control/concept/ProcessJudgment.ts");
    const { DerivationContext } = await import("../../src/control/DerivationContext.ts");

    const nar = new Nar();
    const task = new Narsese(nar).parseTask(new java.lang.String(
        "(^want,{SELF},toothbrush,TRUE).",
    ));
    task.sentence.stamp.setOccurrenceTime(0);
    const priority = task.getPriority();

    assert.equal(task.isInput(), true);
    assert.equal(task.sentence.isEternal(), false);
    const context = new DerivationContext(nar.memory, nar.narParameters, nar);
    ProcessJudgment.handleOperationFeedback(task, context);

    assert.equal(task.getPriority(), priority);
    assert.equal(nar.memory.recent_operations.size(), 0);
});

test("sentence rendering preserves Java conceptual decimal visual indices", async () => {
    const { java } = await import("jree");
    const { Nar } = await import("../../src/main/Nar.ts");
    const { Narsese } = await import("../../src/io/Narsese.ts");

    const nar = new Nar();
    const task = new Narsese(nar).parseTask(new java.lang.String(
        "<{M1[-1.0,0.0]} --> [BRIGHT]>. ",
    ));

    assert.match(String(task.sentence.toString(nar, true)), /\{M1\[-1\.0,0\.0\]\}/);
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
