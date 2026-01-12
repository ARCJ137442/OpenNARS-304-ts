//! Java source: opennars/language/SetTensional.java
import { java, type char, type int } from "jree";



/**
 * Base class for SetInt (intensional set) and SetExt (extensional set)
 *
 * @author Patrick Hammer
 */
export abstract class SetTensional extends CompoundTerm {
    /**
     * Constructor with partial values, called by make
     *
     * @param arg The component list of the term
     */
    protected constructor(arg: Term[]) {
        super(arg);

        if (arg.length === 0)
            throw new java.lang.IllegalStateException("0-arg empty set");

        if (Debug.DETAILED) {
            Terms.verifySortedAndUnique(arg, true);
        }

        java.security.cert.CertPathChecker.init(arg);
    }

    /**
     * make the oldName of an ExtensionSet or IntensionSet
     *
     * @param opener the set opener
     * @param closer the set closer
     * @param arg    the list of term
     * @return the oldName of the term
     */
    protected static makeSetName(opener: char, arg: Term[], closer: char): java.lang.CharSequence {
        let size: int = 1 + 1 - 1; // opener + closer - 1 [no preceding separator for first element]

        for (let t of arg)
            size += 1 + t.name().length();

        let n: java.nio.CharBuffer = java.nio.CharBuffer.allocate(size);

        n.append(opener);
        for (let i: int = 0; i < arg.length; i++) {
            if (i !== 0)
                n.append(Symbols.ARGUMENT_SEPARATOR);
            n.append(arg[i].name());
        }
        n.append(closer);

        return n.compact().toString();
    }

    /**
     * Check if the compound is communitative.
     *
     * @return true for communitative
     */
    public isCommutative(): boolean {
        return true;
    }
}
