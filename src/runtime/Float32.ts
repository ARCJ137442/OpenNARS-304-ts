/**
 * Java float-compatible numeric boundaries for translated calculations.
 *
 * A TypeScript `number` is IEEE-754 binary64. Java `float` values are
 * binary32, and Java narrows a float operand before an operation as well as
 * when the result is stored. Keep that rule in one small adapter instead of
 * scattering `Math.fround` casts through inference code.
 */
export type Float32 = number & { readonly __float32: unique symbol };

const narrow = (value: number): Float32 => Math.fround(value) as Float32;

export const Float32Math = {
    from(value: number): Float32 {
        return narrow(value);
    },

    add(left: number, right: number): Float32 {
        return narrow(narrow(left) + narrow(right));
    },

    subtract(left: number, right: number): Float32 {
        return narrow(narrow(left) - narrow(right));
    },

    multiply(left: number, right: number): Float32 {
        return narrow(narrow(left) * narrow(right));
    },

    divide(left: number, right: number): Float32 {
        return narrow(narrow(left) / narrow(right));
    },

    pow(base: number, exponent: number): Float32 {
        return narrow(Math.pow(narrow(base), exponent));
    },

    /**
     * Java Math.pow receives a float operand as a widened double and returns a
     * double. Keep the binary32 input boundary, but do not round the result
     * until the translated caller stores it in a Java float variable.
     */
    powDouble(base: number, exponent: number): number {
        return Math.pow(narrow(base), exponent);
    },

    sqrt(value: number): Float32 {
        return narrow(Math.sqrt(narrow(value)));
    },

    /**
     * Java BudgetFunctions.truthToQuality translated with the same operand
     * boundaries as the source expression:
     * (float) max(exp, (1 - exp) * 0.75).
     */
    truthToQuality(expectation: number): Float32 {
        const exp = narrow(expectation);
        const complement = narrow(narrow(1) - exp);
        return narrow(Math.max(exp, complement * narrow(0.75)));
    },
};
