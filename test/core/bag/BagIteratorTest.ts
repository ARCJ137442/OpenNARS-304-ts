


import { java, JavaObject, type int } from "jree";



export class BagIteratorTest extends JavaObject {

    protected readonly L: int = 4;

    public testIterator(/* final */  b: Bag<NullItem, java.lang.CharSequence> | null): void {
        let count: int = 0;
        let first: NullItem = null;
        let current: NullItem = null;
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
                throw new java.lang.AssertionError();
            assertTrue(first.getPriority() > current.getPriority());
        }

        assertTrue(count === b.size());
    }

    public numEmptyLevels(bag: Bag<unknown, unknown> | null): int {
        /*
         * int empty = 0;
         * for (int i = 0; i < bag.level.length; i++) {
         * if (bag.level[i].isEmpty()) {
         * empty++;
         * }
         * }
         * return empty;
         */
        return 0;
    }

    public testBagIterator(/* final */  b: Bag<NullItem, java.lang.CharSequence> | null): void {

        b.putIn(new NullItem(0.1));
        b.putIn(new NullItem(0.2));
        b.putIn(new NullItem(0.3));
        b.putIn(new NullItem(0.4));
        b.putIn(new NullItem(0.5));
        b.putIn(new NullItem(0.6));
        b.putIn(new NullItem(0.7));
        b.putIn(new NullItem(0.8));

        /* assert !(b instanceof Bag) || (numEmptyLevels((Bag<?, ?>) b) < L); */

        this.testIterator(b);

        b.clear();

        this.testIterator(b);

        b.putIn(new NullItem(0.6));

        this.testIterator(b);

    }

    public testBags(): void {
        // Nar nar = new Nar();
        // testBagIterator(new Bag(L, L*2, nar.narParameters));
        /* assert (true); */
    }

}
