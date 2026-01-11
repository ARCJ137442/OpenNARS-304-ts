//! Java source: opennars/language/AbstractTerm.java

import { java } from "jree";



abstract class AbstractTerm extends java.lang.Cloneable, java.lang.Comparable<AbstractTerm> {

    /**
     * Whether this compound term contains any variable term
     *
     * @return Whether the name contains a variable
     */
    protected abstract hasVar(): boolean;

    /**
     * Check whether the current Term can name a Concept.
     *
     * @return A Term is constant by default
     */
    protected abstract isConstant(): boolean;

    /**
     * Reporting the name of the current Term.
     *
     * @return The name of the term as a String
     */
    protected abstract name(): java.lang.CharSequence {
        return java.io.ByteArrayOutputStream.toString();
    }

}
