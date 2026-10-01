import { java, JavaObject } from "../../src/platform/node/legacy-runtime-facade.ts";
import { CompoundTerm } from "../../src/language/CompoundTerm.ts";
import { Nar } from "../../src/main/Nar.ts";
import { Narsese } from "../../src/io/Narsese.ts";
import { Term } from "../../src/language/Term.ts";



/**
 * Tests for interval handling integrity
 *
 * @author Patrick Hammer
 */
export class ReplaceIntervalTest extends JavaObject {
    // <(*,{SELF},<{(*,fragmentC,fragmentD)} --> compare>,TRUE) =\>
    // (*,{SELF},(&/,<{fragmentC} --> mutate>,+12),TRUE)>. %1.00;0.25%
    public replaceIvalTest(): void {
        let nar: Nar = new Nar();
        let parser: Narsese = new Narsese(nar);
        const parsed = parser.parseTerm(
            "<(*,{SELF},<{(*,fragmentC,fragmentD)} --> compare>,TRUE) =\\> (*,{SELF},(&/,<{fragmentC} --> mutate>,+12),TRUE)>");
        if (parsed === null)
            throw new java.lang.IllegalStateException(new java.lang.String("Expected an interval test term."));
        let ret: Term = parsed;
        let ct: CompoundTerm = CompoundTerm.replaceIntervals(ret) as CompoundTerm;
        /* assert (ct.toString().equals(
                "<(*,{SELF},<{(*,fragmentC,fragmentD)} --> compare>,TRUE) =\\> (*,{SELF},(&/,<{fragmentC} --> mutate>,+1),TRUE)>")); */
    }
}
