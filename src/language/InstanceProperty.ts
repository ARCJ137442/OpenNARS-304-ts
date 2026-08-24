//! Java source: opennars/language/InstanceProperty.java

import { java, JavaObject } from "jree";
import { Inheritance } from "./Inheritance.ts";
import { SetExt } from "./SetExt.ts";
import { SetInt } from "./SetInt.ts";
import type { Term } from "./Term.ts";



/**
 * A Statement about an InstanceProperty relation, which is used only in Narsese
 * for I/O,
 * and translated into Inheritance for internal use.
 *
 * @author Patrick Hammer
 */
export abstract class InstanceProperty extends JavaObject /* extends Statement */ {

    /**
     * Try to make a new compound from two components. Called by the inference
     * rules.
     * <p>
     * A {-] B becomes {A} --> [B]
     *
     * @param subject   The first component
     * @param predicate The second component
     * @return A compound generated or null
     */
    public static make(subject: Term, predicate: Term): Inheritance {
        return Inheritance.make(new SetExt(subject), new SetInt(predicate));
    }
}
