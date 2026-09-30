import { java, JavaObject } from "../../src/runtime/native-runtime.ts";

export type SerialTestCase = (argumentsForTest: JavaObject[]) => void;
export type SerialTestFailureHandler = (argumentsForTest: JavaObject[], error: unknown) => void;

/**
 * Executes migrated parameterized tests one case at a time.
 *
 * The Java sources used JUnit's parameterized runner, but the TypeScript
 * project does not ship JUnit. Keeping the execution loop explicit makes the
 * serial/low-memory behavior part of the test contract and still lets later
 * cases run after an earlier case fails.
 */
export function runSerialParameterized(
    parameters: java.util.Collection<JavaObject[]>,
    runCase: SerialTestCase,
    onFailure: SerialTestFailureHandler,
): void {
    for (const argumentsForTest of parameters) {
        try {
            runCase(argumentsForTest);
        } catch (error) {
            onFailure(argumentsForTest, error);
        }
    }
}
