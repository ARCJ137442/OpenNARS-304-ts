import { java, JavaObject } from "jree";

/**
 * The translated core is currently single-threaded. This adapter preserves
 * the Java Thread call surface used by the source migration without claiming
 * that Node has Java's shared-memory thread model.
 */
export class ThreadCompat extends JavaObject implements java.lang.Runnable {
    private readonly target: java.lang.Runnable | null;
    private readonly threadName: string | null;
    private interrupted = false;

    public constructor();
    public constructor(target: java.lang.Runnable, name?: string);
    public constructor(...args: unknown[]) {
        super();
        this.target = args.length > 0 ? args[0] as java.lang.Runnable : null;
        this.threadName = args.length > 1 ? String(args[1]) : null;
    }

    public start(): void {
        if (this.target !== null) {
            setImmediate(() => this.target?.run());
        } else {
            setImmediate(() => this.run());
        }
    }

    public run(): void {
        this.target?.run();
    }

    public interrupt(): void {
        this.interrupted = true;
    }

    public isInterrupted(): boolean {
        return this.interrupted;
    }

    public getName(): string | null {
        return this.threadName;
    }

    public static sleep(milliseconds: number | bigint): void {
        const timeout = Number(milliseconds);
        if (timeout <= 0 || !Number.isFinite(timeout)) return;
        const signal = new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT));
        Atomics.wait(signal, 0, 0, timeout);
    }

    /** Yield is a scheduling hint in Java; no synchronous equivalent is needed in this single-thread path. */
    public static yield(): void {
        return;
    }

    public static currentThread(): ThreadCompat {
        return new ThreadCompat();
    }

    public getStackTrace(): java.lang.StackTraceElement[] {
        return [];
    }
}

export class InterruptedExceptionCompat extends java.lang.Exception {
}
