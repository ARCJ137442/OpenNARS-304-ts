import { java, JavaObject, type long, type int, S } from "jree";



/**
 * empty event classes for use with EventEmitter
 *
 */
export abstract  class Events extends JavaObject {

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


    public static ConceptNew =  class ConceptNew extends Events.ParametricInferenceEvent<Concept> {
        public  constructor(c: Concept, when: long) {
            super(c, when);
        }

        public override  toString():  java.lang.String {
            return "Concept Created: " + this.object;
        }
    };


    public static Perceive =  class Perceive extends JavaObject {
    };


    public static ConceptForget =  class ConceptForget extends JavaObject {
    };


    public static EnactableExplainationAdd =  class EnactableExplainationAdd extends JavaObject {
    };


    public static EnactableExplainationRemove =  class EnactableExplainationRemove extends JavaObject {
    };


    public abstract static ConceptBeliefAdd =  class ConceptBeliefAdd extends JavaObject implements EventObserver {

        public abstract  onBeliefAdd(c: Concept, t: Task, extra: java.lang.Object[]):  void;

        public  event(event: java.lang.Class<unknown>, args: java.lang.Object[]):  void {
            this.onBeliefAdd( args[0] as Concept,  args[1] as Task,  args[2] as java.lang.Object[]);
        }

    };


    public abstract static ConceptBeliefRemove =  class ConceptBeliefRemove extends JavaObject implements EventObserver {

        public abstract  onBeliefRemove(c: Concept, removed: Sentence, t: Task, extra: java.lang.Object[]):  void;

        public  event(event: java.lang.Class<unknown>, args: java.lang.Object[]):  void {
            this.onBeliefRemove( args[0] as Concept,  args[1] as Sentence,  args[2] as Task,  args[3] as java.lang.Object[]);
        }

    };


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


    public abstract static ConceptFire =  class ConceptFire extends JavaObject implements EventObserver {

        /**
         * use:
         * Concept n.getCurrentConcept()
         * TaskLink n.getCurrentTaskLink()
         */
        public abstract  onFire(n: GeneralInferenceControl):  void;

        public  event(event: java.lang.Class<unknown>, args: java.lang.Object[]):  void {
            this.onFire( args[0] as GeneralInferenceControl);
        }

    };


    public abstract static TaskImmediateProcess =  class TaskImmediateProcess extends JavaObject implements EventObserver {

        public abstract  onProcessed(t: Task, n: DerivationContext):  void;

        public  event(event: java.lang.Class<unknown>, args: java.lang.Object[]):  void {
            this.onProcessed( args[0] as Task,  args[1] as DerivationContext);
        }

    };


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

    public abstract static TaskAdd =  class TaskAdd extends JavaObject implements EventObserver {

        public abstract  onTaskAdd(t: Task, reason: java.lang.String):  void;

        public  event(event: java.lang.Class<unknown>, args: java.lang.Object[]):  void {
            this.onTaskAdd( args[0] as Task,  args[1] as java.lang.String);
        }
    };


    public static TaskRemove =  class TaskRemove extends JavaObject {
    };


    public static TaskDerive =  class TaskDerive extends JavaObject {
    };


    public static PluginsChange =  class PluginsChange extends JavaObject {
    };


    // public static class UnExecutedGoal { }

    public static ConceptDirectProcessedTask =  class ConceptDirectProcessedTask extends JavaObject {
    };


    public abstract static InferenceEvent =  class InferenceEvent extends JavaObject {

        public readonly  when:  long;
        public readonly  stack:  java.util.List<java.lang.StackTraceElement>;

        // how many stack frames down to record from; we don't need to include the
        // current and the previous (InferenceEvent subclass's constructor
        protected readonly  STACK_PREFIX:  int = 4;

        protected  constructor(when: long);

        protected  constructor(when: long, stackFrames: int);
    protected constructor(...args: unknown[]) {
		switch (args.length) {
			case 1: {
				const [when] = args as [long];


            this(when, 0);
        

				break;
			}

			case 2: {
				const [when, stackFrames] = args as [long, int];


            super();
this.when = when;

            if (stackFrames > 0) {
                 let  sl: java.util.List<java.lang.StackTraceElement> = java.util.Arrays.asList(java.lang.Thread.currentThread().getStackTrace());

                let  frame: int = 0;

                for (let e of sl) {
                    frame++;
                    if (e.getClassName().equals("org.opennars.core.Nar")) {
                        break;
                    }
                }
                if (frame - this.STACK_PREFIX > stackFrames)
                    frame = this.STACK_PREFIX + stackFrames;
                this.stack = sl.subList(this.STACK_PREFIX, frame);
            } else {
                this.stack = null;
            }
        

				break;
			}

			default: {
				throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
			}
		}
	}


        public  getType():  java.lang.Class<unknown> {
            return this.getClass();
        }

    };


    public abstract static ParametricInferenceEvent =  class ParametricInferenceEvent<O> extends java.util.EventObject {
        public readonly  object:  O;

        public  constructor(object: O, when: long) {
            super(when);
            this.object = object;
        }

    }
}

export type ParametricInferenceEvent<O> = InstanceType<typeof Events.ParametricInferenceEvent<O>>;