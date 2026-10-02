import { java, JavaObject, type IntNumber } from "../../support/legacy-runtime-facade.ts";
import { Item } from "../../../src/entity/Item.ts";
import { JavaAssertionError } from "../../support/legacy-runtime-facade.ts";
import { Bag } from "../../../src/storage/Bag.ts";
import { BagPerf } from "../../perf/BagPerf.ts";
import { assertTrue } from "../../util/junit-assert.ts";



export class BagIteratorTest extends JavaObject {

    protected readonly L: IntNumber = 4;

    public testIterator(b: Bag<BagPerf.NullItem, java.lang.CharSequence>): void {
        let count: IntNumber = 0;
        let first: BagPerf.NullItem | null = null;
        let current: BagPerf.NullItem | null = null;
        for (let n of b) {
            if (first === null)
                first = n;
            current = n;
            // System.out.println(current);
            count++;
        }

        if (b.size() > 1) {
            // check correct order
            if (first === null || current === null)
                throw new JavaAssertionError();
            assertTrue(first.getPriority() > current.getPriority());
        }

        assertTrue(count === b.size());
    }

    public numEmptyLevels(bag: Bag<Item<unknown>, unknown>): IntNumber {
        /*
         * IntNumber empty = 0;
         * for (IntNumber i = 0; i < bag.level.length; i++) {
         * if (bag.level[i].isEmpty()) {
         * empty++;
         * }
         * }
         * return empty;
         */
        return 0;
    }

    public testBagIterator(b: Bag<BagPerf.NullItem, java.lang.CharSequence>): void {

        b.putIn(new BagPerf.NullItem(0.1));
        b.putIn(new BagPerf.NullItem(0.2));
        b.putIn(new BagPerf.NullItem(0.3));
        b.putIn(new BagPerf.NullItem(0.4));
        b.putIn(new BagPerf.NullItem(0.5));
        b.putIn(new BagPerf.NullItem(0.6));
        b.putIn(new BagPerf.NullItem(0.7));
        b.putIn(new BagPerf.NullItem(0.8));

        /* assert !(b instanceof Bag) || (numEmptyLevels((Bag<?, ?>) b) < L); */

        this.testIterator(b);

        b.clear();

        this.testIterator(b);

        b.putIn(new BagPerf.NullItem(0.6));

        this.testIterator(b);

    }

    public testBags(): void {
        // Nar nar = new Nar();
        // testBagIterator(new Bag(L, L*2, nar.narParameters));
        /* assert (true); */
    }

}
