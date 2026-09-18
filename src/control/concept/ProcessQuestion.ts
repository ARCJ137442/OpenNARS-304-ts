//! Java source: opennars/control/concept/ProcessQuestion.java
import { java } from "jree";
import { Symbols } from "../../io/Symbols.ts";
import { Events } from "../../io/events/Events.ts";
import { CompoundTerm } from "../../language/CompoundTerm.ts";
import { Variables } from "../../language/Variables.ts";
import { LocalRules } from "../../inference/LocalRules.ts";
import { NativeList } from "../../runtime/NativeList.ts";
import type { Concept } from "../../entity/Concept.ts";
import type { Sentence } from "../../entity/Sentence.ts";
import type { Task } from "../../entity/Task.ts";
import type { Term } from "../../language/Term.ts";
import type { DerivationContext } from "../DerivationContext.ts";

const trySolution = LocalRules.trySolution;
// Java source uses Guava Optional only as a private search result.  The
// TypeScript boundary is internal, so null represents Java Optional.empty().
const tryFind = <T>(items: Iterable<T>, predicate: (value: T) => boolean): T | null => {
    for (const item of items) {
        if (predicate(item)) {
            return item;
        }
    }
    return null;
};



/**
 *
 * @author Patrick Hammer
 */
// Java source declares ProcessQuestion without an explicit parent; this class
// is a static utility namespace. Event payloads are native unknown values;
// no JavaObject cast is required.
export class ProcessQuestion {
    /**
     * To answer a question by existing beliefs
     *
     * @param concept The concept of the question
     * @param nal     The derivation context
     * @param task    The task to be processed
     */
    public static processQuestion(concept: Concept, nal: DerivationContext, task: Task): void {
        let quesTask: Task = task;
        let questions: NativeList<Task> = concept.questions;
        if (task.sentence.punctuation === Symbols.QUEST_MARK) {
            questions = concept.quests;
        }
        if (task.sentence.isEternal()) {
            const eternalQuestionTask: Task | null = tryFind(questions,
                iQuestionTask => iQuestionTask.sentence.isEternal());

            // we can override the question task with the eternal question task if any was
            // found
            if (eternalQuestionTask !== null) {
                quesTask = eternalQuestionTask;
            }
        }
        if (questions.size() + 1 > concept.memory.narParameters.CONCEPT_QUESTIONS_MAX) {
            const removed = questions.remove(0); // FIFO
            if (removed === null || removed === undefined) {
                throw new java.lang.IllegalStateException("Question table removal returned no task");
            }
            concept.memory.event.emit(Events.ConceptQuestionRemove.class, concept, removed);
        }

        questions.add(quesTask);
        concept.memory.event.emit(Events.ConceptQuestionAdd.class, concept, task);

        let ques: Sentence = quesTask.sentence;
        let newAnswerT: Task | null = (ques.isQuestion())
            ? concept.selectCandidate(quesTask, concept.beliefs, nal.time)
            : concept.selectCandidate(quesTask, concept.desires, nal.time);

        if (newAnswerT !== null) {
            trySolution(newAnswerT.sentence, task, nal, true);
        } else if (task.isInput() && !quesTask.getTerm().hasVarQuery() && quesTask.getBestSolution() !== null) { // show
            // previously
            // found
            // solution
            // anyway
            // in
            // case
            // of
            // input
            concept.memory.emit(Events.Answer.class, quesTask, quesTask.getBestSolution());
        }
    }

    /**
     * Recognize an existing belief task as solution to the what question task,
     * which contains a query variable
     *
     * @param concept The concept which potentially outdated anticipations should be
     *                processed
     * @param ques    The belief task
     * @param nal     The derivation context
     */
    // called only in GeneralInferenceControl.insertTaskLink on concept selection
    public static ProcessWhatQuestion(concept: Concept, ques: Task, nal: DerivationContext): void {
        if (!(ques.sentence.isJudgment()) && ques.getTerm().hasVarQuery()) { // ok query var, search
            let newAnswer: boolean = false;
            for (let t of concept.taskLinks) {
                let u: Term[] = [CompoundTerm.replaceIntervals(ques.getTerm()),
                CompoundTerm.replaceIntervals(t.getTerm())];
                if (!t.getTerm().hasVarQuery() && Variables.unify(nal.memory.randomNumber, Symbols.VAR_QUERY, u)) {
                    let c: Concept = nal.memory.concept(t.getTerm());
                    if (c === null) {
                        continue; // target concept is already gone
                    }
                    /* synchronized (c) { */ // changing target concept, lock it
                    let answers: NativeList<Task> = ques.sentence.isQuest() ? c.desires : c.beliefs;
                    if (c !== null && answers.size() > 0) {
                        let taskAnswer: Task = answers.get(0);
                        if (taskAnswer !== null && taskAnswer !== undefined) {
                            const solutionFound = trySolution(taskAnswer.sentence, ques, nal, false); // order important here
                            newAnswer = newAnswer || solutionFound;
                        }
                    }
                    /* } */
                }
            }
            if (newAnswer && ques.isInput()) {
                nal.memory.emit(Events.Answer.class, ques, ques.getBestSolution());
            }
        }
    }

    /**
     * Recognize an added belief task as solution to what questions, those that
     * contain query variable
     *
     * @param concept The concept which potentially outdated anticipations should be
     *                processed
     * @param t       The belief task
     * @param nal     The derivation context
     */
    // called only in GeneralInferenceControl.insertTaskLink on concept selection
    public static ProcessWhatQuestionAnswer(concept: Concept, t: Task, nal: DerivationContext): void {
        if (!t.sentence.term.hasVarQuery() && t.sentence.isJudgment() || t.sentence.isGoal()) { // ok query var, search
            for (let quess of concept.taskLinks) {
                let ques: Task = quess.getTarget();
                if (((ques.sentence.isQuestion() && t.sentence.isJudgment()) ||
                    (ques.sentence.isGoal() && t.sentence.isJudgment()) ||
                    (ques.sentence.isQuest() && t.sentence.isGoal())) && ques.getTerm().hasVarQuery()) {
                    let newAnswer: boolean = false;
                    let u: Term[] = [CompoundTerm.replaceIntervals(ques.getTerm()),
                    CompoundTerm.replaceIntervals(t.getTerm())];
                    if (ques.sentence.term.hasVarQuery() && !t.getTerm().hasVarQuery()
                        && Variables.unify(nal.memory.randomNumber, Symbols.VAR_QUERY, u)) {
                        let c: Concept = nal.memory.concept(t.getTerm());
                        if (c === null) {
                            continue; // target doesn't exist anymore
                        }
                        /* synchronized (c) { */ // changing target concept, lock it
                        let answers: NativeList<Task> = ques.sentence.isQuest() ? c.desires : c.beliefs;
                        if (c !== null && answers.size() > 0) {
                            let taskAnswer: Task = answers.get(0);
                            if (taskAnswer !== null && taskAnswer !== undefined) {
                                const solutionFound = trySolution(taskAnswer.sentence, ques, nal, false); // order important
                                newAnswer = newAnswer || solutionFound;
                                // here
                            }
                        }
                        /* } */
                    }
                    if (newAnswer && ques.isInput()) {
                        nal.memory.emit(Events.Answer.class, ques, ques.getBestSolution());
                    }
                }
            }
        }
    }
}
