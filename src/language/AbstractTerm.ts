//! Java source: opennars/language/AbstractTerm.java

import type { int } from "../types.ts";
import type { JavaCharSequenceInput } from "../runtime/jree-compat.ts";



/**
 * Project-owned view of Java's AbstractTerm contract.
 *
 * The translated jree Cloneable/Comparable interfaces also inherit
 * IReflection, which requires java.lang.Object-shaped getClass/equals
 * members.  That runtime shell is not part of AbstractTerm's domain
 * contract, so keep only the methods actually declared or consumed here.
 */
export interface AbstractTerm {

    clone(): AbstractTerm;

    compareTo(o: AbstractTerm): int;


    /**
     * Whether this compound term contains any variable term
     *
     * @return Whether the name contains a variable
     */
    hasVar(): boolean;

    /**
     * Check whether the current Term can name a Concept.
     *
     * @return A Term is constant by default
     */
    isConstant(): boolean;

    /**
     * Reporting the name of the current Term.
     *
     * @return The name of the term as a String
     */
    name(): JavaCharSequenceInput;

}
