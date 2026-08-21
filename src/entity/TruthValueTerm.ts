import { Term } from "../language/Term.ts";
import { Parameters } from "../main/Parameters.ts";
import { TruthValue } from "./TruthValue.ts";

const TRUTH_TRUE: Term = new Term("TRUE");
const TRUTH_FALSE: Term = new Term("FALSE");
const TRUTH_UNSURE: Term = new Term("UNSURE");

export function truthToWordTerm(truth: TruthValue): Term {
    const e: number = truth.getExpectation();
    const t: number = truth.narParameters.DEFAULT_CREATION_EXPECTATION;
    if (e > t) {
        return TRUTH_TRUE;
    }
    if (e < 1 - t) {
        return TRUTH_FALSE;
    }
    return TRUTH_UNSURE;
}

export function truthFromWordTerm(narParameters: Parameters, term: Term): TruthValue | null {
    if (term.equals(TRUTH_TRUE)) {
        return TruthValue.fromFrequencyConfidence(1.0, narParameters.DEFAULT_JUDGMENT_CONFIDENCE, narParameters);
    }
    if (term.equals(TRUTH_FALSE)) {
        return TruthValue.fromFrequencyConfidence(0.0, narParameters.DEFAULT_JUDGMENT_CONFIDENCE, narParameters);
    }
    if (term.equals(TRUTH_UNSURE)) {
        return TruthValue.fromFrequencyConfidence(0.5, narParameters.DEFAULT_JUDGMENT_CONFIDENCE / 2.0, narParameters);
    }
    return null;
}
