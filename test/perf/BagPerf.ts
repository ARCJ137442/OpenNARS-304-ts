import { java, JavaObject, type int, type float, type double, S } from "../../src/runtime/native-runtime.ts";
import {
    JavaClassNotFoundException,
    JavaIllegalAccessException,
    JavaInstantiationException,
    JavaNoSuchMethodException,
    JavaParserConfigurationException as ParserConfigurationException,
    JavaSAXException as SAXException,
    JavaInvocationTargetException,
    JavaParseException,
    JavaSystemLoggerCompat,
    JavaStringJoinerCompat,
} from "../../src/runtime/native-runtime.ts";
import { Nar } from "../../src/main/Nar.ts";
import { Parameters } from "../../src/main/Parameters.ts";
import { Bag } from "../../src/storage/Bag.ts";
import type { JavaIterator } from "../../src/runtime/JavaIterator.ts";
import { Item } from "../../src/entity/Item.ts";
import { BudgetValue } from "../../src/entity/BudgetValue.ts";
import { Performance } from "./Performance.ts";

const Lists = {
    newArrayList<T>(...values: T[]): java.util.List<T> {
        return new java.util.ArrayList<T>(values);
    },
};



/**
 * Performance test of bag implementation
 */
export class BagPerf extends JavaObject {

    private static narParameters: Parameters;
    protected readonly repeats: int = 8;
    protected readonly warmups: int = 1;
    protected static forgetRate: float;

    static {
        try {
            BagPerf.forgetRate = (new Nar().narParameters).CONCEPT_FORGET_DURATIONS;
        } catch (e) {
            if (e instanceof java.io.IOException) {
                e.printStackTrace();
            } else if (e instanceof JavaInstantiationException) {
                e.printStackTrace();
            } else if (e instanceof JavaInvocationTargetException) {
                e.printStackTrace();
            } else if (e instanceof JavaNoSuchMethodException) {
                e.printStackTrace();
            } else if (e instanceof ParserConfigurationException) {
                e.printStackTrace();
            } else if (e instanceof JavaIllegalAccessException) {
                e.printStackTrace();
            } else if (e instanceof SAXException) {
                e.printStackTrace();
            } else if (e instanceof JavaClassNotFoundException) {
                e.printStackTrace();
            } else if (e instanceof JavaParseException) {
                e.printStackTrace();
            } else {
                throw e;
            }
        }
    }

    protected randomAccesses: int = 0;
    protected readonly insertRatio: double = 0.9;

    /*
     * public int getLevelSize(Bag<?,?> lb, final int level) {
     * return (lb.level[level] == null) ? 0 : lb.level[level].size();
     * }
     */

    public getMaxItemsPerLevel<E extends Item<K>, K>(b: Bag<E, K>): float {
        /*
         * int max = getLevelSize(b,0);
         * for (int i = 1; i < b.levels; i++) {
         * final int s = getLevelSize(b,i);
         * if (s > max) {
         * max = s;
         * }
         * }
         * return max;
         */
        return 0.0;
    }

    public getMinItemsPerLevel<E extends Item<K>, K>(b: Bag<E, K>): float {
        /*
         * int min = getLevelSize(b,0);
         * for (int i = 1; i < b.levels; i++) {
         * final int s = getLevelSize(b,i);
         * if (s < min) {
         * min = s;
         * }
         * }
         * return min;
         */
        return 0;
    }

    public totalPriority: float = 0;


    public totalMinItemsPerLevel: float = 0;


    public totalMaxItemsPerLevel: float = 0;

    public testBag(List: boolean, levels: int, capacity: int, forgetRate: float): void {
        const outer = this;

        this.totalPriority = 0;
        this.totalMaxItemsPerLevel = this.totalMinItemsPerLevel = 0;

        let p: Performance = new class extends Performance {

            public init(): void {
            }

            public run(warmup: boolean): void {
                let nar: Nar | null = null;
                try {
                    nar = new Nar();
                } catch (ex) {
                    if (ex instanceof java.io.IOException) {
                        JavaSystemLoggerCompat.getLogger(BagPerf.class.getName()).log(JavaSystemLoggerCompat.Level.SEVERE, null, ex);
                    } else if (ex instanceof JavaInstantiationException) {
                        JavaSystemLoggerCompat.getLogger(BagPerf.class.getName()).log(JavaSystemLoggerCompat.Level.SEVERE, null, ex);
                    } else if (ex instanceof JavaInvocationTargetException) {
                        JavaSystemLoggerCompat.getLogger(BagPerf.class.getName()).log(JavaSystemLoggerCompat.Level.SEVERE, null, ex);
                    } else if (ex instanceof JavaNoSuchMethodException) {
                        JavaSystemLoggerCompat.getLogger(BagPerf.class.getName()).log(JavaSystemLoggerCompat.Level.SEVERE, null, ex);
                    } else if (ex instanceof ParserConfigurationException) {
                        JavaSystemLoggerCompat.getLogger(BagPerf.class.getName()).log(JavaSystemLoggerCompat.Level.SEVERE, null, ex);
                    } else if (ex instanceof JavaIllegalAccessException) {
                        JavaSystemLoggerCompat.getLogger(BagPerf.class.getName()).log(JavaSystemLoggerCompat.Level.SEVERE, null, ex);
                    } else if (ex instanceof SAXException) {
                        JavaSystemLoggerCompat.getLogger(BagPerf.class.getName()).log(JavaSystemLoggerCompat.Level.SEVERE, null, ex);
                    } else if (ex instanceof JavaClassNotFoundException) {
                        JavaSystemLoggerCompat.getLogger(BagPerf.class.getName()).log(JavaSystemLoggerCompat.Level.SEVERE, null, ex);
                    } else if (ex instanceof JavaParseException) {
                        JavaSystemLoggerCompat.getLogger(BagPerf.class.getName()).log(JavaSystemLoggerCompat.Level.SEVERE, null, ex);
                    } else {
                        throw ex;
                    }
                }

                if (nar === null)
                    throw new java.lang.IllegalStateException("NAR not initialized");
                let b: Bag<BagPerf.NullItem, java.lang.CharSequence> = new class extends Bag<BagPerf.NullItem, java.lang.CharSequence> {

                    // @Override
                    // protected ArrayDeque<NullItem> newLevel() {
                    // //if (List)
                    // return super.newLevel();
                    // //return new LinkedList<>();
                    // }

                }(levels, capacity,
                    nar.narParameters);
                BagPerf.randomBagIO(b, outer.randomAccesses, outer.insertRatio);

                if (!warmup) {
                    outer.totalPriority += b.getAveragePriority();
                    outer.totalMinItemsPerLevel += outer.getMinItemsPerLevel(b);
                    outer.totalMaxItemsPerLevel += outer.getMaxItemsPerLevel(b);
                }
            }

        }(S`${List ? "DequeArray" : "LinkedList"},${levels},${capacity}`,
            outer.repeats, outer.warmups).printCSV(true);

        // items per level min
        // items per lvel max
        // avg prioirty
        // avg norm mass
        // System.out.print((totalMinItemsPerLevel/p.repeats) + ",");
        java.lang.System.out.print(S`${this.totalMaxItemsPerLevel / p.repeats},`);
        java.lang.System.out.print(S`${this.totalPriority / p.repeats},`);
        java.lang.System.out.println();
    }

    public static itemID: int = 0;
    public static rnd: java.util.Random = new java.util.Random(42n);

    /** Empty Item implementation useful for testing */
    public static NullItem = class NullItem extends Item.StringKeyItem {
        public readonly key: java.lang.String;

        public constructor();

        public constructor(priority: float);
        public constructor(...args: unknown[]) {
            if (args.length !== 0 && args.length !== 1) {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
            const priority = args.length === 0
                ? BagPerf.rnd.nextFloat() * (1.0 - BagPerf.narParameters.TRUTH_EPSILON)
                : args[0] as float;
            super(new BudgetValue(priority, priority, priority, BagPerf.narParameters));
            this.key = new java.lang.String(String(BagPerf.itemID++));
        }

        public name(): java.lang.CharSequence {
            return this.key;
        }

    };


    public static randomBagIO(b: Bag<BagPerf.NullItem, java.lang.CharSequence>, accesses: int,
        insertProportion: double): void {
        for (let i: int = 0; i < accesses; i++) {
            if (BagPerf.rnd.nextFloat() > insertProportion) {
                // remove
                b.takeOut();
            } else {
                // insert
                b.putIn(new BagPerf.NullItem());
            }
        }
    }

    public static iterate(b: Bag<BagPerf.NullItem, java.lang.CharSequence>): void {
        let i: JavaIterator<BagPerf.NullItem> = b.iterator();
        let count: int = 0;
        while (i.hasNext()) {
            i.next();
            count++;
        }
        if (count !== b.size()) {
            java.lang.System.err.println(S`Error itrating ${b.getClass()} ${b.size()} != ${count}`);
        }
    }

    public static getTime(label: java.lang.String, b: BagPerf.BagBuilder<BagPerf.NullItem, java.lang.CharSequence>,
        iterations: int,
        randomAccesses: int,
        insertRatio: float, repeats: int, warmups: int): double {
        let p: Performance = new class extends Performance {

            public init(): void {
            }

            public run(warmup: boolean): void {

                let bag: Bag<BagPerf.NullItem, java.lang.CharSequence> = b.newBag();

                BagPerf.randomBagIO(bag, randomAccesses, insertRatio);

                for (let i: int = 0; i < iterations; i++)
                    BagPerf.iterate(bag);

            }

        }(label, repeats, warmups);// .printCSV(false);
        // System.out.println();

        return p.getCycleTimeMS();

    }

    public constructor() {

        super();
        for (let capacity: int = 8; capacity < 40000; capacity *= capacity) {
            this.randomAccesses = capacity * 64;
            for (let i: int = 5; i < 200; i += 5) {
                this.testBag(false, i, capacity, BagPerf.forgetRate);
                this.testBag(true, i, capacity, BagPerf.forgetRate);
            }
        }

    }

    public static compare(iterations: int,
        randomAccesses: int,
        insertRatio: float,
        repeats: int, warmups: int, ...B: Bag<BagPerf.NullItem, java.lang.CharSequence>[]): java.util.Map<Bag<BagPerf.NullItem, java.lang.CharSequence>, double> {

        let t: java.util.Map<Bag<BagPerf.NullItem, java.lang.CharSequence>, double> = new java.util.LinkedHashMap();

        for (let X of B) {
            X.clear();

            t.put(X, BagPerf.getTime(new java.lang.String(X.toString()), { newBag: () => X },
                iterations, randomAccesses, insertRatio, repeats, warmups));

        }
        return t;

    }

    public static printCSVLine(out: java.io.PrintStream, ...s: java.lang.String[]): void;

    public static printCSVLine(out: java.io.PrintStream, o: java.util.List<java.lang.String>): void;
    public static printCSVLine(...args: unknown[]): void {
        if (args.length !== 2) {
            throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
        }

        const out = args[0] as java.io.PrintStream;
        const value = args[1];
        if (Array.isArray(value)) {
            BagPerf.printCSVLine(out, Lists.newArrayList(...value as java.lang.String[]));
            return;
        }

        const line = new JavaStringJoinerCompat(", ", "", "");
        for (const x of value as java.util.List<java.lang.String>)
            line.add(x);
        out.println(line.toString());
    }


    public static main(args: java.lang.String[]): void {
        BagPerf.narParameters = new Nar().narParameters;
        let itemsPerLevel: int = 10;
        let repeats: int = 10;
        let warmups: int = 1;

        let iterationsPerItem: int = 0;
        let accessesPerItem: int = 8;

        let printedHeader: boolean = false;

        for (let insertRatio: float = 0.1; insertRatio <= 1.0; insertRatio += 0.1) {
            for (let levels: int = 1; levels <= 10; levels += 1) {

                let items: int = levels * itemsPerLevel;
                let iterations: int = iterationsPerItem * items;
                let randomAccesses: int = accessesPerItem * items;

                let bags: Bag<BagPerf.NullItem, java.lang.CharSequence>[] =
                    new Array<Bag<BagPerf.NullItem, java.lang.CharSequence>>(1);
                bags[0] = new Bag(levels, items, BagPerf.narParameters);

                let t: java.util.Map<Bag<BagPerf.NullItem, java.lang.CharSequence>, double> = BagPerf.compare(
                    iterations, randomAccesses, insertRatio, repeats, warmups,
                    ...bags);

                if (!printedHeader) {

                    let ls: java.util.List<java.lang.String> = Lists.newArrayList(
                        new java.lang.String("items"), new java.lang.String("io_ratio"),
                        new java.lang.String("accesses"), new java.lang.String("nexts"),
                    );
                    for (let e of t.entrySet())
                        ls.add(new java.lang.String(e.getKey().toString()));

                    BagPerf.printCSVLine(java.lang.System.out, ls);
                    printedHeader = true;
                }

                {
                    let ls: java.util.List<java.lang.String> = Lists.newArrayList(
                        new java.lang.String(String(items)), new java.lang.String(String(insertRatio)),
                        new java.lang.String(String(randomAccesses)), new java.lang.String(String(iterations)),
                    );
                    for (let e of t.entrySet())
                        ls.add(new java.lang.String(e.getValue().toString()));

                    BagPerf.printCSVLine(java.lang.System.out, ls);
                }
            }
        }
    }
}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace BagPerf {
    export type NullItem = InstanceType<typeof BagPerf.NullItem>;
    export interface BagBuilder<E extends Item<K>, K> {
        newBag(): Bag<E, K>;
    }

}


