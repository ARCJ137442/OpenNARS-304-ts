import { java, JavaObject, type int } from "jree";
import { CompoundTerm } from "../../src/language/CompoundTerm.ts";
import { Nar } from "../../src/main/Nar.ts";
import { Narsese } from "../../src/io/Narsese.ts";
import { Term } from "../../src/language/Term.ts";
import { assertTrue } from "../util/junit-assert.ts";



export class ApplySubstituteTest extends JavaObject {

    protected readonly n: Nar = new Nar();
    protected readonly np: Narsese = new Narsese(this.n);

    public constructor() {
        super();
    }

    public testApplySubstitute(): void {

        let abS: java.lang.String = "<a --> b>";
        let ab: CompoundTerm = this.np.parseTerm(abS) as CompoundTerm;
        let originalComplexity: int = ab.getComplexity();

        let xyS: java.lang.String = "<x --> y>";
        let xy: Term = this.np.parseTerm(xyS);

        let h: java.util.Map<Term, Term> = new java.util.LinkedHashMap();
        h.put(this.np.parseTerm("b"), xy);
        let c: CompoundTerm = ab.applySubstituteToCompound(h);

        assertTrue(c.getComplexity() > originalComplexity);

        assertTrue(ab.name().toString().equals(abS)); // ab unmodified

        assertTrue(!c.name().equals(abS)); // c is actually different
        assertTrue(!c.equals(ab));

    }

    public test2(): void {
        // substituting: <(*,$1) --> num>. with $1 ==> 0
        // final Nar n = new Nar();

        let h: java.util.Map<Term, Term> = new java.util.LinkedHashMap();
        h.put(this.np.parseTerm("$1"), this.np.parseTerm("0"));
        let c: CompoundTerm = (this.np.parseTerm("<(*,$1) --> num>") as CompoundTerm).applySubstituteToCompound(h);

        assertTrue(c !== null);
    }
}
