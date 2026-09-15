//! Java source: opennars/language/Tense.java
import { java, S } from "jree";

export class Tense extends java.lang.Enum<Tense> {

    public static readonly Past: Tense = new class extends Tense {
    }(":\\:", S`Past`, 0);
    public static readonly Present: Tense = new class extends Tense {
    }(":|:", S`Present`, 1);
    public static readonly Future: Tense = new class extends Tense {
    }(":/:", S`Future`, 2);

    public readonly symbol: string;

    public static readonly Eternal: Tense = null!;

    protected constructor(string: string, $name$: java.lang.String, $index$: number) {
        super($name$, $index$);
        this.symbol = string;
    }

    public toString(): string {
        return this.symbol;
    }

    protected static readonly stringToTense: Map<string, Tense> = new Map<string, Tense>();

    static {
        for (let t of Tense.values<Tense>()) {
            Tense.stringToTense.set(t.toString(), t);
        }
    }

    public static tense(s: java.lang.String): Tense {
        // Java String keys and native JavaScript strings are not interchangeable
        // in jree-backed maps. Normalize at this parser boundary so Narsese
        // preserves the Java tense lookup contract.
        return Tense.stringToTense.get(String(s)) ?? null!;
    }

}
