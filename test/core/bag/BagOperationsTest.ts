import { java, JavaObject, S, type float } from "../../../src/runtime/native-runtime.ts";
import {
    JavaClassNotFoundException,
    JavaIllegalAccessException,
    JavaInvocationTargetException,
    JavaInstantiationException,
    JavaNoSuchMethodException,
    JavaParseException,
    JavaParserConfigurationException,
    JavaSAXException,
} from "../../../src/runtime/native-runtime.ts";
import { BudgetValue } from "../../../src/entity/BudgetValue.ts";
import { Concept } from "../../../src/entity/Concept.ts";
import { Item } from "../../../src/entity/Item.ts";
import { Term } from "../../../src/language/Term.ts";
import { Nar } from "../../../src/main/Nar.ts";
import { Parameters } from "../../../src/main/Parameters.ts";
import { Bag } from "../../../src/storage/Bag.ts";
import { assertEquals, assertTrue } from "../../util/junit-assert.ts";



/**
 *
 * @author me
 */
export class BagOperationsTest extends JavaObject {

    private static narParameters: Parameters;
    protected static nar: Nar;

    static {
        try {
            BagOperationsTest.nar = new Nar();
        } catch (e) {
            if (e instanceof java.io.IOException) {
                e.printStackTrace();
            } else if (e instanceof JavaInstantiationException) {
                e.printStackTrace();
            } else if (e instanceof JavaInvocationTargetException) {
                e.printStackTrace();
            } else if (e instanceof JavaNoSuchMethodException) {
                e.printStackTrace();
            } else if (e instanceof JavaParserConfigurationException) {
                e.printStackTrace();
            } else if (e instanceof JavaIllegalAccessException) {
                e.printStackTrace();
            } else if (e instanceof JavaSAXException) {
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

    protected static makeConcept(name: java.lang.String, priority: float): Concept {
        let budget: BudgetValue = new BudgetValue(priority, priority, priority, BagOperationsTest.narParameters);
        let s: Concept = new Concept(budget, new Term(name), BagOperationsTest.nar.memory);
        return s;
    }

    public testConcept(): void {
        let nar: Nar = new Nar();
        BagOperationsTest.narParameters = nar.narParameters;
        BagOperationsTest.testBagSequence(new Bag(2, 2, nar.narParameters));
    }

    public static getMinPriority(bag: Bag<Concept, Term>): float {
        let min: float = 1.0;
        for (let e of bag) {
            let p: float = e.getPriority();
            if (p < min)
                min = p;
        }
        return min;
    }

    public static getMaxPriority(bag: Bag<Concept, Term>): float {
        let max: float = 0.0;
        for (let e of bag) {
            let p: float = e.getPriority();
            if (p > max)
                max = p;
        }
        return max;
    }

    public static testBagSequence(b: Bag<Concept, Term>): void {

        // different id, different priority
        b.putIn(BagOperationsTest.makeConcept(S`a`, 0.1));
        b.putIn(BagOperationsTest.makeConcept(S`b`, 0.15));
        assertEquals(2, b.size());
        b.clear();

        // same priority, different id
        b.putIn(BagOperationsTest.makeConcept(S`a`, 0.1));
        b.putIn(BagOperationsTest.makeConcept(S`b`, 0.1));
        assertEquals(2, b.size());

        b.putIn(BagOperationsTest.makeConcept(S`c`, 0.2));
        assertEquals(2, b.size());
        assertEquals(0.1, BagOperationsTest.getMinPriority(b), 0.001);
        assertEquals(0.2, BagOperationsTest.getMaxPriority(b), 0.001);

        // if (b instanceof GearBag()) return;

        b.putIn(BagOperationsTest.makeConcept(S`b`, 0.4));

        assertEquals(2, b.size());
        assertEquals(0.2, BagOperationsTest.getMinPriority(b), 0.001);
        assertEquals(0.4, BagOperationsTest.getMaxPriority(b), 0.001);

        let tb: Item<Term> = b.pickOut(new Term(S`b`));
        assertTrue(tb !== null);
        assertEquals(1, b.size());
        assertEquals(0.4, tb.getPriority(), 0.001);

        let tc: Item<Term> = b.takeOut();
        assertEquals(0, b.size());
        assertEquals(0.2, tc.getPriority(), 0.001);

        assertEquals(null, b.putIn(BagOperationsTest.makeConcept(S`a`, 0.2)));
        assertEquals(null, b.putIn(BagOperationsTest.makeConcept(S`b`, 0.3)));

        if (b instanceof Bag) {
            assertEquals(S`a`, b.putIn(BagOperationsTest.makeConcept(S`c`, 0.1)).name()); // replaces item on level
        }

    }
}
