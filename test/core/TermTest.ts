import { java, JavaObject, type int } from "jree";



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

    protected assertEquivalent(/* final */  term1String: java.lang.String, /* final */  term2String: java.lang.String): void {
        // final Nar n = new Nar();

        try {
            let term1: Term = this.np.parseTerm(term1String);
            let term2: Term = this.np.parseTerm(term2String);

            assertTrue(term1 instanceof CompoundTerm);
            assertTrue(term2 instanceof CompoundTerm);
            assertTrue(!term1String.equals(term2String));

            assertTrue(term1.hashCode() === term2.hashCode());
            assertTrue(term1.equals(term2));
            assertTrue(term1.compareTo(term2) === 0);
        } catch (e) {
            if (e instanceof Narsese.InvalidInputException) {
                throw new java.lang.IllegalStateException("Invalid test string.", e);
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
        let a: Term = m.parseTerm("a");
        let b: Term = m.parseTerm("b");
        let c: Term = m.parseTerm("c");

        assertEquals(3, Term.toSortedSetArray(a, b, c).length);
        assertEquals(2, Term.toSortedSetArray(a, b, b).length);
        assertEquals(1, Term.toSortedSetArray(a, a).length);
        assertEquals(1, Term.toSortedSetArray(a).length);
        assertEquals("correct natural ordering", a, Term.toSortedSetArray(a, b)[0]);
    }

    public testConjunctionTreeSet(): void {
        // final Nar n = new Nar();

        // these 2 representations are equal, after natural ordering
        let term1String: java.lang.String = "<#1 --> (&,boy,(/,taller_than,{Tom},_))>";
        let term1: Term = this.np.parseTerm(term1String);
        let term1Alternate: java.lang.String = "<#1 --> (&,(/,taller_than,{Tom},_),boy)>";
        let term1a: Term = this.np.parseTerm(term1Alternate);

        // <#1 --> (|,boy,(/,taller_than,{Tom},_))>
        let term2: Term = this.np.parseTerm("<#1 --> (|,boy,(/,taller_than,{Tom},_))>");

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

        let set: java.util.NavigableSet<Term> = new java.util.TreeSet();
        let added1: boolean = set.add(term1.clone());
        let added2: boolean = set.add(term2.clone());
        assertTrue("term 1 added to set", added1);
        assertTrue("term 2 added to set", added2);

        assertTrue(set.size() === 2);

    }

    public testUnconceptualizedTermInstancing(): void {
        // final Nar n = new Nar();

        let term1String: java.lang.String = "<a --> b>";
        let term1: Term = this.np.parseTerm(term1String);
        let term2: Term = this.np.parseTerm(term1String);

        assertTrue(term1.equals(term2));
        assertTrue(term1.hashCode() === term2.hashCode());

        let cTerm1: CompoundTerm = (term1 as CompoundTerm);
        let cTerm2: CompoundTerm = (term2 as CompoundTerm);

        // test subterms
        assertTrue(cTerm1.term[0].equals(cTerm2.term[0])); // 'a'

    }

    public testConceptInstancing(): void {
        let n: Nar = new Nar();

        let statement1: java.lang.String = "<a --> b>.";

        let a: Term = this.np.parseTerm("a");
        assertTrue(a !== null);
        let a1: Term = this.np.parseTerm("a");
        assertTrue(a.equals(a1));

        n.addInput(statement1);
        n.cycles(4);

        n.addInput(" <a  --> b>.  ");
        n.cycles(1);
        n.addInput(" <a--> b>.  ");
        n.cycles(1);

        let statement2: java.lang.String = "<a --> c>.";
        n.addInput(statement2);
        n.cycles(4);

        let a2: Term = this.np.parseTerm("a");
        assertTrue(a2 !== null);

        let ca: Concept = n.memory.concept(a2);
        assertTrue(ca !== null);

        assertEquals(true, n.memory.concepts.iterator().hasNext());

    }

    public invalidTermIndep(): void {

        let t: java.lang.String = "<$1 --> (~,{place4},$1)>";
        let n: Nar = new Nar();
        let p: Narsese = new Narsese(n);

        let subj: Term = null;
        let pred: Term = null;

        subj = p.parseTerm("$1");
        pred = p.parseTerm("(~,{place4},$1)");

        let s: Statement = Statement.make(NativeOperator.INHERITANCE, subj, pred, false, 0);
        assertEquals(null, s);

        let i: Inheritance = Inheritance.make(subj, pred);
        assertEquals(null, i);

        let forced: CompoundTerm = p.parseTerm("<a --> b>") as CompoundTerm;
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

        let x: Term = p.parseTerm("wonder(a,b)");
        assertEquals(Operation.class, x.getClass());
        assertEquals("(^wonder,a,b)", x.toString());
    }
}
