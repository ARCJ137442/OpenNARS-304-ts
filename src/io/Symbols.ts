//! Java source: opennars/io/Symbols.java
import type { char } from "../types.ts"; // Java primitive aliases formerly imported from jree; runtime narrowing is separate.
import { ReasonerInputError } from "../runtime/ReasonerErrors.ts";
import { RuntimeObject } from "../runtime/RuntimeClass.ts";

const S = (strings: TemplateStringsArray): string => strings[0] ?? "";



/**
 * @author Patrick Hammer
 */
// Java source declares `class Symbols` with only the implicit Object base;
// keep the nested Java enum boundary, but do not pay for a jree Object shell.
export class Symbols {

    /* sentence type and delimitors */
    public static readonly JUDGMENT_MARK: string = '.';
    public static readonly QUESTION_MARK: string = '?';
    public static readonly GOAL_MARK: string = '!';
    public static readonly QUEST_MARK: string = '@';
    public static readonly TERM_NORMALIZING_WORKAROUND_MARK: string = 'T';

    /* Tense markers */
    public static readonly TENSE_MARK: string = ":";
    public static readonly TENSE_PAST: string = ":\\:";
    public static readonly TENSE_PRESENT: string = ":|:";
    public static readonly TENSE_FUTURE: string = ":/:";

    /* variable type ------------------ */
    public static readonly VAR_INDEPENDENT: string = '$';
    public static readonly VAR_DEPENDENT: string = '#';
    public static readonly VAR_QUERY: string = '?';

    /* numerical value delimitors, must be different from the Term delimitors */
    public static readonly BUDGET_VALUE_MARK: string = '$';
    public static readonly TRUTH_VALUE_MARK: string = '%';
    public static readonly VALUE_SEPARATOR: string = ';';

    /* special characters in argument list */
    public static readonly ARGUMENT_SEPARATOR: string = ',';
    public static readonly IMAGE_PLACE_HOLDER: string = '_';

    /* prefix of special Term name */
    public static readonly INTERVAL_PREFIX: string = '+';
    public static readonly OPERATOR_PREFIX: string = '^';
    public static readonly TERM_PREFIX: string = 'T';
    public static readonly QUOTE: string = '\"';

    /* experience line prefix */
    // Java obtains these names from OutputHandler nested interfaces. Keep the
    // stable wire values at this text boundary instead of importing an event
    // hierarchy during static initialization.
    public static readonly INPUT_LINE_PREFIX: string = "IN";
    public static readonly OUTPUT_LINE_PREFIX: string = "OUT";
    public static readonly ERROR_LINE_PREFIX: string = "ERR";

    public static readonly PREFIX_MARK: string = ':';
    public static readonly COMMENT_MARK: string = '/';
    // public static final char URL_INCLUDE_MARK = '`';
    public static readonly ECHO_MARK: string = '\'';
    // public static final char NATURAL_LANGUAGE_MARK = '\"';

    /* control commands */
    public static readonly RESET_COMMAND: string = "*reset";
    public static readonly REBOOT_COMMAND: string = "*reboot";
    public static readonly STOP_COMMAND: string = "*stop";
    public static readonly START_COMMAND: string = "*start";
    public static readonly SET_NOISE_LEVEL_COMMAND: string = "*volume";
    public static readonly SET_DECISION_LEVEL_COMMAND: string = "*decisionthreshold";

    /* Stamp, display only */
    public static readonly STAMP_OPENER: string = '{';
    public static readonly STAMP_CLOSER: string = '}';
    public static readonly STAMP_SEPARATOR: string = ';';
    public static readonly STAMP_STARTER: string = ':';

    /* TermLink type, display only */
    public static readonly TO_COMPONENT_1: string = "@(";
    public static readonly TO_COMPONENT_2: string = ")_";
    public static readonly TO_COMPOUND_1: string = "_@(";
    public static readonly TO_COMPOUND_2: string = ")";

    public static SELF: string = "SELF";

    public static NativeOperator = class NativeOperator extends RuntimeObject {
        private static readonly members: NativeOperator[] = [];
        private readonly enumName: string;
        private readonly enumOrdinal: number;

        public static values<T>(): T[] {
            return [...NativeOperator.members] as T[];
        }

        /* CompountTerm operators, length = 1 */
        public static readonly INTERSECTION_EXT: NativeOperator = new class extends NativeOperator {
        }("&", false, true, S`INTERSECTION_EXT`, 0);
        public static readonly INTERSECTION_INT: NativeOperator = new class extends NativeOperator {
        }("|", false, true, S`INTERSECTION_INT`, 1);
        public static readonly DIFFERENCE_EXT: NativeOperator = new class extends NativeOperator {
        }("-", false, true, S`DIFFERENCE_EXT`, 2);
        public static readonly DIFFERENCE_INT: NativeOperator = new class extends NativeOperator {
        }("~", false, true, S`DIFFERENCE_INT`, 3);
        public static readonly PRODUCT: NativeOperator = new class extends NativeOperator {
        }("*", false, true, S`PRODUCT`, 4);
        public static readonly IMAGE_EXT: NativeOperator = new class extends NativeOperator {
        }("/", false, true, S`IMAGE_EXT`, 5);
        public static readonly IMAGE_INT: NativeOperator = new class extends NativeOperator {
        }("\\", false, true, S`IMAGE_INT`, 6);

        /* CompoundStatement operators, length = 2 */
        public static readonly NEGATION: NativeOperator = new class extends NativeOperator {
        }("--", false, true, S`NEGATION`, 7);
        public static readonly DISJUNCTION: NativeOperator = new class extends NativeOperator {
        }("||", false, true, S`DISJUNCTION`, 8);
        public static readonly CONJUNCTION: NativeOperator = new class extends NativeOperator {
        }("&&", false, true, S`CONJUNCTION`, 9);
        public static readonly SEQUENCE: NativeOperator = new class extends NativeOperator {
        }("&/", false, true, S`SEQUENCE`, 10);
        public static readonly PARALLEL: NativeOperator = new class extends NativeOperator {
        }("&|", false, true, S`PARALLEL`, 11);
        public static readonly SPATIAL: NativeOperator = new class extends NativeOperator {
        }("#", false, true, S`SPATIAL`, 12);

        /* CompountTerm delimitors, must use 4 different pairs */
        public static readonly SET_INT_OPENER: NativeOperator = new class extends NativeOperator {
        }("[", false, true, S`SET_INT_OPENER`, 13);
        public static readonly SET_INT_CLOSER: NativeOperator = new class extends NativeOperator {
        }("]", false, false, S`SET_INT_CLOSER`, 14);
        public static readonly SET_EXT_OPENER: NativeOperator = new class extends NativeOperator {
        }("{", false, true, S`SET_EXT_OPENER`, 15);
        public static readonly SET_EXT_CLOSER: NativeOperator = new class extends NativeOperator {
        }("}", false, false, S`SET_EXT_CLOSER`, 16);

        /* Syntactical, so is neither relation or isNative */
        public static readonly COMPOUND_TERM_OPENER: NativeOperator = new class extends NativeOperator {
        }("(", false, false, S`COMPOUND_TERM_OPENER`, 17);
        public static readonly COMPOUND_TERM_CLOSER: NativeOperator = new class extends NativeOperator {
        }(")", false, false, S`COMPOUND_TERM_CLOSER`, 18);
        public static readonly STATEMENT_OPENER: NativeOperator = new class extends NativeOperator {
        }("<", false, false, S`STATEMENT_OPENER`, 19);
        public static readonly STATEMENT_CLOSER: NativeOperator = new class extends NativeOperator {
        }(">", false, false, S`STATEMENT_CLOSER`, 20);

        /* Relations */
        public static readonly INHERITANCE: NativeOperator = new class extends NativeOperator {
        }("-->", true, S`INHERITANCE`, 21);
        public static readonly SIMILARITY: NativeOperator = new class extends NativeOperator {
        }("<->", true, S`SIMILARITY`, 22);
        public static readonly INSTANCE: NativeOperator = new class extends NativeOperator {
        }("{--", true, S`INSTANCE`, 23);
        public static readonly PROPERTY: NativeOperator = new class extends NativeOperator {
        }("--]", true, S`PROPERTY`, 24);
        public static readonly INSTANCE_PROPERTY: NativeOperator = new class extends NativeOperator {
        }("{-]", true, S`INSTANCE_PROPERTY`, 25);
        public static readonly IMPLICATION: NativeOperator = new class extends NativeOperator {
        }("==>", true, S`IMPLICATION`, 26);

        /* Temporal Relations */
        public static readonly IMPLICATION_AFTER: NativeOperator = new class extends NativeOperator {
        }("=/>", true, S`IMPLICATION_AFTER`, 27);
        public static readonly IMPLICATION_WHEN: NativeOperator = new class extends NativeOperator {
        }("=|>", true, S`IMPLICATION_WHEN`, 28);
        public static readonly IMPLICATION_BEFORE: NativeOperator = new class extends NativeOperator {
        }("=\\>", true, S`IMPLICATION_BEFORE`, 29);
        public static readonly EQUIVALENCE: NativeOperator = new class extends NativeOperator {
        }("<=>", true, S`EQUIVALENCE`, 30);
        public static readonly EQUIVALENCE_AFTER: NativeOperator = new class extends NativeOperator {
        }("</>", true, S`EQUIVALENCE_AFTER`, 31);
        public static readonly EQUIVALENCE_WHEN: NativeOperator = new class extends NativeOperator {
        }("<|>", true, S`EQUIVALENCE_WHEN`, 32);

        /** an atomic term; this value is set if not a compound term */
        public static readonly ATOM: NativeOperator = new class extends NativeOperator {
        }(".", false, S`ATOM`, 33);

        // -----------------------------------------------------

        /** symbol representation of this getOperator */
        public readonly symbol: string;

        /**
         * character representation of this getOperator if symbol has length 1; else ch
         * = 0
         */
        public readonly ch: string;

        /** is relation? */
        public readonly relation: boolean;

        /** is native */
        public readonly isNative: boolean;

        /** opener? */
        public readonly opener: boolean;

        /** closer? */
        public readonly closer: boolean;

        protected constructor(string: string, $name$: string, $index$: number);

        protected constructor(string: string, relation: boolean, $name$: string, $index$: number);

        protected constructor(string: string, relation: boolean, innate: boolean, $name$: string, $index$: number);
        protected constructor(...args: unknown[]) {
            let string: string;
            let relation = false;
            let innate = false;
            let name: string;
            let index: number;
            if (args.length === 5) {
                [string, relation, innate, name, index] = args as [string, boolean, boolean, string, number];
            } else if (args.length === 4) {
                [string, relation, name, index] = args as [string, boolean, string, number];
                innate = !relation;
            } else if (args.length === 3) {
                [string, name, index] = args as [string, string, number];
            } else {
                throw new ReasonerInputError(S`Invalid number of arguments`);
            }
            super();
            this.enumName = name;
            this.enumOrdinal = index;
            NativeOperator.members.push(this);
            this.symbol = string;
            this.relation = relation;
            this.isNative = innate;
            this.ch = string.length === 1 ? string.charAt(0) : "";
            this.opener = this.enumName.endsWith("_OPENER");
            this.closer = this.enumName.endsWith("_CLOSER");
        }

        public name(): string {
            return this.enumName;
        }

        public ordinal(): number {
            return this.enumOrdinal;
        }

        public toString(): string {
            return this.symbol;
        }
    };

    protected static readonly stringToOperator: Map<string, Symbols.NativeOperator> = new Map<string, Symbols.NativeOperator>();
    protected static readonly charToOperator: Map<string, Symbols.NativeOperator> = new Map<string, Symbols.NativeOperator>();


    static {
        // Setup NativeOperator String index hashtable
        for (const r of Symbols.NativeOperator.values<Symbols.NativeOperator>())
            Symbols.stringToOperator.set(r.symbol, r);

        // Setup NativeOperator Character index hashtable
        for (const r of Symbols.NativeOperator.values<Symbols.NativeOperator>()) {
            let c: string = r.ch;
            if (c !== "")
                Symbols.charToOperator.set(c, r);
        }
    }

    public static getOperator(c: string): Symbols.NativeOperator | null;

    public static getOperator(s: string): Symbols.NativeOperator | null;
    public static getOperator(...args: unknown[]): Symbols.NativeOperator | null {
        switch (args.length) {
            case 1: {
                const [value] = args as [string];
                const nativeValue = typeof value === "string"
                    ? value
                    : String((value as unknown as { valueOf?: () => unknown }).valueOf?.() ?? value);
                return nativeValue.length === 1
                    ? Symbols.charToOperator.get(nativeValue) ?? null
                    : Symbols.stringToOperator.get(nativeValue) ?? null;


            }

            default: {
                throw new ReasonerInputError(S`Invalid number of arguments`);
            }
        }
    }


    public static getRelation(s: string): Symbols.NativeOperator | null {
        let o: Symbols.NativeOperator | null = Symbols.getOperator(s);
        if (o === null)
            return null;
        if (o.relation)
            return o;
        return null;
    }

    public static getOpener(c: string): Symbols.NativeOperator | null {
        let o: Symbols.NativeOperator | null = Symbols.getOperator(c);
        if (o === null)
            return null;
        if (o.opener)
            return o;
        return null;
    }

    public static getCloser(c: string): Symbols.NativeOperator | null {
        let o: Symbols.NativeOperator | null = Symbols.getOperator(c);
        if (o === null)
            return null;
        if (o.closer)
            return o;
        return null;
    }

    /**
     * Check Statement getRelation symbol, called in StringPaser
     *
     * @param s The String to be checked
     * @return if the given String is a getRelation symbol
     */
    public static isRelation(s: string): boolean {
        return Symbols.getRelation(s) !== null;
    }
}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace Symbols {
    export type NativeOperator = {
        symbol: string;
        ch: string;
        relation: boolean;
        isNative: boolean;
        opener: boolean;
        closer: boolean;
        name(): string;
        ordinal(): number;
        equals(other: unknown): boolean;
        toString(): string;
    };
}
