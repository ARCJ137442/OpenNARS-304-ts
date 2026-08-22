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
        ["^lighter", new NullOperator("^lighter")],
        ["^reshape", new NullOperator("^reshape")],
    ]);
    const parser = new Narsese({
        getOperator(name: unknown) {
            return operators.get(String(name)) ?? null;
        },
    } as any);
    const implication = parser.parseTerm(new java.lang.String(
        `<<${variable} --> [unscrewing]> =/> (&/,<(*,${variable},plastic) --> made_of>,(^lighter,{SELF},${variable}),(^reshape,{SELF},${variable}))>`,
    ));
    const taskTerm = parser.parseTerm(new java.lang.String("<toothbrush --> [unscrewing]>"));
    const unified: any[] = [implication, taskTerm];

    assert.equal(Variables.unify(
        new java.util.Random(1),
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
