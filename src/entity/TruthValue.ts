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
    if (value < 0 || value > 1.0) {
        throw new Error("Invalid value for TruthValue formatN2");
    }
    const hundredths = Math.floor(value * 100 + 0.5);
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
    private frequency: number;
    private confidence: number;
    private analytic: boolean;
    private narParameters: TruthParameters;

    public constructor(frequency: number, confidence: number, analytic: boolean, narParameters: TruthParameters) {
        this.narParameters = narParameters;
        this.analytic = analytic;
        this.setFrequency(frequency);
        this.setConfidence(confidence);
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
        return new TruthValue(value.getFrequency(), value.getConfidence(), value.getAnalytic(), value.getNarParameters());
    }

    public getFrequency(): number {
        return this.frequency;
    }

    public getConfidence(): number {
        return this.confidence;
    }

    public getAnalytic(): boolean {
        return this.analytic;
    }

    public getNarParameters(): TruthParameters {
        return this.narParameters;
    }

    public setFrequency(frequency: number): TruthValue {
        this.frequency = frequency;
        return this;
    }

    public setConfidence(confidence: number): TruthValue {
        const maxConfidence = 1.0 - this.narParameters.TRUTH_EPSILON;
        this.confidence = confidence < maxConfidence ? confidence : maxConfidence;
        return this;
    }

    public mulConfidence(mul: number): TruthValue {
        const maxConfidence = 1.0 - this.narParameters.TRUTH_EPSILON;
        const confidence = this.confidence * mul;
        this.confidence = confidence < maxConfidence ? confidence : maxConfidence;
        return this;
    }

    public setAnalytic(analytic: boolean = true): TruthValue {
        this.analytic = analytic;
        return this;
    }

    public getExpectation(): number {
        return this.confidence * (this.frequency - 0.5) + 0.5;
    }

    public getExpDifAbs(value: TruthValue): number {
        return Math.abs(this.getExpectation() - value.getExpectation());
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

    public clone(): TruthValue {
        return TruthValue.fromTruthValue(this);
    }

    public set(frequency: number, confidence: number): TruthValue {
        this.setFrequency(frequency);
        this.setConfidence(confidence);
        return this;
    }

    private formatString(_external: boolean): string {
        return `${DELIMITER}${formatN2(this.frequency)}${SEPARATOR}${formatN2(this.confidence)}${DELIMITER}`;
    }
}
