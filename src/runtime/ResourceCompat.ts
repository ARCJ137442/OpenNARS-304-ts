import { JavaThrowable } from "./JavaExceptions.ts";

type AutoCloseableCompat = {
    close(): void;
};

function toJavaThrowable(error: unknown): JavaThrowable {
    if (error instanceof JavaThrowable) return error;
    if (error instanceof Error) {
        return new JavaThrowable(error.message, (error as Error & { cause?: unknown }).cause ?? null);
    }
    return new JavaThrowable(String(error));
}

export function closeResourcesCompat(resources: AutoCloseableCompat[]): JavaThrowable | undefined {
    let error: JavaThrowable | undefined;
    for (const resource of [...resources].reverse()) {
        try {
            resource.close();
        } catch (cause) {
            const throwable = toJavaThrowable(cause);
            if (error === undefined) {
                error = throwable;
            } else {
                error.addSuppressed(throwable);
            }
        }
    }
    return error;
}

export function handleResourceErrorCompat(cause: unknown, closeError?: JavaThrowable): JavaThrowable {
    const error = toJavaThrowable(cause);
    if (closeError !== undefined) {
        error.addSuppressed(closeError);
    }
    return error;
}

export function throwResourceErrorCompat(error?: JavaThrowable): void {
    if (error !== undefined) throw error;
}
