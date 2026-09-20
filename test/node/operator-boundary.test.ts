import assert from "node:assert/strict";
import test from "node:test";
import { java } from "jree";
import { Term } from "../../src/language/Term.ts";
import { Anticipate } from "../../src/operator/mental/Anticipate.ts";
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

class AddProbe extends Add {
    public evaluate(args: Term[]): Term | null {
        return this.function(null as never, args);
    }
}

class ReflectProbe extends ReflectOperator {
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

test("FunctionOperator preserves Java arity and overload exception contracts", () => {
    const add = new Add();
    const execute = (add as unknown as {
        execute: (...args: unknown[]) => unknown;
    }).execute.bind(add);

    assert.throws(() => execute(null, [], null, null), (error: unknown) => {
        assert.ok(error instanceof JavaIllegalStateException);
        assert.ok(error instanceof java.lang.IllegalStateException);
        assert.equal(String((error as { getMessage?: () => unknown }).getMessage?.()),
            "Requires at least 1 arguments");
        return true;
    });

    assert.throws(() => execute(null, [Term.get("a"), Term.get("b")], null, null),
        (error: unknown) => {
            assert.ok(error instanceof JavaIllegalStateException);
            assert.ok(error instanceof java.lang.IllegalStateException);
            assert.equal(String((error as { getMessage?: () => unknown }).getMessage?.()),
                "Requires at least 2 arguments");
            return true;
        });

    const equals = (add as unknown as { equals: (...args: unknown[]) => unknown }).equals.bind(add);
    assert.throws(() => equals(), (error: unknown) => {
        assert.ok(error instanceof JavaIllegalArgumentException);
        assert.ok(error instanceof java.lang.IllegalArgumentException);
        assert.equal(String((error as { getMessage?: () => unknown }).getMessage?.()),
            "Invalid number of arguments");
        return true;
    });
});

test("Add preserves Java argument and result contracts", () => {
    const add = new AddProbe();

    assert.throws(() => add.evaluate([]), (error: unknown) => {
        assert.ok(error instanceof JavaIllegalStateException);
        assert.ok(error instanceof java.lang.IllegalStateException);
        assert.equal(String((error as { getMessage?: () => unknown }).getMessage?.()),
            "Requires 2 arguments");
        return true;
    });

    assert.throws(() => add.evaluate([Term.get("a"), Term.get("2")]), (error: unknown) => {
        assert.ok(error instanceof JavaIllegalArgumentException);
        assert.ok(error instanceof java.lang.IllegalArgumentException);
        assert.equal(String((error as { getMessage?: () => unknown }).getMessage?.()),
            "1st parameter not an integer");
        return true;
    });

    assert.throws(() => add.evaluate([Term.get("1"), Term.get("b")]), (error: unknown) => {
        assert.ok(error instanceof JavaIllegalArgumentException);
        assert.ok(error instanceof java.lang.IllegalArgumentException);
        assert.equal(String((error as { getMessage?: () => unknown }).getMessage?.()),
            "2nd parameter not an integer");
        return true;
    });

    assert.equal(String(add.evaluate([Term.get("2"), Term.get("3")])?.name()), "5");
});

test("Reflect preserves Java argument and overload contracts", () => {
    const reflect = new ReflectProbe();

    assert.throws(() => reflect.evaluate([]), (error: unknown) => {
        assert.ok(error instanceof JavaIllegalStateException);
        assert.ok(error instanceof java.lang.IllegalStateException);
        assert.equal(String((error as { getMessage?: () => unknown }).getMessage?.()),
            "Requires 1 Term argument");
        return true;
    });

    assert.equal(String(reflect.evaluate([Term.get("a")])?.name()), "a");

    const sop = ReflectOperator.sop as unknown as (...args: unknown[]) => unknown;
    assert.throws(() => sop(), (error: unknown) => {
        assert.ok(error instanceof JavaIllegalArgumentException);
        assert.ok(error instanceof java.lang.IllegalArgumentException);
        assert.equal(String((error as { getMessage?: () => unknown }).getMessage?.()),
            "Invalid number of arguments");
        return true;
    });
});

test("Anticipate preserves its invalid-constructor exception contract", () => {
    assert.throws(() => new (Anticipate as unknown as new (...args: unknown[]) => Anticipate)(0.1),
        (error: unknown) => {
            assert.ok(error instanceof JavaIllegalArgumentException);
            assert.ok(error instanceof java.lang.IllegalArgumentException);
            assert.equal(String((error as { getMessage?: () => unknown }).getMessage?.()),
                "Invalid number of arguments");
            return true;
        });
});

test("Operator.call preserves its invalid-overload exception contract", () => {
    const call = new Add().call as unknown as (...args: unknown[]) => unknown;

    assert.throws(() => call(), (error: unknown) => {
        assert.ok(error instanceof JavaIllegalArgumentException);
        assert.ok(error instanceof java.lang.IllegalArgumentException);
        assert.equal(String((error as { getMessage?: () => unknown }).getMessage?.()),
            "Invalid number of arguments");
        return true;
    });
});
