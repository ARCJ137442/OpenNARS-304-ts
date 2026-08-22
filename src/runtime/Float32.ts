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

    sqrt(value: number): Float32 {
        return narrow(Math.sqrt(narrow(value)));
    },
};
