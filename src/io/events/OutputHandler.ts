//! Java source: opennars/io/events/OutputHandler.java
import { ReasonerInputError } from "../../runtime/ReasonerErrors.ts";
import { RuntimeObject } from "../../runtime/RuntimeClass.ts";
import type { ClassTokenLike } from "../../runtime/RuntimeClass.ts";
import { EventHandler } from "./EventHandler.ts";
import { Events } from "./Events.ts";
import type { EventEmitter } from "./EventEmitter.ts";
import type { Nar } from "../../main/Nar.ts";
import type { Memory } from "../../storage/Memory.ts";

const InputChannel = class IN extends RuntimeObject {
};
const OutputChannel = class OUT extends RuntimeObject {
};
const ErrorChannel = class ERR extends RuntimeObject {
};
const EchoChannel = class ECHO extends RuntimeObject {
};
const DebugChannel = class DEBUG extends RuntimeObject {
};
const ExecuteChannel = class EXE extends RuntimeObject {
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

    public static ANTICIPATE = class ANTICIPATE extends RuntimeObject {
    };


    public static CONFIRM = class CONFIRM extends RuntimeObject {
    };


    public static DISAPPOINT = class DISAPPOINT extends RuntimeObject {
    };


    public static readonly DefaultOutputEvents: ClassTokenLike[] = [InputChannel.class, ExecuteChannel.class, OutputChannel.class, ErrorChannel.class,
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
            throw new ReasonerInputError("Invalid number of arguments");
        }
        super(source, active, ...OutputHandler.DefaultOutputEvents);
    }


}


