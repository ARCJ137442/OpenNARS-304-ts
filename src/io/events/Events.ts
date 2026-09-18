//! Java source: opennars/io/events/Events.java
import "../../runtime/jree-compat.ts";
import { java, JavaObject, S } from "jree";
import type { long, int } from "../../types.ts"; // Java primitive aliases formerly imported from jree; runtime narrowing is separate.
import type { Concept } from "../../entity/Concept.ts";
import type { Sentence } from "../../entity/Sentence.ts";
import type { Task } from "../../entity/Task.ts";
import type { DerivationContext } from "../../control/DerivationContext.ts";
import type { GeneralInferenceControl } from "../../control/GeneralInferenceControl.ts";
import type { EventEmitter } from "./EventEmitter.ts";

type EventObserver = EventEmitter.EventObserver;

abstract class ConceptBeliefAdd extends JavaObject implements EventObserver {
    public abstract onBeliefAdd(c: Concept, t: Task, extra: java.lang.Object[]): void;

    public event(event: java.lang.Class<unknown>, args: java.lang.Object[]): void {
        this.onBeliefAdd(args[0] as unknown as Concept, args[1] as unknown as Task,
            args[2] as unknown as java.lang.Object[]);
    }
}

abstract class ConceptBeliefRemove extends JavaObject implements EventObserver {
    public abstract onBeliefRemove(c: Concept, removed: Sentence, t: Task, extra: java.lang.Object[]): void;

    public event(event: java.lang.Class<unknown>, args: java.lang.Object[]): void {
        this.onBeliefRemove(args[0] as unknown as Concept, args[1] as unknown as Sentence,
            args[2] as unknown as Task, args[3] as unknown as java.lang.Object[]);
    }
}

abstract class ConceptFire extends JavaObject implements EventObserver {
    public abstract onFire(n: GeneralInferenceControl): void;

    public event(event: java.lang.Class<unknown>, args: java.lang.Object[]): void {
        this.onFire(args[0] as unknown as GeneralInferenceControl);
    }
}

abstract class TaskImmediateProcess extends JavaObject implements EventObserver {
    public abstract onProcessed(t: Task, n: DerivationContext): void;

    public event(event: java.lang.Class<unknown>, args: java.lang.Object[]): void {
        this.onProcessed(args[0] as unknown as Task, args[1] as unknown as DerivationContext);
    }
}

abstract class TaskAdd extends JavaObject implements EventObserver {
    public abstract onTaskAdd(t: Task, reason: java.lang.String): void;

    public event(event: java.lang.Class<unknown>, args: java.lang.Object[]): void {
        this.onTaskAdd(args[0] as unknown as Task, args[1] as unknown as java.lang.String);
    }
}

abstract class InferenceEvent extends JavaObject {
    public readonly when: long;
    public readonly stack: java.util.List<java.lang.StackTraceElement> | null;

    // how many stack frames down to record from; we don't need to include the
    // current and the previous (InferenceEvent subclass's constructor
    protected readonly STACK_PREFIX: int = 4;

    protected constructor(when: long);
    protected constructor(when: long, stackFrames: int);
    protected constructor(...args: unknown[]) {
        super();
        if (args.length !== 1 && args.length !== 2) {
            throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
        }

        const when = args[0] as long;
        const stackFrames = args.length === 2 ? args[1] as int : 0;
        this.when = when;

        if (stackFrames > 0) {
            const sl: java.util.List<java.lang.StackTraceElement> =
                java.util.Arrays.asList(new java.lang.Throwable().getStackTrace());
            let frame: int = 0;

            for (const e of sl) {
                frame++;
                if (e.getClassName() === "org.opennars.core.Nar") {
                    break;
                }
            }
            if (frame - this.STACK_PREFIX > stackFrames)
                frame = this.STACK_PREFIX + stackFrames;
            this.stack = sl.subList(this.STACK_PREFIX, frame);
        } else {
            this.stack = null;
        }
    }

    public getType(): java.lang.Class<unknown> {
        return this.getClass();
    }
}

abstract class ParametricInferenceEvent<O> extends InferenceEvent {
    public readonly object: O;

    public constructor(object: O, when: long) {
        super(when);
        this.object = object;
    }
}

class ConceptNew extends ParametricInferenceEvent<Concept> {
    public constructor(c: Concept, when: long) {
        super(c, when);
    }

    public override toString(): java.lang.String {
        return new java.lang.StringBuilder().append(S`Concept Created: `)
            .append(java.lang.String.valueOf(this.object)).toString();
    }
}



/**
 * empty event classes for use with EventEmitter
 *
 */
// Java original type: public class Events; only the nested event classes carry
// JavaObject/reflection behavior. The outer namespace holder has no superclass.
export class Events {

    /** fired at the beginning of each Nar multi-cycle execution */
    public static CyclesStart =  class CyclesStart extends JavaObject {
    };


    /** fired at the end of each Nar multi-cycle execution */
    public static CyclesEnd =  class CyclesEnd extends JavaObject {
    };


    /** fired at the beginning of each memory cycle */
    public static CycleStart =  class CycleStart extends JavaObject {
    };


    /** fired at the end of each memory cycle */
    public static CycleEnd =  class CycleEnd extends JavaObject {
    };


    /** fired at the beginning of each individual Memory work cycle */
    public static WorkCycleStart =  class WorkCycleStart extends JavaObject {
    };


    /** fired at the end of each Memory individual cycle */
    public static WorkCycleEnd =  class WorkCycleEnd extends JavaObject {
    };


    /** called before memory.reset() proceeds */
    public static ResetStart =  class ResetStart extends JavaObject {
    };


    /** called after memory.reset() proceeds */
    public static ResetEnd =  class ResetEnd extends JavaObject {
    };


    public static Perceive =  class Perceive extends JavaObject {
    };


    public static ConceptForget =  class ConceptForget extends JavaObject {
    };


    public static EnactableExplainationAdd =  class EnactableExplainationAdd extends JavaObject {
    };


    public static EnactableExplainationRemove =  class EnactableExplainationRemove extends JavaObject {
    };


    public static ConceptBeliefAdd = ConceptBeliefAdd;


    public static ConceptBeliefRemove = ConceptBeliefRemove;


    public static ConceptGoalAdd =  class ConceptGoalAdd extends JavaObject {
    };


    public static ConceptGoalRemove =  class ConceptGoalRemove extends JavaObject {
    };


    public static ConceptQuestionAdd =  class ConceptQuestionAdd extends JavaObject {
    };


    public static ConceptQuestionRemove =  class ConceptQuestionRemove extends JavaObject {
    };


    // Executive & Planning
    public static UnexecutableGoal =  class UnexecutableGoal extends JavaObject {
    };


    public static UnexecutableOperation =  class UnexecutableOperation extends JavaObject {
    };


    public static NewTaskExecution =  class NewTaskExecution extends JavaObject {
    };


    public static InduceSucceedingEvent =  class InduceSucceedingEvent extends JavaObject {
    };


    public static TermLinkAdd =  class TermLinkAdd extends JavaObject {
    };


    public static TermLinkRemove =  class TermLinkRemove extends JavaObject {
    };


    public static TaskLinkAdd =  class TaskLinkAdd extends JavaObject {
    };


    public static TaskLinkRemove =  class TaskLinkRemove extends JavaObject {
    };


    public static Answer =  class Answer extends JavaObject {
    };


    public static Unsolved =  class Unsolved extends JavaObject {
    };


    public static TrySolution =  class TrySolution extends JavaObject {
    };


    public static ConceptFire = ConceptFire;


    public static TaskImmediateProcess = TaskImmediateProcess;


    public static TermLinkSelect =  class TermLinkSelect extends JavaObject {
    };


    public static BeliefSelect =  class BeliefSelect extends JavaObject {
    };


    /** called from RuleTables.reason for a given Belief */
    public static BeliefReason =  class BeliefReason extends JavaObject {
    };


    public static ConceptUnification =  class ConceptUnification extends JavaObject {
    };
 // 2nd level unification in CompositionalRules

    public static TaskAdd = TaskAdd;


    public static TaskRemove =  class TaskRemove extends JavaObject {
    };


    public static TaskDerive =  class TaskDerive extends JavaObject {
    };


    public static PluginsChange =  class PluginsChange extends JavaObject {
    };


    // public static class UnExecutedGoal { }

    public static ConceptDirectProcessedTask =  class ConceptDirectProcessedTask extends JavaObject {
    };


    public static InferenceEvent = InferenceEvent;


    public static ParametricInferenceEvent = ParametricInferenceEvent;


    public static ConceptNew = ConceptNew;


}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace Events {
	export type CyclesStart = InstanceType<typeof Events.CyclesStart>;
	export type CyclesEnd = InstanceType<typeof Events.CyclesEnd>;
	export type CycleStart = InstanceType<typeof Events.CycleStart>;
	export type CycleEnd = InstanceType<typeof Events.CycleEnd>;
	export type WorkCycleStart = InstanceType<typeof Events.WorkCycleStart>;
	export type WorkCycleEnd = InstanceType<typeof Events.WorkCycleEnd>;
	export type ResetStart = InstanceType<typeof Events.ResetStart>;
	export type ResetEnd = InstanceType<typeof Events.ResetEnd>;
	export type ConceptNew = InstanceType<typeof Events.ConceptNew>;
	export type Perceive = InstanceType<typeof Events.Perceive>;
	export type ConceptForget = InstanceType<typeof Events.ConceptForget>;
	export type EnactableExplainationAdd = InstanceType<typeof Events.EnactableExplainationAdd>;
	export type EnactableExplainationRemove = InstanceType<typeof Events.EnactableExplainationRemove>;
	export type ConceptBeliefAdd = InstanceType<typeof Events.ConceptBeliefAdd>;
	export type ConceptBeliefRemove = InstanceType<typeof Events.ConceptBeliefRemove>;
	export type ConceptGoalAdd = InstanceType<typeof Events.ConceptGoalAdd>;
	export type ConceptGoalRemove = InstanceType<typeof Events.ConceptGoalRemove>;
	export type ConceptQuestionAdd = InstanceType<typeof Events.ConceptQuestionAdd>;
	export type ConceptQuestionRemove = InstanceType<typeof Events.ConceptQuestionRemove>;
	export type UnexecutableGoal = InstanceType<typeof Events.UnexecutableGoal>;
	export type UnexecutableOperation = InstanceType<typeof Events.UnexecutableOperation>;
	export type NewTaskExecution = InstanceType<typeof Events.NewTaskExecution>;
	export type InduceSucceedingEvent = InstanceType<typeof Events.InduceSucceedingEvent>;
	export type TermLinkAdd = InstanceType<typeof Events.TermLinkAdd>;
	export type TermLinkRemove = InstanceType<typeof Events.TermLinkRemove>;
	export type TaskLinkAdd = InstanceType<typeof Events.TaskLinkAdd>;
	export type TaskLinkRemove = InstanceType<typeof Events.TaskLinkRemove>;
	export type Answer = InstanceType<typeof Events.Answer>;
	export type Unsolved = InstanceType<typeof Events.Unsolved>;
	export type TrySolution = InstanceType<typeof Events.TrySolution>;
	export type ConceptFire = InstanceType<typeof Events.ConceptFire>;
	export type TaskImmediateProcess = InstanceType<typeof Events.TaskImmediateProcess>;
	export type TermLinkSelect = InstanceType<typeof Events.TermLinkSelect>;
	export type BeliefSelect = InstanceType<typeof Events.BeliefSelect>;
	export type BeliefReason = InstanceType<typeof Events.BeliefReason>;
	export type ConceptUnification = InstanceType<typeof Events.ConceptUnification>;
	export type TaskAdd = InstanceType<typeof Events.TaskAdd>;
	export type TaskRemove = InstanceType<typeof Events.TaskRemove>;
	export type TaskDerive = InstanceType<typeof Events.TaskDerive>;
	export type PluginsChange = InstanceType<typeof Events.PluginsChange>;
	export type ConceptDirectProcessedTask = InstanceType<typeof Events.ConceptDirectProcessedTask>;
	export type InferenceEvent = {
		readonly when: long;
		readonly stack: java.util.List<java.lang.StackTraceElement> | null;
		getType(): java.lang.Class<unknown>;
	};
	export type ParametricInferenceEvent<O> = InferenceEvent & { readonly object: O };
}


