//! Java source: opennars/inference/TruthFunctions.java
import { ReasonerInputError } from "../runtime/ReasonerErrors.ts";
import type { int, float, double, long } from "../types.ts"; // Java primitive aliases formerly imported from jree; runtime narrowing is separate.
import { UtilityFunctions } from "./UtilityFunctions.ts";
import { TruthValue } from "../entity/TruthValue.ts";
import { Parameters } from "../main/Parameters.ts";
import { Float32Math } from "../runtime/Float32.ts";
import { subtractRuntimeLongValues, type RuntimeLongInput } from "../runtime/runtime-numbers.ts";

class EnumType {
    public static readonly DESIREDED = new EnumType("DESIREDED", 0);
    public static readonly DESIREIND = new EnumType("DESIREIND", 1);
    public static readonly DESIREWEAK = new EnumType("DESIREWEAK", 2);
    public static readonly DESIRESTRONG = new EnumType("DESIRESTRONG", 3);
    public static readonly COMPARISON = new EnumType("COMPARISON", 4);
    public static readonly ANALOGY = new EnumType("ANALOGY", 5);
    public static readonly ANONYMOUSANALOGY = new EnumType("ANONYMOUSANALOGY", 6);
    public static readonly DEDUCTION = new EnumType("DEDUCTION", 7);
    public static readonly EXEMPLIFICATION = new EnumType("EXEMPLIFICATION", 8);
    public static readonly ABDUCTION = new EnumType("ABDUCTION", 9);
    public static readonly RESEMBLENCE = new EnumType("RESEMBLENCE", 10);
    public static readonly REDUCECONJUNCTION = new EnumType("REDUCECONJUNCTION", 11);
    public static readonly REDUCEDISJUNCTION = new EnumType("REDUCEDISJUNCTION", 12);
    public static readonly REDUCEDISJUNCTIONREV = new EnumType("REDUCEDISJUNCTIONREV", 13);
    public static readonly REDUCECONJUNCTIONNEG = new EnumType("REDUCECONJUNCTIONNEG", 14);

    private constructor(
        private readonly enumName: string,
        private readonly enumOrdinal: int,
    ) {}

    public name(): string {
        return this.enumName;
    }

    public ordinal(): int {
        return this.enumOrdinal;
    }

    public toString(): string {
        return this.enumName;
    }
}



/**
 * All truth-value (and desire-value) functions used in inference rules
 *
 * @author Pei Wang
 * @author Patrick Hammer
 * @author Robert Wünsche
 */
export class TruthFunctions extends UtilityFunctions {
    public static EnumType = EnumType;


    /**
     * lookup the truth function and compute the value
     *
     * @param type truth-function
     * @param a    truth value of the first premise
     * @param b    truth value of the second premise
     * @return truth value as computed by the truth-function
     */
    public static lookupTruthFunctionAndCompute(type: TruthFunctions.EnumType, a: TruthValue, b: TruthValue,
        narParameters: Parameters): TruthValue {
        switch (type) {
            case DESIREDED:
                return TruthFunctions.desireDed(a, b, narParameters);
            case DESIREIND:
                return TruthFunctions.desireInd(a, b, narParameters);
            case DESIREWEAK:
                return TruthFunctions.desireWeak(a, b, narParameters);
            case DESIRESTRONG:
                return TruthFunctions.desireStrong(a, b, narParameters);
            case COMPARISON:
                return TruthFunctions.comparison(a, b, narParameters);
            case ANALOGY:
                return TruthFunctions.analogy(a, b, narParameters);
            case ANONYMOUSANALOGY:
                return TruthFunctions.anonymousAnalogy(a, b, narParameters);
            case DEDUCTION:
                return TruthFunctions.deduction(a, b, narParameters);
            case EXEMPLIFICATION:
                return TruthFunctions.exemplification(a, b, narParameters);
            case ABDUCTION:
                return TruthFunctions.abduction(a, b, narParameters);
            case RESEMBLENCE:
                return TruthFunctions.resemblance(a, b, narParameters);
            case REDUCECONJUNCTION:
                return TruthFunctions.reduceConjunction(a, b, narParameters);
            case REDUCEDISJUNCTION:
                return TruthFunctions.reduceDisjunction(a, b, narParameters);
            case REDUCEDISJUNCTIONREV:
                return TruthFunctions.reduceDisjunction(b, a, narParameters);
            case REDUCECONJUNCTIONNEG:
                return TruthFunctions.reduceConjunctionNeg(a, b, narParameters);
            default:
                throw new ReasonerInputError("Encountered unimplemented case!"); // internal error
        }
    }

    /**
     * lookup the truth function and compute the value - for two truth functions
     * which are decided by flag
     *
     * @param flag      which type to choose
     * @param typeTrue  truth-function for the case when the flag is true
     * @param typeFalse truth-function for the case when the flag is false
     * @param a         truth value of the first premise
     * @param b         truth value of the second premise
     * @return truth value as computed by the truth-function
     */
    public static lookupTruthFunctionByBoolAndCompute(flag: boolean, typeTrue: TruthFunctions.EnumType,
        typeFalse: TruthFunctions.EnumType, a: TruthValue, b: TruthValue, narParameters: Parameters): TruthValue {
        let type: TruthFunctions.EnumType = flag ? typeTrue : typeFalse;
        return TruthFunctions.lookupTruthFunctionAndCompute(type, a, b, narParameters);
    }

    /**
     * lookup the truth function by the first boolean which is true or return null
     * if no boolean is true
     *
     * @param values tuples of boolean conditional values and their corresponding
     *               truth function
     * @param a      truth value of the first premise
     * @param b      truth value of the second premise
     * @return truth value as computed by the truth-function or null if no boolean
     *         value was true
     */
    // Java source: Object... values; the implementation observes only boolean
    // guards and EnumType selectors, so the boundary does not require JavaObject.
    public static lookupTruthOrNull(a: TruthValue, b: TruthValue, narParameters: Parameters,
        ...values: unknown[]): TruthValue | null {
        let numberOfTuples: int = values.length / 2;

        for (let idx: int = 0; idx < numberOfTuples; idx++) {
            const value: unknown = values[idx * 2];
            if (value === true) {
                let type: TruthFunctions.EnumType = values[idx * 2 + 1] as TruthFunctions.EnumType;
                return TruthFunctions.lookupTruthFunctionAndCompute(type, a, b, narParameters);
            }
        }

        return null;
    }

    /* ----- Single argument functions, called in MatchingRules ----- */
    /**
     * {<A ==> B>} |- <B ==> A>
     *
     * @param v1 Truth value of the premise
     * @return Truth value of the conclusion
     */
    public static conversion(v1: TruthValue, narParameters: Parameters): TruthValue {
        let f1: float = v1.frequency;
        let c1: double = v1.confidence;
        let w: float = and(f1, c1) as float;
        let c: double = w2c(w, narParameters);
        return TruthValue.fromFrequencyConfidence(1, c, narParameters);
    }

    /* ----- Single argument functions, called in StructuralRules ----- */
    /**
     * {A} |- (--A)
     *
     * @param v1 Truth value of the premise
     * @return Truth value of the conclusion
     */
    public static negation(v1: TruthValue, narParameters: Parameters): TruthValue {
        let f: float = Float32Math.subtract(1, v1.frequency) as float;
        let c: double = v1.confidence;
        return TruthValue.fromFrequencyConfidence(f, c, narParameters);
    }

    /**
     * {<A ==> B>} |- <(--, B) ==> (--, A)>
     *
     * @param v1 Truth value of the premise
     * @return Truth value of the conclusion
     */
    public static contraposition(v1: TruthValue, narParameters: Parameters): TruthValue {
        let f1: float = v1.frequency;
        let c1: double = v1.confidence;
        let w: float = and(1 - f1 as double, c1) as float;
        let c: double = w2c(w, narParameters);
        return TruthValue.fromFrequencyConfidence(0, c, narParameters);
    }

    /* ----- double argument functions, called in MatchingRules ----- */
    /**
     * {<S ==> P>, <S ==> P>} |- <S ==> P>
     *
     * @param v1 Truth value of the first premise
     * @param v2 Truth value of the second premise
     * @return Truth value of the conclusion
     */
    public static revision(v1: TruthValue, v2: TruthValue, narParameters: Parameters): TruthValue;

    public static revision(...args: unknown[]): TruthValue {
        switch (args.length) {
            case 3: {
                const [v1, v2, narParameters] = args as [TruthValue, TruthValue, Parameters];


                return TruthFunctions.revisionInto(v1, v2, TruthValue.fromParameters(narParameters), narParameters);


                break;
            }

            case 4: {
                const [v1, v2, result, narParameters] = args as [TruthValue, TruthValue, TruthValue, Parameters];


                return TruthFunctions.revisionInto(v1, v2, result, narParameters);


                break;
            }

            default: {
                throw new ReasonerInputError("Invalid number of arguments");
            }
        }
    }

    private static revisionInto(v1: TruthValue, v2: TruthValue, result: TruthValue,
        narParameters: Parameters): TruthValue {
        let f1: float = v1.frequency;
        let f2: float = v2.frequency;
        let w1: double = c2w(v1.confidence, narParameters);
        let w2: double = c2w(v2.confidence, narParameters);
        let w: double = w1 + w2;
        result.frequency = ((w1 * f1 + w2 * f2) / w) as float;
        result.confidence = w2c(w, narParameters);
        return result;
    }


    /* ----- double argument functions, called in SyllogisticRules ----- */
    /**
     * {<S ==> M>, <M ==> P>} |- <S ==> P>
     *
     * @param v1 Truth value of the first premise
     * @param v2 Truth value of the second premise
     * @return Truth value of the conclusion
     */
    public static deduction(v1: TruthValue, v2: TruthValue, narParameters: Parameters): TruthValue;

    /**
     * {M, <M ==> P>} |- P
     *
     * @param v1       Truth value of the first premise
     * @param reliance Confidence of the second (analytical) premise
     * @return Truth value of the conclusion
     */
    public static deduction(v1: TruthValue, reliance: float, narParameters: Parameters): TruthValue;
    public static deduction(...args: unknown[]): TruthValue {
        if (args.length === 3 && args[1] instanceof TruthValue) {
                const [v1, v2, narParameters] = args as [TruthValue, TruthValue, Parameters];


                let f1: float = v1.frequency;
                let f2: float = v2.frequency;
                let c1: double = v1.confidence;
                let c2: double = v2.confidence;
                let f: float = and(f1, f2) as float;
                let c: double = and(c1, c2, f);
                return TruthValue.fromFrequencyConfidence(f, c, narParameters);
        }
        if (args.length === 3) {
                const [v1, reliance, narParameters] = args as [TruthValue, float, Parameters];


                let f1: float = v1.frequency;
                let c1: double = v1.confidence;
                let c: double = and(f1, c1, reliance);
                return TruthValue.fromFrequencyConfidence(f1, c, narParameters, true);
        }
        throw new ReasonerInputError("Invalid number of arguments");
    }


    /**
     * {<S ==> M>, <M <=> P>} |- <S ==> P>
     *
     * @param v1 Truth value of the first premise
     * @param v2 Truth value of the second premise
     * @return Truth value of the conclusion
     */
    public static analogy(v1: TruthValue, v2: TruthValue, narParameters: Parameters): TruthValue {
        let f1: float = v1.frequency;
        let f2: float = v2.frequency;
        let c1: double = v1.confidence;
        let c2: double = v2.confidence;
        let f: float = and(f1, f2) as float;
        let c: double = and(c1, c2, f2);
        return TruthValue.fromFrequencyConfidence(f, c, narParameters);
    }

    /**
     * {<S <=> M>, <M <=> P>} |- <S <=> P>
     *
     * @param v1 Truth value of the first premise
     * @param v2 Truth value of the second premise
     * @return Truth value of the conclusion
     */
    public static resemblance(v1: TruthValue, v2: TruthValue, narParameters: Parameters): TruthValue {
        let f1: float = v1.frequency;
        let f2: float = v2.frequency;
        let c1: double = v1.confidence;
        let c2: double = v2.confidence;
        let f: float = and(f1, f2) as float;
        let c: double = and(c1, c2, or(f1, f2));
        return TruthValue.fromFrequencyConfidence(f, c, narParameters);
    }

    /**
     * {<S ==> M>, <P ==> M>} |- <S ==> P>
     *
     * @param v1 Truth value of the first premise
     * @param v2 Truth value of the second premise
     * @return Truth value of the conclusion
     */
    public static abduction(v1: TruthValue, v2: TruthValue, narParameters: Parameters): TruthValue;

    /**
     * {M, <P ==> M>} |- P
     *
     * @param v1       Truth value of the first premise
     * @param reliance Confidence of the second (analytical) premise
     * @return Truth value of the conclusion
     */
    public static abduction(v1: TruthValue, reliance: float, narParameters: Parameters): TruthValue;
    public static abduction(...args: unknown[]): TruthValue {
        if (args.length === 3 && args[1] instanceof TruthValue) {
                const [v1, v2, narParameters] = args as [TruthValue, TruthValue, Parameters];


                if (v1.analytic || v2.analytic) {
                    return TruthValue.fromFrequencyConfidence(0.5, 0, narParameters);
                }
                let f1: float = v1.frequency;
                let f2: float = v2.frequency;
                let c1: double = v1.confidence;
                let c2: double = v2.confidence;
                let w: double = and(f2, c1, c2);
                let c: double = w2c(w, narParameters);
                return TruthValue.fromFrequencyConfidence(f1, c, narParameters);
        }
        if (args.length === 3) {
                const [v1, reliance, narParameters] = args as [TruthValue, float, Parameters];


                if (v1.analytic) {
                    return TruthValue.fromFrequencyConfidence(0.5, 0, narParameters);
                }
                let f1: float = v1.frequency;
                let c1: double = v1.confidence;
                let w: double = and(c1, reliance);
                let c: double = w2c(w, narParameters);
                return TruthValue.fromFrequencyConfidence(f1, c, narParameters, true);
        }
        throw new ReasonerInputError("Invalid number of arguments");
    }


    /**
     * {<M ==> S>, <M ==> P>} |- <S ==> P>
     *
     * @param v1 Truth value of the first premise
     * @param v2 Truth value of the second premise
     * @return Truth value of the conclusion
     */
    public static induction(v1: TruthValue, v2: TruthValue, narParameters: Parameters): TruthValue {
        return TruthFunctions.abduction(v2, v1, narParameters);
    }

    /**
     * {<M ==> S>, <P ==> M>} |- <S ==> P>
     *
     * @param v1 Truth value of the first premise
     * @param v2 Truth value of the second premise
     * @return Truth value of the conclusion
     */
    public static exemplification(v1: TruthValue, v2: TruthValue, narParameters: Parameters): TruthValue {
        if (v1.analytic || v2.analytic) {
            return TruthValue.fromFrequencyConfidence(0.5, 0, narParameters);
        }
        let f1: float = v1.frequency;
        let f2: float = v2.frequency;
        let c1: double = v1.confidence;
        let c2: double = v2.confidence;
        let w: double = and(f1, f2, c1, c2);
        let c: double = w2c(w, narParameters);
        return TruthValue.fromFrequencyConfidence(1, c, narParameters);
    }

    /**
     * {<M ==> S>, <M ==> P>} |- <S <=> P>
     *
     * @param v1 Truth value of the first premise
     * @param v2 Truth value of the second premise
     * @return Truth value of the conclusion
     */
    public static comparison(v1: TruthValue, v2: TruthValue, narParameters: Parameters): TruthValue {
        let f1: float = v1.frequency;
        let f2: float = v2.frequency;
        let c1: double = v1.confidence;
        let c2: double = v2.confidence;
        let f0: float = or(f1, f2);
        let f: float = (f0 === 0) ? 0 : Float32Math.divide(and(f1, f2), f0) as float;
        let w: double = and(f0, c1, c2);
        let c: double = w2c(w, narParameters);
        return TruthValue.fromFrequencyConfidence(f, c, narParameters);
    }

    /* ----- desire-value functions, called in SyllogisticRules ----- */
    /**
     * A function specially designed for desire value [To be refined]
     *
     * @param v1 Truth value of the first premise
     * @param v2 Truth value of the second premise
     * @return Truth value of the conclusion
     */
    public static desireStrong(v1: TruthValue, v2: TruthValue, narParameters: Parameters): TruthValue {
        let f1: float = v1.frequency;
        let f2: float = v2.frequency;
        let c1: double = v1.confidence;
        let c2: double = v2.confidence;
        let f: float = and(f1, f2) as float;
        let c: double = and(c1, c2, f2);
        return TruthValue.fromFrequencyConfidence(f, c, narParameters);
    }

    /**
     * A function specially designed for desire value [To be refined]
     *
     * @param v1 Truth value of the first premise
     * @param v2 Truth value of the second premise
     * @return Truth value of the conclusion
     */
    public static desireWeak(v1: TruthValue, v2: TruthValue, narParameters: Parameters): TruthValue {
        let f1: float = v1.frequency;
        let f2: float = v2.frequency;
        let c1: double = v1.confidence;
        let c2: double = v2.confidence;
        let f: float = and(f1, f2) as float;
        let c: double = and(c1, c2, f2, w2c(1.0, narParameters));
        return TruthValue.fromFrequencyConfidence(f, c, narParameters);
    }

    /**
     * A function specially designed for desire value [To be refined]
     *
     * @param v1 Truth value of the first premise
     * @param v2 Truth value of the second premise
     * @return Truth value of the conclusion
     */
    public static desireDed(v1: TruthValue, v2: TruthValue, narParameters: Parameters): TruthValue {
        let f1: float = v1.frequency;
        let f2: float = v2.frequency;
        let c1: double = v1.confidence;
        let c2: double = v2.confidence;
        let f: float = and(f1, f2) as float;
        let c: double = and(c1, c2);
        return TruthValue.fromFrequencyConfidence(f, c, narParameters);
    }

    /**
     * A function specially designed for desire value [To be refined]
     *
     * @param v1 Truth value of the first premise
     * @param v2 Truth value of the second premise
     * @return Truth value of the conclusion
     */
    public static desireInd(v1: TruthValue, v2: TruthValue, narParameters: Parameters): TruthValue {
        let f1: float = v1.frequency;
        let f2: float = v2.frequency;
        let c1: double = v1.confidence;
        let c2: double = v2.confidence;
        let w: double = and(f2, c1, c2);
        let c: double = w2c(w, narParameters);
        return TruthValue.fromFrequencyConfidence(f1, c, narParameters);
    }

    /* ----- double argument functions, called in CompositionalRules ----- */
    /**
     * {<M --> S>, <M > P>} |- <M --> (S|P)>
     *
     * @param v1 Truth value of the first premise
     * @param v2 Truth value of the second premise
     * @return Truth value of the conclusion
     */
    public static union(v1: TruthValue, v2: TruthValue, narParameters: Parameters): TruthValue {
        let f1: float = v1.frequency;
        let f2: float = v2.frequency;
        let c1: double = v1.confidence;
        let c2: double = v2.confidence;
        let f: float = or(f1, f2);
        let c: double = and(c1, c2);
        return TruthValue.fromFrequencyConfidence(f, c, narParameters);
    }

    /**
     * {<M --> S>, <M <-> P>} |- <M --> (S&P)>
     *
     * @param v1 Truth value of the first premise
     * @param v2 Truth value of the second premise
     * @return Truth value of the conclusion
     */
    public static intersection(v1: TruthValue, v2: TruthValue, narParameters: Parameters): TruthValue {
        let f1: float = v1.frequency;
        let f2: float = v2.frequency;
        let c1: double = v1.confidence;
        let c2: double = v2.confidence;
        let f: float = and(f1, f2) as float;
        let c: double = and(c1, c2);
        return TruthValue.fromFrequencyConfidence(f, c, narParameters);
    }

    /**
     * {(||, A, B), (--, B)} |- A
     *
     * @param v1 Truth value of the first premise
     * @param v2 Truth value of the second premise
     * @return Truth value of the conclusion
     */
    public static reduceDisjunction(v1: TruthValue, v2: TruthValue,
        narParameters: Parameters): TruthValue {
        let v0: TruthValue = TruthFunctions.intersection(v1, TruthFunctions.negation(v2, narParameters), narParameters);
        return TruthFunctions.deduction(v0, 1, narParameters);
    }

    /**
     * {(--, (&&, A, B)), B} |- (--, A)
     *
     * @param v1 Truth value of the first premise
     * @param v2 Truth value of the second premise
     * @return Truth value of the conclusion
     */
    public static reduceConjunction(v1: TruthValue, v2: TruthValue,
        narParameters: Parameters): TruthValue {
        let v0: TruthValue = TruthFunctions.intersection(TruthFunctions.negation(v1, narParameters), v2, narParameters);
        return TruthFunctions.negation(TruthFunctions.deduction(v0, 1, narParameters), narParameters);
    }

    /**
     * {(--, (&&, A, (--, B))), (--, B)} |- (--, A)
     *
     * @param v1 Truth value of the first premise
     * @param v2 Truth value of the second premise
     * @return Truth value of the conclusion
     */
    public static reduceConjunctionNeg(v1: TruthValue, v2: TruthValue,
        narParameters: Parameters): TruthValue {
        return TruthFunctions.reduceConjunction(v1, TruthFunctions.negation(v2, narParameters), narParameters);
    }

    /**
     * {(&&, <#x() ==> M>, <#x() ==> P>), S ==> M} |-
     * <S ==> P>
     *
     * @param v1 Truth value of the first premise
     * @param v2 Truth value of the second premise
     * @return Truth value of the conclusion
     */
    public static anonymousAnalogy(v1: TruthValue, v2: TruthValue,
        narParameters: Parameters): TruthValue {
        let f1: float = v1.frequency;
        let c1: double = v1.confidence;
        let v0: TruthValue = TruthValue.fromFrequencyConfidence(f1, w2c(c1, narParameters), narParameters);
        return TruthFunctions.analogy(v2, v0, narParameters);
    }

    /**
     * Indicates the result of eternalization
     *
     * Implements the same functionality like TruthValue
     */
    public static readonly EternalizedTruthValue = class EternalizedTruthValue extends TruthValue {
        public constructor(f: float, c: double, narParameters: Parameters) {
            super(f, c, false, narParameters);
        }
    };


    /**
     * From one moment to eternal
     *
     * @param v1 Truth value of the premise
     * @return Truth value of the conclusion
     */
    public static eternalize(v1: TruthValue, narParameters: Parameters): TruthFunctions.EternalizedTruthValue {
        let f1: float = v1.frequency;
        let c1: double = v1.confidence;
        let c: double = w2c(c1, narParameters);
        return new TruthFunctions.EternalizedTruthValue(f1, c, narParameters);
    }

    public static temporalProjection(sourceTime: RuntimeLongInput, targetTime: RuntimeLongInput, currentTime: RuntimeLongInput,
        param: Parameters): float {
        let a: double = 100000.0 * param.PROJECTION_DECAY; // projection less strict as we changed in v2.0.0 10000.0
        // slower decay than 100000.0
        const sourceTargetDistance = Math.abs(Number(subtractRuntimeLongValues(sourceTime, targetTime)));
        const sourceCurrentDistance = Math.abs(Number(subtractRuntimeLongValues(sourceTime, currentTime)));
        const targetCurrentDistance = Math.abs(Number(subtractRuntimeLongValues(targetTime, currentTime)));
        const denominator = Float32Math.from(
            sourceCurrentDistance
            + targetCurrentDistance
            + a,
        );
        const ratio = Float32Math.divide(sourceTargetDistance, denominator);
        return Float32Math.subtract(1, ratio) as float;
    }
}

// Java inherited static methods and nested enum members are not lexical names
// in TypeScript. Bind the translated names once, after class initialization.
const { and, or, w2c, c2w } = UtilityFunctions;
const {
    DESIREDED,
    DESIREIND,
    DESIREWEAK,
    DESIRESTRONG,
    COMPARISON,
    ANALOGY,
    ANONYMOUSANALOGY,
    DEDUCTION,
    EXEMPLIFICATION,
    ABDUCTION,
    RESEMBLENCE,
    REDUCECONJUNCTION,
    REDUCEDISJUNCTION,
    REDUCEDISJUNCTIONREV,
    REDUCECONJUNCTIONNEG,
} = TruthFunctions.EnumType;

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace TruthFunctions {
    export type EnumType = typeof TruthFunctions.EnumType.DEDUCTION;
    export type EternalizedTruthValue = InstanceType<typeof TruthFunctions.EternalizedTruthValue>;
}


