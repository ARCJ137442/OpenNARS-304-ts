import assert from "node:assert/strict";
import test from "node:test";
import { java } from "jree";
import { Nar } from "../../src/main/Nar.ts";
import { NullOperator } from "../../src/operator/NullOperator.ts";

test("Memory operator registry adds, replaces, and removes operators by Java text value", () => {
    const nar = new Nar({ configText: "<config></config>" });
    const memory = nar.memory;
    const first = new NullOperator(new java.lang.String("^registry"));
    const replacement = new NullOperator(new java.lang.String("^registry"));

    try {
        assert.equal(memory.addOperator(first), first);
        assert.equal(memory.getOperator(new java.lang.String("^registry")), first);
        assert.equal(memory.getOperator(new java.lang.String("^unknown")), null);
        assert.equal(memory.addOperator(replacement), replacement);
        assert.equal(memory.getOperator(new java.lang.String("^registry")), replacement);
        assert.equal(memory.removeOperator(replacement), replacement);
        assert.equal(memory.getOperator(new java.lang.String("^registry")), null);
    } finally {
        nar.stop();
    }
});

test("Memory keeps the Java plain-class boundary without a jree object shell", () => {
    const nar = new Nar({ configText: "<config></config>" });

    try {
        assert.equal(Object.getPrototypeOf(Object.getPrototypeOf(nar.memory)), Object.prototype);
    } finally {
        nar.stop();
    }
});
