import { java, S } from "jree";

class Tense extends java.lang.Enum<Tense> {

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
        return Tense.stringToTense.get(s);
    }

}
