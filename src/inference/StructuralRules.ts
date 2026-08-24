//! Java source: opennars/inference/StructuralRules.java
import { java, JavaObject, type short, type int, type float } from "jree";
import { BudgetValue } from "../entity/BudgetValue.ts";
import { Sentence } from "../entity/Sentence.ts";
import { TruthValue } from "../entity/TruthValue.ts";
import { BudgetFunctions } from "./BudgetFunctions.ts";
import { TruthFunctions } from "./TruthFunctions.ts";
import { IntersectionExt } from "../language/IntersectionExt.ts";
import { IntersectionInt } from "../language/IntersectionInt.ts";
import { SetExt } from "../language/SetExt.ts";
import { SetInt } from "../language/SetInt.ts";
import { DifferenceExt } from "../language/DifferenceExt.ts";
import { DifferenceInt } from "../language/DifferenceInt.ts";
import { CompoundTerm } from "../language/CompoundTerm.ts";
import { Product } from "../language/Product.ts";
import { ImageInt } from "../language/ImageInt.ts";
import { ImageExt } from "../language/ImageExt.ts";
import { Term } from "../language/Term.ts";
import { Inheritance } from "../language/Inheritance.ts";
import { Terms } from "../language/Terms.ts";
import { Statement } from "../language/Statement.ts";
import { TemporalRules } from "./TemporalRules.ts";
import { Interval } from "../language/Interval.ts";
import { Similarity } from "../language/Similarity.ts";
import { Conjunction } from "../language/Conjunction.ts";
import { Implication } from "../language/Implication.ts";
import { Disjunction } from "../language/Disjunction.ts";
import { Equivalence } from "../language/Equivalence.ts";
import { Negation } from "../language/Negation.ts";
import { Symbols } from "../io/Symbols.ts";
import type { DerivationContext } from "../control/DerivationContext.ts";
import type { Task } from "../entity/Task.ts";



/**
 * Single-premise inference rules involving compound terms. Input are one
 * sentence (the premise) and one TermLink (indicating a component)
 *
 * @author Pei Wang
 * @author Patrick Hammer
 */
export class StructuralRules extends JavaObject {

    /*
     * -------------------- transform between compounds and term
     * --------------------
     */
    /**
     * {<S --> P>, S@(S&T)} |- <(S&T) --> (P&T)>
     * <br>
     * {<S --> P>, S@(M-S)} |- <(M-P) --> (M-S)>
     *
     * @param compound  The compound term
     * @param index     The location of the indicated term in the compound
     * @param statement The premise
     * @param side      The location of the indicated term in the premise
     * @param nal       Reference to the memory
     */
    protected static structuralCompose2(compound: CompoundTerm, index: short, statement: Statement,
        side: short, nal: DerivationContext): void {
        if (compound.equals(statement.term[side])) {
            return;
        }
        let sub: Term = statement.getSubject();
        let pred: Term = statement.getPredicate();
        let components: java.util.List<Term> = compound.asTermList();
        if (((side === 0) && components.contains(pred)) || ((side === 1) && components.contains(sub))) {
            return;
        }
        if (side === 0) {
            if (components.contains(sub)) {
                sub = compound;
                components.set(index, pred.cloneDeep());
                pred = Terms.term(compound, components);
            }
        } else {
            if (components.contains(pred)) {
                components.set(index, sub.cloneDeep());
                sub = Terms.term(compound, components);
                pred = compound;
            }
        }

        if ((sub === null) || (pred === null)) {
            return;
        }
        if (sub.cloneDeep().equals(pred.cloneDeep())) {
            return;
        }
        let content: Statement | null;
        let order: int = statement.getTemporalOrder();
        if (StructuralRules.switchOrder(compound, index)) {
            content = Statement.make(statement, pred, sub, TemporalRules.reverseOrder(order));
        } else {
            content = Statement.make(statement, sub, pred, order);
        }

        if (content === null) {
            return;
        }

        let sentence: Sentence = nal.getCurrentTask().sentence;
        let truth: TruthValue = TruthFunctions.deduction(sentence.getTruth(), nal.narParameters.reliance,
            nal.narParameters);
        let budget: BudgetValue = BudgetFunctions.compoundForward(truth, content, nal);
        nal.singlePremiseTask(content, truth, budget);
    }

    /**
     * {<(S*T) --> (P*T)>, S@(S*T)} |- <S --> P>
     *
     * @param statement The premise
     * @param nal       Reference to the memory
     */
    protected static structuralDecompose2(statement: Statement, index: int, nal: DerivationContext): void {
        let subj: Term = statement.getSubject();
        let pred: Term = statement.getPredicate();
        if (subj.getClass() !== pred.getClass()) {
            return;
        }

        if (!(subj instanceof Product) && !(subj instanceof SetExt) && !(subj instanceof SetInt)) {
            return; // no abduction on other compounds for now, but may change in the future
        }

        let sub: CompoundTerm = subj as CompoundTerm;
        let pre: CompoundTerm = pred as CompoundTerm;
        if (sub.size() !== pre.size() || sub.size() <= index) {
            return;
        }

        let t1: Term = sub.term[index];
        let t2: Term = pre.term[index];
        let content: Statement | null;
        let order: int = statement.getTemporalOrder();
        if (StructuralRules.switchOrder(sub, index as short)) {
            content = Statement.make(statement, t2, t1, TemporalRules.reverseOrder(order));
        } else {
            content = Statement.make(statement, t1, t2, order);
        }
        if (content === null) {
            return;
        }
        let task: Task = nal.getCurrentTask();
        let sentence: Sentence = task.sentence;
        let truth: TruthValue | null = sentence.truth;
        let budget: BudgetValue;
        if (sentence.isQuestion() || sentence.isQuest()) {
            budget = BudgetFunctions.compoundBackward(content, nal);
        } else {
            budget = BudgetFunctions.compoundForward(sentence.getTruth(), content, nal);
        }
        nal.singlePremiseTask(content, truth, budget);
    }

    /**
     * List the cases where the direction of inheritance is revised in conclusion
     *
     * @param compound The compound term
     * @param index    The location of focus in the compound
     * @return Whether the direction of inheritance should be revised
     */
    private static switchOrder(compound: CompoundTerm, index: short): boolean {
        return ((((compound instanceof DifferenceExt) || (compound instanceof DifferenceInt)) && (index === 1))
            || ((compound instanceof ImageExt) && (index !== (compound as ImageExt).relationIndex))
            || ((compound instanceof ImageInt) && (index !== (compound as ImageInt).relationIndex)));
    }

    /**
     * {<S --> P>, P@(P|Q)} |- <S --> (P|Q)>
     *
     * @param compound  The compound term
     * @param index     The location of the indicated term in the compound
     * @param statement The premise
     * @param nal       Reference to the memory
     */
    protected static structuralCompose1(compound: CompoundTerm, index: short, statement: Statement,
        nal: DerivationContext): void {
        if (!nal.getCurrentTask().sentence.isJudgment()) {
            return; // forward inference only
        }
        let component: Term = compound.term[index];
        let task: Task = nal.getCurrentTask();
        let sentence: Sentence = task.sentence;
        let order: int = sentence.getTemporalOrder();
        let truth: TruthValue = sentence.getTruth();

        let reliance: float = nal.narParameters.reliance;
        let truthDed: TruthValue = TruthFunctions.deduction(truth, reliance, nal.narParameters);
        let truthNDed: TruthValue = TruthFunctions
            .negation(TruthFunctions.deduction(truth, reliance, nal.narParameters), nal.narParameters);

        let subj: Term = statement.getSubject();
        let pred: Term = statement.getPredicate();

        if (component.equals(subj)) {
            if (compound instanceof IntersectionExt) {
                StructuralRules.structuralStatement(compound, pred, order, truthDed, nal);
            } else if (compound instanceof IntersectionInt) {
            } else if ((compound instanceof DifferenceExt) && (index === 0)) {
                StructuralRules.structuralStatement(compound, pred, order, truthDed, nal);
            } else if (compound instanceof DifferenceInt) {
                if (index === 0) {
                } else {
                    StructuralRules.structuralStatement(compound, pred, order, truthNDed, nal);
                }
            }
        } else if (component.equals(pred)) {
            if (compound instanceof IntersectionExt) {
            } else if (compound instanceof IntersectionInt) {
                StructuralRules.structuralStatement(subj, compound, order, truthDed, nal);
            } else if (compound instanceof DifferenceExt) {
                if (index === 0) {
                } else {
                    StructuralRules.structuralStatement(subj, compound, order, truthNDed, nal);
                }
            } else if ((compound instanceof DifferenceInt) && (index === 0)) {
                StructuralRules.structuralStatement(subj, compound, order, truthDed, nal);
            }
        }
    }

    /**
     * {<(S|T) --> P>, S@(S|T)} |- <S --> P>
     * <br>
     * {<S --> (P&T)>, P@(P&T)} |- <S --> P>
     *
     * @param compound  The compound term
     * @param index     The location of the indicated term in the compound
     * @param statement The premise
     * @param nal       Reference to the memory
     */
    protected static structuralDecompose1(compound: CompoundTerm, index: short, statement: Statement,
        nal: DerivationContext): void {
        if (index >= compound.term.length) {
            return;
        }
        let component: Term = compound.term[index];
        let task: Task = nal.getCurrentTask();
        let sentence: Sentence = task.sentence;
        let order: int = sentence.getTemporalOrder();
        let truth: TruthValue | null = sentence.truth;

        if (truth === null) {
            return;
        }

        let reliance: float = nal.narParameters.reliance;
        let truthDed: TruthValue = TruthFunctions.deduction(truth, reliance, nal.narParameters);
        let truthNDed: TruthValue = TruthFunctions
            .negation(TruthFunctions.deduction(truth, reliance, nal.narParameters), nal.narParameters);

        let subj: Term = statement.getSubject();
        let pred: Term = statement.getPredicate();
        if (compound.equals(subj)) {
            if (compound instanceof IntersectionInt) {
                StructuralRules.structuralStatement(component, pred, order, truthDed, nal);
            } else if ((compound instanceof SetExt) && (compound.size() > 1)) {
                let t1: Term[] = [component];
                StructuralRules.structuralStatement(new SetExt(t1), pred, order, truthDed, nal);
            } else if (compound instanceof DifferenceInt) {
                if (index === 0) {
                    StructuralRules.structuralStatement(component, pred, order, truthDed, nal);
                } else {
                    StructuralRules.structuralStatement(component, pred, order, truthNDed, nal);
                }
            }
        } else if (compound.equals(pred)) {
            if (compound instanceof IntersectionExt) {
                StructuralRules.structuralStatement(subj, component, order, truthDed, nal);
            } else if ((compound instanceof SetInt) && (compound.size() > 1)) {
                StructuralRules.structuralStatement(subj, new SetInt(component), order, truthDed, nal);
            } else if (compound instanceof DifferenceExt) {
                if (index === 0) {
                    StructuralRules.structuralStatement(subj, component, order, truthDed, nal);
                } else {
                    StructuralRules.structuralStatement(subj, component, order, truthNDed, nal);
                }
            }
        }
    }

    /**
     * Common final operations of the above two methods
     *
     * @param subject   The subject of the new task
     * @param predicate The predicate of the new task
     * @param truth     The truth value of the new task
     * @param nal       Reference to the memory
     */
    private static structuralStatement(subject: Term, predicate: Term, order: int,
        truth: TruthValue, nal: DerivationContext): void {
        let task: Task = nal.getCurrentTask();
        let oldContent: Term = task.getTerm();
        if (oldContent instanceof Statement) {
            let content: Statement | null = Statement.make(oldContent as Statement, subject, predicate, order);
            if (content !== null) {
                let budget: BudgetValue = BudgetFunctions.compoundForward(truth, content, nal);
                nal.singlePremiseTask(content, truth, budget);
            }
        }
    }

    /* -------------------- set transform -------------------- */
    /**
     * {<S --> {P}>} |- <S <-> {P}>
     *
     * @param compound  The set compound
     * @param statement The premise
     * @param side      The location of the indicated term in the premise
     * @param nal       Reference to the memory
     */
    protected static transformSetRelation(compound: CompoundTerm, statement: Statement, side: short,
        nal: DerivationContext): void {
        if (compound.size() > 1) {
            return;
        }
        if (statement instanceof Inheritance) {
            if (((compound instanceof SetExt) && (side === 0)) || ((compound instanceof SetInt) && (side === 1))) {
                return;
            }
        }
        let sub: Term = statement.getSubject();
        let pre: Term = statement.getPredicate();
        let content: Statement;
        if (statement instanceof Inheritance) {
            content = Similarity.make(sub, pre);
        } else {
            if (((compound instanceof SetExt) && (side === 0)) || ((compound instanceof SetInt) && (side === 1))) {
                content = Inheritance.make(pre, sub);
            } else {
                content = Inheritance.make(sub, pre);
            }
        }
        if (content === null) {
            return;
        }

        let task: Task = nal.getCurrentTask();
        let sentence: Sentence = task.sentence;
        let truth: TruthValue | null = sentence.truth;
        let budget: BudgetValue;
        if (sentence.isJudgment()) {
            budget = BudgetFunctions.compoundForward(sentence.getTruth(), content, nal);
        } else {
            budget = BudgetFunctions.compoundBackward(content, nal);
        }
        nal.singlePremiseTask(content, truth, budget);
    }

    /* -------------------- products and images transform -------------------- */
    /**
     * Equivalent transformation between products and images
     *
     * {<(*, S, M) --> P>, S@(*, S, M)} |- <S --> (/, P, _, M)>
     * <br>
     * {<S --> (/, P, _, M)>, P@(/, P, _, M)} |- <(*, S, M) --> P>
     * <br>
     * {<S --> (/, P, _, M)>, M@(/, P, _, M)} |- <M --> (/, P, S,
     * _)>
     *
     * @param inh        An Inheritance statement
     * @param oldContent The whole content
     * @param indices    The indices of the TaskLink
     * @param nal        Reference to the memory
     */
    protected static transformProductImage(inh: Inheritance, oldContent: CompoundTerm, indices: Int16Array,
        nal: DerivationContext): void {
        // final Memory memory = nal.mem();
        let subject: Term = inh.getSubject();
        let predicate: Term = inh.getPredicate();
        let index: short = indices[indices.length - 1];
        let side: short = indices[indices.length - 2];
        if (inh.equals(oldContent)) {
            if (subject instanceof CompoundTerm) {
                StructuralRules.transformSubjectPI(index, subject as CompoundTerm, predicate, nal);
            }
            if (predicate instanceof CompoundTerm) {
                StructuralRules.transformPredicatePI(index, subject, predicate as CompoundTerm, nal);
            }
            return;
        }

        let compT: Term = inh.term[side];
        if (!(compT instanceof CompoundTerm))
            return;
        let comp: CompoundTerm = compT as CompoundTerm;
        if (comp.size() <= index) { // make sure it points into the compound
            return;
        }

        if (comp instanceof Product) {
            if (side === 0) {
                subject = comp.term[index];
                predicate = ImageExt.make(comp as Product, inh.getPredicate(), index);
            } else {
                subject = ImageInt.make(comp as Product, inh.getSubject(), index);
                predicate = comp.term[index];
            }
        } else if ((comp instanceof ImageExt) && (side === 1)) {
            if (index === (comp as ImageExt).relationIndex) {
                subject = Product.make(comp, inh.getSubject(), index);
                predicate = comp.term[index];
            } else {
                subject = comp.term[index];
                predicate = ImageExt.make(comp as ImageExt, inh.getSubject(), index);
            }
        } else if ((comp instanceof ImageInt) && (side === 0)) {
            if (index === (comp as ImageInt).relationIndex) {
                subject = comp.term[index];
                predicate = Product.make(comp, inh.getPredicate(), index);
            } else {
                subject = ImageInt.make(comp as ImageInt, inh.getPredicate(), index);
                predicate = comp.term[index];
            }
        } else {
            return;
        }

        let newInh: CompoundTerm = null;
        if (predicate.equals(Term.SEQ_SPATIAL)) {
            newInh = Conjunction.make((subject as CompoundTerm).term, TemporalRules.ORDER_FORWARD, true) as CompoundTerm;
        } else if (predicate.equals(Term.SEQ_TEMPORAL)) {
            newInh = Conjunction.make((subject as CompoundTerm).term, TemporalRules.ORDER_FORWARD, false) as CompoundTerm;
        } else {
            newInh = Inheritance.make(subject, predicate);
        }
        if (newInh === null)
            return;

        let content: CompoundTerm | null = null;
        if (indices.length === 2) {
            content = newInh;
        } else if ((oldContent instanceof Statement) && (indices[0] === 1)) {
            content = Statement.make(oldContent as Statement, oldContent.term[0], newInh, oldContent.getTemporalOrder());
        } else {
            let componentList: Term[];
            let condition: Term = oldContent.term[0];

            let oldContentIsImplicationOrEquivalence: boolean = oldContent instanceof Implication
                || oldContent instanceof Equivalence;
            if (condition instanceof Conjunction && oldContentIsImplicationOrEquivalence) {
                // ex: <(&&,<(*,a,b) --> R>,...) ==> C>. |- <(&&,<a --> (/,R,_,b)>,...) ==> C>
                // ex: <(&&,<(*,a,b) --> R>,...) <=> C>. |- <(&&,<a --> (/,R,_,b)>,...) <=> C>

                componentList = (condition as CompoundTerm).cloneTerms();
                componentList[indices[1]] = newInh;
                let newCond: Term = Terms.term(condition as CompoundTerm, componentList);
                content = Statement.make(oldContent as Statement, newCond, (oldContent as Statement).getPredicate(),
                    oldContent.getTemporalOrder());
            } else {
                componentList = oldContent.cloneTerms();
                componentList[indices[0]] = newInh;
                if (oldContent instanceof Conjunction) {
                    // ex: (&&,<(*,a,b) --> R>,...) |- (&&,<a --> (/,R,_,b)>,...)

                    let newContent: Term = Terms.term(oldContent, componentList);
                    if (!(newContent instanceof CompoundTerm))
                        return;
                    content = newContent as CompoundTerm;
                } else if (oldContentIsImplicationOrEquivalence) {
                    // ex: <<(*,a,b) --> R> ==> C>. |- <<a --> (/,R,_,b)> ==> C>
                    // ex: <<(*,a,b) --> R> <=> C>. |- <<a --> (/,R,_,b)> <=> C>

                    content = Statement.make(oldContent as Statement, componentList[0], componentList[1],
                        oldContent.getTemporalOrder());
                }
            }
        }

        if (content === null)
            return;

        let sentence: Sentence = nal.getCurrentTask().sentence;
        let truth: TruthValue | null = sentence.truth;
        let budget: BudgetValue;
        if (sentence.isQuestion() || sentence.isQuest()) {
            budget = BudgetFunctions.compoundBackward(content, nal);
        } else {
            budget = BudgetFunctions.compoundForward(sentence.getTruth(), content, nal);
        }

        nal.singlePremiseTask(content, truth, budget);
    }

    /**
     * Equivalent transformation between products and images when the subject is
     * a compound
     *
     * {<(*, S, M) --> P>, S@(*, S, M)} |- <S --> (/, P, _, M)>
     * <br>
     * {<S --> (/, P, _, M)>, P@(/, P, _, M)} |- <(*, S, M) --> P>
     * <br>
     * {<S --> (/, P, _, M)>, M@(/, P, _, M)} |- <M --> (/, P, S,
     * _)>
     *
     * @param subject   The subject term
     * @param predicate The predicate term
     * @param nal       Reference to the memory
     */
    private static transformSubjectPI(index: short, subject: CompoundTerm, predicate: Term,
        nal: DerivationContext): void {
        let truth: TruthValue | null = nal.getCurrentTask().sentence.truth;
        let budget: BudgetValue;
        let inheritance: Inheritance;
        let newSubj: Term;
        let newPred: Term;
        if (subject instanceof Product) {
            let product: Product = subject as Product;
            let i: short = index;
            if (product.term.length >= i + 1) {
                newSubj = product.term[i];
                newPred = ImageExt.make(product, predicate, i);
                if (!(newSubj instanceof Interval)) { // no intervals as subjects
                    inheritance = Inheritance.make(newSubj, newPred);
                    if (inheritance !== null) {
                        if (truth === null) {
                            budget = BudgetFunctions.compoundBackward(inheritance, nal);
                        } else {
                            budget = BudgetFunctions.compoundForward(truth, inheritance, nal);
                        }
                        nal.singlePremiseTask(inheritance, truth, budget);
                    }
                }
            }
        } else if (subject instanceof ImageInt) {
            let image: ImageInt = subject as ImageInt;
            let relationIndex: int = image.relationIndex;
            for (let i: short = 0; i < image.size(); i++) {
                if (i === relationIndex) {
                    newSubj = image.term[relationIndex];
                    newPred = Product.make(image, predicate, relationIndex);
                } else {
                    newSubj = ImageInt.make(image, predicate, i);
                    newPred = image.term[i];
                }

                inheritance = Inheritance.make(newSubj, newPred);
                if (inheritance !== null) {
                    if (truth === null) {
                        budget = BudgetFunctions.compoundBackward(inheritance, nal);
                    } else {
                        budget = BudgetFunctions.compoundForward(truth, inheritance, nal);
                    }
                    nal.singlePremiseTask(inheritance, truth, budget);
                }
            }
        }
    }

    /**
     * Equivalent transformation between products and images when the predicate
     * is a compound
     *
     * {<(*, S, M) --> P>, S@(*, S, M)} |- <S --> (/, P, _, M)>
     * <br>
     * {<S --> (/, P, _, M)>, P@(/, P, _, M)} |- <(*, S, M) --> P>
     * <br>
     * {<S --> (/, P, _, M)>, M@(/, P, _, M)} |- <M --> (/, P, S,
     * _)>
     *
     * @param subject   The subject term
     * @param predicate The predicate term
     * @param nal       Reference to the memory
     */
    private static transformPredicatePI(index: short, subject: Term, predicate: CompoundTerm,
        nal: DerivationContext): void {
        let truth: TruthValue | null = nal.getCurrentTask().sentence.truth;
        let budget: BudgetValue;
        let inheritance: Inheritance;
        let newSubj: Term;
        let newPred: Term;
        if (predicate instanceof Product) {
            let product: Product = predicate as Product;
            let i: short = index;
            if (product.term.length >= i + 1) {
                newSubj = ImageInt.make(product, subject, i);
                newPred = product.term[i];
                inheritance = Inheritance.make(newSubj, newPred);
                if (inheritance !== null) {
                    if (truth === null) {
                        budget = BudgetFunctions.compoundBackward(inheritance, nal);
                    } else {
                        budget = BudgetFunctions.compoundForward(truth, inheritance, nal);
                    }
                    nal.singlePremiseTask(inheritance, truth, budget);
                }
            }
        } else if (predicate instanceof ImageExt) {
            let image: ImageExt = predicate as ImageExt;
            let relationIndex: int = image.relationIndex;
            for (let i: short = 0; i < image.size(); i++) {
                if (i === relationIndex) {
                    newSubj = Product.make(image, subject, relationIndex);
                    newPred = image.term[relationIndex];
                } else {
                    newSubj = image.term[i];
                    newPred = ImageExt.make(image, subject, i);
                }

                if (newSubj instanceof CompoundTerm &&
                    (newPred.equals(Term.SEQ_TEMPORAL) || newPred.equals(Term.SEQ_SPATIAL))) {
                    let seq: Term = Conjunction.make((newSubj as CompoundTerm).term,
                        TemporalRules.ORDER_FORWARD,
                        newPred.equals(Term.SEQ_SPATIAL));
                    if (truth === null) {
                        budget = BudgetFunctions.compoundBackward(seq, nal);
                    } else {
                        budget = BudgetFunctions.compoundForward(truth, seq, nal);
                    }
                    nal.singlePremiseTask(seq, truth, budget);
                    return;
                }

                inheritance = Inheritance.make(newSubj, newPred);
                if (inheritance !== null) { // jmv <<<<<
                    if (truth === null) {
                        budget = BudgetFunctions.compoundBackward(inheritance, nal);
                    } else {
                        budget = BudgetFunctions.compoundForward(truth, inheritance, nal);
                    }
                    nal.singlePremiseTask(inheritance, truth, budget);
                }
            }
        }
    }

    /* --------------- Flatten sequence transform --------------- */
    /**
     * {(#,(#,A,B),C), (#,A,B)@(#,(#,A,B), C)} |- (#,A,B,C)
     * (same for &/)
     *
     * @param compound     The premise
     * @param component    The recognized component in the premise
     * @param compoundTask Whether the compound comes from the task
     * @param nal          Reference to the memory
     */
    protected static flattenSequence(compound: CompoundTerm, component: Term, compoundTask: boolean,
        index: int, nal: DerivationContext): void {
        if (compound instanceof Conjunction && component instanceof Conjunction) {
            let conjCompound: Conjunction = compound as Conjunction;
            let conjComponent: Conjunction = component as Conjunction;
            if (conjCompound.getTemporalOrder() === TemporalRules.ORDER_FORWARD && // since parallel conjunction and
                // normal one already is flattened
                conjComponent.getTemporalOrder() === TemporalRules.ORDER_FORWARD &&
                conjCompound.getIsSpatial() === conjComponent.getIsSpatial()) { // because also when both are tmporal
                let newTerm: Term[] = new Array<Term>(conjCompound.size() - 1 + conjComponent.size());
                java.lang.System.arraycopy(conjCompound.term, 0, newTerm, 0, index);
                java.lang.System.arraycopy(conjComponent.term, 0, newTerm, index + 0, conjComponent.size());
                java.lang.System.arraycopy(conjCompound.term, index + conjComponent.size() - conjComponent.size() + 1, newTerm,
                    index + conjComponent.size(), newTerm.length - (index + conjComponent.size()));
                let cont: Conjunction = Conjunction.make(newTerm, conjCompound.getTemporalOrder(),
                    conjCompound.getIsSpatial()) as Conjunction;
                let truth: TruthValue = nal.getCurrentTask().sentence.getTruth().clone();
                let budget: BudgetValue = BudgetFunctions.forward(truth, nal);
                nal.singlePremiseTask(cont, truth, budget);
            }
        }
    }

    /* --------------- Take out from conjunction --------------- */
    /**
     * {(&&,A,B,C), B@(&&,A,B,C)} |- (&&,A,C)
     *
     * Works for all conjunctions
     *
     * @param compound     The premise
     * @param component    The recognized component in the premise
     * @param compoundTask Whether the compound comes from the task
     * @param nal          Reference to the memory
     */
    protected static takeOutFromConjunction(compound: CompoundTerm, component: Term, compoundTask: boolean,
        index: int, nal: DerivationContext): void {
        if (compound instanceof Conjunction) {
            let conjCompound: Conjunction = compound as Conjunction;
            let newTerm: Term[] = new Array<Term>(conjCompound.size() - 1);
            java.lang.System.arraycopy(conjCompound.term, 0, newTerm, 0, index);
            java.lang.System.arraycopy(conjCompound.term, index + 1, newTerm, index, newTerm.length - index);
            let cont: Term = Conjunction.make(newTerm, conjCompound.getTemporalOrder(), conjCompound.getIsSpatial());
            let curS: Sentence = nal.getCurrentTask().sentence;
            let truth: TruthValue = null;
            if (curS.isJudgment()) {
                truth = TruthFunctions.deduction(nal.getCurrentTask().sentence.getTruth(), nal.narParameters.reliance,
                    nal.narParameters);
            }
            if (curS.isGoal()) {
                truth = TruthFunctions.desireStrong(nal.getCurrentTask().sentence.getTruth(),
                    TruthValue.fromFrequencyConfidence(1.0, nal.narParameters.reliance, nal.narParameters), nal.narParameters);
            }
            let budget: BudgetValue = BudgetFunctions.forward(truth, nal);
            nal.singlePremiseTask(cont, truth, budget);
        }
    }

    /* --------------- Split sequence apart --------------- */
    /**
     * {(#,A,B,C,D,E), C@(#,A,B,C,D,E)} |- (#,A,B,C), (#,C,D,E)
     *
     * Works for all conjunctions
     *
     * @param compound     The premise
     * @param component    The recognized component in the premise
     * @param compoundTask Whether the compound comes from the task
     * @param nal          Reference to the memory
     */
    protected static splitConjunctionApart(compound: CompoundTerm, component: Term, compoundTask: boolean,
        index: int, nal: DerivationContext): void {
        if (compound instanceof Conjunction) {
            let conjCompound: Conjunction = compound as Conjunction;
            let newTermLeft: Term[] = new Array<Term>(index + 1);
            let newTermRight: Term[] = new Array<Term>(conjCompound.size() - index);
            if (newTermLeft.length === compound.size() || // since nothing was splitted
                newTermRight.length === compound.size()) {
                return;
            }
            if (conjCompound.term.length < newTermLeft.length) {
                return;
            }
            java.lang.System.arraycopy(conjCompound.term, 0, newTermLeft, 0, newTermLeft.length);
            if (conjCompound.term.length - index < newTermRight.length) {
                return;
            }
            java.lang.System.arraycopy(conjCompound.term, 0 + index, newTermRight, 0, newTermRight.length);
            let curS: Sentence = nal.getCurrentTask().sentence;
            let truth: TruthValue = null;
            if (curS.isJudgment()) {
                truth = TruthFunctions.deduction(curS.getTruth(), nal.narParameters.reliance, nal.narParameters);
            }
            if (curS.isGoal()) {
                truth = TruthFunctions.desireStrong(curS.getTruth(),
                    TruthValue.fromFrequencyConfidence(1.0, nal.narParameters.reliance, nal.narParameters), nal.narParameters);
            }
            StructuralRules.deriveSequenceTask(nal, conjCompound, newTermLeft, truth);
            StructuralRules.deriveSequenceTask(nal, conjCompound, newTermRight, truth);
        }
    }

    /**
     * {(#,A,B,C,D,E), C@(#,A,B,C,D,E)} |- (#,(#,A,B),C,D,E), (#,A,B,C,(#,D,E))
     *
     * Group sequence left and right
     *
     * Works for all conjunctions
     *
     * @param compound     The premise
     * @param component    The recognized component in the premise
     * @param compoundTask Whether the compound comes from the task
     * @param nal          Reference to the memory
     *
     * @author Patrick Hammer
     * @author Robert Wünsche
     */
    protected static groupSequence(compound: CompoundTerm, component: Term, compoundTask: boolean,
        index: int, nal: DerivationContext): void {
        if (!(compound instanceof Conjunction) || index >= compound.size()) {
            return;
        }

        let conjCompound: Conjunction = compound as Conjunction;
        if (conjCompound.getTemporalOrder() !== TemporalRules.ORDER_FORWARD) {
            return;
        }

        let hasLeft: boolean = index >= 1; // result subsequence will have at least two elements
        let hasRight: boolean = index < (compound.size() - 1);

        if (hasLeft) {
            let sliceStartIndexInclusive: int = nal.memory.randomNumber.nextInt(index - 1 + 1 /* inclusive */); // if
            // index-1
            // it
            // would
            // have
            // length
            // 1,
            // no
            // group
            let sliceEndIndexInclusive: int = index;

            let allRange: boolean = sliceStartIndexInclusive === 0
                && sliceEndIndexInclusive === (conjCompound.term.length - 1);
            if (!allRange) {
                StructuralRules.createSequenceTaskByRange(conjCompound, sliceStartIndexInclusive, sliceEndIndexInclusive, nal);
            }
        }

        if (hasRight) {
            let sliceStartIndexInclusive: int = index;
            let sliceEndIndexInclusive: int;
            {
                let randminInclusive: int = index + 1;
                let randmaxInclusive: int = compound.size() - 1;
                sliceEndIndexInclusive = nal.memory.randomNumber
                    .nextInt(randmaxInclusive - randminInclusive + 1 /* inclusive */) + randminInclusive;
            }

            let allRange: boolean = sliceStartIndexInclusive === 0
                && sliceEndIndexInclusive === (conjCompound.term.length - 1);
            if (!allRange) {
                StructuralRules.createSequenceTaskByRange(conjCompound, sliceStartIndexInclusive, sliceEndIndexInclusive, nal);
            }
        }
    }

    /**
     * Derives a sub-sequence of a sequence based on a (inclusive) index range
     *
     * @param sourceConjunction   The conjunction we take out a certain part from
     * @param inclusiveStartIndex The start index (inclusive)
     * @param inclusiveEndIndex   The end index (inclusive)
     * @param nal                 The derivation context
     *
     * @author Robert Wünsche
     */
    private static createSequenceTaskByRange(sourceConjunction: Conjunction, inclusiveStartIndex: int,
        inclusiveEndIndex: int, nal: DerivationContext): void {
        let subsequenceLength: int = inclusiveEndIndex - inclusiveStartIndex + 1; // +1 because of all being inclusive
        // indices
        let subsequence: Term[] = new Array<Term>(subsequenceLength);
        // copy subsequence from source to subsequence:
        for (let idxInSource: int = inclusiveStartIndex; idxInSource <= inclusiveEndIndex; idxInSource++) {
            let idxInSubsequence: int = idxInSource - inclusiveStartIndex;
            subsequence[idxInSubsequence] = sourceConjunction.term[idxInSource];
        }
        let destination: Term[] = new Array<Term>(sourceConjunction.size() - subsequenceLength + 1); // +1 because the
        // subsequence requires
        // one element too
        // copy everything before the subsequence:
        let destinationIdx: int = 0;
        for (let idx: int = 0; idx < inclusiveStartIndex; idx++) {
            destination[destinationIdx++] = sourceConjunction.term[idx];
        }
        /* assert destinationIdx == inclusiveStartIndex; */
        // followed by the subsequence
        destination[destinationIdx++] = Conjunction.make(subsequence, sourceConjunction.getTemporalOrder(),
            sourceConjunction.getIsSpatial());
        // followed by everything after the subsequence
        for (let idxInSource: int = inclusiveEndIndex + 1; idxInSource < sourceConjunction.size(); idxInSource++) {
            destination[destinationIdx++] = sourceConjunction.term[idxInSource];
        }
        /* assert destinationIdx == destination.length; */
        // derive sourceConjunction, inheriting the type of conjunction from
        // sourceConjunction
        let curS: Sentence = nal.getCurrentTask().sentence;
        let truth: TruthValue | null = curS.truth !== null ? curS.getTruth().clone() : null;
        StructuralRules.deriveSequenceTask(nal, sourceConjunction, destination, truth);
    }

    /***
     * Derives a sequence task, inheriting properties from parentConj
     *
     * @param nal   The derivation context
     * @param total The sub-terms the conjunction should be created from
     * @param truth The truth value of the derivation
     */
    private static deriveSequenceTask(nal: DerivationContext, parentConj: Conjunction, total: Term[],
        truth: TruthValue): void {
        let cont: Term = Conjunction.make(total, parentConj.getTemporalOrder(), parentConj.getIsSpatial());
        if (cont instanceof Conjunction && total.length !== parentConj.size()) {
            let budget: BudgetValue = truth !== null ? BudgetFunctions.compoundForward(truth, cont, nal)
                : BudgetFunctions.compoundBackward(cont, nal);
            nal.singlePremiseTask(cont, truth, budget);
        }
    }

    public static seqToImage(conj: Conjunction, index: int, nal: DerivationContext): void {
        let side: int = 0; // extensional
        let indices: Int16Array = [side as short, index as short];
        let subject: Product = Product.make(conj.term);
        let predicate: Term = Term.SEQ_TEMPORAL;
        if (conj.isSpatial) {
            predicate = Term.SEQ_SPATIAL;
        }
        let inh: Inheritance = Inheritance.make(subject, predicate);
        StructuralRules.transformProductImage(inh, inh, indices, nal);
    }

    /* --------------- Disjunction and Conjunction transform --------------- */
    /**
     * {(&&, A, B), A@(&&, A, B)} |- A,
     * <br>
     * or answer (&&, A, B)? using A {(||, A, B), A@(||, A, B)} |- A,
     * <br>
     * or answer (||, A, B)? using A
     *
     * @param compound     The premise
     * @param component    The recognized component in the premise
     * @param compoundTask Whether the compound comes from the task
     * @param nal          Reference to the memory
     */
    protected static structuralCompound(compound: CompoundTerm, component: Term, compoundTask: boolean,
        index: int, nal: DerivationContext): boolean {

        if (compound instanceof Conjunction) {
            if (nal.getCurrentTask().getTerm() === compound) {
                let conj: Conjunction = compound as Conjunction; // only for # for now, will be gradually applied to &/
                // later
                if (conj.getTemporalOrder() === TemporalRules.ORDER_FORWARD && conj.isSpatial) { // and some also to &&
                    // &|
                    // flattenSequence(compound, component, compoundTask, index, nal);
                    StructuralRules.groupSequence(compound, component, compoundTask, index, nal);
                    // takeOutFromConjunction(compound, component, compoundTask, index, nal);
                    StructuralRules.splitConjunctionApart(compound, component, compoundTask, index, nal);
                }
                if (conj.getTemporalOrder() === TemporalRules.ORDER_FORWARD) {
                    StructuralRules.seqToImage(conj, index, nal);
                }
            }
        }

        if (component.hasVarIndep()) { // moved down here since flattening also works when indep
            return false;
        } // and also for &/ with index > 0
        if ((compound instanceof Conjunction) && !compound.getIsSpatial()
            && (compound.getTemporalOrder() === TemporalRules.ORDER_FORWARD) && (index !== 0)) {
            return false;
        }

        let content: Term = compoundTask ? component : compound;
        let task: Task = nal.getCurrentTask();

        let sentence: Sentence = task.sentence;
        let truth: TruthValue | null = sentence.truth;

        let reliance: float = nal.narParameters.reliance;

        let budget: BudgetValue;
        if (sentence.isQuestion() || sentence.isQuest()) {
            budget = BudgetFunctions.compoundBackward(content, nal);
        } else { // need to redefine the cases

            // [03:24] <patham9> <a --> b>. (||,<a --> b>,<x --> y>)? => (||,<a --> b>,<x
            // --> y>).
            // [03:25] <patham9> <a --> b>. (||,<a --> b>,<x --> y>). => dont derive it
            // "outputMustNotContain(<x --> y>)"
            // [03:25] <patham9> <a --> b>. (&&,<a --> b>,<x --> y>)? => dont derive it
            // "outputMustNotContain( (&&,<a --> b>,<x --> y>))"
            // [03:25] <patham9> <a --> b>. (&&,<a --> b>,<x --> y>). => <x --> y>
            if ((sentence.isJudgment() || sentence.isGoal()) &&
                ((!compoundTask && compound instanceof Disjunction) ||
                    (compoundTask && compound instanceof Conjunction))) {
                truth = TruthFunctions.deduction(sentence.getTruth(), reliance, nal.narParameters);
            } else {
                let v1: TruthValue;
                let v2: TruthValue;
                const sourceTruth = sentence.getTruth();
                v1 = TruthFunctions.negation(sourceTruth, nal.narParameters);
                v2 = TruthFunctions.deduction(v1, reliance, nal.narParameters);
                truth = TruthFunctions.negation(v2, nal.narParameters);
            }
            budget = BudgetFunctions.forward(truth, nal);
        }
        return nal.singlePremiseTask(content, truth, budget);
    }

    /* --------------- Negation related rules --------------- */
    /**
     * {A, A@(--, A)} |- (--, A)
     *
     * @param content The premise
     * @param nal     Reference to the memory
     */
    public static transformNegation(content: CompoundTerm, nal: DerivationContext): void {
        let task: Task = nal.getCurrentTask();
        let sentence: Sentence = task.sentence;
        let truth: TruthValue | null = sentence.truth;

        let budget: BudgetValue;

        if (sentence.isJudgment() || sentence.isGoal()) {
            truth = TruthFunctions.negation(sentence.getTruth(), nal.narParameters);
            budget = BudgetFunctions.compoundForward(truth, content, nal);
        } else {
            budget = BudgetFunctions.compoundBackward(content, nal);
        }
        nal.singlePremiseTask(content, truth, budget);
    }

    /**
     * {<A ==> B>, A@(--, A)} |- <(--, B) ==> (--, A)>
     *
     * @param statement The premise
     * @param nal       Reference to the memory
     */
    protected static contraposition(statement: Statement, sentence: Sentence,
        nal: DerivationContext): boolean {
        // final Memory memory = nal.mem();
        // memory.logic.CONTRAPOSITION.commit(statement.complexity);

        let subj: Term = statement.getSubject();
        let pred: Term = statement.getPredicate();

        let content: Statement | null = Statement.make(statement,
            Negation.make(pred),
            Negation.make(subj),
            TemporalRules.reverseOrder(statement.getTemporalOrder()));

        if (content === null)
            return false;

        let truth: TruthValue | null = sentence.truth;
        let budget: BudgetValue;
        if (sentence.isQuestion() || sentence.isQuest()) {
            if (content instanceof Implication) {
                budget = BudgetFunctions.compoundBackwardWeak(content, nal);
            } else {
                budget = BudgetFunctions.compoundBackward(content, nal);
            }
            return nal.singlePremiseTask(content, Symbols.QUESTION_MARK, truth, budget);
        } else {
            if (content instanceof Implication) {
                truth = TruthFunctions.contraposition(sentence.getTruth(), nal.narParameters);
            }
            budget = BudgetFunctions.compoundForward(truth, content, nal);
            return nal.singlePremiseTask(content, Symbols.JUDGMENT_MARK, truth, budget);
        }
    }
}
