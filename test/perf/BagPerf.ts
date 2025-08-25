import { java, JavaObject, type int, type float, type double, S } from "jree";



/**
 * Performance test of bag implementation
 */
export class BagPerf extends JavaObject {

    private static narParameters: java.security.Policy.Parameters;
    protected readonly repeats: int = 8;
    protected readonly warmups: int = 1;
    protected static forgetRate: float;

    static {
        try {
            BagPerf.forgetRate = (new Nar().narParameters).CONCEPT_FORGET_DURATIONS;
        } catch (e) {
            if (e instanceof java.io.IOException) {
                e.printStackTrace();
            } else if (e instanceof java.lang.InstantiationException) {
                e.printStackTrace();
            } else if (e instanceof java.lang.reflect.InvocationTargetException) {
                e.printStackTrace();
            } else if (e instanceof java.lang.NoSuchMethodException) {
                e.printStackTrace();
            } else if (e instanceof ParserConfigurationException) {
                e.printStackTrace();
            } else if (e instanceof java.lang.IllegalAccessException) {
                e.printStackTrace();
            } else if (e instanceof SAXException) {
                e.printStackTrace();
            } else if (e instanceof java.lang.ClassNotFoundException) {
                e.printStackTrace();
            } else if (e instanceof java.text.ParseException) {
                e.printStackTrace();
            } else {
                throw e;
            }
        }
    }

    protected randomAccesses: int;
    protected readonly insertRatio: double = 0.9;

    /*
     * public int getLevelSize(Bag<?,?> lb, final int level) {
     * return (lb.level[level] == null) ? 0 : lb.level[level].size();
     * }
     */

    public getMaxItemsPerLevel(b: Bag<unknown, unknown>): float {
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

    public getMinItemsPerLevel(b: Bag<unknown, unknown>): float {
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

    public totalPriority: float;


    public totalMinItemsPerLevel: float;


    public totalMaxItemsPerLevel: float;

    public testBag(/* final */  List: boolean, /* final */  levels: int, /* final */  capacity: int, /* final */  forgetRate: float): void {

        this.totalPriority = 0;
        this.totalMaxItemsPerLevel = this.totalMinItemsPerLevel = 0;

        let p: Performance = new class extends Performance {

            public init(): void {
            }

            public run(/* final */  warmup: boolean): void {
                let nar: Nar = null;
                try {
                    nar = new Nar();
                } catch (ex) {
                    if (ex instanceof java.io.IOException) {
                        java.lang.System.Logger.getLogger(BagPerf.class.getName()).log(java.lang.System.Logger.Level.SEVERE, null, ex);
                    } else if (ex instanceof java.lang.InstantiationException) {
                        java.lang.System.Logger.getLogger(BagPerf.class.getName()).log(java.lang.System.Logger.Level.SEVERE, null, ex);
                    } else if (ex instanceof java.lang.reflect.InvocationTargetException) {
                        java.lang.System.Logger.getLogger(BagPerf.class.getName()).log(java.lang.System.Logger.Level.SEVERE, null, ex);
                    } else if (ex instanceof java.lang.NoSuchMethodException) {
                        java.lang.System.Logger.getLogger(BagPerf.class.getName()).log(java.lang.System.Logger.Level.SEVERE, null, ex);
                    } else if (ex instanceof ParserConfigurationException) {
                        java.lang.System.Logger.getLogger(BagPerf.class.getName()).log(java.lang.System.Logger.Level.SEVERE, null, ex);
                    } else if (ex instanceof java.lang.IllegalAccessException) {
                        java.lang.System.Logger.getLogger(BagPerf.class.getName()).log(java.lang.System.Logger.Level.SEVERE, null, ex);
                    } else if (ex instanceof SAXException) {
                        java.lang.System.Logger.getLogger(BagPerf.class.getName()).log(java.lang.System.Logger.Level.SEVERE, null, ex);
                    } else if (ex instanceof java.lang.ClassNotFoundException) {
                        java.lang.System.Logger.getLogger(BagPerf.class.getName()).log(java.lang.System.Logger.Level.SEVERE, null, ex);
                    } else if (ex instanceof java.text.ParseException) {
                        java.lang.System.Logger.getLogger(BagPerf.class.getName()).log(java.lang.System.Logger.Level.SEVERE, null, ex);
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
                BagPerf.randomBagIO(b, $outer.randomAccesses, $outer.insertRatio);

                if (!warmup) {
                    $outer.totalPriority += b.getAveragePriority();
                    $outer.totalMinItemsPerLevel += $outer.getMinItemsPerLevel(b);
                    $outer.totalMaxItemsPerLevel += $outer.getMaxItemsPerLevel(b);
                }
            }

        }((List ? "DequeArray" : "LinkedList") + "," + levels + "," + capacity,
            $outer.repeats, $outer.warmups).printCSV(true);

        // items per level min
        // items per lvel max
        // avg prioirty
        // avg norm mass
        // System.out.print((totalMinItemsPerLevel/p.repeats) + ",");
        java.lang.System.out.print((this.totalMaxItemsPerLevel / p.repeats) + ",");
        java.lang.System.out.print(this.totalPriority / p.repeats + ",");
        java.lang.System.out.println();
    }

    public static itemID: int = 0;
    public static rnd: java.util.Random = new java.util.Random(42);

    /** Empty Item implementation useful for testing */
    public static NullItem = class NullItem extends Item.StringKeyItem {
        public readonly key: java.lang.String;

        public constructor();

        public constructor(/* final */  priority: float);
        public constructor(...args: unknown[]) {
            switch (args.length) {
                case 0: {

                    this(BagPerf.rnd.nextFloat() * (1.0 - BagPerf.narParameters.TRUTH_EPSILON));


                    break;
                }

                case 1: {
                    const [priority] = args as [float];


                    super(new BudgetValue(priority, priority, priority, BagPerf.narParameters));
                    this.key = "" + (BagPerf.itemID++);


                    break;
                }

                default: {
                    throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
                }
            }
        }


        public name(): java.lang.CharSequence {
            return this.key;
        }

    };


    public static randomBagIO(/* final */  b: Bag<BagPerf.NullItem, java.lang.CharSequence>, /* final */  accesses: int,
            /* final */  insertProportion: double): void {
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

    public static iterate(/* final */  b: Bag<BagPerf.NullItem, java.lang.CharSequence>): void {
        let i: java.util.Iterator<BagPerf.NullItem> = b.iterator();
        let count: int = 0;
        while (i.hasNext()) {
            i.next();
            count++;
        }
        if (count !== b.size()) {
            java.lang.System.err.println("Error itrating " + b.getClass() + " " + b.size() + " != " + count);
        }
    }

    public static getTime(/* final */  label: java.lang.String, /* final */  b: BagPerf.BagBuilder<BagPerf.NullItem, java.lang.CharSequence>,
            /* final */  iterations: int,
            /* final */  randomAccesses: int,
            /* final */  insertRatio: float, /* final */  repeats: int, /* final */  warmups: int): double {
        let p: Performance = new class extends Performance {

            public init(): void {
            }

            public run(/* final */  warmup: boolean): void {

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

    public static compare(/* final */  iterations: int,
            /* final */  randomAccesses: int,
            /* final */  insertRatio: float,
            /* final */  repeats: int, /* final */  warmups: int, /* final */ ...B: Bag<BagPerf.NullItem, java.lang.CharSequence>[]): java.util.Map<Bag<BagPerf.NullItem, java.lang.CharSequence>, java.lang.Double> {

        let t: java.util.Map<Bag<BagPerf.NullItem, java.lang.CharSequence>, java.lang.Double> = new java.util.LinkedHashMap();

        for (let X of B) {
            X.clear();

            t.put(X, BagPerf.getTime(X.toString(), () => X, iterations, randomAccesses, insertRatio, repeats, warmups));

        }
        return t;

    }

    public static printCSVLine(/* final */  out: java.io.PrintStream, /* final */ ...s: java.lang.String[]): void;

    public static printCSVLine(/* final */  out: java.io.PrintStream, /* final */  o: java.util.List<java.lang.String>): void;
    public static printCSVLine(...args: unknown[]): void {
        switch (args.length) {
            case 2: {
                const [out, s] = args as [java.io.PrintStream, java.lang.String[]];


                BagPerf.printCSVLine(out, Lists.newArrayList(s));


                break;
            }

            case 2: {
                const [out, o] = args as [java.io.PrintStream, java.util.List<java.lang.String>];


                let line: java.util.StringJoiner = new java.util.StringJoiner(", ", "", "");
                for (let x of o)
                    line.add(x);
                out.println(line.toString());


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    public static main(/* final */  args: java.lang.String[]): void {
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

                let bags: Bag<BagPerf.NullItem, java.lang.CharSequence>[] = new Array<Bag>(1);
                bags[0] = new Bag(levels, items, BagPerf.narParameters);

                let t: java.util.Map<Bag<BagPerf.NullItem, java.lang.CharSequence>, java.lang.Double> = BagPerf.compare(
                    iterations, randomAccesses, insertRatio, repeats, warmups,
                    bags);

                if (!printedHeader) {

                    let ls: java.util.List<java.lang.String> = Lists.newArrayList("items", "io_ratio", "accesses", "nexts");
                    for (let e of t.entrySet())
                        ls.add(e.getKey().toString());

                    BagPerf.printCSVLine(java.lang.System.out, ls);
                    printedHeader = true;
                }

                {
                    let ls: java.util.List<java.lang.String> = Lists.newArrayList(items + "", insertRatio + "", randomAccesses + "",
                        iterations + "");
                    for (let e of t.entrySet())
                        ls.add(e.getValue().toString());

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
        newBag(): Bag<java.lang.Math.E, K>;
    }

}


