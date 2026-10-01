import { createSocket, type RemoteInfo, type Socket } from "node:dgram";
import { deserialize, serialize } from "node:v8";
import type { NetworkMessage } from "../../main/NarNode.ts";
import type { MessageTransportCapability } from "../RuntimeCapabilities.ts";
import { Task } from "../../entity/Task.ts";

/** Node UDP transport; wire serialization is private to this host adapter. */
export class UdpMessageTransport implements MessageTransportCapability {
    private readonly listeners = new Map<number, Socket>();

    public listen(port: number, onMessage: (message: unknown) => void): void {
        if (this.listeners.has(port)) return;
        const socket = createSocket("udp4");
        socket.on("message", (packet: Buffer, _remote: RemoteInfo) => {
            const message = this.decode(packet);
            if (message !== null) onMessage(message);
        });
        socket.bind(port, "127.0.0.1");
        this.listeners.set(port, socket);
    }

    public send(address: string, port: number, message: unknown): void {
        const socket = createSocket("udp4");
        const bytes = serialize(message);
        socket.send(bytes, port, address, error => {
            socket.close();
            if (error !== null) throw error;
        });
    }

    private decode(packet: Buffer): NetworkMessage | null {
        try {
            const value = deserialize(packet) as Partial<NetworkMessage>;
            if (value.kind === "task" && value.task instanceof Task) return value as NetworkMessage;
            if (value.kind === "narsese" && typeof value.text === "string") return value as NetworkMessage;
        } catch {
            // Legacy raw UTF-8 Narsese datagrams remain accepted.
        }
        const text = packet.toString("utf8").trim();
        return text.length === 0 ? null : { kind: "narsese", text };
    }
}
