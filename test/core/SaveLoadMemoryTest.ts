import { java, JavaObject } from "jree";
import { Concept } from "../../src/entity/Concept.ts";
import { Nar } from "../../src/main/Nar.ts";



/**
 * Tests for the correct functionality of the serialization fo the state
 *
 * @author Patrick Hammer
 */
export class SaveLoadMemoryTest extends JavaObject {
    public testloadSaveMem(): void {
        let nar: Nar = new Nar();
        nar.addInput("<a --> b>.");
        nar.cycles(1);
        let fname: java.lang.String = new java.lang.String("test1.nars");
        nar.SaveToFile(fname);
        let nar2: Nar = Nar.LoadFromFile(fname);
        let c2: Concept = nar2.concept("<a --> b>");
        /* assert (c2 != null); */
    }
}
