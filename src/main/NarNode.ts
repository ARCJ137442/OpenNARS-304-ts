//! Java source: opennars/main/NarNode.java
import { java, JavaObject, type int, type float, closeResources, handleResourceError, throwResourceError, S } from "jree";
import { Float32Math } from "../runtime/Float32.ts";
import { Nar } from "./Nar.ts";
import { Events } from "../io/events/Events.ts";
import type { EventEmitter } from "../io/events/EventEmitter.ts";
import { CompoundTerm } from "../language/CompoundTerm.ts";
import { Term } from "../language/Term.ts";
import { Task } from "../entity/Task.ts";
import { ThreadCompat } from "../runtime/ThreadCompat.ts";

type EventObserver = EventEmitter.EventObserver;



/**
 * @author Patrick Hammer
 */
export class NarNode extends JavaObject implements EventObserver {

    /* An extra event for received tasks */
    public EventReceivedTask = (($outer) => {
        return class EventReceivedTask extends JavaObject {
        }
    })(this);


    /* The socket the Nar listens from */
    private receiveSocket: java.net.DatagramSocket;

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
        switch (args.length) {
            case 1: {
                const [listenPort] = args as [int];


                this(new Nar(), listenPort);


                break;
            }

            case 2: {
                const [nar, listenPort] = args as [Nar, int];


                super();
                this.nar = nar;
                // this.listenPort = listenPort;
                this.receiveSocket = new java.net.DatagramSocket(listenPort, java.net.InetAddress.getByName("127.0.0.1"));
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
                                if (ex instanceof java.lang.Exception) { // log any type of exception, also parsing exceptions, because it shouldn't
                                    // crash on wrong parses or temporary network issues
                                    java.lang.System.Logger.getLogger(NarNode.class.getName()).log(java.lang.System.Logger.Level.SEVERE, null, ex);
                                } else {
                                    throw ex;
                                }
                            }
                        }
                    }
                }().start();


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    /**
     * Input and derived tasks will be potentially sent
     *
     * @param event
     * @param args
     */
    public event(event: java.lang.Class<unknown>, args: java.lang.Object[]): void {
        if (event === Events.TaskAdd.class) {
            let t: Task = args[0] as Task;
            try {
                this.sendTask(t);
            } catch (ex) {
                if (ex instanceof java.lang.Exception) {
                    java.lang.System.Logger.getLogger(NarNode.class.getName()).log(java.lang.System.Logger.Level.SEVERE, null, ex);
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
        let oo: java.io.ObjectOutput = new java.io.ObjectOutputStream(bStream);
        oo.writeObject(t);
        oo.close();
        let serializedMessage: Int8Array = bStream.toByteArray();
        for (let target of this.targets) {
            if (t.getPriority() > target.threshold) {
                let term: Term = t.getTerm();
                let isCompound: boolean = (term instanceof CompoundTerm);
                let searchTerm: boolean = target.mustContainTerm !== null;
                let atomicEqualsSearched: boolean = searchTerm && !isCompound && target.mustContainTerm.equals(term);
                let compoundContainsSearched: boolean = searchTerm && isCompound
                    && (term as CompoundTerm).containsTermRecursively(target.mustContainTerm);
                if (!searchTerm || atomicEqualsSearched || compoundContainsSearched) {
                    let packet: java.net.DatagramPacket = new java.net.DatagramPacket(serializedMessage, serializedMessage.length,
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
    public static sendNarsese(input: java.lang.String, target: NarNode.TargetNar): void;

    public static sendNarsese(input: java.lang.String, targetIP: java.lang.String, targetPort: int, taskThreshold: float,
        mustContainTerm: Term): void;
    public static sendNarsese(...args: unknown[]): void {
        switch (args.length) {
            case 2: {
                const [input, target] = args as [java.lang.String, NarNode.TargetNar];


                let bStream: java.io.ByteArrayOutputStream = new java.io.ByteArrayOutputStream();
                let oo: java.io.ObjectOutput = new java.io.ObjectOutputStream(bStream);
                oo.writeObject(input);
                oo.close();
                let serializedMessage: Int8Array = bStream.toByteArray();
                let searchTerm: boolean = target.mustContainTerm !== null;
                let containsFound: boolean = searchTerm && input.contains(target.mustContainTerm.toString());
                if (!searchTerm || containsFound) {
                    let packet: java.net.DatagramPacket = new java.net.DatagramPacket(serializedMessage, serializedMessage.length,
                        target.targetAddress, target.targetPort);
                    target.sendSocket.send(packet);
                    // System.out.println("narsese sent:" + input);
                }


                break;
            }

            case 5: {
                const [input, targetIP, targetPort, taskThreshold, mustContainTerm] = args as [java.lang.String, java.lang.String, int, float, Term];


                NarNode.sendNarsese(input, new NarNode.TargetNar(targetIP, targetPort, taskThreshold, mustContainTerm, true));


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    public static TargetNar = class TargetNar extends JavaObject {

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
        public constructor(targetIP: java.lang.String, targetPort: int, threshold: float, mustContainTerm: Term,
            sendInput: boolean) {
            super();
            this.targetAddress = java.net.InetAddress.getByName(targetIP);
            this.sendSocket = new java.net.DatagramSocket();
            this.threshold = Float32Math.from(threshold) as float;
            this.targetPort = targetPort;
            this.mustContainTerm = mustContainTerm;
            this.sendInput = sendInput;
        }

        protected readonly threshold: float;
        protected readonly sendSocket: java.net.DatagramSocket;
        protected readonly targetPort: int;
        protected readonly targetAddress: java.net.InetAddress;
        protected readonly mustContainTerm: Term;
        protected readonly sendInput: boolean;
    };


    private targets: java.util.List<NarNode.TargetNar> = new java.util.ArrayList();

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
    public addRedirectionTo(targetIP: java.lang.String, targetPort: int, taskThreshold: float,
        mustContainTerm: Term, sendInput: boolean): void;
    public addRedirectionTo(...args: unknown[]): void {
        switch (args.length) {
            case 1: {
                const [target] = args as [NarNode.TargetNar];


                this.targets.add(target);


                break;
            }

            case 5: {
                const [targetIP, targetPort, taskThreshold, mustContainTerm, sendInput] = args as [java.lang.String, int, float, Term, boolean];


                this.addRedirectionTo(new NarNode.TargetNar(targetIP, targetPort, taskThreshold, mustContainTerm, sendInput));


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
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
        let packet: java.net.DatagramPacket = new java.net.DatagramPacket(recBytes, recBytes.length);
        this.receiveSocket.receive(packet);
        if (packet.getLength() > 0) {
            try {
                    // This holds the final error to throw (if any).
                    let error: java.lang.Throwable | undefined;

                    const iStream: java.io.ObjectInputStream = new java.io.ObjectInputStream(new java.io.ByteArrayInputStream(recBytes))
                    try {
                        try {
                            let msg: java.lang.Object = iStream.readObject();
                            if (msg instanceof Task || msg instanceof java.lang.String) {
                                return msg;
                            }
                        }
                        finally {
                            error = closeResources([iStream]);
                        }
                    } catch (e) {
                        error = handleResourceError(e, error);
                    } finally {
                        throwResourceError(error);
                    }
                // not an object NarNode could digest
            } catch (ex) {
                if (ex instanceof java.lang.Exception) {
                    // object wasn't retrieved, maybe it wasn't one
                } else {
                    throw ex;
                }
            }
            // ok let's assume it's a raw Narsese string encoding not a Java object, the
            // parser will tell
            return new java.lang.String(recBytes, java.nio.charset.StandardCharsets.UTF_8).trim();
        }
        return null;
    }
}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace NarNode {
    export type EventReceivedTask = InstanceType<NarNode["EventReceivedTask"]>;
    export type TargetNar = InstanceType<typeof NarNode.TargetNar>;
}


