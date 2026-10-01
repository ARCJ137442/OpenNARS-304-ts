//! Java source: opennars/language/SetTensional.java
import type { int } from "../types.ts"; // Java primitive aliases formerly imported from jree; runtime narrowing is separate.
import { CompoundTerm } from "./CompoundTerm.ts";
import { Symbols } from "../io/Symbols.ts";
import { Debug } from "../main/Debug.ts";
import { Terms } from "./Terms.ts";
import type { Term } from "./Term.ts";
import { asText, type TextCharacter, type TextString } from "../runtime/Text.ts";
import { ReasonerStateError } from "../runtime/ReasonerErrors.ts";

const ARGUMENT_SEPARATOR = Symbols.ARGUMENT_SEPARATOR;



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
            throw new ReasonerStateError("0-arg empty set");

        if (Debug.DETAILED) {
            Terms.verifySortedAndUnique(arg, true);
        }

        // Java initializes the compound metrics in this constructor. Without
        // this call, sets keep CompoundTerm's zero complexity in TypeScript,
        // which makes Concept.getQuality return Infinity once Emotions is on.
        this.init(arg);

    }

    /**
     * make the oldName of an ExtensionSet or IntensionSet
     *
     * @param opener the set opener
     * @param closer the set closer
     * @param arg    the list of term
     * @return the oldName of the term
     */
    protected static makeSetName(opener: TextCharacter, arg: Term[], closer: TextCharacter): TextString {
        const names = arg.map((t) => String(t.name()));
        return asText(`${String(opener)}${names.join(Symbols.ARGUMENT_SEPARATOR)}${String(closer)}`);
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
