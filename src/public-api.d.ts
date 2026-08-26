/**
 * Public TypeScript contract for the published OpenNARS entry point.
 *
 * The implementation is a Java-to-TypeScript translation and contains many
 * internal anonymous compatibility classes. Keep those implementation details
 * out of the package declaration boundary; the public facade describes the
 * stable values and methods that a consumer can use without the source tree.
 */

export type StringLike = string | { toString(): string };

export interface ParsedConfigValue {
    readonly name: string;
    readonly value: string;
}

export interface ParsedPluginArgument {
    readonly type: string | null;
    readonly value: string | null;
    readonly name: string | null;
    readonly isReasoner: boolean;
}

export interface ParsedPlugin {
    readonly classpath: string;
    readonly arguments: readonly ParsedPluginArgument[];
}

export interface ParsedNarConfig {
    readonly values: readonly ParsedConfigValue[];
    readonly plugins: readonly ParsedPlugin[];
}

export function parseConfigXml(text: string): ParsedNarConfig;

export interface EventToken {
    readonly name?: string;
}

export interface EventType {
    readonly class: EventToken;
}

export interface EventObserver {
    event(event: EventToken, args?: readonly unknown[]): void;
}

export interface TruthParameters {
    TRUTH_EPSILON: number;
    DEFAULT_CREATION_EXPECTATION: number;
    DEFAULT_JUDGMENT_CONFIDENCE: number;
}

export class Parameters implements TruthParameters {
    TRUTH_EPSILON: number;
    DEFAULT_CREATION_EXPECTATION: number;
    DEFAULT_JUDGMENT_CONFIDENCE: number;
    DECISION_THRESHOLD: number;
    BUDGET_EPSILON: number;
    BUDGET_THRESHOLD: number;
    HORIZON: number;
    [name: string]: number;
}

export class TruthValue {
    constructor(frequency: number, confidence: number, analytic: boolean, narParameters: TruthParameters);
    static fromParameters(narParameters: TruthParameters): TruthValue;
    static fromFrequencyConfidence(
        frequency: number,
        confidence: number,
        narParameters: TruthParameters,
        analytic?: boolean,
    ): TruthValue;
    static fromTruthValue(value: TruthValue): TruthValue;
    analytic: boolean;
    readonly narParameters: TruthParameters;
    frequency: number;
    confidence: number;
    mulConfidence(mul: number): TruthValue;
    getExpectation(): number;
    getExpectationAsFloat(): number;
    getExpDifAbs(value: TruthValue): number;
    isNegative(): boolean;
    name(): string;
    toStringExternal(): string;
    toKey(): string;
    equals(other: unknown): boolean;
    hashCode(): number;
    clone(): TruthValue;
}

export class BudgetValue {
    constructor(value: BudgetValue);
    constructor(priority: number, durability: number, qualityFromTruth: TruthValue, narParameters: Parameters);
    constructor(priority: number, durability: number, quality: number, narParameters: Parameters);
    clone(): BudgetValue;
    getPriority(): number;
    setPriority(value: number): void;
    incPriority(value: number): void;
    andPriority(value: number): void;
    decPriority(value: number): void;
    getDurability(): number;
    setDurability(value: number): void;
    incDurability(value: number): void;
    decDurability(value: number): void;
    getQuality(): number;
    setQuality(value: number): void;
    incQuality(value: number): void;
    decQuality(value: number): void;
    merge(other: BudgetValue): void;
    greaterThan(other: BudgetValue): boolean;
    summary(): number;
    aboveThreshold(): boolean;
    toStringExternal(): string;
    setLastForgetTime(time: number | bigint): number | bigint;
    getLastForgetTime(): number | bigint;
}

export class Term {
    constructor();
    constructor(name: StringLike);
    static get(name: StringLike | number): Term;
    static text(text: StringLike): Term;
    static isSelf(term: Term): boolean;
    static readonly SELF: Term;
    static readonly SEQ_SPATIAL: Term;
    static readonly SEQ_TEMPORAL: Term;
    name(): StringLike;
    clone(): Term;
    cloneDeep(): Term;
    equals(other: unknown): boolean;
    hashCode(): number;
    isConstant(): boolean;
    getTemporalOrder(): number;
    getIsSpatial(): boolean;
    getComplexity(): number;
    compareTo(other: Term): number;
    containsTerm(target: Term): boolean;
    toString(): string;
    hasVar(type?: string): boolean;
}

export interface MemoryLike {
    readonly narParameters?: Parameters;
}

export class Narsese {
    constructor(memory: MemoryLike | Nar);
    readonly memory: MemoryLike;
    parseTask(input: StringLike): unknown;
    parseTerm(input: StringLike): Term | null;
    static possiblyNarsese(input: StringLike): boolean;
}

export const Parser: {
    readonly InvalidInputException: new (message: string) => Error;
};

export class Debug {
    static SHOW_REASONING_ERRORS: boolean;
    static SHOW_EXECUTION_ERRORS: boolean;
    static SHOW_INPUT_ERRORS: boolean;
    static PARENTS: boolean;
    static REASONING_ERRORS_CONTINUE: boolean;
    static EXECUTION_ERRORS_CONTINUE: boolean;
    static INPUT_ERRORS_CONTINUE: boolean;
    static DETAILED: boolean;
    static readonly DETAILED_SENTENCES: boolean;
    static readonly ANCESTRY: boolean;
    static TEST: boolean;
}

export class Nar {
    static readonly VERSION: StringLike;
    static readonly NAME: StringLike;
    static readonly DEFAULTCONFIG_FILEPATH: StringLike;
    readonly memory: MemoryLike;
    narParameters: Parameters;
    usedConfigFilePath: StringLike;
    constructor(options: NarOptions);
    constructor();
    constructor(configText: StringLike);
    constructor(narId: number | bigint, configText: StringLike);
    constructor(...args: readonly unknown[]);
    reset(): void;
    addInput(input: StringLike): void;
    addInputText(text: StringLike): void;
    concept(term: StringLike): unknown;
    ask(term: StringLike, answered: EventObserver): Nar;
    askNow(term: StringLike, answered: EventObserver): Nar;
    on(event: EventToken, observer: EventObserver): void;
    off(event: EventToken, observer: EventObserver): void;
    start(minCyclePeriodMS?: number | bigint): void;
    stop(): void;
    cycles(cycles: number): void;
    cycle(): void;
    time(): number | bigint;
    isRunning(): boolean;
    getMinCyclePeriodMS(): number | bigint;
    setThreadYield(enabled: boolean): void;
    toString(): string;
}

export interface NarOptions {
    readonly narId?: number | bigint;
    readonly configText?: string;
    readonly configSource?: string;
}

export class Events {
    static readonly CyclesStart: EventType;
    static readonly CyclesEnd: EventType;
    static readonly CycleStart: EventType;
    static readonly CycleEnd: EventType;
    static readonly WorkCycleStart: EventType;
    static readonly WorkCycleEnd: EventType;
    static readonly ResetStart: EventType;
    static readonly ResetEnd: EventType;
    static readonly Perceive: EventType;
    static readonly ConceptForget: EventType;
    static readonly ConceptBeliefAdd: EventType;
    static readonly ConceptBeliefRemove: EventType;
    static readonly ConceptGoalAdd: EventType;
    static readonly ConceptGoalRemove: EventType;
    static readonly ConceptQuestionAdd: EventType;
    static readonly ConceptQuestionRemove: EventType;
    static readonly UnexecutableGoal: EventType;
    static readonly UnexecutableOperation: EventType;
    static readonly NewTaskExecution: EventType;
    static readonly Answer: EventType;
    static readonly TermLinkSelect: EventType;
    static readonly BeliefSelect: EventType;
    static readonly TaskAdd: EventType;
    static readonly TaskRemove: EventType;
    static readonly TaskDerive: EventType;
    static readonly PluginsChange: EventType;
    static readonly ConceptNew: EventType;
}

export class OutputHandler {
    static readonly IN: EventType;
    static readonly OUT: EventType;
    static readonly ERR: EventType;
    static readonly ECHO: EventType;
    static readonly DEBUG: EventType;
    static readonly EXE: EventType;
    static readonly ANTICIPATE: EventType;
    static readonly CONFIRM: EventType;
    static readonly DISAPPOINT: EventType;
    constructor(nar: Nar);
}
