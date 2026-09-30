import { java, JavaObject, type int } from "../../src/runtime/native-runtime.ts";
import { EventEmitter } from "../../src/io/events/EventEmitter.ts";
import { OutputHandler } from "../../src/io/events/OutputHandler.ts";
import { NarNode } from "../../src/main/NarNode.ts";
import { Task } from "../../src/entity/Task.ts";
import type { ClassTokenLike } from "../../src/runtime/RuntimeClass.ts";

const IN = OutputHandler.IN;
const TargetNar = NarNode.TargetNar;
type TargetNar = InstanceType<typeof NarNode.TargetNar>;



/**
 * Test for NarNode functionality
 */
export class NarNodeTest extends JavaObject {
    protected static a: int = 0;

    public testNarToNar(): void {
        NarNodeTest.a = 0; // just in case of a re-test
        let nar1port: int = 64001;
        let nar2port: int = 64002;
        let localIP: java.lang.String = new java.lang.String("127.0.0.1");
        let nar1: NarNode = new NarNode(nar1port);
        let nar2: NarNode = new NarNode(nar2port);
        let nar2_connection: TargetNar = new TargetNar(localIP, nar2port, 0.5, null, true);
        nar1.addRedirectionTo(nar2_connection);
        nar2.nar.event(new class implements EventEmitter.EventObserver {
            public event(event: ClassTokenLike, args: EventEmitter.EventPayload): void {
                if (event === nar2.EventReceivedTask.class || event === IN.class) {
                    let task: Task = args[0] as Task;
                    java.lang.System.out.println("received task event triggered in nar2: " + task);
                    /* synchronized (a) { */
                    NarNodeTest.a++;
                    /* } */
                }
            }
        }(), true, nar2.EventReceivedTask.class, IN.class);
        java.lang.System.out.println("High priority task occurred in nar1");
        NarNode.sendNarsese(new java.lang.String("<{task1} --> [great]>."), nar2_connection);
        nar1.nar.addInput(new java.lang.String("<{task1} --> [great]>."));
        while (true) {
            /* synchronized (a) { */
            if (NarNodeTest.a >= 2) {
                java.lang.System.out.println("success");
                break;
            }
            /* } */
        }
        /* assert (true); */
        nar1.nar.stop();
        nar2.nar.stop();
    }
}
