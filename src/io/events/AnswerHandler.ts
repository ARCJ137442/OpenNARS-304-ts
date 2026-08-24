//! Java source: opennars/io/events/AnswerHandler.java
import { java, JavaObject } from "jree";
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
export abstract class AnswerHandler extends JavaObject implements EventObserver {

    private question!: Task;
    private nar!: Nar;

    protected static readonly events: java.lang.Class<unknown>[] = [
        Answer.class
    ];

    public start(question: Task, n: Nar): void {
        this.nar = n;
        this.question = question;

        this.nar.event(this, true, ...AnswerHandler.events);
    }

    public off(): void {
        this.nar.event(this, false, ...AnswerHandler.events);
    }

    public event(event: java.lang.Class<unknown>, args: java.lang.Object[]): void {

        if (event === Answer.class) {
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
