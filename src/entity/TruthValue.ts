import { java, JavaObject, type char, type float, type double, type int, S } from "jree";
import { Symbols } from "../io/Symbols";
import { Parameters } from "../main/Parameters";



/**
 * Truth is a tuple of frequency and confidence as defined by NARS theory
 *
 * @author Pei Wang
 * @author Patrick Hammer
 */
export class TruthValue extends JavaObject implements java.lang.Cloneable, java.io.Serializable { // implements Cloneable {

    protected static readonly Truth_TRUE: Term = new Term("TRUE");
    protected static readonly Truth_FALSE: Term = new Term("FALSE");
    protected static readonly Truth_UNSURE: Term = new Term("UNSURE");

    /**
     * character that marks the two ends of a truth value
     */
    private static readonly DELIMITER: char = Symbols.TRUTH_VALUE_MARK;
    /**
     * character that separates the factors in a truth value
     */
    private static readonly SEPARATOR: char = Symbols.VALUE_SEPARATOR;
    /**
     * frequency factor of the truth value
     */
    private frequency: float;
    /**
     * confidence factor of the truth value
     */
    private confidence: double;
    /**
     * Whether the truth value is derived from a definition
     */
    private analytic: boolean = false;

    private narParameters: Parameters;

    /**
     * @param narParameters parameters of the reasoner
     */
    public constructor(narParameters: Parameters);

    /**
     * Constructor with a TruthValue to clone
     *
     * @param v truth value to be cloned
     */
    public constructor(v: TruthValue);

    /**
     * Constructor
     *
     * @param f             frequency value
     * @param c             confidence value
     * @param narParameters parameters of the reasoner
     */
    public constructor(f: float, c: double, narParameters: Parameters);

    /**
     * Constructor
     *
     * @param f             frequency value
     * @param c             confidence value
     * @param isAnalytic    is the truth value an analytic one?
     * @param narParameters parameters of the reasoner
     */
    public constructor(f: float, c: double, isAnalytic: boolean, narParameters: Parameters);
    public constructor(...args: unknown[]) {
        switch (args.length) {
            case 1: {
                const [narParameters] = args as [Parameters];


                this(0, 0, narParameters);


                break;
            }

            case 1: {
                const [v] = args as [TruthValue];


                super();
                this.narParameters = v.narParameters;
                this.frequency = v.getFrequency();
                this.confidence = v.getConfidence();
                this.analytic = v.getAnalytic();


                break;
            }

            case 3: {
                const [f, c, narParameters] = args as [float, double, Parameters];


                this(f, c, false, narParameters);


                break;
            }

            case 4: {
                const [f, c, isAnalytic, narParameters] = args as [float, double, boolean, Parameters];


                super();
                this.narParameters = narParameters;
                this.setFrequency(f);
                this.setConfidence(c);
                this.setAnalytic(isAnalytic);


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    /**
     * returns the frequency value
     *
     * @return frequency value
     */
    public getFrequency(): float {
        return this.frequency;
    }

    /**
     * returns the confidence value
     *
     * @return confidence value
     */
    public getConfidence(): double {
        return this.confidence;
    }

    public setFrequency(f: float): TruthValue {
        this.frequency = f;
        return this;
    }

    public setConfidence(c: double): TruthValue {
        let max_confidence: double = 1.0 - this.narParameters.TRUTH_EPSILON;
        this.confidence = (c < max_confidence) ? c : max_confidence;
        return this;
    }

    public mulConfidence(mul: float): TruthValue {
        let max_confidence: double = 1.0 - this.narParameters.TRUTH_EPSILON;
        let c: double = this.confidence * mul;
        this.confidence = (c < max_confidence) ? c : max_confidence;
        return this;
    }

    /**
     * @return is it a analytic truth value?
     */
    public getAnalytic(): boolean {
        return this.analytic;
    }

    /**
     * Set it to analytic truth
     */
    public setAnalytic(): void;

    public setAnalytic(a: boolean): TruthValue;
    public setAnalytic(...args: unknown[]): void | TruthValue {
        switch (args.length) {
            case 0: {

                this.analytic = true;


                break;
            }

            case 1: {
                const [a] = args as [boolean];


                this.analytic = a;
                return this;


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    /**
     * Calculate the expectation value of the truth value
     *
     * @return expectation value
     */
    public getExpectation(): float {
        return (this.confidence as float * (this.frequency - 0.5) + 0.5);
    }

    /**
     * Calculate the absolute difference of the expectation value and that of a
     * given truth value
     *
     * @param t given value
     * @return absolute difference
     */
    public getExpDifAbs(t: TruthValue): float {
        return java.lang.Math.abs(this.getExpectation() - t.getExpectation());
    }

    /**
     * Check if the truth value is negative
     *
     * @return True if the frequency is less than 1/2
     */
    public isNegative(): boolean {
        return this.getFrequency() < 0.5;
    }

    public static isEqual(a: double, b: double, epsilon: double): boolean {
        let d: double = java.lang.Math.abs(a - b);
        return (d < epsilon);
    }

    /**
     * Compare two truth values
     *
     * @param that other TruthValue
     * @return Whether the two are equivalent
     */
    public override  equals(that: java.lang.Object): boolean {
        if (that instanceof TruthValue) {
            let t: TruthValue = that as TruthValue;
            return TruthValue.isEqual(this.getFrequency(), t.getFrequency(), this.narParameters.TRUTH_EPSILON) &&
                TruthValue.isEqual(this.getConfidence(), t.getConfidence(), this.narParameters.TRUTH_EPSILON);
        }
        return false;
    }

    /**
     * The hash code of a TruthValue
     *
     * @return hash code
     */
    public override  hashCode(): int {
        return (((0xFFFF * this.frequency) & 0) << 16) | ((0xFFFF * this.confidence) & 0);
    }

    public override  clone(): TruthValue {
        return new TruthValue(this.frequency, this.confidence, this.getAnalytic(), this.narParameters);
    }

    /**
     * A simplified String representation of a TruthValue
     */
    public appendString(sb: java.lang.StringBuilder, external: boolean): java.lang.StringBuilder {
        sb.ensureCapacity(11);
        return sb
            .append(TruthValue.DELIMITER)
            .append(Texts.n2(this.frequency))
            .append(TruthValue.SEPARATOR)
            .append(Texts.n2(this.confidence))
            .append(TruthValue.DELIMITER);
    }

    public name(): java.lang.CharSequence {
        let sb: java.lang.StringBuilder = new java.lang.StringBuilder();
        return this.appendString(sb, false);
    }

    /** output representation */
    public toStringExternal(): java.lang.CharSequence {
        let sb: java.lang.StringBuilder = new java.lang.StringBuilder();
        return this.appendString(sb, true);
    }

    /**
     * Returns a String representation of a TruthValue, as used internally by the
     * system
     *
     * @return String representation
     */
    public override  toString(): java.lang.String {
        return this.name().toString();
    }

    public toWordTerm(): Term {
        let e: float = this.getExpectation();
        let t: float = this.narParameters.DEFAULT_CREATION_EXPECTATION;
        if (e > t) {
            return TruthValue.Truth_TRUE;
        }
        if (e < 1 - t) {
            return TruthValue.Truth_FALSE;
        }
        return TruthValue.Truth_UNSURE;
    }

    public static fromWordTerm(narParameters: Parameters, term: Term): TruthValue {
        if (term.equals(TruthValue.Truth_TRUE)) {
            return new TruthValue(1.0, narParameters.DEFAULT_JUDGMENT_CONFIDENCE, narParameters);
        } else if (term.equals(TruthValue.Truth_FALSE)) {
            return new TruthValue(0.0, narParameters.DEFAULT_JUDGMENT_CONFIDENCE, narParameters);
        } else if (term.equals(TruthValue.Truth_UNSURE)) {
            return new TruthValue(0.5, narParameters.DEFAULT_JUDGMENT_CONFIDENCE / 2.0, narParameters);
        } else {
            return null;
        }
    }

    // * 📝【2024-05-08 20:49:46】这个函数并无所用之处
    public set(frequency: float, confidence: double): TruthValue {
        this.setFrequency(frequency);
        this.setConfidence(confidence);
        return this;
    }
}
