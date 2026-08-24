//! Java source: opennars/plugin/mental/ComplexEmotions.java
import { java, JavaObject, type float } from "jree";
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
export class ComplexEmotions extends JavaObject implements Plugin {

    public obs: EventObserver;
    protected fear: float = Float32Math.from(0.5) as float;

    public setEnabled(n: Nar, enabled: boolean): boolean {
        if (enabled) {

            let memory: Memory = n.memory;

            if (this.obs === null) {
                this.obs = (event, a) => {
                    if (event !== Events.TaskDerive.class &&
                        event !== Events.InduceSucceedingEvent.class)
                        return;
                    let future_task: Task = a[0] as Task;

                    if (future_task.sentence.getOccurrenceTime() > n.time()) {
                        let c: Concept = n.memory.concept(future_task.getTerm());
                        let true_expectation: float = 0.5;
                        let false_expectation: float = 0.5;
                        if (c !== null) {
                            if (c.desires.size() > 0 && c.beliefs.size() > 0) {
                                // Fear:
                                if (future_task.sentence.getTruth().getExpectation() > true_expectation &&
                                    c.desires.get(0).sentence.getTruth().getExpectation() < false_expectation) {
                                    // n.addInput("<(*,{SELF},fear) --> ^feel>. :|:");
                                    let weight: float = future_task.getPriority();
                                    let fear: float = LocalRules.solutionQuality(true, c.desires.get(0), future_task.sentence, memory,
                                        n);
                                    let newValue: float = Float32Math.multiply(fear, weight) as float;
                                    fear = Float32Math.add(fear, Float32Math.multiply(newValue, weight)) as float;
                                    fear = Float32Math.divide(fear, Float32Math.add(1.0, weight)) as float;
                                    // incrase concept priority by fear value:
                                    let C1: Concept = memory.concept(future_task.getTerm());
                                    if (C1 !== null) {
                                        C1.incPriority(fear);
                                    }
                                    memory.emit(Answer.class, "Fear value=" + fear);
                                    java.lang.System.out.println("Fear value=" + fear);
                                }
                            }
                        }
                    }
                };
            }
            memory.event.set(this.obs, enabled, Events.InduceSucceedingEvent.class, Events.TaskDerive.class);
        }
        return true;
    }
}
