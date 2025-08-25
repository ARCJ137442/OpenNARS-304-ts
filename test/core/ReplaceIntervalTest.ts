


import { java, JavaObject } from "jree";



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
        let ret: Term = parser.parseTerm(
            "<(*,{SELF},<{(*,fragmentC,fragmentD)} --> compare>,TRUE) =\\> (*,{SELF},(&/,<{fragmentC} --> mutate>,+12),TRUE)>");
        let ct: CompoundTerm = CompoundTerm.replaceIntervals(ret) as CompoundTerm;
        /* assert (ct.toString().equals(
                "<(*,{SELF},<{(*,fragmentC,fragmentD)} --> compare>,TRUE) =\\> (*,{SELF},(&/,<{fragmentC} --> mutate>,+1),TRUE)>")); */
    }
}
