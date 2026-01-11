import type { float } from "jree";
import { Term } from "../language/Term";
import { Parameters } from "../main/Parameters";
import { TruthValue } from "./TruthValue";

const TRUTH_TRUE: Term = new Term("TRUE");
const TRUTH_FALSE: Term = new Term("FALSE");
const TRUTH_UNSURE: Term = new Term("UNSURE");

export function truthToWordTerm(truth: TruthValue): Term {
    const e: float = truth.getExpectation();
    const t: float = truth.getNarParameters().DEFAULT_CREATION_EXPECTATION;
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
        return new TruthValue(1.0, narParameters.DEFAULT_JUDGMENT_CONFIDENCE, narParameters);
    }
    if (term.equals(TRUTH_FALSE)) {
        return new TruthValue(0.0, narParameters.DEFAULT_JUDGMENT_CONFIDENCE, narParameters);
    }
    if (term.equals(TRUTH_UNSURE)) {
        return new TruthValue(0.5, narParameters.DEFAULT_JUDGMENT_CONFIDENCE / 2.0, narParameters);
    }
    return null;
}
