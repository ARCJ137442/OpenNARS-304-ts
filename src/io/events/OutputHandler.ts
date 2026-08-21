//! Java source: opennars/io/events/OutputHandler.java
import { java, JavaObject, S } from "jree";
import { EventHandler } from "./EventHandler.ts";
import { Events } from "./Events.ts";
import type { Nar } from "../../main/Nar.ts";
import type { Memory } from "../../storage/Memory.ts";

const InputChannel = class IN extends JavaObject {
};
const OutputChannel = class OUT extends JavaObject {
};
const ErrorChannel = class ERR extends JavaObject {
};
const EchoChannel = class ECHO extends JavaObject {
};
const DebugChannel = class DEBUG extends JavaObject {
};
const ExecuteChannel = class EXE extends JavaObject {
};



/**
 * Output Channel: Implements this and Nar.addOutput(..) to receive output
 * signals on various channels
 *
 */
export abstract class OutputHandler extends EventHandler {

    public static readonly IN = InputChannel;
    public static readonly OUT = OutputChannel;
    public static readonly ERR = ErrorChannel;
    public static readonly ECHO = EchoChannel;
    public static readonly DEBUG = DebugChannel;
    public static readonly EXE = ExecuteChannel;

    public static ANTICIPATE = class ANTICIPATE extends JavaObject {
    };


    public static CONFIRM = class CONFIRM extends JavaObject {
    };


    public static DISAPPOINT = class DISAPPOINT extends JavaObject {
    };


    public static readonly DefaultOutputEvents: java.lang.Class<unknown>[] = [InputChannel.class, ExecuteChannel.class, OutputChannel.class, ErrorChannel.class,
    EchoChannel.class, Events.Answer.class, OutputHandler.ANTICIPATE.class, OutputHandler.CONFIRM.class, OutputHandler.DISAPPOINT.class, DebugChannel.class];

    public constructor(n: Nar);

    public constructor(source: EventEmitter, active: boolean);

    public constructor(m: Memory, active: boolean);

    public constructor(n: Nar, active: boolean);
    public constructor(...args: unknown[]) {
        let source: EventEmitter;
        let active: boolean;
        if (args.length === 1) {
            source = (args[0] as Nar).memory.event;
            active = true;
        } else if (args.length === 2) {
            const candidate = args[0] as Nar | Memory | EventEmitter;
            active = args[1] as boolean;
            source = (candidate as Nar).memory?.event
                ?? (candidate as Memory).event
                ?? candidate as EventEmitter;
        } else {
            throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
        }
        super(source, active, OutputHandler.DefaultOutputEvents);
    }


}


