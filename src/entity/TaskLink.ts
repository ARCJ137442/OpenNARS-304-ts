//! Java source: opennars/entity/TaskLink.java
import { java, S } from "jree";
import type { int, long, short } from "../types.ts"; // Java primitive aliases formerly imported from jree; runtime narrowing is separate.
import { Item } from "./Item.ts";
import { Task } from "./Task.ts";
import { TermLink } from "./TermLink.ts";
import { BudgetValue } from "./BudgetValue.ts";
import type { TLink } from "./TLink.ts";
import type { Parameters } from "../main/Parameters.ts";
import type { Term } from "../language/Term.ts";
import { NativeDeque } from "../runtime/NativeDeque.ts";
import { javaStringValue } from "../runtime/jree-compat.ts";



/**
 * Reference to a Task.
 * <p>
 * The reason to separate a Task and a TaskLink is that the same Task can be
 * linked from multiple Concepts, with different BudgetValue.
 *
 * TaskLinks are unique according to the Task they reference
 *
 * @author Pei Wang
 * @author Patrick Hammer
 */
export class TaskLink extends Item<Task> implements TLink<Task> {

    /**
     * The Task linked. The "target" field in TermLink is not used here.
     */
    public readonly targetTask: Task;
    private readonly recordLength: int;

    /* Hash of the object */
    public hash: int;

    /*
     * Remember the TermLinks, and when they has been used recently with this
     * TaskLink
     */
    // Java原类型：public static final class Recording implements Serializable。
    // Serializable 在 Java 中只是 marker；原转写的 JavaObject 只提供隐式 Object 外壳，
    // Recording 不消费 class/getClass、equals 或 hashCode，因此不保留 jree 类型壳。
    public static readonly Recording = class Recording {

        public readonly link: TermLink;
        protected time: long;

        public constructor(link: TermLink, time: long) {
            this.link = link;
            this.time = time;
        }

        public getTime(): long {
            return this.time;
        }

        public setTime(t: long): void {
            this.time = t;
        }

    };


    /** The usage record **/
    public readonly records: NativeDeque<TaskLink.Recording>;

    /** The type of link, one of the above */
    public readonly type: short;

    /**
     * The index of the component in the component list of the compound, may have up
     * to 4 levels
     */
    public readonly index: Int16Array | null;

    /**
     * Constructor
     * <p>
     * only called in Memory.continuedProcess
     *
     * @param t        The target Task
     * @param template The TermLink template
     * @param v        The budget
     */
    public constructor(t: Task, template: TermLink | null, v: BudgetValue, recordLength: int) {
        super(v);
        this.type = template === null ? TermLink.SELF : template.type;
        this.index =

            template === null ? null : template.index;

        this.targetTask = t;
        this.recordLength = recordLength;
        this.records = new NativeDeque<TaskLink.Recording>();
        this.hash = (((this.targetTask.hashCode() * 31) + this.type) * 31) + (this.index !== null ? java.util.Arrays.hashCode(this.index) : 0);
    }

    public hashCode(): int {
        return this.hash;
    }

    public name(): Task {
        return this.targetTask;
    }

    public equals(obj: java.lang.Object): boolean {
        if (obj === this)
            return true;
        if (obj instanceof TaskLink) {
            let t: TaskLink = obj as TaskLink;
            return this.hash === t.hash && this.type === t.type
                && java.util.Arrays.equals(this.index ?? undefined, t.index ?? undefined)
                && this.targetTask.equals(t.targetTask);
        }
        return false;
    }

    /**
     * Get one index by level
     *
     * @param i The index level
     * @return The index value
     */
    public getIndex(i: int): short {
        if ((this.index !== null) && (i < this.index.length)) {
            return this.index[i];
        } else {
            return -1;
        }
    }

    /**
     * To check whether a TaskLink should use a TermLink, return false if they
     * interacted recently
     * <p>
     * called in TermLinkBag only
     *
     * @param termLink    The TermLink to be checked
     * @param currentTime The current time
     * @return Whether they are novel to each other
     */
    public novel(termLink: TermLink, currentTime: long, narParameters: Parameters): boolean;

    public novel(termLink: TermLink, currentTime: long, narParameters: Parameters,
        transformTask: boolean): boolean;
    public novel(...args: unknown[]): boolean {
        switch (args.length) {
            case 3: {
                const [termLink, currentTime, narParameters] = args as [TermLink, long, Parameters];


                return this.novel(termLink, currentTime, narParameters, false);


                break;
            }

            case 4: {
                const [termLink, currentTime, narParameters, transformTask] = args as [TermLink, long, Parameters, boolean];
                // The translated long may arrive at this runtime boundary as a
                // JavaScript number (for example from Nar.time()). Normalize it
                // before reproducing Java long arithmetic and keep recordings
                // consistently bigint-valued.
                const currentTimeLong = BigInt(currentTime);
                const noveltyHorizon = BigInt(narParameters.NOVELTY_HORIZON);


                let bTerm: Term = termLink.target;
                if (!transformTask && bTerm.equals(this.targetTask.sentence.term)) {
                    return false;
                }
                let linkKey: TermLink = termLink.name();

                // iterating the FIFO deque from oldest (first) to newest (last)
                const ir = this.records.iterator();
                while (ir.hasNext()) {
                    let r: TaskLink.Recording = ir.next();
                    if (linkKey.equals(r.link)) {
                        if (currentTimeLong < BigInt(r.getTime()) + noveltyHorizon) {
                            // too recent, not novel
                            return false;
                        } else {
                            // happened long enough ago that we have forgotten it somewhat, making it seem
                            // more novel
                            r.setTime(currentTimeLong);
                            ir.remove();
                            this.records.addLast(r);
                            return true;
                        }
                    }
                }
                // keep recordedLinks queue a maximum finite size
                while (this.records.size() + 1 >= this.recordLength)
                    this.records.remove();
                // add knowledge reference to recordedLinks
                this.records.addLast(new TaskLink.Recording(linkKey, currentTimeLong));
                return true;


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    public toString(): string {
        // Java source return type: String; return super.toString() + " " + getTarget().sentence.stamp;
        // Keep the inherited Item output and Java object-to-string boundary
        // explicit while returning the native string contract.
        return `${javaStringValue(super.toString())} ${javaStringValue(this.getTarget().sentence.stamp)}`;
    }

    public toStringBrief(): string {
        return super.toString();
    }

    /**
     * Get the target Task
     *
     * @return The linked Task
     */
    public getTarget(): Task {
        return this.targetTask;
    }

    public getTerm(): Term {
        return this.getTarget().getTerm();
    }
}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace TaskLink {
    export type Recording = InstanceType<typeof TaskLink.Recording>;
}


