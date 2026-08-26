/**
 * The translated core is currently single-threaded. This adapter preserves
 * the Java Thread call surface used by the source migration with native
 * TypeScript values. It does not claim that Node has Java's shared-memory
 * thread model.
 */
export interface RunnableCompat {
    run(): void;
}

export interface StackTraceElementCompat {
    getClassName(): string;
}

export class ThreadCompat {
    private readonly target: RunnableCompat | null;
    private readonly threadName: string | null;
    private interrupted = false;

    public constructor();
    public constructor(target: RunnableCompat, name?: string);
    public constructor(...args: unknown[]) {
        this.target = args.length > 0 ? args[0] as RunnableCompat : null;
        this.threadName = args.length > 1 ? String(args[1]) : null;
    }

    public start(): void {
        if (this.target !== null) {
            ThreadCompat.schedule(() => this.target?.run());
        } else {
            ThreadCompat.schedule(() => this.run());
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

    public getStackTrace(): StackTraceElementCompat[] {
        return [];
    }

    private static schedule(callback: () => void): void {
        const setImmediate = (globalThis as typeof globalThis & {
            setImmediate?: (callback: () => void) => unknown;
        }).setImmediate;
        if (setImmediate !== undefined) {
            setImmediate(callback);
        } else {
            globalThis.setTimeout(callback, 0);
        }
    }
}

export class InterruptedExceptionCompat extends Error {
    public constructor(message = "Thread interrupted") {
        super(message);
        this.name = "InterruptedExceptionCompat";
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
