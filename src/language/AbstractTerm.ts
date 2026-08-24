//! Java source: opennars/language/AbstractTerm.java

import { java } from "jree";



export interface AbstractTerm extends java.lang.Cloneable<AbstractTerm>, java.lang.Comparable<AbstractTerm> {

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
    name(): java.lang.CharSequence;

}
