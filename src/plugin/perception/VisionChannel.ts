import { java, type float, type int, JavaObject } from "jree";



export class VisionChannel extends SensoryChannel {
    public defaultOutputConfidence: float = 0.5;
    public nPrototypes: int = 0;
    public prototypes: java.util.ArrayList<VisionChannel.Prototype>;
    protected inputs: Float64Array[];
    protected updated: boolean[][];
    protected cnt_updated: int = 0;
    protected px: int = 0;
    protected py: int = 0;
    protected readonly label: Term;
    protected readonly nar: Nar;
    protected HadNewInput: boolean = false; // only generate frames if at least something was input since last "commit to
    // Nar"
    public readonly obs: EventEmitter.EventObserver;

    public constructor(/* final */  label: java.lang.String, /* final */  nar: Reasoner, /* final */  reportResultsTo: Reasoner, /* final */  width: int,
            /* final */  height: int, /* final */  duration: int,
        defaultOutputConfidence: float, nPrototypes: int) {
        super(nar as Nar, reportResultsTo as SensoryChannel, width, height, duration, SetInt.make(new Term(label)));
        this.nar = nar as Nar;
        this.label = SetInt.make(new Term(label));
        this.defaultOutputConfidence = defaultOutputConfidence;
        this.nPrototypes = nPrototypes;
        this.prototypes = new java.util.ArrayList<Prototype>();
        this.inputs = new [[]];
        this.updated = new [[]];
        this.obs = (ev, a) => {
            if (this.HadNewInput && ev === CycleEnd.class) {
                this.empty_cycles++;
                if (this.empty_cycles > duration) { // a deadline, pixels can't appear more than duration after each other
                    this.step_start(nar); // so we know we can input, not only when all pixels were re-set.
                }
            } else if (ev === ResetEnd.class) {
                this.resetChannel();
            }
        };

    }

    public setEnabled(/* final */  n: Nar, /* final */  enabled: boolean): boolean {
        n.memory.event.set(this.obs, enabled, Events.CycleEnd.class);
        n.memory.event.set(this.obs, enabled, Events.ResetEnd.class);
        return true;
    }

    public resetChannel(): void {
        this.inputs = new [[]];
        this.updated = new [[]];
        this.cnt_updated = 0;
        this.px = 0;
        this.py = 0;
        this.termid = 0;
        this.subj = "";
    }

    protected subj: java.lang.String = "";
    protected empty_cycles: int = 0;

    public AddToMatrix(/* final */  t: Task, /* final */  time: Timable): boolean {
        let inh: Inheritance = t.getTerm() as Inheritance; // channels receive inheritances
        let cur_subj: java.lang.String = (inh.getSubject() as SetExt).term[0].index_variable;
        if (!cur_subj.equals(this.subj)) { // when subject changes, we start to collect from scratch,
            if (!this.subj.isEmpty()) { // but only if subj isn't empty
                this.step_start(time); // flush to upper level what we so far had
            }
            this.cnt_updated = 0; // this way multiple matrices can be processed by the same vision channel
            this.updated = new [[]];
            this.subj = cur_subj;
        }
        this.HadNewInput = true;
        this.empty_cycles = 0;
        let x: int = t.getTerm().term_indices[2];
        let y: int = t.getTerm().term_indices[3];
        if (!this.updated[y][x]) {
            this.inputs[y][x] = t.sentence.getTruth().getFrequency();
            this.cnt_updated++;
            this.updated[y][x] = true;
        } else { // a second value, so take average of frequencies
            // revision wouldn't be proper as each sensory point can just have 1 vote
            this.inputs[y][x] = (this.inputs[y][x] + t.sentence.getTruth().getFrequency()) / 2.0;
        }
        return this.cnt_updated === height * width;
    }

    protected isEternal: boolean = false; // don't use increasing ID if eternal

    public addInput(/* final */  t: Task, /* final */  time: Timable): Nar {
        this.isEternal = t.sentence.isEternal();
        if (this.AddToMatrix(t, time)) // new data complete
            this.step_start(time);
        return this.nar;
    }

    protected termid: int = 0;

    public step_start(/* final */  time: Timable): void {
        this.cnt_updated = 0;
        this.HadNewInput = false;
        this.termid++;
        let V: Term;
        if (this.isEternal) {
            V = SetExt.make(new Term(this.subj));
        } else {
            V = SetExt.make(new Term(this.subj + this.termid));
        }
        // the visual space has to be a copy.
        let cpy: Float64Array[] = new [[]];
        for (let i: int = 0; i < height; i++) {
            for (let j: int = 0; j < width; j++) {
                cpy[i][j] = this.inputs[i][j] as float;
            }
        }
        this.updated = new [[]];
        this.inputs = new [[]];
        this.subj = "";
        let vspace: VisualSpace = new VisualSpace(this.nar, cpy, this.py, this.px, height, width);
        // attach sensation to term:
        V.imagination = vspace;
        let stamp: Stamp = this.isEternal ? new Stamp(time, this.nar.memory, Tense.Eternal) : new Stamp(time, this.nar.memory);

        let s: Sentence = new Sentence(Inheritance.make(V, this.label),
            Symbols.JUDGMENT_MARK,
            new TruthValue(1.0,
                this.defaultOutputConfidence, this.nar.narParameters),
            stamp);

        let budgetForNewTask: BudgetValue = new BudgetValue(this.nar.narParameters.DEFAULT_JUDGMENT_PRIORITY,
            this.nar.narParameters.DEFAULT_JUDGMENT_DURABILITY,
            BudgetFunctions.truthToQuality(s.truth), this.nar.narParameters);
        let newTask: Task = new Task(s, budgetForNewTask, Task.EnumType.INPUT);
        newTask.setElemOfSequenceBuffer(true);
        if (this.nPrototypes === 0) { // report directly to NARS as there are no prototypes
            this.results.add(newTask);// feeds results into "upper" sensory channels:
            this.step_finished(time);
        } else {
            // if there is no other prototype yet we return
            if (this.prototypes.isEmpty()) {
                this.prototypes.add(new Prototype(newTask));
                this.results.add(newTask);// feeds results into "upper" sensory channels:
                this.step_finished(time);
            } else {
                // 1. determine the most similar prototype
                let similarity: float = 0;
                let bestTruth: TruthValue = null;
                let best: VisionChannel.Prototype = null;
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
                if (this.prototypes.size() >= this.nPrototypes) {
                    let lowestValue: int = java.lang.Integer.MAX_VALUE;
                    let lowestIndex: int = -1;
                    for (let i: int = 0; i < this.prototypes.size(); i++) {
                        let cur: VisionChannel.Prototype = this.prototypes.get(i);
                        if (cur.getObservationCount() < lowestValue) {
                            lowestValue = i;
                            lowestIndex = i;
                        }
                    }
                    if (similarity < 0.8) {
                        this.prototypes.set(lowestIndex, new Prototype(newTask));
                    }
                } else {
                    if (similarity < 0.8) {
                        this.prototypes.add(new Prototype(newTask));
                    }
                }

                // 3. build spatial relation to previous
                if (this.lastPrototype !== null) {
                    // int oldFocusX = this.focusX;
                    // int oldFocusY = this.focusY;
                    let lastSpace: VisualSpace = (this.lastPrototype.task.getTerm() as Inheritance)
                        .getSubject().imagination as VisualSpace;
                    if (best === null)
                        throw new java.lang.IllegalStateException("No prototype found");
                    let newSpace: VisualSpace = (best.task.getTerm() as Inheritance).getSubject().imagination as VisualSpace;
                    let oldFocusX: int = lastSpace.px;
                    let oldFocusY: int = lastSpace.py;
                    let newFocusX: int = newSpace.px;
                    let newFocusY: int = newSpace.py;
                    let dx: float = 0;
                    let dy: float = 0;
                    let minusX: java.lang.String = "";
                    let minusY: java.lang.String = "";
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
                    let xParam: float = dx / this.width as float;
                    let yParam: float = dy / this.height as float;
                    try {
                        // timing to make sure procedure learning observes the operation after the last
                        // prototype
                        this.nar.cycles(this.nar.narParameters.DURATION);
                        let taskX: Task = new Narsese(this.nar).parseTask("(^move,{SELF}," + minusX + Texts.n1(xParam) + ","
                            + minusY + Texts.n1(yParam) + "). :|:");
                        taskX.setElemOfSequenceBuffer(true);
                        this.results.add(taskX);
                        this.step_finished(time);
                        // timing to make sure procedure learning observes the operation before the new
                        // prototype
                        this.nar.cycles(this.nar.narParameters.DURATION);
                        // stamp has to be re-built according to new timing
                        if (!this.isEternal) {
                            stamp = new Stamp(time, this.nar.memory);
                        }
                    } catch (ex) {
                        if (ex instanceof Narsese.InvalidInputException) {
                            java.lang.System.Logger.getLogger(VisionChannel.class.getName()).log(java.lang.System.Logger.Level.SEVERE, null, ex);
                        } else {
                            throw ex;
                        }
                    }
                }

                // 4. add the best prototype as identified sensation
                // but with current time stamp
                if (best === null)
                    throw new java.lang.IllegalStateException("No prototype found");
                let bestSentence: Sentence = new Sentence(best.task.getTerm(),
                    best.task.sentence.punctuation,
                    bestTruth,
                    stamp.clone());
                let bestTask: Task = new Task(bestSentence, best.task.budget.clone(), Task.EnumType.INPUT);
                bestTask.setElemOfSequenceBuffer(true);
                this.results.add(bestTask);// feeds results into "upper" sensory channels:
                this.step_finished(time);
                // 5. reward the best prototype and set as the last observed one
                best.incrementObservationCount();
                this.lastPrototype = best;
            }
        }
    }

    protected lastPrototype: VisionChannel.Prototype = null;

    public setFocus(px: int, py: int): void {
        this.px = px;
        this.py = py;
    }

    public Prototype = (($outer) => {
        return class Prototype extends JavaObject {
            protected observationCount: int;
            protected task: Task;

            public constructor(t: Task) {
                super();
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


