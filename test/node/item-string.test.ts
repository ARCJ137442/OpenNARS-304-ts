import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { Item } from "../../src/entity/Item.ts";
import { BudgetValue } from "../../src/entity/BudgetValue.ts";
import { Parameters } from "../../src/main/Parameters.ts";

class TextItem extends Item<unknown> {
    public constructor(private readonly key: unknown, budget?: BudgetValue) {
        super(budget ?? null);
    }

    public name(): unknown {
        return this.key;
    }

    public getPriority(): number {
        return this.budget?.getPriority() ?? 0;
    }

    public merge(): Item<unknown> {
        return this;
    }
}

test("Item text methods replace one-shot StringBuilder without changing order", () => {
    const budget = new BudgetValue(0.4, 0.6, 0.8, new Parameters());
    const item = new TextItem("item", budget);

    assert.equal(item.toString(), "$0.4000;0.6000;0.8000$ item");
    assert.equal(item.toStringExternal(), "$0.40;0.60;0.80$ item");
    assert.equal(item.toStringExternal2(), "item $0.40;0.60;0.80$");
    assert.equal(typeof item.toString(), "string");
});

test("Item text methods retain Java null/string conversion at the boundary", () => {
    const noBudget = new TextItem(null);
    assert.equal(noBudget.toString(), " null");

    const objectName = new TextItem({ toString: () => "object-name" }, new BudgetValue(0.1, 0.2, 0.3, new Parameters()));
    assert.equal(objectName.toStringExternal(), "$0.10;0.20;0.30$ object-name");
});

test("Item keeps Java runtime types behind project boundaries", () => {
    const source = readFileSync("src/entity/Item.ts", "utf8");
    assert.doesNotMatch(source, /from ["']jree["']/);
    assert.doesNotMatch(source, /java\.lang\.(Iterable|CharSequence|NullPointerException)/);
    assert.match(source, /JavaCharSequenceInput/);
    assert.match(source, /JavaNullPointerException/);
});
