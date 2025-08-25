import { java, JavaObject } from "jree";



/**
 * Tests the correct functionality of the unifier
 *
 * @author Patrick Hammer
 */
export class UnificationTest extends JavaObject {
    public testUnificationTermination(): void {
        try {
            let nar: Nar = new Nar();
            let parser: Narsese = new Narsese(nar);
            let t1: CompoundTerm = parser.parseTerm(
                "<(&&,$1#1$,$2,$4$3$,(#,$2,$1#1$,$4$3$)) ==> <(*,$1#1$,(*,(/,REPRESENT,$2,_),(/,REPRESENT,$4$3$,_))) --> REPRESENT>>") as CompoundTerm;
            let t2: CompoundTerm = parser.parseTerm(
                "<(&&,#1,$2,$3,(#,$2,#1,$3)) ==> <(*,#1,(*,(/,REPRESENT,$2,_),(/,REPRESENT,$3,_))) --> REPRESENT>>") as CompoundTerm;
            let unifier: java.util.Map<Term, Term>[] = [new java.util.LinkedHashMap<Term, Term>(),
            new java.util.LinkedHashMap<Term, Term>()];
            Variables.findSubstitute(nar.memory.randomNumber, Symbols.VAR_DEPENDENT, t1, t2, unifier);
            // Variables.unify(0, t1, t2, compound)
            // findSubstitute(final char type, final Term term1, final Term term2, final
            // Map<Term, Term>[] map, final boolean allowPartial)
            Variables.findSubstitute(nar.memory.randomNumber, Symbols.VAR_INDEPENDENT, t1, t2, unifier, true);
        } catch (ex) {
            if (ex instanceof java.lang.Exception) {
                /* assert (false); */  // test failed, no matter what happened
            } else {
                throw ex;
            }
        }
    }
}
