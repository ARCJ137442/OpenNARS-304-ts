//! Java source: opennars/main/NarNode.java
import { java, closeResources, handleResourceError, throwResourceError } from "jree";
import type { ClassTokenLike } from "../runtime/RuntimeClass.ts";
import { RuntimeObject } from "../runtime/RuntimeClass.ts";
import type { int, float } from "../types.ts"; // Java primitive aliases formerly imported from jree; runtime narrowing is separate.
import { Float32Math } from "../runtime/Float32.ts";
import { Nar } from "./Nar.ts";
import { Events } from "../io/events/Events.ts";
import type { EventEmitter } from "../io/events/EventEmitter.ts";
import { CompoundTerm } from "../language/CompoundTerm.ts";
import { Term } from "../language/Term.ts";
import { Task } from "../entity/Task.ts";
import { ThreadCompat } from "../runtime/ThreadCompat.ts";
import { isJavaException, JavaSystemLoggerCompat, toJavaString, type JavaStringInput } from "../runtime/jree-compat.ts";

type EventObserver = EventEmitter.EventObserver;
type DatagramPacketCompat = { getLength(): number };
type DatagramSocketCompat = {
    send(packet: DatagramPacketCompat): void;
    receive(packet: DatagramPacketCompat): void;
};
type InetAddressCompat = object;
type JavaNetCompat = {
    DatagramSocket: new (...args: unknown[]) => DatagramSocketCompat;
    DatagramPacket: new (...args: unknown[]) => DatagramPacketCompat;
    InetAddress: { getByName(host: unknown): InetAddressCompat };
};
type ObjectOutputCompat = { writeObject(value: unknown): void; close(): void };
type ObjectInputStreamCompat = { readObject(): unknown; close(): void };
type JavaIoCompat = {
    ObjectOutputStream: new (stream: unknown) => ObjectOutputCompat;
    ObjectInputStream: new (stream: unknown) => ObjectInputStreamCompat;
    ByteArrayInputStream: new (bytes: Int8Array) => unknown;
};

const javaNetCompat = java.net as unknown as JavaNetCompat;
const javaIoCompat = java.io as unknown as JavaIoCompat;

/**
 * @author Patrick Hammer
 */
// Java 原始声明：public class NarNode implements EventObserver。
// 旧 TS 仅为提供 .class 身份令牌而继承 jree.JavaObject；RuntimeObject 保留这一窄契约。
export class NarNode extends RuntimeObject implements EventObserver {

    /* An extra event for received tasks */
    public EventReceivedTask = (($outer) => {
        // Java 原始声明：public class EventReceivedTask；这里只需要 .class 身份令牌。
        return class EventReceivedTask extends RuntimeObject {
        }
    })(this);


    /* The socket the Nar listens from */
    private receiveSocket: DatagramSocketCompat;

    // /*
    // * Listen port however is not transient and can be used to recover the
    // * deserialized instance
    // */
    // private int listenPort;

    public nar: Nar;

    /***
     * Create a Nar node that listens for received tasks from other NarNode
     * instances
     *
     * @param listenPort
     * @throws SocketException
     * @throws UnknownHostException
     */
    public constructor(listenPort: int);

    public constructor(nar: Nar, listenPort: int);
    public constructor(...args: unknown[]) {
        super();

        let nar: Nar;
        let listenPort: int;
        if (args.length === 1) {
            listenPort = args[0] as int;
            nar = new Nar();
        } else if (args.length === 2) {
            [nar, listenPort] = args as [Nar, int];
        } else {
            throw new java.lang.IllegalArgumentException("Invalid number of arguments");
        }

        this.nar = nar;
        // this.listenPort = listenPort;
        this.receiveSocket = new javaNetCompat.DatagramSocket(listenPort, javaNetCompat.InetAddress.getByName("127.0.0.1"));
        nar.event(this, true, Events.TaskAdd.class);
        let THIS: NarNode = this;
        new class extends ThreadCompat {
            public run(): void {
                for (; ;) {
                    try {
                        let ret: java.lang.Object = THIS.receiveObject();
                        if (ret !== null) {
                            if (ret instanceof Task) {
                                nar.memory.event.emit(THIS.EventReceivedTask.class, [ret]);
                                nar.addInput(ret as Task, nar);
                            } else if (ret instanceof java.lang.String) { // emits IN.class anyway
                                nar.addInput(ret as java.lang.String);
                            }
                        }
                    } catch (ex) {
                        if (isJavaException(ex)) { // log any type of exception, also parsing exceptions, because it shouldn't
                            // crash on wrong parses or temporary network issues
                            JavaSystemLoggerCompat.getLogger(NarNode.class.getName()).log(JavaSystemLoggerCompat.Level.SEVERE, null, ex);
                        } else {
                            throw ex;
                        }
                    }
                }
            }
        }().start();
    }


    /**
     * Input and derived tasks will be potentially sent
     *
     * @param event
     * @param args
     */
    public event(event: ClassTokenLike, args: EventEmitter.EventPayload): void {
        if (event === Events.TaskAdd.class) {
            let t: Task = args[0] as Task;
            try {
                this.sendTask(t);
            } catch (ex) {
                if (isJavaException(ex)) {
                    JavaSystemLoggerCompat.getLogger(NarNode.class.getName()).log(JavaSystemLoggerCompat.Level.SEVERE, null, ex);
                } else {
                    throw ex;
                }
            }
        }
    }

    /**
     * Send tasks that are above priority threshold and contain the optional
     * mustContainTerm
     *
     * @param t
     * @throws IOException
     */
    private sendTask(t: Task): void {
        let bStream: java.io.ByteArrayOutputStream = new java.io.ByteArrayOutputStream();
        let oo: ObjectOutputCompat = new javaIoCompat.ObjectOutputStream(bStream);
        oo.writeObject(t);
        oo.close();
        let serializedMessage: Int8Array = bStream.toByteArray();
        for (let target of this.targets) {
            if (t.getPriority() > target.threshold) {
                let term: Term = t.getTerm();
                let isCompound: boolean = (term instanceof CompoundTerm);
                let searchTerm: boolean = target.mustContainTerm !== null;
                let atomicEqualsSearched: boolean = target.mustContainTerm !== null && !isCompound && target.mustContainTerm.equals(term);
                let compoundContainsSearched: boolean = target.mustContainTerm !== null && isCompound
                    && (term as CompoundTerm).containsTermRecursively(target.mustContainTerm);
                if (!searchTerm || atomicEqualsSearched || compoundContainsSearched) {
                    let packet: DatagramPacketCompat = new javaNetCompat.DatagramPacket(serializedMessage, serializedMessage.length,
                        target.targetAddress, target.targetPort);
                    target.sendSocket.send(packet);
                    // System.out.println("task sent:" + t);
                }
            }
        }
    }

    /**
     * Send Narsese that contains the optional mustContainTerm
     *
     * @param input
     * @param target
     * @throws IOException
     */
    public static sendNarsese(input: JavaStringInput, target: NarNode.TargetNar): void;

    public static sendNarsese(input: JavaStringInput, targetIP: JavaStringInput, targetPort: int, taskThreshold: float,
        mustContainTerm: Term | null): void;
    public static sendNarsese(...args: unknown[]): void {
        switch (args.length) {
            case 2: {
                const [input, target] = args as [JavaStringInput, NarNode.TargetNar];


                let bStream: java.io.ByteArrayOutputStream = new java.io.ByteArrayOutputStream();
                let oo: ObjectOutputCompat = new javaIoCompat.ObjectOutputStream(bStream);
                oo.writeObject(toJavaString(input));
                oo.close();
                let serializedMessage: Int8Array = bStream.toByteArray();
                let searchTerm: boolean = target.mustContainTerm !== null;
                let containsFound: boolean = target.mustContainTerm !== null
                    && String(input).includes(String(target.mustContainTerm.toString()));
                if (!searchTerm || containsFound) {
                    let packet: DatagramPacketCompat = new javaNetCompat.DatagramPacket(serializedMessage, serializedMessage.length,
                        target.targetAddress, target.targetPort);
                    target.sendSocket.send(packet);
                    // System.out.println("narsese sent:" + input);
                }


                break;
            }

            case 5: {
                const [input, targetIP, targetPort, taskThreshold, mustContainTerm] = args as [JavaStringInput, JavaStringInput, int, float, Term | null];


                NarNode.sendNarsese(input, new NarNode.TargetNar(targetIP, targetPort, taskThreshold, mustContainTerm, true));


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException("Invalid number of arguments");
            }
        }
    }


    // Java original type: public static class TargetNar;
    // the socket-bearing target is a plain holder; NarNode retains the host boundary.
    public static TargetNar = class TargetNar {

        /**
         * The target Nar node, specifying under which conditions the current Nar node
         * redirects tasks to it.
         *
         * @param targetIP
         * @param targetPort
         * @param threshold
         * @param mustContainTerm
         * @throws SocketException
         * @throws UnknownHostException
         */
        public constructor(targetIP: JavaStringInput, targetPort: int, threshold: float, mustContainTerm: Term | null,
            sendInput: boolean) {
            this.targetAddress = javaNetCompat.InetAddress.getByName(toJavaString(targetIP));
            this.sendSocket = new javaNetCompat.DatagramSocket();
            this.threshold = Float32Math.from(threshold) as float;
            this.targetPort = targetPort;
            this.mustContainTerm = mustContainTerm;
            this.sendInput = sendInput;
        }

        public readonly threshold: float;
        public readonly sendSocket: DatagramSocketCompat;
        public readonly targetPort: int;
        public readonly targetAddress: InetAddressCompat;
        public readonly mustContainTerm: Term | null;
        protected readonly sendInput: boolean;
    };


    // Java source: private List<TargetNar> targets = new ArrayList<>();
    // This collection is private and only supports append plus ordered iteration.
    private targets: NarNode.TargetNar[] = [];

    public addRedirectionTo(target: NarNode.TargetNar): void;

    /**
     * Add another target Nar node to redirect tasks to, and under which conditions.
     *
     * @param targetIP        The target Nar node IP
     * @param targetPort      The target Nar node port
     * @param taskThreshold   The threshold the priority of the task has to have to
     *                        redirect
     * @param mustContainTerm The optional term that needs to be contained
     *                        recursively in the task term
     * @throws SocketException
     * @throws UnknownHostException
     */
    public addRedirectionTo(targetIP: JavaStringInput, targetPort: int, taskThreshold: float,
        mustContainTerm: Term | null, sendInput: boolean): void;
    public addRedirectionTo(...args: unknown[]): void {
        switch (args.length) {
            case 1: {
                const [target] = args as [NarNode.TargetNar];


                this.targets.push(target);


                break;
            }

            case 5: {
                const [targetIP, targetPort, taskThreshold, mustContainTerm, sendInput] = args as [JavaStringInput, int, float, Term | null, boolean];


                this.addRedirectionTo(new NarNode.TargetNar(targetIP, targetPort, taskThreshold, mustContainTerm, sendInput));


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException("Invalid number of arguments");
            }
        }
    }


    /***
     * NarNode's receiving a task or Narsese string
     *
     * @return the object received (Task, String)
     * @throws IOException when can't receive packet
     */
    private receiveObject(): java.lang.Object {
        let recBytes: Int8Array = new Int8Array(65535);
        let packet: DatagramPacketCompat = new javaNetCompat.DatagramPacket(recBytes, recBytes.length);
        this.receiveSocket.receive(packet);
        if (packet.getLength() > 0) {
            try {
                    // This holds the final error to throw (if any).
                    let error: java.lang.Throwable | undefined;

                    const iStream: ObjectInputStreamCompat = new javaIoCompat.ObjectInputStream(
                        new javaIoCompat.ByteArrayInputStream(recBytes),
                    );
                    try {
                        try {
                            const msg = iStream.readObject();
                            if (msg instanceof Task || msg instanceof java.lang.String) {
                                return msg as java.lang.Object;
                            }
                        }
                        finally {
                            error = closeResources([iStream as unknown as java.io.Closeable]);
                        }
                    } catch (e) {
                        error = handleResourceError(e, error);
                    } finally {
                        throwResourceError(error);
                    }
                // not an object NarNode could digest
            } catch (ex) {
                if (isJavaException(ex)) {
                    // object wasn't retrieved, maybe it wasn't one
                } else {
                    throw ex;
                }
            }
            // ok let's assume it's a raw Narsese string encoding not a Java object, the
            // parser will tell
            return new java.lang.String(recBytes, java.nio.charset.StandardCharsets.UTF_8).trim();
        }
        return null as unknown as java.lang.Object;
    }
}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace NarNode {
    export type EventReceivedTask = InstanceType<NarNode["EventReceivedTask"]>;
    export type TargetNar = InstanceType<typeof NarNode.TargetNar>;
}

