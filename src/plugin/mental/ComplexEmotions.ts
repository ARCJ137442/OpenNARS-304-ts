import { java, JavaObject, type float } from "jree";



/**
 *
 * @author Patrick
 */
export class ComplexEmotions extends JavaObject implements Plugin {

    public obs: EventEmitter.EventObserver;
    protected fear: float = 0.5;

    public setEnabled(/* final */  n: Nar, /* final */  enabled: boolean): boolean {
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
                                if (future_task.sentence.truth.getExpectation() > true_expectation &&
                                    c.desires.get(0).sentence.truth.getExpectation() < false_expectation) {
                                    // n.addInput("<(*,{SELF},fear) --> ^feel>. :|:");
                                    let weight: float = future_task.getPriority();
                                    let fear: float = solutionQuality(true, c.desires.get(0), future_task.sentence, memory,
                                        n);
                                    let newValue: float = fear * weight;
                                    fear += newValue * weight;
                                    fear /= 1.0 + weight;
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
