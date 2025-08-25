import { java, JavaObject } from "jree";



/**
 *
 */
export abstract class AnswerHandler extends JavaObject implements EventObserver {

    private question: Task | null;
    private nar: Nar | null;

    protected static readonly events: java.lang.Class<unknown>[] | null = [
        Answer.class
    ];

    public start(/* final */  question: Task | null, /* final */  n: Nar | null): void {
        this.nar = n;
        this.question = question;

        this.nar.event(this, true, AnswerHandler.events);
    }

    public off(): void {
        this.nar.event(this, false, AnswerHandler.events);
    }

    public event(/* final */  event: java.lang.Class<unknown> | null, /* final */  args: java.lang.Object[] | null): void {

        if (event === Answer.class) {
            let task: Task = args[0] as Task;
            let belief: Sentence = args[1] as Sentence;
            if (task.equals(this.question)) {
                this.onSolution(belief);
            }
        }
    }

    /** called when the question task has been solved directly */
    public abstract onSolution(belief: Sentence | null): void;
}
