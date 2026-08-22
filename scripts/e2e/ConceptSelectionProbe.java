import org.opennars.control.DerivationContext;
import org.opennars.io.events.EventEmitter.EventObserver;
import org.opennars.io.events.Events;
import org.opennars.main.Nar;
import org.opennars.parameter.Debug;

import java.io.BufferedReader;
import java.io.FileReader;

public final class ConceptSelectionProbe {
    public static void main(String[] args) throws Exception {
        Debug.TEST = true;
        Nar nar = new Nar();
        try (BufferedReader reader = new BufferedReader(new FileReader("java-master/src/main/resources/nal/application/toothbrush.nal"))) {
            String raw;
            while ((raw = reader.readLine()) != null) {
                String line = raw.trim();
                if (line.isEmpty() || line.startsWith("'") || line.matches("[0-9]+")) break;
                nar.addInput(line);
            }
        }
        nar.event(new EventObserver() {
            private int sequence;

            @Override
            public void event(Class<?> event, Object[] args) {
                if (event == Events.ConceptFire.class && args[0] instanceof DerivationContext context) {
                    System.out.println("{\"sequence\":" + sequence
                            + ",\"concept\":\"" + quote(context.getCurrentConcept().getTerm().toString())
                            + "\",\"task\":\"" + quote(context.getCurrentTask().sentence.term.toString())
                            + "\",\"taskPriority\":" + context.getCurrentTask().getPriority()
                            + ",\"taskDurability\":" + context.getCurrentTask().getDurability()
                            + ",\"taskQuality\":" + context.getCurrentTask().getQuality()
                            + ",\"priority\":" + context.getCurrentConcept().getPriority()
                            + ",\"durability\":" + context.getCurrentConcept().getDurability()
                            + ",\"quality\":" + context.getCurrentConcept().getQuality() + "}");
                }
                sequence++;
            }

            private String quote(String value) {
                return value.replace("\\", "\\\\").replace("\"", "\\\"");
            }
        }, true, Events.ConceptFire.class);
        nar.cycles(1000);
    }
}
