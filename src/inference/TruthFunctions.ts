


import { java, S, type int, type float, type double, type long } from "jree";



/**
 * All truth-value (and desire-value) functions used in inference rules
 *
 * @author Pei Wang
 * @author Patrick Hammer
 * @author Robert Wünsche
 */
export class TruthFunctions extends UtilityFunctions {
    public static EnumType = class EnumType extends java.lang.Enum<EnumType> {
        public static readonly DESIREDED: EnumType = new class extends EnumType {
        }(S`DESIREDED`, 0);
        public static readonly DESIREIND: EnumType = new class extends EnumType {
        }(S`DESIREIND`, 1);
        public static readonly DESIREWEAK: EnumType = new class extends EnumType {
        }(S`DESIREWEAK`, 2);
        public static readonly DESIRESTRONG: EnumType = new class extends EnumType {
        }(S`DESIRESTRONG`, 3);
        public static readonly COMPARISON: EnumType = new class extends EnumType {
        }(S`COMPARISON`, 4);
        public static readonly ANALOGY: EnumType = new class extends EnumType {
        }(S`ANALOGY`, 5);
        public static readonly ANONYMOUSANALOGY: EnumType = new class extends EnumType {
        }(S`ANONYMOUSANALOGY`, 6);
        public static readonly DEDUCTION: EnumType = new class extends EnumType {
        }(S`DEDUCTION`, 7);
        public static readonly EXEMPLIFICATION: EnumType = new class extends EnumType {
        }(S`EXEMPLIFICATION`, 8);
        public static readonly ABDUCTION: EnumType = new class extends EnumType {
        }(S`ABDUCTION`, 9);
        public static readonly RESEMBLENCE: EnumType = new class extends EnumType {
        }(S`RESEMBLENCE`, 10);
        public static readonly REDUCECONJUNCTION: EnumType = new class extends EnumType {
        }(S`REDUCECONJUNCTION`, 11);
        public static readonly REDUCEDISJUNCTION: EnumType = new class extends EnumType {
        }(S`REDUCEDISJUNCTION`, 12);
        public static readonly REDUCEDISJUNCTIONREV: EnumType = new class extends EnumType {
        }(S`REDUCEDISJUNCTIONREV`, 13);
        public static readonly REDUCECONJUNCTIONNEG: EnumType = new class extends EnumType {
        }(S`REDUCECONJUNCTIONNEG`, 14),
    };


    /**
     * lookup the truth function and compute the value
     *
     * @param type truth-function
     * @param a    truth value of the first premise
     * @param b    truth value of the second premise
     * @return truth value as computed by the truth-function
     */
    public static lookupTruthFunctionAndCompute(/* final */  type: TruthFunctions.EnumType | null, /* final */  a: TruthValue | null, /* final */  b: TruthValue | null,
            /* final */  narParameters: java.security.Policy.Parameters | null): TruthValue | null {
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
                throw new java.lang.IllegalArgumentException("Encountered unimplemented case!"); // internal error
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
    public static lookupTruthFunctionByBoolAndCompute(/* final */  flag: boolean, /* final */  typeTrue: TruthFunctions.EnumType | null,
            /* final */  typeFalse: TruthFunctions.EnumType | null, /* final */  a: TruthValue | null, /* final */  b: TruthValue | null, narParameters: java.security.Policy.Parameters | null): TruthValue | null {
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
    public static lookupTruthOrNull(/* final */  a: TruthValue | null, /* final */  b: TruthValue | null, narParameters: java.security.Policy.Parameters | null,
            /* final */ ...values: java.lang.Object | null[]): TruthValue | null {
        let numberOfTuples: int = (java.io.ObjectInputFilter.Status.values.length) / 2;

        for (let idx: int = 0; idx < numberOfTuples; idx++) {
            let v: boolean = java.io.ObjectInputFilter.Status.values[idx * 2] as boolean;
            if (v) {
                let type: TruthFunctions.EnumType = java.io.ObjectInputFilter.Status.values[idx * 2 + 1] as TruthFunctions.EnumType;
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
    public static readonly conversion(/* final */  v1: TruthValue | null, narParameters: java.security.Policy.Parameters | null): TruthValue | null {
        let f1: float = v1.getFrequency();
        let c1: double = v1.getConfidence();
        let w: float = java.math.BigInteger.and(f1, c1) as float;
        let c: double = w2c(w, narParameters);
        return new TruthValue(1, c, narParameters);
    }

    /* ----- Single argument functions, called in StructuralRules ----- */
    /**
     * {A} |- (--A)
     *
     * @param v1 Truth value of the premise
     * @return Truth value of the conclusion
     */
    public static readonly negation(/* final */  v1: TruthValue | null, narParameters: java.security.Policy.Parameters | null): TruthValue | null {
        let f: float = 1 - v1.getFrequency();
        let c: double = v1.getConfidence();
        return new TruthValue(f, c, narParameters);
    }

    /**
     * {<A ==> B>} |- <(--, B) ==> (--, A)>
     *
     * @param v1 Truth value of the premise
     * @return Truth value of the conclusion
     */
    public static readonly contraposition(/* final */  v1: TruthValue | null, narParameters: java.security.Policy.Parameters | null): TruthValue | null {
        let f1: float = v1.getFrequency();
        let c1: double = v1.getConfidence();
        let w: float = java.math.BigInteger.and(1 - f1 as double, c1) as float;
        let c: double = w2c(w, narParameters);
        return new TruthValue(0, c, narParameters);
    }

    /* ----- double argument functions, called in MatchingRules ----- */
    /**
     * {<S ==> P>, <S ==> P>} |- <S ==> P>
     *
     * @param v1 Truth value of the first premise
     * @param v2 Truth value of the second premise
     * @return Truth value of the conclusion
     */
    public static readonly revision(/* final */  v1: TruthValue | null, /* final */  v2: TruthValue | null, narParameters: java.security.Policy.Parameters | null): TruthValue | null;

    private static readonly revision(/* final */  v1: TruthValue | null, /* final */  v2: TruthValue | null, /* final */  result: TruthValue | null,
        narParameters: java.security.Policy.Parameters | null): TruthValue | null;
    public static readonly revision(...args: unknown[]): TruthValue | null {
        switch (args.length) {
            case 3: {
                const [v1, v2, narParameters] = args as [TruthValue, TruthValue, java.security.Policy.Parameters];


                return TruthFunctions.revision(v1, v2, new TruthValue(narParameters), narParameters);


                break;
            }

            case 4: {
                const [v1, v2, result, narParameters] = args as [TruthValue, TruthValue, TruthValue, java.security.Policy.Parameters];


                let f1: float = v1.getFrequency();
                let f2: float = v2.getFrequency();
                let w1: double = c2w(v1.getConfidence(), narParameters);
                let w2: double = c2w(v2.getConfidence(), narParameters);
                let w: double = w1 + w2;
                result.setFrequency(((w1 * f1 + w2 * f2) / w) as float);
                result.setConfidence(w2c(w, narParameters));
                return result;


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    /* ----- double argument functions, called in SyllogisticRules ----- */
    /**
     * {<S ==> M>, <M ==> P>} |- <S ==> P>
     *
     * @param v1 Truth value of the first premise
     * @param v2 Truth value of the second premise
     * @return Truth value of the conclusion
     */
    public static readonly deduction(/* final */  v1: TruthValue | null, /* final */  v2: TruthValue | null, narParameters: java.security.Policy.Parameters | null): TruthValue | null;

    /**
     * {M, <M ==> P>} |- P
     *
     * @param v1       Truth value of the first premise
     * @param reliance Confidence of the second (analytical) premise
     * @return Truth value of the conclusion
     */
    public static readonly deduction(/* final */  v1: TruthValue | null, /* final */  reliance: float, narParameters: java.security.Policy.Parameters | null): TruthValue | null;
    public static readonly deduction(...args: unknown[]): TruthValue | null {
        switch (args.length) {
            case 3: {
                const [v1, v2, narParameters] = args as [TruthValue, TruthValue, java.security.Policy.Parameters];


                let f1: float = v1.getFrequency();
                let f2: float = v2.getFrequency();
                let c1: double = v1.getConfidence();
                let c2: double = v2.getConfidence();
                let f: float = java.math.BigInteger.and(f1, f2) as float;
                let c: double = java.math.BigInteger.and(c1, c2, f);
                return new TruthValue(f, c, narParameters);


                break;
            }

            case 3: {
                const [v1, reliance, narParameters] = args as [TruthValue, float, java.security.Policy.Parameters];


                let f1: float = v1.getFrequency();
                let c1: double = v1.getConfidence();
                let c: double = java.math.BigInteger.and(f1, c1, reliance);
                return new TruthValue(f1, c, true, narParameters);


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    /**
     * {<S ==> M>, <M <=> P>} |- <S ==> P>
     *
     * @param v1 Truth value of the first premise
     * @param v2 Truth value of the second premise
     * @return Truth value of the conclusion
     */
    public static readonly analogy(/* final */  v1: TruthValue | null, /* final */  v2: TruthValue | null, narParameters: java.security.Policy.Parameters | null): TruthValue | null {
        let f1: float = v1.getFrequency();
        let f2: float = v2.getFrequency();
        let c1: double = v1.getConfidence();
        let c2: double = v2.getConfidence();
        let f: float = java.math.BigInteger.and(f1, f2) as float;
        let c: double = java.math.BigInteger.and(c1, c2, f2);
        return new TruthValue(f, c, narParameters);
    }

    /**
     * {<S <=> M>, <M <=> P>} |- <S <=> P>
     *
     * @param v1 Truth value of the first premise
     * @param v2 Truth value of the second premise
     * @return Truth value of the conclusion
     */
    public static readonly resemblance(/* final */  v1: TruthValue | null, /* final */  v2: TruthValue | null, narParameters: java.security.Policy.Parameters | null): TruthValue | null {
        let f1: float = v1.getFrequency();
        let f2: float = v2.getFrequency();
        let c1: double = v1.getConfidence();
        let c2: double = v2.getConfidence();
        let f: float = java.math.BigInteger.and(f1, f2) as float;
        let c: double = java.math.BigInteger.and(c1, c2, java.math.BigInteger.or(f1, f2));
        return new TruthValue(f, c, narParameters);
    }

    /**
     * {<S ==> M>, <P ==> M>} |- <S ==> P>
     *
     * @param v1 Truth value of the first premise
     * @param v2 Truth value of the second premise
     * @return Truth value of the conclusion
     */
    public static readonly abduction(/* final */  v1: TruthValue | null, /* final */  v2: TruthValue | null, narParameters: java.security.Policy.Parameters | null): TruthValue | null;

    /**
     * {M, <P ==> M>} |- P
     *
     * @param v1       Truth value of the first premise
     * @param reliance Confidence of the second (analytical) premise
     * @return Truth value of the conclusion
     */
    public static readonly abduction(/* final */  v1: TruthValue | null, /* final */  reliance: float, narParameters: java.security.Policy.Parameters | null): TruthValue | null;
    public static readonly abduction(...args: unknown[]): TruthValue | null {
        switch (args.length) {
            case 3: {
                const [v1, v2, narParameters] = args as [TruthValue, TruthValue, java.security.Policy.Parameters];


                if (v1.getAnalytic() || v2.getAnalytic()) {
                    return new TruthValue(0.5, 0, narParameters);
                }
                let f1: float = v1.getFrequency();
                let f2: float = v2.getFrequency();
                let c1: double = v1.getConfidence();
                let c2: double = v2.getConfidence();
                let w: double = java.math.BigInteger.and(f2, c1, c2);
                let c: double = w2c(w, narParameters);
                return new TruthValue(f1, c, narParameters);


                break;
            }

            case 3: {
                const [v1, reliance, narParameters] = args as [TruthValue, float, java.security.Policy.Parameters];


                if (v1.getAnalytic()) {
                    return new TruthValue(0.5, 0, narParameters);
                }
                let f1: float = v1.getFrequency();
                let c1: double = v1.getConfidence();
                let w: double = java.math.BigInteger.and(c1, reliance);
                let c: double = w2c(w, narParameters);
                return new TruthValue(f1, c, true, narParameters);


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    /**
     * {<M ==> S>, <M ==> P>} |- <S ==> P>
     *
     * @param v1 Truth value of the first premise
     * @param v2 Truth value of the second premise
     * @return Truth value of the conclusion
     */
    public static readonly induction(/* final */  v1: TruthValue | null, /* final */  v2: TruthValue | null, narParameters: java.security.Policy.Parameters | null): TruthValue | null {
        return TruthFunctions.abduction(v2, v1, narParameters);
    }

    /**
     * {<M ==> S>, <P ==> M>} |- <S ==> P>
     *
     * @param v1 Truth value of the first premise
     * @param v2 Truth value of the second premise
     * @return Truth value of the conclusion
     */
    public static readonly exemplification(/* final */  v1: TruthValue | null, /* final */  v2: TruthValue | null, narParameters: java.security.Policy.Parameters | null): TruthValue | null {
        if (v1.getAnalytic() || v2.getAnalytic()) {
            return new TruthValue(0.5, 0, narParameters);
        }
        let f1: float = v1.getFrequency();
        let f2: float = v2.getFrequency();
        let c1: double = v1.getConfidence();
        let c2: double = v2.getConfidence();
        let w: double = java.math.BigInteger.and(f1, f2, c1, c2);
        let c: double = w2c(w, narParameters);
        return new TruthValue(1, c, narParameters);
    }

    /**
     * {<M ==> S>, <M ==> P>} |- <S <=> P>
     *
     * @param v1 Truth value of the first premise
     * @param v2 Truth value of the second premise
     * @return Truth value of the conclusion
     */
    public static readonly comparison(/* final */  v1: TruthValue | null, /* final */  v2: TruthValue | null, narParameters: java.security.Policy.Parameters | null): TruthValue | null {
        let f1: float = v1.getFrequency();
        let f2: float = v2.getFrequency();
        let c1: double = v1.getConfidence();
        let c2: double = v2.getConfidence();
        let f0: float = java.math.BigInteger.or(f1, f2);
        let f: float = (f0 === 0) ? 0 : (java.math.BigInteger.and(f1, f2) as float / f0);
        let w: double = java.math.BigInteger.and(f0, c1, c2);
        let c: double = w2c(w, narParameters);
        return new TruthValue(f, c, narParameters);
    }

    /* ----- desire-value functions, called in SyllogisticRules ----- */
    /**
     * A function specially designed for desire value [To be refined]
     *
     * @param v1 Truth value of the first premise
     * @param v2 Truth value of the second premise
     * @return Truth value of the conclusion
     */
    public static readonly desireStrong(/* final */  v1: TruthValue | null, /* final */  v2: TruthValue | null, narParameters: java.security.Policy.Parameters | null): TruthValue | null {
        let f1: float = v1.getFrequency();
        let f2: float = v2.getFrequency();
        let c1: double = v1.getConfidence();
        let c2: double = v2.getConfidence();
        let f: float = java.math.BigInteger.and(f1, f2) as float;
        let c: double = java.math.BigInteger.and(c1, c2, f2);
        return new TruthValue(f, c, narParameters);
    }

    /**
     * A function specially designed for desire value [To be refined]
     *
     * @param v1 Truth value of the first premise
     * @param v2 Truth value of the second premise
     * @return Truth value of the conclusion
     */
    public static readonly desireWeak(/* final */  v1: TruthValue | null, /* final */  v2: TruthValue | null, narParameters: java.security.Policy.Parameters | null): TruthValue | null {
        let f1: float = v1.getFrequency();
        let f2: float = v2.getFrequency();
        let c1: double = v1.getConfidence();
        let c2: double = v2.getConfidence();
        let f: float = java.math.BigInteger.and(f1, f2) as float;
        let c: double = java.math.BigInteger.and(c1, c2, f2, w2c(1.0, narParameters));
        return new TruthValue(f, c, narParameters);
    }

    /**
     * A function specially designed for desire value [To be refined]
     *
     * @param v1 Truth value of the first premise
     * @param v2 Truth value of the second premise
     * @return Truth value of the conclusion
     */
    public static readonly desireDed(/* final */  v1: TruthValue | null, /* final */  v2: TruthValue | null, narParameters: java.security.Policy.Parameters | null): TruthValue | null {
        let f1: float = v1.getFrequency();
        let f2: float = v2.getFrequency();
        let c1: double = v1.getConfidence();
        let c2: double = v2.getConfidence();
        let f: float = java.math.BigInteger.and(f1, f2) as float;
        let c: double = java.math.BigInteger.and(c1, c2);
        return new TruthValue(f, c, narParameters);
    }

    /**
     * A function specially designed for desire value [To be refined]
     *
     * @param v1 Truth value of the first premise
     * @param v2 Truth value of the second premise
     * @return Truth value of the conclusion
     */
    public static readonly desireInd(/* final */  v1: TruthValue | null, /* final */  v2: TruthValue | null, narParameters: java.security.Policy.Parameters | null): TruthValue | null {
        let f1: float = v1.getFrequency();
        let f2: float = v2.getFrequency();
        let c1: double = v1.getConfidence();
        let c2: double = v2.getConfidence();
        let w: double = java.math.BigInteger.and(f2, c1, c2);
        let c: double = w2c(w, narParameters);
        return new TruthValue(f1, c, narParameters);
    }

    /* ----- double argument functions, called in CompositionalRules ----- */
    /**
     * {<M --> S>, <M > P>} |- <M --> (S|P)>
     *
     * @param v1 Truth value of the first premise
     * @param v2 Truth value of the second premise
     * @return Truth value of the conclusion
     */
    public static readonly union(/* final */  v1: TruthValue | null, /* final */  v2: TruthValue | null, narParameters: java.security.Policy.Parameters | null): TruthValue | null {
        let f1: float = v1.getFrequency();
        let f2: float = v2.getFrequency();
        let c1: double = v1.getConfidence();
        let c2: double = v2.getConfidence();
        let f: float = java.math.BigInteger.or(f1, f2);
        let c: double = java.math.BigInteger.and(c1, c2);
        return new TruthValue(f, c, narParameters);
    }

    /**
     * {<M --> S>, <M <-> P>} |- <M --> (S&P)>
     *
     * @param v1 Truth value of the first premise
     * @param v2 Truth value of the second premise
     * @return Truth value of the conclusion
     */
    public static readonly intersection(/* final */  v1: TruthValue | null, /* final */  v2: TruthValue | null, narParameters: java.security.Policy.Parameters | null): TruthValue | null {
        let f1: float = v1.getFrequency();
        let f2: float = v2.getFrequency();
        let c1: double = v1.getConfidence();
        let c2: double = v2.getConfidence();
        let f: float = java.math.BigInteger.and(f1, f2) as float;
        let c: double = java.math.BigInteger.and(c1, c2);
        return new TruthValue(f, c, narParameters);
    }

    /**
     * {(||, A, B), (--, B)} |- A
     *
     * @param v1 Truth value of the first premise
     * @param v2 Truth value of the second premise
     * @return Truth value of the conclusion
     */
    public static readonly reduceDisjunction(/* final */  v1: TruthValue | null, /* final */  v2: TruthValue | null,
        narParameters: java.security.Policy.Parameters | null): TruthValue | null {
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
    public static readonly reduceConjunction(/* final */  v1: TruthValue | null, /* final */  v2: TruthValue | null,
        narParameters: java.security.Policy.Parameters | null): TruthValue | null {
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
    public static readonly reduceConjunctionNeg(/* final */  v1: TruthValue | null, /* final */  v2: TruthValue | null,
        narParameters: java.security.Policy.Parameters | null): TruthValue | null {
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
    public static readonly anonymousAnalogy(/* final */  v1: TruthValue | null, /* final */  v2: TruthValue | null,
        narParameters: java.security.Policy.Parameters | null): TruthValue | null {
        let f1: float = v1.getFrequency();
        let c1: double = v1.getConfidence();
        let v0: TruthValue = new TruthValue(f1, w2c(c1, narParameters), narParameters);
        return TruthFunctions.analogy(v2, v0, narParameters);
    }

    /**
     * Indicates the result of eternalization
     *
     * Implements the same functionality like TruthValue
     */
    public static readonly EternalizedTruthValue = class EternalizedTruthValue extends TruthValue {
        public constructor(/* final */  f: float, /* final */  c: double, narParameters: java.security.Policy.Parameters | null) {
            super(f, c, narParameters);
        }
    };


    /**
     * From one moment to eternal
     *
     * @param v1 Truth value of the premise
     * @return Truth value of the conclusion
     */
    public static readonly eternalize(/* final */  v1: TruthValue | null, narParameters: java.security.Policy.Parameters | null): TruthFunctions.EternalizedTruthValue | null {
        let f1: float = v1.getFrequency();
        let c1: double = v1.getConfidence();
        let c: double = w2c(c1, narParameters);
        return new TruthFunctions.EternalizedTruthValue(f1, c, narParameters);
    }

    public static readonly temporalProjection(/* final */  sourceTime: long, /* final */  targetTime: long, /* final */  currentTime: long,
        param: java.security.Policy.Parameters | null): float {
        let a: double = 100000.0 * param.PROJECTION_DECAY; // projection less strict as we changed in v2.0.0 10000.0
        // slower decay than 100000.0
        return 1.0 - java.lang.Math.abs(sourceTime - targetTime)
            / (java.lang.Math.abs(sourceTime - currentTime) + java.lang.Math.abs(targetTime - currentTime) + a) as float;
    }
}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace TruthFunctions {
    export type EnumType = InstanceType<typeof TruthFunctions.EnumType>;
    export type EternalizedTruthValue = InstanceType<typeof TruthFunctions.EternalizedTruthValue>;
}


