import { java, JavaObject, type int, type long, type float } from "jree";



/**
 *
 * @author Patrick Hammer
 */
export class TemporalInferenceControl extends JavaObject {
    public static proceedWithTemporalInduction(/* final */  newEvent: Sentence, /* final */  stmLast: Sentence,
            /* final */  controllerTask: Task, /* final */  nal: DerivationContext, /* final */  SucceedingEventsInduction: boolean,
            /* final */  addToMemory: boolean, /* final */  allowSequence: boolean): java.util.List<Task> {

        if (SucceedingEventsInduction && !controllerTask.isElemOfSequenceBuffer()) { // todo refine, add directbool in
            // task
            return null;
        }
        if (newEvent.isEternal() || !controllerTask.isInput()) {
            return null;
        }
        /*
         * if (equalSubTermsInRespectToImageAndProduct(newEvent.term, stmLast.term)) {
         * return false;
         * }
         */

        if (newEvent.punctuation !== Symbols.JUDGMENT_MARK || stmLast.punctuation !== Symbols.JUDGMENT_MARK)
            return null; // temporal inductions for judgements only

        nal.setTheNewStamp(newEvent.stamp, stmLast.stamp, nal.time.time());
        nal.setCurrentTask(controllerTask);

        let previousBelief: Sentence = stmLast;
        nal.setCurrentBelief(previousBelief);

        let currentBelief: Sentence = newEvent;

        // if(newEvent.getPriority()>Parameters.TEMPORAL_INDUCTION_MIN_PRIORITY)
        return TemporalRules.temporalInduction(currentBelief, previousBelief, nal, SucceedingEventsInduction,
            addToMemory, allowSequence);
    }

    public static eventInference(/* final */  newEvent: Task, /* final */  nal: DerivationContext): boolean {

        if (newEvent.getTerm() === null || newEvent.budget === null || !newEvent.isElemOfSequenceBuffer()) { // todo
            // refine,
            // add
            // directbool
            // in task
            return false;
        }

        nal.emit(Events.InduceSucceedingEvent.class, newEvent, nal);

        if (!newEvent.sentence.isJudgment() || newEvent.sentence.isEternal() || !newEvent.isInput()) {
            return false;
        }

        let already_attempted: java.util.Set<Task> = new java.util.LinkedHashSet();
        let already_attempted_ops: java.util.Set<Task> = new java.util.LinkedHashSet();
        // Sequence formation:
        for (let i: int = 0; i < nal.narParameters.SEQUENCE_BAG_ATTEMPTS; i++) {
            /* synchronized (nal.memory.seq_current) { */
            let takeout: Task = nal.memory.seq_current.takeOut();
            if (takeout === null) {
                break; // there were no elements in the bag to try
            }

            if (already_attempted.contains(takeout) ||
                Stamp.baseOverlap(newEvent.sentence.stamp, takeout.sentence.stamp)) {
                nal.memory.seq_current.putBack(takeout,
                    nal.memory.cycles(nal.memory.narParameters.EVENT_FORGET_DURATIONS), nal.memory);
                continue;
            }
            already_attempted.add(takeout);
            TemporalInferenceControl.proceedWithTemporalInduction(newEvent.sentence, takeout.sentence, newEvent, nal, true, true, true);
            nal.memory.seq_current.putBack(takeout,
                nal.memory.cycles(nal.memory.narParameters.EVENT_FORGET_DURATIONS), nal.memory);
            /* } */
        }

        // Conditioning:
        if (nal.memory.lastDecision !== null && newEvent !== nal.memory.lastDecision) {
            already_attempted_ops.clear();
            for (let k: int = 0; k < nal.narParameters.OPERATION_SAMPLES; k++) {
                already_attempted.clear(); // todo move into k loop
                let Toperation: Task = k === 0 ? nal.memory.lastDecision : nal.memory.recent_operations.takeOut();
                if (Toperation === null) {
                    break; // there were no elements in the bag to try
                }
                if (already_attempted_ops.contains(Toperation)) {
                    // put opc back into bag
                    // (k>0 holds here):
                    nal.memory.recent_operations.putBack(Toperation,
                        nal.memory.cycles(nal.memory.narParameters.EVENT_FORGET_DURATIONS), nal.memory);
                    continue;
                }
                already_attempted_ops.add(Toperation);
                let opc: Concept = nal.memory.concept(Toperation.getTerm());
                if (opc !== null) {
                    if (opc.seq_before === null) {
                        opc.seq_before = new Bag(nal.narParameters.SEQUENCE_BAG_LEVELS,
                            nal.narParameters.SEQUENCE_BAG_SIZE, nal.narParameters);
                    }
                    for (let i: int = 0; i < nal.narParameters.CONDITION_BAG_ATTEMPTS; i++) {
                        let takeout: Task = opc.seq_before.takeOut();
                        if (takeout === null) {
                            break; // there were no elements in the bag to try
                        }
                        if (already_attempted.contains(takeout)) {
                            opc.seq_before.putBack(takeout,
                                nal.memory.cycles(nal.memory.narParameters.EVENT_FORGET_DURATIONS), nal.memory);
                            continue;
                        }
                        already_attempted.add(takeout);
                        let x: long = Toperation.sentence.getOccurrenceTime();
                        let y: long = takeout.sentence.getOccurrenceTime();
                        if (y > x) { // something wrong here?
                            java.lang.System.out.println("analyze case in TemporalInferenceControl!");
                            continue;
                        }
                        let seq_op: java.util.List<Task> = TemporalInferenceControl.proceedWithTemporalInduction(Toperation.sentence, takeout.sentence,
                            nal.memory.lastDecision, nal, true, false, true);
                        for (let t of seq_op) {
                            if (!t.sentence.isEternal()) {
                                // TODO do not return the eternal here probably..;
                                /* final List<Task> res = */ TemporalInferenceControl.proceedWithTemporalInduction(newEvent.sentence,
                                t.sentence,
                                newEvent, nal, true, true, false); // only =/> </> ..
                                /*
                                 * DETAILED: for(Task seq_op_cons : res) {
                                 * System.out.println(seq_op_cons.toString());
                                 * }
                                 */
                            }
                        }

                        opc.seq_before.putBack(takeout,
                            nal.memory.cycles(nal.memory.narParameters.EVENT_FORGET_DURATIONS), nal.memory);
                    }
                }
                // put Toperation back into bag if it was taken out
                if (k > 0) {
                    nal.memory.recent_operations.putBack(Toperation,
                        nal.memory.cycles(nal.memory.narParameters.EVENT_FORGET_DURATIONS), nal.memory);
                }
            }
        }

        TemporalInferenceControl.addToSequenceTasks(nal, newEvent);
        return true;
    }

    public static addToSequenceTasks(/* final */  nal: DerivationContext, /* final */  newEvent: Task): void {
        // multiple versions are necessary, but we do not allow duplicates
        let removal: Task = null;
        /* synchronized (nal.memory.seq_current) { */
        for (let s of nal.memory.seq_current) {
            if (CompoundTerm.replaceIntervals(s.getTerm()).equals(
                CompoundTerm.replaceIntervals(newEvent.getTerm()))) {
                // && //-- new outcommented
                // s.sentence.stamp.equals(newEvent.sentence.stamp,false,true,true,false) ) {
                // && newEvent.sentence.getOccurenceTime()>s.sentence.getOccurenceTime() ) {
                // check term indices
                if (s.getTerm().term_indices !== null && newEvent.getTerm().term_indices !== null) {
                    let differentTermIndices: boolean = false;
                    for (let i: int = 0; i < s.getTerm().term_indices.length; i++) {
                        if (s.getTerm().term_indices[i] !== newEvent.getTerm().term_indices[i]) {
                            differentTermIndices = true;
                        }
                    }
                    if (differentTermIndices) {
                        continue;
                    }
                }
                removal = s;
                break;
            }
        }
        if (removal !== null) {
            nal.memory.seq_current.pickOut(removal);
        }

        // ok now add the new one:
        // making sure we do not mess with budget of the task:
        if (!(newEvent.sentence.getTerm() instanceof Operation)) {
            let c: Concept = nal.memory.concept(newEvent.getTerm());
            let event_quality: float = BudgetFunctions.truthToQuality(newEvent.sentence.truth);
            let event_priority: float = event_quality;
            if (c !== null) {
                event_priority = java.lang.Math.max(event_quality, c.getPriority());
            }
            let t2: Task = new Task(newEvent.sentence,
                new BudgetValue(event_priority, 1.0 / newEvent.sentence.term.getComplexity() as float,
                    event_quality, nal.narParameters),
                newEvent.getParentBelief(),
                newEvent.getBestSolution());
            nal.memory.seq_current.putIn(t2);
        }
        /* } */
    }

    public static NewOperationFrame(/* final */  mem: Memory, /* final */  task: Task): void {
        let toRemove: java.util.List<Task> = new java.util.LinkedList(); // can there be more than one? I don't think so..
        let priorityGain: float = 0.0;
        for (let t of mem.recent_operations) { // when made sure, make single element and add break
            if (t.getTerm().equals(task.getTerm())) {
                priorityGain = BudgetFunctions.or(priorityGain, t.getPriority());
                toRemove.add(t);
            }
        }
        for (let t of toRemove) {
            mem.recent_operations.pickOut(t);
        }
        task.setPriority(BudgetFunctions.or(task.getPriority(), priorityGain)); // this way operations priority of
        // previous exections
        mem.recent_operations.putIn(task); // contributes to the current (enhancement)
        mem.lastDecision = task;
        let c: Concept = mem.concept(task.getTerm());
        /* synchronized (mem.seq_current) { */
        if (c !== null) {
            if (c.seq_before === null) {
                c.seq_before = new Bag(mem.narParameters.SEQUENCE_BAG_LEVELS, mem.narParameters.SEQUENCE_BAG_SIZE,
                    mem.narParameters);
            }
            for (let t of mem.seq_current) {
                if (task.sentence.getOccurrenceTime() > t.sentence.getOccurrenceTime()) {
                    c.seq_before.putIn(t);
                }
            }
        }
        mem.seq_current.clear();
        /* } */
    }
}
