


import { java, JavaObject, type int } from "jree";



/**
 * Checks for invariants of Concepts
 */
// TODO run this for each different kind of attention/bag etc
export class AttentionTest extends JavaObject {

    public testSampleNextConcept(): void {

        let numConcepts: int = 32;
        let n: Nar = new Nar();
        for (let i: int = 0; i < numConcepts; i++)
            n.addInput("<x" + i + " <-> x" + (i + 1) + ">.");

        n.cycles(100);

        let c: int = Iterables.size(n.memory.concepts);
        assertTrue(c > 32);

        let uniqueconcepts: java.util.Set<Concept> = new java.util.LinkedHashSet();

        for (let i: int = 0; i < numConcepts; i++) {
            let s: Concept = n.memory.concepts.takeOut();
            n.memory.concepts.putIn(s);
            uniqueconcepts.add(s);
        }

        assertTrue(uniqueconcepts.size() > 1);

        let c2: int = Iterables.size(n.memory.concepts);
        assertEquals("does not affect # of concepts", c, c2);
    }

}
