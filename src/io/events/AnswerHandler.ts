//! Java source: opennars/io/events/AnswerHandler.java
import type { ClassKey } from "../../runtime/ClassIdentity.ts";
import { Events } from "./Events.ts";
import type { EventEmitter } from "./EventEmitter.ts";
import type { Task } from "../../entity/Task.ts";
import type { Sentence } from "../../entity/Sentence.ts";
import type { Nar } from "../../main/Nar.ts";

type EventObserver = EventEmitter.EventObserver;

const Answer = Events.Answer;



/**
 *
 */
// Java source declares AnswerHandler without a specialized parent.  Its
// observable contract is the Answer event subscription and Task equality.
export abstract class AnswerHandler implements EventObserver {

    private question!: Task;
    private nar!: Nar;

    protected static readonly events: ClassKey[] = [
        Answer
    ];

    public start(question: Task, n: Nar): void {
        this.nar = n;
        this.question = question;

        this.nar.event(this, true, ...AnswerHandler.events);
    }

    public off(): void {
        this.nar.event(this, false, ...AnswerHandler.events);
    }

    public event(event: ClassKey, args: EventEmitter.EventPayload): void {

        if (event === Answer) {
            let task: Task = args[0] as unknown as Task;
            let belief: Sentence = args[1] as unknown as Sentence;
            if (task.equals(this.question)) {
                this.onSolution(belief);
            }
        }
    }

    /** called when the question task has been solved directly */
    public abstract onSolution(belief: Sentence): void;
}
