import type { ClassKey } from "../runtime/ClassIdentity.ts";
import { ReasonerObject } from "../runtime/ClassIdentity.ts";
import type { IntNumber, FloatNumber } from "../types.ts";
import { Float32Math } from "../runtime/Float32.ts";
import { Nar } from "./Nar.ts";
import { Events } from "../io/events/Events.ts";
import type { EventEmitter } from "../io/events/EventEmitter.ts";
import { CompoundTerm } from "../language/CompoundTerm.ts";
import { Term } from "../language/Term.ts";
import { Task } from "../entity/Task.ts";
import { ReasonerInputError, HostCapabilityError } from "../runtime/ReasonerErrors.ts";
import type { MessageTransportCapability, RuntimeCapabilities } from "../platform/RuntimeCapabilities.ts";

type EventObserver = EventEmitter.EventObserver;

/** Platform-independent representation of a task or Narsese message. */
export type NetworkMessage =
    | { readonly kind: "task"; readonly task: Task }
    | { readonly kind: "narsese"; readonly text: string };

/** Host boundary used by the optional distributed-NARS feature. */
export interface MessageTransport {
    listen(port: number, onMessage: (message: NetworkMessage) => void): void;
    send(address: string, port: number, message: NetworkMessage): void;
}

export interface NetworkCapabilities extends RuntimeCapabilities {
    readonly messageTransport?: MessageTransportCapability;
}

const networkCapabilities = new WeakMap<Nar, NetworkCapabilities>();
export function attachNetworkCapabilities(nar: Nar, capabilities: NetworkCapabilities): void {
    networkCapabilities.set(nar, capabilities);
}

/** Optional message routing around a NAR; all socket and wire details are injected. */
export class NarNode extends ReasonerObject implements EventObserver {
    public EventReceivedTask = class EventReceivedTask extends ReasonerObject {};
    public readonly nar: Nar;
    private readonly transport: MessageTransport;
    private readonly targets: NarNode.TargetNar[] = [];

    public constructor(listenPort: IntNumber);
    public constructor(nar: Nar, listenPort: IntNumber, capabilities?: NetworkCapabilities);
    public constructor(narOrPort: Nar | IntNumber, maybePort?: IntNumber, explicitCapabilities?: NetworkCapabilities) {
        super();
        const nar = narOrPort instanceof Nar ? narOrPort : new Nar();
        const listenPort = narOrPort instanceof Nar ? maybePort : narOrPort;
        if (listenPort === undefined) throw new ReasonerInputError("A listen port is required");
        const capabilities = explicitCapabilities ?? networkCapabilities.get(nar)
            ?? nar.getRuntimeCapabilities() as NetworkCapabilities | undefined;
        if (capabilities?.messageTransport === undefined) throw new HostCapabilityError("messageTransport");
        this.nar = nar;
        this.transport = capabilities.messageTransport as MessageTransport;
        this.transport.listen(listenPort, message => this.receive(message));
        nar.event(this, true, Events.TaskAdd);
    }

    private receive(message: NetworkMessage): void {
        if (message.kind === "task") {
            this.nar.memory.event.emit(this.EventReceivedTask, [message.task]);
            this.nar.addInput(message.task, this.nar);
            return;
        }
        this.nar.addInput(message.text);
    }

    public event(event: ClassKey, args: EventEmitter.EventPayload): void {
        if (event !== Events.TaskAdd) return;
        const task = args[0];
        if (!(task instanceof Task)) return;
        for (const target of this.targets) {
            if (task.getPriority() <= target.threshold || !target.matches(task.getTerm())) continue;
            this.transport.send(target.address, target.port, { kind: "task", task });
        }
    }

    public sendNarsese(input: string, target: NarNode.TargetNar): void {
        if (target.matchesText(input)) this.transport.send(target.address, target.port, { kind: "narsese", text: input });
    }

    public static sendNarsese(input: string, target: NarNode.TargetNar): void {
        target.send({ kind: "narsese", text: input });
    }

    public addRedirectionTo(target: NarNode.TargetNar): void;
    public addRedirectionTo(address: string, port: IntNumber, threshold: FloatNumber, mustContainTerm: Term | null, sendInput: boolean): void;
    public addRedirectionTo(...args: unknown[]): void {
        if (args.length === 1 && args[0] instanceof NarNode.TargetNar) {
            this.targets.push(args[0]);
            return;
        }
        if (args.length === 1 && typeof args[0] === "object" && args[0] !== null) {
            this.targets.push(args[0] as NarNode.TargetNar);
            return;
        }
        if (args.length === 5) {
            const [address, port, threshold, term, sendInput] = args as [string, IntNumber, FloatNumber, Term | null, boolean];
            this.targets.push(new NarNode.TargetNar(address, port, threshold, term, sendInput));
            return;
        }
        throw new ReasonerInputError("addRedirectionTo expects a target or five target fields");
    }

    public static TargetNar = class TargetNar {
        public readonly threshold: FloatNumber;
        public readonly address: string;
        public readonly port: IntNumber;
        public readonly mustContainTerm: Term | null;
        public readonly sendInput: boolean;
        private readonly transport?: MessageTransport;

        public constructor(address: string, port: IntNumber, threshold: FloatNumber, mustContainTerm: Term | null, sendInput: boolean,
            transport?: MessageTransport) {
            this.address = address;
            this.port = port;
            this.threshold = Float32Math.from(threshold) as FloatNumber;
            this.mustContainTerm = mustContainTerm;
            this.sendInput = sendInput;
            this.transport = transport;
        }

        public matches(term: Term): boolean {
            if (this.mustContainTerm === null) return true;
            return term instanceof CompoundTerm
                ? term.containsTermRecursively(this.mustContainTerm)
                : this.mustContainTerm.equals(term);
        }

        public matchesText(text: string): boolean {
            return this.mustContainTerm === null || text.includes(String(this.mustContainTerm));
        }

        public send(message: NetworkMessage): void {
            if (this.transport === undefined) throw new HostCapabilityError("messageTransport");
            this.transport.send(this.address, this.port, message);
        }
    };
}

export namespace NarNode {
    export type TargetNar = InstanceType<typeof NarNode.TargetNar>;
}
