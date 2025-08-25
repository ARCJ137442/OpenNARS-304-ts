
import { java, JavaObject } from "jree";



/**
 * A Statement about an Instance relation, which is used only in Narsese for
 * I/O,
 * and translated into Inheritance for internal use.
 *
 * @author Patrick Hammer
 */
export abstract class Instance extends JavaObject /* extends Statement */ {

    /**
     * Try to make a new compound from two components. Called by the inference
     * rules.
     * <p>
     * A {-- B becomes {A} --> B
     *
     * @param subject   The first component
     * @param predicate The second component
     * @return A compound generated or null
     */
    public static make(/* final */  subject: Term, /* final */  predicate: Term): Inheritance {
        return Inheritance.make(new SetExt(subject), predicate);
    }
}
