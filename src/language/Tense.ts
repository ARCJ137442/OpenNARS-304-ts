//! Java source: opennars/language/Tense.java
import { javaStringValue } from "../runtime/java-text.ts";
import { JavaIllegalArgumentException } from "../runtime/JavaExceptions.ts";
import type { JavaStringInput } from "../runtime/java-text.ts";

/** Native enum-like representation of the canonical Java Tense enum. */
export class Tense {

    public static readonly Past: Tense = new Tense(":\\:", "Past", 0);
    public static readonly Present: Tense = new Tense(":|:", "Present", 1);
    public static readonly Future: Tense = new Tense(":/:", "Future", 2);

    public readonly symbol: string;

    public static readonly Eternal: Tense = null!;

    private constructor(string: string, private readonly enumName: string, private readonly enumOrdinal: number) {
        this.symbol = string;
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

    public static values<T extends Tense = Tense>(): T[] {
        return [Tense.Past, Tense.Present, Tense.Future] as T[];
    }

    public static valueOf(name: string): Tense {
        const value = Tense.values().find(tense => tense.name() === name);
        if (value === undefined) {
            throw new JavaIllegalArgumentException(`No enum constant Tense.${name}`);
        }
        return value;
    }

    private static readonly stringToTense: Map<string, Tense> = new Map<string, Tense>();

    static {
        for (const t of Tense.values()) {
            Tense.stringToTense.set(t.toString(), t);
        }
    }

    public static tense(s: JavaStringInput): Tense {
        // Normalize Java String and native JavaScript string inputs at this
        // parser boundary so Narsese preserves the Java lookup contract.
        return Tense.stringToTense.get(javaStringValue(s)) ?? null!;
    }

}
