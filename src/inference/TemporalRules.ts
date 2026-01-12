//! Java source: opennars/inference/TemporalRules.java
import { java, JavaObject, type int, type long, S } from "jree";



/**
 *
 * @author Pei Wang
 * @author Patrick Hammer
 */
export class TemporalRules extends JavaObject {

    public static readonly ORDER_NONE: int = 2;
    public static readonly ORDER_FORWARD: int = 1;
    public static readonly ORDER_CONCURRENT: int = 0;
    public static readonly ORDER_BACKWARD: int = -1;
    public static readonly ORDER_INVALID: int = -2;

    public static reverseOrder(order: int): int {
        if (order === TemporalRules.ORDER_NONE) {
            return TemporalRules.ORDER_NONE;
        } else {
            return -order;
        }
    }

    public static matchingOrder(a: Sentence, b: Sentence): boolean;

    public static matchingOrder(order1: int, order2: int): boolean;
    public static matchingOrder(...args: unknown[]): boolean {
        switch (args.length) {
            case 2: {
                const [a, b] = args as [Sentence, Sentence];


                return TemporalRules.matchingOrder(a.getTemporalOrder(), b.getTemporalOrder());


                break;
            }

            case 2: {
                const [order1, order2] = args as [int, int];


                return (order1 === order2) || (order1 === TemporalRules.ORDER_NONE) || (order2 === TemporalRules.ORDER_NONE);


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    public static dedExeOrder(order1: int, order2: int): int {
        let order: int = TemporalRules.ORDER_INVALID;
        if ((order1 === order2) || (order2 === TemporalRules.ORDER_NONE)) {
            order = order1;
        } else if ((order1 === TemporalRules.ORDER_NONE) || (order1 === TemporalRules.ORDER_CONCURRENT)) {
            order = order2;
        } else if (order2 === TemporalRules.ORDER_CONCURRENT) {
            order = order1;
        }
        return order;
    }

    public static abdIndComOrder(order1: int, order2: int): int {
        let order: int = TemporalRules.ORDER_INVALID;
        if (order2 === TemporalRules.ORDER_NONE) {
            order = order1;
        } else if ((order1 === TemporalRules.ORDER_NONE) || (order1 === TemporalRules.ORDER_CONCURRENT)) {
            order = TemporalRules.reverseOrder(order2);
        } else if ((order2 === TemporalRules.ORDER_CONCURRENT) || (order1 === -order2)) {
            order = order1;
        }
        return order;
    }

    public static analogyOrder(order1: int, order2: int, figure: int): int {
        let order: int = TemporalRules.ORDER_INVALID;
        if ((order2 === TemporalRules.ORDER_NONE) || (order2 === TemporalRules.ORDER_CONCURRENT)) {
            order = order1;
        } else if ((order1 === TemporalRules.ORDER_NONE) || (order1 === TemporalRules.ORDER_CONCURRENT)) {
            order = (figure < 20) ? order2 : TemporalRules.reverseOrder(order2);
        } else if (order1 === order2) {
            if ((figure === 12) || (figure === 21)) {
                order = order1;
            }
        } else if ((order1 === -order2)) {
            if ((figure === 11) || (figure === 22)) {
                order = order1;
            }
        }
        return order;
    }

    public static resemblanceOrder(order1: int, order2: int, figure: int): int {
        let order: int = TemporalRules.ORDER_INVALID;
        let order1Reverse: int = TemporalRules.reverseOrder(order1);

        if ((order2 === TemporalRules.ORDER_NONE)) {
            order = (figure > 20) ? order1 : order1Reverse; // switch when 11 or 12
        } else if ((order1 === TemporalRules.ORDER_NONE) || (order1 === TemporalRules.ORDER_CONCURRENT)) {
            order = (figure % 10 === 1) ? order2 : TemporalRules.reverseOrder(order2); // switch when 12 or 22
        } else if (order2 === TemporalRules.ORDER_CONCURRENT) {
            order = (figure > 20) ? order1 : order1Reverse; // switch when 11 or 12
        } else if (order1 === order2) {
            order = (figure === 21) ? order1 : -order1;
        }
        return order;
    }

    public static composeOrder(order1: int, order2: int): int {
        let order: int = TemporalRules.ORDER_INVALID;
        if (order2 === TemporalRules.ORDER_NONE) {
            order = order1;
        } else if (order1 === TemporalRules.ORDER_NONE) {
            order = order2;
        } else if (order1 === order2) {
            order = order1;
        }
        return order;
    }

    /**
     * whether temporal induction can generate a task by avoiding producing wrong
     * terms; only one temporal operator is allowed
     */
    public static tooMuchTemporalStatements(t: Term): boolean {
        return (t === null) || (t.containedTemporalRelations() > 1);
    }

    /** whether a term can be used in temoralInduction(,,) */
    protected static termForTemporalInduction(t: Term): boolean {
        return (t instanceof Inheritance) || (t instanceof Similarity);
    }

    // TODO maybe split &/ case into own function
    public static temporalInduction(s1: Sentence, s2: Sentence,
        nal: org.opennars.control.DerivationContext, SucceedingEventsInduction: boolean,
        addToMemory: boolean, allowSequence: boolean): java.util.List<Task> {

        if ((s1.truth === null) || (s2.truth === null) || s1.punctuation !== Symbols.JUDGMENT_MARK
            || s2.punctuation !== Symbols.JUDGMENT_MARK
            || s1.isEternal() || s2.isEternal())
            return java.util.Collections.emptyList();

        let t1: Term = s1.term;
        let t2: Term = s2.term;

        let deriveSequenceOnly: boolean = (!addToMemory) || Statement.invalidStatement(t1, t2, true);
        if (Statement.invalidStatement(t1, t2, false))
            return java.util.Collections.emptyList();

        let durationCycles: int = nal.narParameters.DURATION;
        let time1: long = s1.getOccurrenceTime();
        let time2: long = s2.getOccurrenceTime();
        let timeDiff: long = time2 - time1;
        let interval: Interval = null;

        if (!TemporalRules.concurrent(time1, time2, durationCycles)) {
            interval = new Interval(java.lang.Math.abs(timeDiff));
            if (timeDiff > 0) {
                t1 = Conjunction.make(t1, interval, TemporalRules.ORDER_FORWARD);
            } else {
                t2 = Conjunction.make(t2, interval, TemporalRules.ORDER_FORWARD);
            }
        }
        let order: int = order(timeDiff, durationCycles);
        let givenTruth1: TruthValue = s1.truth;
        let givenTruth2: TruthValue = s2.truth;

        // This code adds a penalty for large time distance (TODO probably revise)
        let s3: Sentence = s2.projection(s1.getOccurrenceTime(), nal.time.time(), nal.memory);
        givenTruth2 = s3.truth;

        // Truth and priority calculations
        let truth1: TruthValue = TruthFunctions.induction(givenTruth1, givenTruth2, nal.narParameters);
        let truth2: TruthValue = TruthFunctions.induction(givenTruth2, givenTruth1, nal.narParameters);
        let truth3: TruthValue = TruthFunctions.comparison(givenTruth1, givenTruth2, nal.narParameters);
        let truth4: TruthValue = TruthFunctions.intersection(givenTruth1, givenTruth2, nal.narParameters);
        let budget1: BudgetValue = BudgetFunctions.forward(truth1, nal);
        let budget2: BudgetValue = BudgetFunctions.forward(truth2, nal);
        let budget3: BudgetValue = BudgetFunctions.forward(truth3, nal);
        let budget4: BudgetValue = BudgetFunctions.forward(truth4, nal); // this one is sequence in sequenceBag, no
        // need to reduce here

        let statement1: Statement = Implication.make(t1, t2, order);
        let statement2: Statement = Implication.make(t2, t1, TemporalRules.reverseOrder(order));
        let statement3: Statement = Equivalence.make(t1, t2, order);
        let statement4: Term = null;
        switch (order) {
            case TemporalRules.ORDER_FORWARD:
                statement4 = Conjunction.make(t1, interval, s2.term, order);
                break;
            case TemporalRules.ORDER_BACKWARD:
                statement4 = Conjunction.make(s2.term, interval, t1, TemporalRules.reverseOrder(order));
                break;
            default:
                statement4 = Conjunction.make(t1, s2.term, order);
                break;
        }

        let t11s: java.util.List<Term> = new java.util.ArrayList();
        let t22s: java.util.List<Term> = new java.util.ArrayList();
        let penalties: java.util.List<java.lang.Float> = new java.util.ArrayList();
        // "Perception Variable Introduction Rule" -
        // https://groups.google.com/forum/#!topic/open-nars/uoJBa8j7ryE
        if (!deriveSequenceOnly && statement2 !== null) {
            for (let subjectIntro of [true, false]) {
                let ress: java.util.Set<Pair<Term, java.lang.Float>> = CompositionalRules.introduceVariables(nal, statement2, subjectIntro);
                for (let content_penalty of ress) { // ok we applied it, all we have to do now is to use it
                    t11s.add((content_penalty.getLeft() as Statement).getPredicate());
                    t22s.add((content_penalty.getLeft() as Statement).getSubject());
                    penalties.add(content_penalty.getRight());
                }
            }
        }

        let derivations: java.util.List<Task> = new java.util.ArrayList();
        if (!deriveSequenceOnly) {
            for (let i: int = 0; i < t11s.size(); i++) {
                let t11: Term = t11s.get(i);
                let t22: Term = t22s.get(i);
                let penalty: java.lang.Float = penalties.get(i);
                let statement11: Statement = Implication.make(t11, t22, order);
                let statement22: Statement = Implication.make(t22, t11, TemporalRules.reverseOrder(order));
                let statement33: Statement = Equivalence.make(t11, t22, order);
                TemporalRules.appendConclusion(nal, truth1.clone().mulConfidence(penalty), budget1.clone(), statement11, derivations);
                TemporalRules.appendConclusion(nal, truth2.clone().mulConfidence(penalty), budget2.clone(), statement22, derivations);
                TemporalRules.appendConclusion(nal, truth3.clone().mulConfidence(penalty), budget3.clone(), statement33, derivations);
            }

            TemporalRules.appendConclusion(nal, truth1, budget1, statement1, derivations);
            TemporalRules.appendConclusion(nal, truth2, budget2, statement2, derivations);
            TemporalRules.appendConclusion(nal, truth3, budget3, statement3, derivations);
        }

        if (!TemporalRules.tooMuchTemporalStatements(statement4)) {
            if (!allowSequence) {
                return derivations;
            }
            let tl: java.util.List<Task> = nal.doublePremiseTask(statement4, truth4, budget4, true, false, addToMemory);
            if (tl !== null) {
                for (let t of tl) {
                    // fill sequenceTask buffer due to the new derived sequence
                    if (addToMemory &&
                        t.sentence.isJudgment() &&
                        !t.sentence.isEternal() &&
                        t.sentence.term instanceof Conjunction &&
                        t.sentence.term.getTemporalOrder() !== TemporalRules.ORDER_NONE &&
                        t.sentence.term.getTemporalOrder() !== TemporalRules.ORDER_INVALID) {
                        TemporalInferenceControl.addToSequenceTasks(nal, t);
                    }

                    derivations.add(t);
                }
            }
        }

        return derivations;
    }

    private static appendConclusion(nal: DerivationContext, truth1: TruthValue, budget1: BudgetValue,
        statement1: Statement, success: java.util.List<Task>): void {
        if (!TemporalRules.tooMuchTemporalStatements(statement1)) {
            let t: java.util.List<Task> = nal.doublePremiseTask(statement1, truth1, budget1, true, false);
            if (t !== null) {
                success.addAll(t);
            }
        }
    }

    public static order(timeDiff: long, durationCycles: int): int;

    /**
     * if (relative) event B after (stationary) event A then order=forward;
     * event B before then order=backward
     * occur at the same time, relative to duration: order = concurrent
     */
    public static order(a: long, b: long, durationCycles: int): int;
    public static order(...args: unknown[]): int {
        switch (args.length) {
            case 2: {
                const [timeDiff, durationCycles] = args as [long, int];


                let halfDuration: int = durationCycles / 2;
                if (timeDiff > halfDuration) {
                    return TemporalRules.ORDER_FORWARD;
                } else if (timeDiff < -halfDuration) {
                    return TemporalRules.ORDER_BACKWARD;
                } else {
                    return TemporalRules.ORDER_CONCURRENT;
                }


                break;
            }

            case 3: {
                const [a, b, durationCycles] = args as [long, long, int];


                if ((a === Stamp.ETERNAL) || (b === Stamp.ETERNAL))
                    throw new java.lang.IllegalStateException("order() does not compare ETERNAL times");

                return TemporalRules.order(b - a, durationCycles);


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    public static concurrent(a: long, b: long, durationCycles: int): boolean {
        // since Stamp.ETERNAL is Integer.MIN_VALUE,
        // avoid any overflow errors by checking eternal first

        if (a === Stamp.ETERNAL) {
            // if both are eternal, consider concurrent. this is consistent with the
            // original
            // method of calculation which compared equivalent integer values only
            return (b === Stamp.ETERNAL);
        } else if (b === Stamp.ETERNAL) {
            return false; // a==b was compared above
        } else {
            return TemporalRules.order(a, b, durationCycles) === TemporalRules.ORDER_CONCURRENT;
        }
    }

}
