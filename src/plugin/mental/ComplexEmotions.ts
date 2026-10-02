//! Java source: opennars/plugin/mental/ComplexEmotions.java
import type { ClassKey } from "../../runtime/ClassIdentity.ts";
import type { FloatNumber } from "../../types.ts"; // Java primitive aliases formerly imported from jree; runtime narrowing is separate.
import { Events } from "../../io/events/Events.ts";
import { LocalRules } from "../../inference/LocalRules.ts";
import { Float32Math } from "../../runtime/Float32.ts";
import type { Task } from "../../entity/Task.ts";
import type { Concept } from "../../entity/Concept.ts";
import type { Memory } from "../../storage/Memory.ts";
import type { Nar } from "../../main/Nar.ts";
import type { EventEmitter } from "../../io/events/EventEmitter.ts";
import type { Plugin } from "../Plugin.ts";

type EventObserver = EventEmitter.EventObserver;
const Answer = Events.Answer;



/**
 *
 * @author Patrick
 */
// Java source declares a plain Plugin implementation without an Object shell.
export class ComplexEmotions implements Plugin {

    public obs: EventObserver | null = null;
    protected fear: FloatNumber = Float32Math.from(0.5) as FloatNumber;

    public setEnabled(n: Nar, enabled: boolean): boolean {
        if (enabled) {

            let memory: Memory = n.memory;

            if (this.obs === null) {
                this.obs = {
                    event: (event: ClassKey, a: EventEmitter.EventPayload): void => {
                    if (event !== Events.TaskDerive &&
                        event !== Events.InduceSucceedingEvent)
                        return;
                    let future_task: Task = a[0] as Task;

                    if (future_task.sentence.getOccurrenceTime() > n.time()) {
                        let c: Concept = n.memory.concept(future_task.getTerm());
                        let true_expectation: FloatNumber = 0.5;
                        let false_expectation: FloatNumber = 0.5;
                        if (c !== null) {
                            if (c.desires.size() > 0 && c.beliefs.size() > 0) {
                                // Fear:
                                if (future_task.sentence.getTruth().getExpectation() > true_expectation &&
                                    c.desires.get(0).sentence.getTruth().getExpectation() < false_expectation) {
                                    // n.addInput("<(*,{SELF},fear) --> ^feel>. :|:");
                                    let weight: FloatNumber = future_task.getPriority();
                                    let fear: FloatNumber = LocalRules.solutionQuality(true, c.desires.get(0), future_task.sentence, memory,
                                        n);
                                    let newValue: FloatNumber = Float32Math.multiply(fear, weight) as FloatNumber;
                                    fear = Float32Math.add(fear, Float32Math.multiply(newValue, weight)) as FloatNumber;
                                    fear = Float32Math.divide(fear, Float32Math.add(1.0, weight)) as FloatNumber;
                                    // incrase concept priority by fear value:
                                    let C1: Concept = memory.concept(future_task.getTerm());
                                    if (C1 !== null) {
                                        C1.incPriority(fear);
                                    }
                                    memory.emit(Answer, `Fear value=${fear}`);
                                }
                            }
                        }
                    }
                    },
                };
            }
            memory.event.set(this.obs as EventObserver, enabled, Events.InduceSucceedingEvent, Events.TaskDerive);
        }
        return true;
    }
}
