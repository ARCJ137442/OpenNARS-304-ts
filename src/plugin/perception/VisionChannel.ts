//! Java source: opennars/plugin/perception/VisionChannel.java
import { JavaIllegalStateException } from "../../runtime/JavaExceptions.ts";
import type { float, int } from "../../types.ts"; // Java primitive aliases formerly imported from jree; runtime narrowing is separate.
import { Texts } from "../../io/Texts.ts";
import { Float32Math } from "../../runtime/Float32.ts";
import { JavaSystemLoggerCompat } from "../../runtime/native-host-boundary.ts";
import { toJavaString, type JavaStringInput } from "../../runtime/java-text.ts";
import { Events } from "../../io/events/Events.ts";
import type { EventEmitter } from "../../io/events/EventEmitter.ts";
import { Narsese } from "../../io/Narsese.ts";
import { Parser } from "../../io/Parser.ts";
import { Symbols } from "../../io/Symbols.ts";
import { BudgetFunctions } from "../../inference/BudgetFunctions.ts";
import { BudgetValue } from "../../entity/BudgetValue.ts";
import { Sentence } from "../../entity/Sentence.ts";
import { Stamp } from "../../entity/Stamp.ts";
import { TruthValue } from "../../entity/TruthValue.ts";
import { Inheritance } from "../../language/Inheritance.ts";
import { SetExt } from "../../language/SetExt.ts";
import { SetInt } from "../../language/SetInt.ts";
import { Term } from "../../language/Term.ts";
import { Tense } from "../../language/Tense.ts";
import { SensoryChannel } from "./SensoryChannel.ts";
import { VisualSpace } from "./VisualSpace.ts";
import { Task } from "../../entity/Task.ts";
import type { Timable } from "../../interfaces/Timable.ts";
import type { Reasoner } from "../../interfaces/pub/Reasoner.ts";
import type { Nar } from "../../main/Nar.ts";
export class VisionChannel extends SensoryChannel {
    public defaultOutputConfidence: float = Float32Math.from(0.5) as float;
    public nPrototypes: int = 0;
    // Java source: public ArrayList<Prototype>; array preserves indexed lookup,
    // ordered append and replacement used by this channel.
    public prototypes: VisionChannel.Prototype[];
    protected inputs: Float64Array[];
    protected updated: boolean[][];
    protected cnt_updated: int = 0;
    protected px: int = 0;
    protected py: int = 0;
    protected HadNewInput: boolean = false; // only generate frames if at least something was input since last "commit to
    // Nar"
    public readonly obs: EventEmitter.EventObserver;

    public constructor(label: JavaStringInput, nar: Reasoner, reportResultsTo: Reasoner, width: int,
        height: int, duration: int,
        defaultOutputConfidence: float, nPrototypes: int) {
        super(nar as Nar, reportResultsTo as unknown as SensoryChannel, width, height, duration,
            SetInt.make(new Term(toJavaString(label))));
        this.nar = nar as Nar;
        this.label = SetInt.make(new Term(toJavaString(label)));
        this.defaultOutputConfidence = Float32Math.from(defaultOutputConfidence) as float;
        this.nPrototypes = nPrototypes;
        this.prototypes = [];
        this.inputs = VisionChannel.emptyInputs(height, width);
        this.updated = VisionChannel.emptyUpdated(height, width);
        this.obs = { event: (ev, _args) => {
            if (this.HadNewInput && ev === Events.CycleEnd.class) {
                this.empty_cycles++;
                if (this.empty_cycles > duration) { // a deadline, pixels can't appear more than duration after each other
                    this.step_start(nar); // so we know we can input, not only when all pixels were re-set.
                }
            } else if (ev === Events.ResetEnd.class) {
                this.resetChannel();
            }
        } };

    }

    public setEnabled(n: Nar, enabled: boolean): boolean {
        n.memory.event.set(this.obs, enabled, Events.CycleEnd.class);
        n.memory.event.set(this.obs, enabled, Events.ResetEnd.class);
        return true;
    }

    public resetChannel(): void {
        this.inputs = VisionChannel.emptyInputs(this.height, this.width);
        this.updated = VisionChannel.emptyUpdated(this.height, this.width);
        this.cnt_updated = 0;
        this.px = 0;
        this.py = 0;
        this.termid = 0;
        this.subj = "";
    }

    protected subj: string = "";
    protected empty_cycles: int = 0;

    public AddToMatrix(t: Task, time: Timable): boolean {
        let inh: Inheritance = t.getTerm() as Inheritance; // channels receive inheritances
        let cur_subj = String((inh.getSubject() as SetExt).term[0].index_variable);
        if (cur_subj !== this.subj) { // when subject changes, we start to collect from scratch,
            if (this.subj.length > 0) { // but only if subj isn't empty
                this.step_start(time); // flush to upper level what we so far had
            }
            this.cnt_updated = 0; // this way multiple matrices can be processed by the same vision channel
            this.updated = VisionChannel.emptyUpdated(this.height, this.width);
            this.subj = cur_subj;
        }
        this.HadNewInput = true;
        this.empty_cycles = 0;
        const termIndices = t.getTerm().term_indices;
        if (termIndices === null) {
            return false;
        }
        let x: int = termIndices[2];
        let y: int = termIndices[3];
        if (!this.updated[y][x]) {
            this.inputs[y][x] = t.sentence.getTruth().frequency;
            this.cnt_updated++;
            this.updated[y][x] = true;
        } else { // a second value, so take average of frequencies
            // revision wouldn't be proper as each sensory point can just have 1 vote
            this.inputs[y][x] = (this.inputs[y][x] + t.sentence.getTruth().frequency) / 2.0;
        }
        return this.cnt_updated === this.height * this.width;
    }

    protected isEternal: boolean = false; // don't use increasing ID if eternal

    public addInput(t: Task, time: Timable): Nar {
        this.isEternal = t.sentence.isEternal();
        if (this.AddToMatrix(t, time)) // new data complete
            this.step_start(time);
        return this.nar;
    }

    protected termid: int = 0;

    public step_start(time: Timable): void {
        this.cnt_updated = 0;
        this.HadNewInput = false;
        this.termid++;
        let V: Term;
        if (this.isEternal) {
            V = SetExt.make(new Term(toJavaString(this.subj)));
        } else {
            V = SetExt.make(new Term(toJavaString(this.subj + this.termid)));
        }
        // the visual space has to be a copy.
        let cpy: Float64Array[] = VisionChannel.emptyInputs(this.height, this.width);
        for (let i: int = 0; i < this.height; i++) {
            for (let j: int = 0; j < this.width; j++) {
                cpy[i][j] = Float32Math.from(this.inputs[i][j]) as float;
            }
        }
        this.updated = VisionChannel.emptyUpdated(this.height, this.width);
        this.subj = "";
        this.inputs = VisionChannel.emptyInputs(this.height, this.width);
        let vspace: VisualSpace = new VisualSpace(this.nar, cpy, this.py, this.px, this.height, this.width);
        // attach sensation to term:
        V.imagination = vspace;
        let stamp: Stamp = this.isEternal ? new Stamp(time, this.nar.memory, Tense.Eternal) : new Stamp(time, this.nar.memory);

        let s: Sentence = new Sentence(Inheritance.make(V, this.label),
            Symbols.JUDGMENT_MARK,
            TruthValue.fromFrequencyConfidence(1.0,
                this.defaultOutputConfidence, this.nar.narParameters),
            stamp);

        let budgetForNewTask: BudgetValue = new BudgetValue(this.nar.narParameters.DEFAULT_JUDGMENT_PRIORITY,
            this.nar.narParameters.DEFAULT_JUDGMENT_DURABILITY,
            BudgetFunctions.truthToQuality(s.getTruth()), this.nar.narParameters);
        let newTask: Task = new Task(s, budgetForNewTask, Task.EnumType.INPUT);
        newTask.setElemOfSequenceBuffer(true);
        if (this.nPrototypes === 0) { // report directly to NARS as there are no prototypes
            this.results.push(newTask);// feeds results into "upper" sensory channels:
            this.step_finished(time);
        } else {
            // if there is no other prototype yet we return
            if (this.prototypes.length === 0) {
                this.prototypes.push(new this.Prototype(newTask));
                this.results.push(newTask);// feeds results into "upper" sensory channels:
                this.step_finished(time);
            } else {
                // 1. determine the most similar prototype
                let similarity: float = 0;
                let bestTruth: TruthValue = null as unknown as TruthValue;
                let best: VisionChannel.Prototype = null as unknown as VisionChannel.Prototype;
                for (let p of this.prototypes) {
                    let inh: Inheritance = p.task.getTerm() as Inheritance;
                    let simCur: TruthValue = inh.getSubject().imagination.AbductionOrComparisonTo(vspace, true);
                    let simCurExp: float = simCur.getExpectation();
                    if (simCurExp > similarity) {
                        best = p;
                        similarity = simCurExp;
                        bestTruth = simCur;
                    }
                }
                // 2. replace the rarest seen prototype with the new prototype when full
                // else just add it
                if (this.prototypes.length >= this.nPrototypes) {
                    let lowestValue: int = Number.MAX_SAFE_INTEGER;
                    let lowestIndex: int = -1;
                    for (let i: int = 0; i < this.prototypes.length; i++) {
                        let cur: VisionChannel.Prototype = this.prototypes[i];
                        if (cur.getObservationCount() < lowestValue) {
                            lowestValue = i;
                            lowestIndex = i;
                        }
                    }
                    if (similarity < 0.8) {
                        this.prototypes[lowestIndex] = new this.Prototype(newTask);
                    }
                } else {
                    if (similarity < 0.8) {
                        this.prototypes.push(new this.Prototype(newTask));
                    }
                }

                // 3. build spatial relation to previous
                if (this.lastPrototype !== null) {
                    // int oldFocusX = this.focusX;
                    // int oldFocusY = this.focusY;
                    let lastSpace: VisualSpace = (this.lastPrototype.task.getTerm() as Inheritance)
                        .getSubject().imagination as VisualSpace;
                    if (best === null)
                        throw new JavaIllegalStateException("No prototype found");
                    let newSpace: VisualSpace = (best.task.getTerm() as Inheritance).getSubject().imagination as VisualSpace;
                    let oldFocusX: int = lastSpace.px;
                    let oldFocusY: int = lastSpace.py;
                    let newFocusX: int = newSpace.px;
                    let newFocusY: int = newSpace.py;
                    let dx: float = 0;
                    let dy: float = 0;
                    let minusX = "";
                    let minusY = "";
                    if (newFocusX >= oldFocusX) {
                        dx = newFocusX - oldFocusX;
                    } else {
                        minusX = "-";
                        dx = oldFocusX - newFocusX;
                    }
                    if (newFocusY >= oldFocusY) {
                        dy = newFocusY - oldFocusY;
                    } else {
                        minusY = "-";
                        dy = oldFocusY - newFocusY;
                    }
                    let xParam: float = Float32Math.divide(dx, this.width) as float;
                    let yParam: float = Float32Math.divide(dy, this.height) as float;
                    try {
                        // timing to make sure procedure learning observes the operation after the last
                        // prototype
                        this.nar.cycles(this.nar.narParameters.DURATION);
                        let taskX: Task = new Narsese(this.nar).parseTask("(^move,{SELF}," + minusX + Texts.n1(xParam) + ","
                            + minusY + Texts.n1(yParam) + "). :|:");
                        taskX.setElemOfSequenceBuffer(true);
                        this.results.push(taskX);
                        this.step_finished(time);
                        // timing to make sure procedure learning observes the operation before the new
                        // prototype
                        this.nar.cycles(this.nar.narParameters.DURATION);
                        // stamp has to be re-built according to new timing
                        if (!this.isEternal) {
                            stamp = new Stamp(time, this.nar.memory);
                        }
                    } catch (ex) {
                        if (ex instanceof Parser.InvalidInputException) {
                            JavaSystemLoggerCompat.getLogger(VisionChannel.class.getName()).log(JavaSystemLoggerCompat.Level.SEVERE, null, ex);
                        } else {
                            throw ex;
                        }
                    }
                }

                // 4. add the best prototype as identified sensation
                // but with current time stamp
                if (best === null)
                    throw new JavaIllegalStateException("No prototype found");
                let bestSentence: Sentence = new Sentence(best.task.getTerm(),
                    best.task.sentence.punctuation,
                    bestTruth,
                    stamp.clone());
                let bestTask: Task = new Task(bestSentence, best.task.budget.clone(), Task.EnumType.INPUT);
                bestTask.setElemOfSequenceBuffer(true);
                this.results.push(bestTask);// feeds results into "upper" sensory channels:
                this.step_finished(time);
                // 5. reward the best prototype and set as the last observed one
                best.incrementObservationCount();
                this.lastPrototype = best;
            }
        }
    }

    protected lastPrototype: VisionChannel.Prototype = null as unknown as VisionChannel.Prototype;

    private static emptyInputs(height: int, width: int): Float64Array[] {
        return Array.from({ length: height }, () => new Float64Array(width));
    }

    private static emptyUpdated(height: int, width: int): boolean[][] {
        return Array.from({ length: height }, () => Array<boolean>(width).fill(false));
    }

    public setFocus(px: int, py: int): void {
        this.px = px;
        this.py = py;
    }

    // Java source: package-private class Prototype.
    // It is a plain data holder; VisionChannel's own class identity and logger
    // reflection remain separate contracts above.
    public Prototype = (($outer) => {
        return class Prototype {
            protected observationCount: int;
            public readonly task: Task;

            public constructor(t: Task) {
                this.observationCount = 1; // as the task itself is a case
                this.task = t;
            }

            public incrementObservationCount(): void {
                this.observationCount++;
            }

            public getObservationCount(): int {
                return this.observationCount;
            }
        }
    })(this);

}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace VisionChannel {
    export type Prototype = InstanceType<VisionChannel["Prototype"]>;
}


