import { java, JavaObject, type int, type float, type long, type char, type double, S } from "jree";



/**
 * Utilities for process Text & String input/output, ex: encoding/escaping
 * and decoding/unescaping Terms
 *
 *
 */
export class Texts extends JavaObject {

    /**
     * Half-way between a String and a Rope; concatenates a list of strings into an
     * immutable CharSequence which is either:
     * If a component is null, it is ignored.
     * if total non-null components is 0, returns null
     * if total non-null components is 1, returns that component.
     * if the combined length <= maxLen, creates a StringBuilder appending them
     * all.
     * if the combined length > maxLen, creates a Rope appending them all.
     *
     * TODO do not allow a StringBuilder to appear in output, instead wrap in
     * CharArrayRope
     */
    public static yarn(/* final */ ...components: java.lang.CharSequence[]): java.lang.CharSequence {
        let totalLen: int = 0;
        let total: int = 0;
        let lastNonNull: java.lang.CharSequence = null;
        for (let s of components) {
            if (s !== null) {
                totalLen += s.length();
                total++;
                lastNonNull = s;
            }
        }
        if (total === 0) {
            return null;
        }
        if (total === 1) {
            if (lastNonNull === null)
                throw new java.lang.IllegalStateException("lastNonNull is null");
            return lastNonNull.toString();
        }

        let sb: java.lang.StringBuilder = new java.lang.StringBuilder(totalLen);
        for (let s of components) {
            if (s !== null) {
                sb.append(s);
            }
        }
        return sb;
    }

    protected static readonly fourDecimal: java.text.Format = new java.text.DecimalFormat("0.0000");

    public static n4(/* final */  x: float): java.lang.String {
        return Texts.fourDecimal.format(x);
    }

    protected static readonly twoDecimal: java.text.Format = new java.text.DecimalFormat("0.00");

    public static n2Slow(/* final */  x: float): java.lang.String {
        return Texts.twoDecimal.format(x);
    }

    public static thousandths(/* final */  d: float): long {
        return ((d * 1000 + 0.5)) as long;
    }

    public static hundredths(/* final */  d: float): long {
        return ((d * 100 + 0.5)) as long;
    }

    public static n2(/* final */  x: float): java.lang.CharSequence;

    public static n2(/* final */  p: double): java.lang.CharSequence;
    public static n2(...args: unknown[]): java.lang.CharSequence {
        switch (args.length) {
            case 1: {
                const [x] = args as [float];


                if ((x < 0) || (x > 1.0))
                    throw new java.lang.IllegalStateException("Invalid value for Texts.n2");

                let hundredths: int = hundredths(x) as int;
                switch (hundredths) {
                    // some common values
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
                    let tens: int = hundredths / 10;
                    return new java.lang.String([
                        '0', '.', ('0' + tens) as char, ('0' + hundredths % 10) as char
                    ]);
                } else {
                    return new java.lang.String([
                        '0', '.', '0', ('0' + hundredths) as char
                    ]);
                }


                break;
            }

            case 1: {
                const [p] = args as [double];


                return Texts.n2(p as float);


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    protected static readonly oneDecimal: java.text.Format = new java.text.DecimalFormat("0.0");

    public static n1(/* final */  x: float): java.lang.String {
        return Texts.oneDecimal.format(x);
    }

    public static compareTo(/* final */  s: java.lang.CharSequence, /* final */  t: java.lang.CharSequence): int {
        if ((s instanceof java.lang.String) && (t instanceof java.lang.String)) {
            return (s as java.lang.String).compareTo(t as java.lang.String);
        } else if ((s instanceof java.nio.CharBuffer) && (t instanceof java.nio.CharBuffer)) {
            return (s as java.nio.CharBuffer).compareTo(t as java.nio.CharBuffer);
        }

        let i: int = 0;

        let sl: int = s.length();
        let tl: int = t.length();

        while (i < sl && i < tl) {
            let a: char = s.charAt(i);
            let b: char = t.charAt(i);

            let diff: int = a - b;

            if (diff !== 0)
                return diff;

            i++;
        }

        return sl - tl;
    }

}
