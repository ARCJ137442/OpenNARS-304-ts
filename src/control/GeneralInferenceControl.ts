//! Java source: opennars/control/GeneralInferenceControl.java
import { java, JavaObject, type float, type int } from "jree";
import { Events } from "../io/events/Events.ts";
import { DerivationContext } from "./DerivationContext.ts";
import { ProcessAnticipation } from "./concept/ProcessAnticipation.ts";
import { BudgetFunctions } from "../inference/BudgetFunctions.ts";
import { RuleTables } from "../inference/RuleTables.ts";
import { TermLink } from "../entity/TermLink.ts";
import type { Memory } from "../storage/Memory.ts";
import type { Parameters } from "../main/Parameters.ts";
import type { Nar } from "../main/Nar.ts";
import type { Concept } from "../entity/Concept.ts";
import type { Task } from "../entity/Task.ts";



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
                currentConcept.setQuality(
                    BudgetFunctions.or(currentConcept.getQuality(), nal.memory.emotion.happy()));
            }
        }
        /* } */
        if (putBackConcept) { // put back into bag (bag is the resource)
            /* synchronized (nal.memory.concepts) { */
            nal.memory.concepts.putBack(currentConcept, forgetCycles, nal.memory);
            /* } */
        }
    }

    // /return true if concept must be put back
    public static fireConcept(nal: DerivationContext, numTaskLinks: int): boolean {
        const currentConcept = nal.requireCurrentConcept();
        for (let i: int = 0; i < numTaskLinks; i++) {
            if (currentConcept.taskLinks.size() === 0) {
                return false;
            }
            const currentTaskLink = currentConcept.taskLinks.takeOut();
            nal.currentTaskLink = currentTaskLink;
            if (currentTaskLink === null) {
                return false;
            }
            if (currentTaskLink.getBudget().aboveThreshold()) {
                GeneralInferenceControl.fireTaskLink(nal, nal.memory.narParameters.TERMLINK_MAX_REASONED);
            }
            currentConcept.taskLinks.putBack(currentTaskLink,
                nal.memory.cycles(nal.memory.narParameters.TASKLINK_FORGET_DURATIONS), nal.memory);
        }
        return true;
    }

    protected static fireTaskLink(nal: DerivationContext, termLinks: int): void {
        const currentTaskLink = nal.requireCurrentTaskLink();
        const currentConcept = nal.requireCurrentConcept();
        let task: Task = currentTaskLink.getTarget();
        nal.setCurrentTerm(currentConcept.term);
        nal.setCurrentTaskLink(currentTaskLink);
        nal.setCurrentBeliefLink(null);
        nal.setCurrentTask(task); // one of the two places where this variable is set
        if (nal.memory.emotion !== null) {
            nal.memory.emotion.adjustBusy(currentTaskLink.getPriority(), currentTaskLink.getDurability(), nal);
        }
        if (currentTaskLink.type === TermLink.TRANSFORM) {
            nal.setCurrentBelief(null);
            // TermLink taskLink_as_termLink = new TermLink(nal.currentTaskLink.getTerm(),
            // TermLink.TRANSFORM, nal.getCurrentTaskLink().index);
            // if(nal.currentTaskLink.novel(taskLink_as_termLink, nal.memory.time(), true))
            // { //then record yourself, but also here novelty counts
            RuleTables.transformTask(currentTaskLink, nal); // to turn this into structural inference as below?
            // }
        } else {
            while (termLinks > 0) {
                let termLink: TermLink | null = currentConcept.selectTermLink(currentTaskLink, nal.time.time(),
                    nal.narParameters);
                if (termLink === null) {
                    break;
                }
                GeneralInferenceControl.fireTermlink(termLink, nal);
                currentConcept.returnTermLink(termLink);
                termLinks--;
            }
        }

        nal.memory.emit(Events.ConceptFire.class, nal);
        // memory.logic.TASKLINK_FIRE.commit(currentTaskLink.budget.getPriority());
    }

    public static fireTermlink(termLink: TermLink, nal: DerivationContext): boolean {
        nal.setCurrentBeliefLink(termLink);
        RuleTables.reason(nal.requireCurrentTaskLink(), termLink, nal);
        nal.memory.emit(Events.TermLinkSelect.class, termLink, nal.requireCurrentConcept(), nal);
        return true;
    }
}
