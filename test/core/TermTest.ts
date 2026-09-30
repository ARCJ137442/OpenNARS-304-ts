import { java, JavaObject, type int } from "../../src/runtime/native-runtime.ts";
import { Concept } from "../../src/entity/Concept.ts";
import { Narsese } from "../../src/io/Narsese.ts";
import { Parser } from "../../src/io/Parser.ts";
import { Symbols } from "../../src/io/Symbols.ts";
import { Nar } from "../../src/main/Nar.ts";
import { Operation } from "../../src/operator/Operation.ts";
import { CompoundTerm } from "../../src/language/CompoundTerm.ts";
import { Inheritance } from "../../src/language/Inheritance.ts";
import { Statement } from "../../src/language/Statement.ts";
import { Term } from "../../src/language/Term.ts";
import type { JavaStringInput } from "../../src/runtime/native-runtime.ts";
import { assertEquals, assertTrue } from "../util/junit-assert.ts";

const NativeOperator = Symbols.NativeOperator;

const parseRequired = (parser: Narsese, input: JavaStringInput): Term => {
    const term = parser.parseTerm(input);
    if (term === null) {
        throw new java.lang.IllegalStateException(new java.lang.String("Expected a term."));
    }
    return term;
};



/**
 *
 *
 */
export class TermTest extends JavaObject {

    protected readonly n: Nar = new Nar();
    protected readonly np: Narsese = new Narsese(this.n);

    public constructor() {
        super();
    }

    protected assertEquivalent(term1String: JavaStringInput, term2String: JavaStringInput): void {
        // final Nar n = new Nar();

        try {
            const term1 = parseRequired(this.np, term1String);
            const term2 = parseRequired(this.np, term2String);

            assertTrue(term1 instanceof CompoundTerm);
            assertTrue(term2 instanceof CompoundTerm);
            assertTrue(String(term1String) !== String(term2String));

            assertTrue(term1.hashCode() === term2.hashCode());
            assertTrue(term1.equals(term2));
            assertTrue(term1.compareTo(term2) === 0);
        } catch (e) {
            if (e instanceof Parser.InvalidInputException) {
                throw new java.lang.IllegalStateException(new java.lang.String("Invalid test string."),
                    e instanceof java.lang.Throwable ? e : null);
            } else {
                throw e;
            }
        }
    }

    public testCommutativeCompoundTerm(): void {
        // final Nar n = new Nar();

        this.assertEquivalent("(&&,a,b)", "(&&,b,a)");
        this.assertEquivalent("(&&,(||,b,c),a)", "(&&,a,(||,b,c))");
        this.assertEquivalent("(&&,(||,c,b),a)", "(&&,a,(||,b,c))");

    }

    public testTermSort(): void {
        let n: Nar = new Nar();

        let m: Narsese = new Narsese(n);
        const a = parseRequired(m, "a");
        const b = parseRequired(m, "b");
        const c = parseRequired(m, "c");

        assertEquals(3, Term.toSortedSetArray(a, b, c).length);
        assertEquals(2, Term.toSortedSetArray(a, b, b).length);
        assertEquals(1, Term.toSortedSetArray(a, a).length);
        assertEquals(1, Term.toSortedSetArray(a).length);
        assertEquals("correct natural ordering", a, Term.toSortedSetArray(a, b)[0]);
    }

    public testConjunctionTreeSet(): void {
        // final Nar n = new Nar();

        // these 2 representations are equal, after natural ordering
        const term1String = new java.lang.String("<#1 --> (&,boy,(/,taller_than,{Tom},_))>");
        const term1 = parseRequired(this.np, term1String);
        const term1Alternate = new java.lang.String("<#1 --> (&,(/,taller_than,{Tom},_),boy)>");
        const term1a = parseRequired(this.np, term1Alternate);

        // <#1 --> (|,boy,(/,taller_than,{Tom},_))>
        const term2 = parseRequired(this.np, "<#1 --> (|,boy,(/,taller_than,{Tom},_))>");

        assertTrue(term1.toString().equals(term1a.toString()));
        assertTrue(term1.getComplexity() > 1);
        assertTrue(term1.getComplexity() === term2.getComplexity());

        assertTrue(term1.getClass().equals(Inheritance.class));
        assertTrue(term1.getClass().equals(Inheritance.class));

        // System.out.println("t1: " + term1 + ", complexity=" + term1.getComplexity());
        // System.out.println("t2: " + term2 + ", complexity=" + term2.getComplexity());

        assertTrue(term1.equals(term1.clone()));
        assertTrue(term1.compareTo(term1.clone()) === 0);
        assertTrue(term2.equals(term2.clone()));
        assertTrue(term2.compareTo(term2.clone()) === 0);

        let t1e2: boolean = term1.equals(term2);
        let t1c2: int = term1.compareTo(term2);
        let t2c1: int = term2.compareTo(term1);

        assertTrue(!t1e2);
        assertTrue("term1 and term2 inequal, so t1.compareTo(t2) should not = 0", t1c2 !== 0);
        assertTrue("term1 and term2 inequal, so t2.compareTo(t1) should not = 0", t2c1 !== 0);

        /*
         * System.out.println("t1 equals t2 " + t1e2);
         * System.out.println("t1 compareTo t2 " + t1c2);
         * System.out.println("t2 compareTo t1 " + t2c1);
         */

        let set: java.util.Set<Term> = new java.util.LinkedHashSet<Term>();
        let added1: boolean = set.add(term1.clone());
        let added2: boolean = set.add(term2.clone());
        assertTrue("term 1 added to set", added1);
        assertTrue("term 2 added to set", added2);

        assertTrue(set.size() === 2);

    }

    public testUnconceptualizedTermInstancing(): void {
        // final Nar n = new Nar();

        const term1String = new java.lang.String("<a --> b>");
        const term1 = parseRequired(this.np, term1String);
        const term2 = parseRequired(this.np, term1String);

        assertTrue(term1.equals(term2));
        assertTrue(term1.hashCode() === term2.hashCode());

        let cTerm1: CompoundTerm = (term1 as CompoundTerm);
        let cTerm2: CompoundTerm = (term2 as CompoundTerm);

        // test subterms
        assertTrue(cTerm1.term[0].equals(cTerm2.term[0])); // 'a'

    }

    public testConceptInstancing(): void {
        let n: Nar = new Nar();

        const statement1 = "<a --> b>.";

        const a = parseRequired(this.np, "a");
        assertTrue(a !== null);
        const a1 = parseRequired(this.np, "a");
        assertTrue(a.equals(a1));

        n.addInput(statement1);
        n.cycles(4);

        n.addInput(" <a  --> b>.  ");
        n.cycles(1);
        n.addInput(" <a--> b>.  ");
        n.cycles(1);

        const statement2 = "<a --> c>.";
        n.addInput(statement2);
        n.cycles(4);

        const a2 = parseRequired(this.np, "a");
        assertTrue(a2 !== null);

        let ca: Concept = n.memory.concept(a2);
        assertTrue(ca !== null);

        assertEquals(true, n.memory.concepts.iterator().hasNext());

    }

    public invalidTermIndep(): void {

        const t = "<$1 --> (~,{place4},$1)>";
        let n: Nar = new Nar();
        let p: Narsese = new Narsese(n);

        const subj = parseRequired(p, "$1");
        const pred = parseRequired(p, "(~,{place4},$1)");

        const s: Statement | null = Statement.make(NativeOperator.INHERITANCE, subj, pred, false, 0);
        assertEquals(null, s);

        let i: Inheritance = Inheritance.make(subj, pred);
        assertEquals(null, i);

        const forced = parseRequired(p, "<a --> b>") as CompoundTerm;
        assertTrue(true);

        forced.term[0] = subj;
        forced.term[1] = pred;
        forced.invalidateName();

        assertEquals(t, forced.toString());

        let cloned: CompoundTerm = forced.clone();
        assertEquals(null, cloned);
    }

    public testParseOperationInFunctionalForm(): void {

        let n: Nar = new Nar();
        let p: Narsese = new Narsese(n);

        const x = parseRequired(p, "wonder(a,b)");
        assertEquals(Operation.class, x.getClass());
        assertEquals("(^wonder,a,b)", x.toString());
    }
}
