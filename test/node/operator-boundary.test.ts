import assert from "node:assert/strict";
import test from "node:test";
import { java } from "jree";
import { Term } from "../../src/language/Term.ts";
import { Add } from "../../src/operator/misc/Add.ts";
import { Count } from "../../src/operator/misc/Count.ts";
import { Reflect as ReflectOperator } from "../../src/operator/misc/Reflect.ts";
import { NullOperator } from "../../src/operator/NullOperator.ts";

test("operator constructors preserve Java string boundaries", () => {
    assert.equal(String(new Add().name()), "^add");
    assert.equal(String(new Count().name()), "^count");
    assert.equal(String(new NullOperator().name()), "^sample");
});

test("Reflect.sop preserves the translated Java varargs-array overload", () => {
    const reflected = ReflectOperator.sop("inheritance", [Term.get(new java.lang.String("a"))]);

    assert.equal(String(reflected.name()), "<(*,a) --> inheritance>");
});
