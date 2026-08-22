//! Java source: opennars/language/Tense.java
import { java, S } from "jree";

export class Tense extends java.lang.Enum<Tense> {

    public static readonly Past: Tense = new class extends Tense {
    }(":\\:", S`Past`, 0);
    public static readonly Present: Tense = new class extends Tense {
    }(":|:", S`Present`, 1);
    public static readonly Future: Tense = new class extends Tense {
    }(":/:", S`Future`, 2);

    public readonly symbol: java.lang.String;

    public static readonly Eternal: Tense = null;

    protected constructor(string: java.lang.String, $name$: java.lang.String, $index$: number) {
        super($name$, $index$);
        this.symbol = string;
    }

    public toString(): java.lang.String {
        return this.symbol;
    }

    protected static readonly stringToTense: java.util.Map<java.lang.String, Tense> = new java.util.LinkedHashMap(Tense.values().length * 2);

    static {
        for (let t of Tense.values()) {
            Tense.stringToTense.put(t.toString(), t);
        }
    }

    public static tense(s: java.lang.String): Tense {
        // Java String keys and native JavaScript strings are not interchangeable
        // in jree-backed maps. Normalize at this parser boundary so Narsese
        // preserves the Java tense lookup contract.
        return Tense.stringToTense.get(s) ?? Tense.stringToTense.get(String(s)) ?? null;
    }

}
