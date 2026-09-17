import assert from "node:assert/strict";
import test from "node:test";

test("变量统一会替换操作参数并保留 Operation 运行时类型", async () => {
    const { java } = await import("jree");
    const { Narsese } = await import("../../src/io/Narsese.ts");
    const { NullOperator } = await import("../../src/operator/NullOperator.ts");
    const { Operation } = await import("../../src/operator/Operation.ts");
    const { Symbols } = await import("../../src/io/Symbols.ts");
    const { Variables } = await import("../../src/language/Variables.ts");

    const variable = String.fromCharCode(36) + "1";
    const operators = new Map([
        ["^lighter", new NullOperator(new java.lang.String("^lighter"))],
        ["^reshape", new NullOperator(new java.lang.String("^reshape"))],
    ]);
    const parser = new Narsese({
        getOperator(name: unknown) {
            return operators.get(String(name)) ?? null;
        },
    } as any);
    const implication = parser.parseTerm(new java.lang.String(
        `<<${variable} --> [unscrewing]> =/> (&/,<(*,${variable},plastic) --> made_of>,(^lighter,{SELF},${variable}),(^reshape,{SELF},${variable}))>`,
    )) as import("../../src/language/Statement.ts").Statement | null;
    const taskTerm = parser.parseTerm(new java.lang.String("<toothbrush --> [unscrewing]>"));
    if (implication === null || taskTerm === null)
        throw new Error("Expected variable substitution terms.");
    const unified: any[] = [implication, taskTerm];

    assert.equal(Variables.unify(
        new java.util.Random(1n),
        Symbols.VAR_INDEPENDENT,
        implication.getSubject(),
        taskTerm,
        unified,
    ), true);

    const result = unified[0];
    const operation = result.getPredicate().term[1];
    assert.ok(operation instanceof Operation);
    assert.equal(String(operation.getArguments().term[1].name()), "toothbrush");
    assert.equal(String(result.getPredicate().name()).includes(variable), false);
});

test("common variable propagation matches Java for commutative unification", async () => {
    const { java } = await import("jree");
    const { Nar } = await import("../../src/main/Nar.ts");
    const { Narsese } = await import("../../src/io/Narsese.ts");
    const { Symbols } = await import("../../src/io/Symbols.ts");
    const { Variables } = await import("../../src/language/Variables.ts");

    const nar = new Nar(304);
    const parser = new Narsese(nar);
    const asym = parser.parseTerm(new java.lang.String(
        "<(|,$1,[unscrewing]) --> (&,(|,#2,$1),(|,$1,object))>",
    )) as any;
    const sym = parser.parseTerm(new java.lang.String(
        "<(&,(|,#1,$2),(|,$2,object)) <-> (|,$2,[unscrewing])>",
    )) as any;
    const compound = [asym, sym] as any[];

    assert.equal(
        Variables.unify(
            new java.util.Random(0n),
            Symbols.VAR_INDEPENDENT,
            asym.getPredicate(),
            sym.getSubject(),
            compound,
        ),
        true,
    );
    assert.equal(
        String(compound[0].name()),
        "<(|,[unscrewing],object) --> (&,(|,#1#2$,object),object)>",
    );
    assert.equal(
        String(compound[1].name()),
        "<(&,(|,#1#2$,object),object) <-> (|,[unscrewing],object)>",
    );
});

test("commutative unification does not reuse one matched operand index", async () => {
    const { java } = await import("jree");
    const { Nar } = await import("../../src/main/Nar.ts");
    const { Narsese } = await import("../../src/io/Narsese.ts");
    const { Symbols } = await import("../../src/io/Symbols.ts");
    const { Variables } = await import("../../src/language/Variables.ts");

    const parser = new Narsese(new Nar());
    const left = parser.parseTerm(new java.lang.String("(|,a,a)"));
    const right = parser.parseTerm(new java.lang.String("(|,a,b)"));
    assert.ok(left);
    assert.ok(right);

    assert.equal(
        Variables.unify(new java.util.Random(1n), Symbols.VAR_INDEPENDENT, left, right, [left, right]),
        false,
    );
});
