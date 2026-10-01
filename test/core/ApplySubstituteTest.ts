import { java, JavaObject, type int } from "../support/legacy-runtime-facade.ts";
import { CompoundTerm } from "../../src/language/CompoundTerm.ts";
import { Nar } from "../../src/main/Nar.ts";
import { Narsese } from "../../src/io/Narsese.ts";
import { Term } from "../../src/language/Term.ts";
import { assertTrue } from "../util/junit-assert.ts";


const parseRequired = (parser: Narsese, input: string): Term => {
    const term = parser.parseTerm(input);
    if (term === null) {
        throw new java.lang.IllegalStateException(new java.lang.String("Expected a term."));
    }
    return term;
};


export class ApplySubstituteTest extends JavaObject {

    protected readonly n: Nar = new Nar();
    protected readonly np: Narsese = new Narsese(this.n);

    public constructor() {
        super();
    }

    public testApplySubstitute(): void {

        const abS = "<a --> b>";
        const ab = parseRequired(this.np, abS) as CompoundTerm;
        let originalComplexity: int = ab.getComplexity();

        const xyS = "<x --> y>";
        const xy = parseRequired(this.np, xyS);

        let h: java.util.Map<Term, Term> = new java.util.LinkedHashMap();
        h.put(parseRequired(this.np, "b"), xy);
        let c: CompoundTerm = ab.applySubstituteToCompound(h);

        assertTrue(c.getComplexity() > originalComplexity);

        assertTrue(ab.name() === abS); // ab unmodified

        assertTrue(String(c.name()) !== abS); // c is actually different
        assertTrue(!c.equals(ab));

    }

    public test2(): void {
        // substituting: <(*,$1) --> num>. with $1 ==> 0
        // final Nar n = new Nar();

        let h: java.util.Map<Term, Term> = new java.util.LinkedHashMap();
        h.put(parseRequired(this.np, "$1"), parseRequired(this.np, "0"));
        const c = (parseRequired(this.np, "<(*,$1) --> num>") as CompoundTerm).applySubstituteToCompound(h);

        assertTrue(c !== null);
    }
}
