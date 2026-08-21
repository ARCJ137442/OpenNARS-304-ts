//! Java source: opennars/language/Property.java

import { java, JavaObject } from "jree";
import { Inheritance } from "./Inheritance.ts";
import { SetInt } from "./SetInt.ts";



/**
 * A Statement about a Property relation, which is used only in Narsese for I/O,
 * and translated into Inheritance for internal use.
 *
 * @author Patrick Hammer
 */
export abstract class Property extends JavaObject /* would extend "Statement" if it were its own type */ {

    /**
     * Try to make a new compound from two components. Called by the inference
     * rules.
     * <p>
     * A --] B becomes A --> [B]
     *
     * @param subject   The first component
     * @param predicate The second component
     * @return A compound generated or null
     */
    public static make(subject: Term, predicate: Term): Inheritance {
        return Inheritance.make(subject, new SetInt(predicate));
    }
}
