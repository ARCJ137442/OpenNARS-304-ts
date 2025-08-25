


import { java, JavaObject, type float } from "jree";



/**
 *
 * @author me
 */
export class BagOperationsTest extends JavaObject {

    private static narParameters: java.security.Policy.Parameters | null;
    protected static nar: Nar | null;

    static {
        try {
            BagOperationsTest.nar = new Nar();
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

    protected static makeConcept(/* final */  name: java.lang.String | null, /* final */  priority: float): Concept | null {
        let budget: BudgetValue = new BudgetValue(priority, priority, priority, BagOperationsTest.narParameters);
        let s: Concept = new Concept(budget, new Term(name), BagOperationsTest.nar.memory);
        return s;
    }

    public testConcept(): void {
        let nar: Nar = new Nar();
        BagOperationsTest.narParameters = nar.narParameters;
        BagOperationsTest.testBagSequence(new Bag(2, 2, nar.narParameters));
    }

    public static getMinPriority(bag: Bag<Concept, Term> | null): float {
        let min: float = 1.0;
        for (let e of bag) {
            let p: float = e.getPriority();
            if (p < min)
                min = p;
        }
        return min;
    }

    public static getMaxPriority(bag: Bag<Concept, Term> | null): float {
        let max: float = 0.0;
        for (let e of bag) {
            let p: float = e.getPriority();
            if (p > max)
                max = p;
        }
        return max;
    }

    public static testBagSequence(/* final */  b: Bag<Concept, Term> | null): void {

        // different id, different priority
        b.putIn(BagOperationsTest.makeConcept("a", 0.1));
        b.putIn(BagOperationsTest.makeConcept("b", 0.15));
        assertEquals(2, b.size());
        b.clear();

        // same priority, different id
        b.putIn(BagOperationsTest.makeConcept("a", 0.1));
        b.putIn(BagOperationsTest.makeConcept("b", 0.1));
        assertEquals(2, b.size());

        b.putIn(BagOperationsTest.makeConcept("c", 0.2));
        assertEquals(2, b.size());
        assertEquals(0.1, BagOperationsTest.getMinPriority(b), 0.001);
        assertEquals(0.2, BagOperationsTest.getMaxPriority(b), 0.001);

        // if (b instanceof GearBag()) return;

        b.putIn(BagOperationsTest.makeConcept("b", 0.4));

        assertEquals(2, b.size());
        assertEquals(0.2, BagOperationsTest.getMinPriority(b), 0.001);
        assertEquals(0.4, BagOperationsTest.getMaxPriority(b), 0.001);

        let tb: Item<unknown> = b.pickOut(new Term("b"));
        assertTrue(tb !== null);
        assertEquals(1, b.size());
        assertEquals(0.4, tb.getPriority(), 0.001);

        let tc: Item<unknown> = b.takeOut();
        assertEquals(0, b.size());
        assertEquals(0.2, tc.getPriority(), 0.001);

        assertEquals(null, b.putIn(BagOperationsTest.makeConcept("a", 0.2)));
        assertEquals(null, b.putIn(BagOperationsTest.makeConcept("b", 0.3)));

        if (b instanceof Bag) {
            assertEquals("a", b.putIn(BagOperationsTest.makeConcept("c", 0.1)).name().toString()); // replaces item on level
        }

    }
}
