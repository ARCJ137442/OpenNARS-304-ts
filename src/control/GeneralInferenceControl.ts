//! Java source: opennars/control/GeneralInferenceControl.java
import { java, JavaObject, type float, type int } from "jree";



/**
 * Concept reasoning context
 *
 * a concept is "fired" or activated by applying the reasoner
 *
 * @author Patrick Hammer
 *
 */
export class GeneralInferenceControl extends JavaObject {

    public static selectConceptForInference(mem: Memory, narParameters: Parameters, nar: Nar): void {
        let currentConcept: Concept;
        /* synchronized (mem.concepts) { */ // modify concept bag
        currentConcept = mem.concepts.takeOut();
        if (currentConcept === null) {
            return;
        }
        /* } */

        let nal: DerivationContext = new DerivationContext(mem, narParameters, nar);
        let putBackConcept: boolean = false;
        let forgetCycles: float = 0.0;
        /* synchronized (currentConcept) { */ // use current concept (current concept is the resource)
        ProcessAnticipation.maintainDisappointedAnticipations(narParameters, currentConcept, nar);
        if (currentConcept.taskLinks.size() === 0) { // remove concepts without taskLinks and without termLinks
            mem.concepts.pickOut(currentConcept.getTerm());
            mem.conceptRemoved(currentConcept);
            return;
        }
        if (currentConcept.termLinks.size() === 0) { // remove concepts without taskLinks and without termLinks
            mem.concepts.pickOut(currentConcept.getTerm());
            mem.conceptRemoved(currentConcept);
            return;
        }
        nal.setCurrentConcept(currentConcept);
        putBackConcept = GeneralInferenceControl.fireConcept(nal, 1);
        if (putBackConcept) {
            forgetCycles = nal.memory.cycles(nal.memory.narParameters.CONCEPT_FORGET_DURATIONS);
            if (nal.memory.emotion !== null) {
                nal.currentConcept.setQuality(
                    BudgetFunctions.or(nal.currentConcept.getQuality(), nal.memory.emotion.happy()));
            }
        }
        /* } */
        if (putBackConcept) { // put back into bag (bag is the resource)
            /* synchronized (nal.memory.concepts) { */
            nal.memory.concepts.putBack(nal.currentConcept, forgetCycles, nal.memory);
            /* } */
        }
    }

    // /return true if concept must be put back
    public static fireConcept(nal: DerivationContext, numTaskLinks: int): boolean {
        for (let i: int = 0; i < numTaskLinks; i++) {
            if (nal.currentConcept.taskLinks.size() === 0) {
                return false;
            }
            nal.currentTaskLink = nal.currentConcept.taskLinks.takeOut();
            if (nal.currentTaskLink === null) {
                return false;
            }
            if (nal.currentTaskLink.budget.aboveThreshold()) {
                GeneralInferenceControl.fireTaskLink(nal, nal.memory.narParameters.TERMLINK_MAX_REASONED);
            }
            nal.currentConcept.taskLinks.putBack(nal.currentTaskLink,
                nal.memory.cycles(nal.memory.narParameters.TASKLINK_FORGET_DURATIONS), nal.memory);
        }
        return true;
    }

    protected static fireTaskLink(nal: DerivationContext, termLinks: int): void {
        let task: Task = nal.currentTaskLink.getTarget();
        nal.setCurrentTerm(nal.currentConcept.term);
        nal.setCurrentTaskLink(nal.currentTaskLink);
        nal.setCurrentBeliefLink(null);
        nal.setCurrentTask(task); // one of the two places where this variable is set
        if (nal.memory.emotion !== null) {
            nal.memory.emotion.adjustBusy(nal.currentTaskLink.getPriority(), nal.currentTaskLink.getDurability(), nal);
        }
        if (nal.currentTaskLink.type === TermLink.TRANSFORM) {
            nal.setCurrentBelief(null);
            // TermLink taskLink_as_termLink = new TermLink(nal.currentTaskLink.getTerm(),
            // TermLink.TRANSFORM, nal.getCurrentTaskLink().index);
            // if(nal.currentTaskLink.novel(taskLink_as_termLink, nal.memory.time(), true))
            // { //then record yourself, but also here novelty counts
            RuleTables.transformTask(nal.currentTaskLink, nal); // to turn this into structural inference as below?
            // }
        } else {
            while (termLinks > 0) {
                let termLink: TermLink = nal.currentConcept.selectTermLink(nal.currentTaskLink, nal.time.time(),
                    nal.narParameters);
                if (termLink === null) {
                    break;
                }
                GeneralInferenceControl.fireTermlink(termLink, nal);
                nal.currentConcept.returnTermLink(termLink);
                termLinks--;
            }
        }

        nal.memory.emit(Events.ConceptFire.class, nal);
        // memory.logic.TASKLINK_FIRE.commit(currentTaskLink.budget.getPriority());
    }

    public static fireTermlink(termLink: TermLink, nal: DerivationContext): boolean {
        nal.setCurrentBeliefLink(termLink);
        RuleTables.reason(nal.currentTaskLink, termLink, nal);
        nal.memory.emit(Events.TermLinkSelect.class, termLink, nal.currentConcept, nal);
        return true;
    }
}
