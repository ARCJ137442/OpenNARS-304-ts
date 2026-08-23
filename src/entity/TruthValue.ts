//! Java source: opennars/entity/TruthValue.java
import { Float32Math } from "../runtime/Float32.ts";

export interface TruthParameters {
    TRUTH_EPSILON: number;
    DEFAULT_CREATION_EXPECTATION: number;
    DEFAULT_JUDGMENT_CONFIDENCE: number;
}

type StringBuilderLike = {
    append(value: string): StringBuilderLike;
};

const DELIMITER: string = "%";
const SEPARATOR: string = ";";

function formatN2(value: number): string {
    value = Float32Math.from(value);
    if (value < 0 || value > 1.0) {
        throw new Error("Invalid value for TruthValue formatN2");
    }
    const hundredths = Math.trunc(Float32Math.add(Float32Math.multiply(value, 100), 0.5));
    switch (hundredths) {
        case 100:
            return "1.00";
        case 99:
            return "0.99";
        case 90:
            return "0.90";
        case 0:
            return "0.00";
        default:
    }
    if (hundredths > 9) {
        const tens = Math.floor(hundredths / 10);
        return `0.${tens}${hundredths % 10}`;
    }
    return `0.0${hundredths}`;
}

/**
 * Truth is a tuple of frequency and confidence as defined by NARS theory.
 */
export class TruthValue {
    private _confidence!: number;
    private _frequency!: number;
    public analytic: boolean;
    public readonly narParameters: TruthParameters;

    public constructor(frequency: number, confidence: number, analytic: boolean, narParameters: TruthParameters) {
        this.narParameters = narParameters;
        this.analytic = analytic;
        this.frequency = frequency;
        this.confidence = confidence;
    }

    public static fromParameters(narParameters: TruthParameters): TruthValue {
        return new TruthValue(0, 0, false, narParameters);
    }

    public static fromFrequencyConfidence(
        frequency: number,
        confidence: number,
        narParameters: TruthParameters,
        analytic: boolean = false
    ): TruthValue {
        return new TruthValue(frequency, confidence, analytic, narParameters);
    }

    public static fromTruthValue(value: TruthValue): TruthValue {
        return new TruthValue(value.frequency, value.confidence, value.analytic, value.narParameters);
    }

    public get confidence(): number {
        return this._confidence;
    }

    public set confidence(confidence: number) {
        const maxConfidence = 1.0 - this.narParameters.TRUTH_EPSILON;
        this._confidence = confidence < maxConfidence ? confidence : maxConfidence;
    }

    public get frequency(): number {
        return this._frequency;
    }

    public set frequency(frequency: number) {
        // Java stores frequency in a float field.  This setter is also the
        // boundary for translated code that still assigns the public field
        // directly, so an `as float` cast cannot silently bypass narrowing.
        this._frequency = Float32Math.from(frequency);
    }

    public mulConfidence(mul: number): TruthValue {
        this.confidence = this.confidence * mul;
        return this;
    }

    public getExpectation(): number {
        // Java: ((float) confidence * (frequency - 0.5f) + 0.5f).
        const confidence = Float32Math.from(this.confidence);
        const centeredFrequency = Float32Math.subtract(this.frequency, 0.5);
        const product = Float32Math.multiply(confidence, centeredFrequency);
        return Float32Math.add(product, 0.5);
    }

    /**
     * Return the Java float evaluation used by budget-quality consumers.
     * Keep getExpectation()'s existing public precision for callers that use
     * the mathematical value directly.
     */
    public getExpectationAsFloat(): number {
        return this.getExpectation();
    }

    public getExpDifAbs(value: TruthValue): number {
        return Float32Math.from(Math.abs(Float32Math.subtract(this.getExpectation(), value.getExpectation())));
    }

    public isNegative(): boolean {
        return this.frequency < 0.5;
    }

    public static isEqual(a: number, b: number, epsilon: number): boolean {
        return Math.abs(a - b) < epsilon;
    }

    public appendString(builder: StringBuilderLike, _external: boolean): StringBuilderLike {
        return builder
            .append(DELIMITER)
            .append(formatN2(this.frequency))
            .append(SEPARATOR)
            .append(formatN2(this.confidence))
            .append(DELIMITER);
    }

    public name(): string {
        return this.formatString(false);
    }

    public toStringExternal(): string {
        return this.formatString(true);
    }

    public toString(): string {
        return this.name();
    }

    public toKey(): string {
        return `f=${this.frequency};c=${this.confidence};a=${this.analytic ? 1 : 0}`;
    }

    public equals(other: unknown): boolean {
        return other instanceof TruthValue
            && TruthValue.isEqual(this.frequency, other.frequency, this.narParameters.TRUTH_EPSILON)
            && TruthValue.isEqual(this.confidence, other.confidence, this.narParameters.TRUTH_EPSILON);
    }

    public hashCode(): number {
        // Java stores frequency as float, so the multiplication is performed
        // with binary32 operands. Confidence is Java double and remains a
        // binary64 operation until the explicit int conversion.
        const frequencyPart: number = Math.trunc(Float32Math.multiply(0xFFFF, this.frequency));
        const confidencePart: number = Math.trunc(0xFFFF * this.confidence);
        return (frequencyPart << 16) | confidencePart;
    }

    public clone(): TruthValue {
        return TruthValue.fromTruthValue(this);
    }

    private formatString(_external: boolean): string {
        return `${DELIMITER}${formatN2(this.frequency)}${SEPARATOR}${formatN2(this.confidence)}${DELIMITER}`;
    }
}
