import { readFileSync } from "node:fs";
import { java } from "../../test/support/legacy-runtime-facade.ts";
import { DerivationContext } from "../../src/control/DerivationContext.ts";
import { Events } from "../../src/io/events/Events.ts";
import { Nar } from "../../src/main/Nar.ts";

const nar = new Nar();
for (const rawLine of readFileSync("java-master/src/main/resources/nal/application/toothbrush.nal", "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (line.length === 0 || line.startsWith("'") || /^[0-9]+$/.test(line)) break;
    nar.addInput(new java.lang.String(line));
}
let sequence = 0;
nar.event({
    event(eventClass, args) {
        if (eventClass === Events.ConceptFire.class && args[0] instanceof DerivationContext) {
            const context = args[0];
            console.log(JSON.stringify({
                sequence,
                concept: String(context.getCurrentConcept().getTerm().name()),
                task: String(context.getCurrentTask().sentence.term.name()),
                taskPriority: context.getCurrentTask().getPriority(),
                taskDurability: context.getCurrentTask().getDurability(),
                taskQuality: context.getCurrentTask().getQuality(),
                priority: context.getCurrentConcept().getPriority(),
                durability: context.getCurrentConcept().getDurability(),
                quality: context.getCurrentConcept().getQuality(),
            }));
        }
        sequence += 1;
    },
}, true, Events.ConceptFire.class);
nar.cycles(1000);
