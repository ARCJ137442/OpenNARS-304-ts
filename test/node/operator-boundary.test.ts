import assert from "node:assert/strict";
import test from "node:test";
import { java } from "jree";
import { Term } from "../../src/language/Term.ts";
import { Add } from "../../src/operator/misc/Add.ts";
import { Count } from "../../src/operator/misc/Count.ts";
import { Reflect as ReflectOperator } from "../../src/operator/misc/Reflect.ts";
import { NullOperator } from "../../src/operator/NullOperator.ts";
import { Operation } from "../../src/operator/Operation.ts";
import {
    JavaIllegalArgumentException,
    JavaIllegalStateException,
} from "../../src/runtime/jree-compat.ts";

class CountProbe extends Count {
    public evaluate(args: Term[]): Term | null {
        return this.function(null as never, args);
    }
}

test("operator constructors preserve Java string boundaries", () => {
    assert.equal(String(new Add().name()), "^add");
    assert.equal(String(new Count().name()), "^count");
    assert.equal(String(new NullOperator().name()), "^sample");
    assert.equal(String(new NullOperator("^native").name()), "^native");
});

test("Reflect.sop preserves the translated Java varargs-array overload", () => {
    const reflected = ReflectOperator.sop("inheritance", [Term.get(new java.lang.String("a"))]);

    assert.equal(String(reflected.name()), "<(*,a) --> inheritance>");
});

test("Count preserves Java's invalid-input exception contract", () => {
    const count = new CountProbe();

    assert.throws(() => count.evaluate([]), (error: unknown) => {
        assert.ok(error instanceof JavaIllegalStateException);
        assert.ok(error instanceof java.lang.IllegalStateException);
        assert.equal(String((error as { getMessage?: () => unknown }).getMessage?.()),
            "Requires 1 SetExt or SetInt argument");
        return true;
    });

    assert.throws(() => count.evaluate([Term.get("a")]), (error: unknown) => {
        assert.ok(error instanceof JavaIllegalStateException);
        return true;
    });
});

test("Operation and NullOperator preserve Java invalid-argument boundaries", () => {
    const operationFactory = Operation.make as unknown as (...args: unknown[]) => unknown;

    assert.throws(() => operationFactory(Term.get("a")), (error: unknown) => {
        assert.ok(error instanceof JavaIllegalArgumentException);
        assert.ok(error instanceof java.lang.IllegalArgumentException);
        assert.equal(String((error as { getMessage?: () => unknown }).getMessage?.()),
            "Invalid number of arguments");
        return true;
    });

    assert.throws(() => new (NullOperator as unknown as new (...args: unknown[]) => NullOperator)(
        "^native",
        "unexpected",
    ), (error: unknown) => {
        assert.ok(error instanceof JavaIllegalArgumentException);
        assert.ok(error instanceof java.lang.IllegalArgumentException);
        assert.equal(String((error as { getMessage?: () => unknown }).getMessage?.()),
            "Invalid number of arguments");
        return true;
    });
});
