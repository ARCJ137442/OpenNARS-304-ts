/**
 * Utilities for processing text input/output, including formatting and comparison.
 */
export class Texts {
    /**
     * Concatenates a list of components into a single string.
     * Null or undefined components are ignored.
     * Returns null when all components are null/undefined.
     */
    public static yarn(...components: Array<string | null | undefined>): string | null {
        const parts: string[] = [];
        for (const component of components) {
            if (component !== null && component !== undefined) {
                parts.push(String(component));
            }
        }
        if (parts.length === 0) {
            return null;
        }
        if (parts.length === 1) {
            return parts[0];
        }
        return parts.join("");
    }

    public static n4(x: number): string {
        return Texts.formatFixed(x, 4);
    }

    public static n2Slow(x: number): string {
        return Texts.formatFixed(x, 2);
    }

    public static thousandths(d: number): number {
        return Math.floor(d * 1000 + 0.5);
    }

    public static hundredths(d: number): number {
        return Math.floor(d * 100 + 0.5);
    }

    public static n2(x: number): string {
        if (x < 0 || x > 1.0) {
            throw new Error("Invalid value for Texts.n2");
        }

        const hundredths = Texts.hundredths(x);
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
                break;
        }

        if (hundredths > 9) {
            const tens = Math.floor(hundredths / 10);
            return `0.${tens}${hundredths % 10}`;
        }
        return `0.0${hundredths}`;
    }

    public static n1(x: number): string {
        return Texts.formatFixed(x, 1);
    }

    public static compareTo(s: string, t: string): number {
        if (s === t) {
            return 0;
        }

        const sl = s.length;
        const tl = t.length;
        const limit = Math.min(sl, tl);

        for (let i = 0; i < limit; i++) {
            const diff = s.charCodeAt(i) - t.charCodeAt(i);
            if (diff !== 0) {
                return diff;
            }
        }

        return sl - tl;
    }

    private static formatFixed(value: number, digits: number): string {
        if (!isFinite(value)) {
            throw new Error("Invalid value for Texts.formatFixed");
        }
        return value.toFixed(digits);
    }
}
