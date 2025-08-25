import { java, JavaObject, S } from "jree";



/**
 * Output Channel: Implements this and Nar.addOutput(..) to receive output
 * signals on various channels
 *
 */
export abstract class OutputHandler extends EventHandler {

    public static ANTICIPATE = class ANTICIPATE extends JavaObject {
    };


    public static CONFIRM = class CONFIRM extends JavaObject {
    };


    public static DISAPPOINT = class DISAPPOINT extends JavaObject {
    };


    public static readonly DefaultOutputEvents: java.lang.Class<unknown>[] | null = [IN.class, EXE.class, OUT.class, ERR.class,
    ECHO.class, Answer.class, OutputHandler.ANTICIPATE.class, OutputHandler.CONFIRM.class, OutputHandler.DISAPPOINT.class, DEBUG.class];

    public constructor(/* final */  n: Nar | null);

    public constructor(/* final */  source: EventEmitter | null, /* final */  active: boolean);

    public constructor(/* final */  m: Memory | null, /* final */  active: boolean);

    public constructor(/* final */  n: Nar | null, /* final */  active: boolean);
    public constructor(...args: unknown[]) {
        switch (args.length) {
            case 1: {
                const [n] = args as [Nar];


                this(n, true);


                break;
            }

            case 2: {
                const [source, active] = args as [EventEmitter, boolean];


                super(source, active, OutputHandler.DefaultOutputEvents);


                break;
            }

            case 2: {
                const [m, active] = args as [Memory, boolean];


                this(m.event, active);


                break;
            }

            case 2: {
                const [n, active] = args as [Nar, boolean];


                this(n.memory.event, active);


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace OutputHandler {
    export interface IN {
    }

    export interface OUT {
    }

    export interface ERR {
    }

    export interface ECHO {
    }

    export interface DEBUG {
    }

    export interface EXE {
    }

    export type ANTICIPATE = InstanceType<typeof OutputHandler.ANTICIPATE>;
    export type CONFIRM = InstanceType<typeof OutputHandler.CONFIRM>;
    export type DISAPPOINT = InstanceType<typeof OutputHandler.DISAPPOINT>;
}


