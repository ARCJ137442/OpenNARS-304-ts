import { java, JavaObject, type IntNumber, S } from "../support/legacy-runtime-facade.ts";
import { Concept } from "../../src/entity/Concept.ts";
import { Nar } from "../../src/main/Nar.ts";
import { assertEquals, assertTrue } from "../util/junit-assert.ts";



/**
 * Checks for invariants of Concepts
 */
// TODO run this for each different kind of attention/bag etc
export class AttentionTest extends JavaObject {

    public testSampleNextConcept(): void {

        let numConcepts: IntNumber = 32;
        let n: Nar = new Nar();
        for (let i: IntNumber = 0; i < numConcepts; i++)
            n.addInput(S`<x${i} <-> x${i + 1}>.`);

        n.cycles(100);

        let c: IntNumber = n.memory.concepts.size();
        assertTrue(c > 32);

        let uniqueconcepts: java.util.Set<Concept> = new java.util.LinkedHashSet();

        for (let i: IntNumber = 0; i < numConcepts; i++) {
            let s: Concept = n.memory.concepts.takeOut();
            n.memory.concepts.putIn(s);
            uniqueconcepts.add(s);
        }

        assertTrue(uniqueconcepts.size() > 1);

        let c2: IntNumber = n.memory.concepts.size();
        assertEquals("does not affect # of concepts", c, c2);
    }

}
