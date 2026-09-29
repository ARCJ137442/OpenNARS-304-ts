/**
 * Node/parity-only compatibility entry for translated Java runtime objects.
 *
 * The reasoning core imports project-owned contracts from `runtime`; this
 * module is the single npm-jree boundary retained while the remaining boxed
 * Java I/O and reflection shapes are migrated. Browser builds must replace
 * this entry at the host boundary.
 */
import { Class, JavaObject, java } from "jree";
import { JavaException, JavaThrowable } from "../../runtime/JavaExceptions.ts";

export { Class, JavaObject, java };
export type JavaStringInput = java.lang.String | string;

/** Convert native text only at a Node/Jree host boundary. */
export const toJavaString = (value: JavaStringInput): java.lang.String =>
    value instanceof java.lang.String ? value : new java.lang.String(value);

/** Observe both project-owned and legacy jree exceptions at the Node edge. */
export const isJavaThrowable = (value: unknown): value is JavaThrowable =>
    value instanceof JavaThrowable || value instanceof java.lang.Throwable;

export const isJavaException = (value: unknown): value is JavaException =>
    value instanceof JavaException || value instanceof java.lang.Exception;
