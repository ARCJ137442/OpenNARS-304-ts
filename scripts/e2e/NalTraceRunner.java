import org.opennars.control.DerivationContext;
import org.opennars.entity.Concept;
import org.opennars.entity.Sentence;
import org.opennars.entity.Task;
import org.opennars.entity.TaskLink;
import org.opennars.entity.TermLink;
import org.opennars.io.events.EventEmitter.EventObserver;
import org.opennars.io.events.Events;
import org.opennars.io.events.OutputHandler;
import org.opennars.main.Nar;
import org.opennars.parameter.Debug;

import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Bounded diagnostic adapter for comparing the observable toothbrush chain.
 * It deliberately stops before an embedded numeric cycle line.
 */
public final class NalTraceRunner {
    private NalTraceRunner() {
    }

    public static void main(final String[] args) throws Exception {
        if (args.length < 2 || (args.length > 2 && !"--skip-embedded".equals(args[2]))) {
            throw new IllegalArgumentException("usage: NalTraceRunner <cycles> <nal-file> [--skip-embedded]");
        }
        final int cycles = Integer.parseInt(args[0]);
        final String file = args[1];
        final boolean skipEmbedded = args.length == 3;
        Debug.TEST = true;
        final PrintStream output = System.out;
        final PrintStream quiet = new PrintStream(new ByteArrayOutputStream());
        final Nar nar = new Nar();
            final Trace trace = new Trace(output, nar);
        nar.event(trace, true,
                Events.TaskAdd.class,
                Events.ConceptNew.class,
                Events.ConceptDirectProcessedTask.class,
                Events.TaskImmediateProcess.class,
                Events.TermLinkAdd.class,
                Events.TaskLinkAdd.class,
                Events.TaskLinkRemove.class,
                Events.ConceptFire.class,
                Events.TermLinkSelect.class,
                Events.BeliefSelect.class,
                Events.BeliefReason.class,
                Events.TaskDerive.class,
                Events.EnactableExplainationAdd.class,
                Events.NewTaskExecution.class,
                OutputHandler.OUT.class,
                OutputHandler.EXE.class);
        try {
            System.setOut(quiet);
            for (final String raw : Files.readAllLines(Path.of(file))) {
                final String line = raw.trim();
                if (line.isEmpty()) {
                    continue;
                }
                if (line.startsWith("'")) {
                    continue;
                }
                if (line.matches("[0-9]+")) {
                    if (!skipEmbedded) {
                        nar.cycles(Integer.parseInt(line));
                    }
                    continue;
                }
                nar.addInput(line);
            }
            trace.write("before-cycles", List.of(), null);
            nar.cycles(cycles);
            trace.write("after-cycles", List.of(), null);
        } finally {
            System.setOut(output);
        }
    }

    private static final class Trace implements EventObserver {
        private final PrintStream output;
        private final Nar nar;
        private int sequence = 0;
        private final int limit = 400000;

        private Trace(final PrintStream output, final Nar nar) {
            this.output = output;
            this.nar = nar;
        }

        @Override
        public void event(final Class<?> event, final Object[] args) {
            if (sequence >= limit) {
                return;
            }
            final List<String> values = new ArrayList<>();
            for (int i = 0; i < Math.min(args.length, 4); i++) {
                values.add(describe(args[i]));
            }
            write(event.getSimpleName(), values, contextSummary(args));
        }

        private String contextSummary(final Object[] args) {
            for (final Object value : args) {
                if (value instanceof Concept concept && "(^left,{SELF})".equals(concept.getTerm().toString())) {
                    final TaskLink focusedTaskLink = Arrays.stream(args)
                            .filter(TaskLink.class::isInstance)
                            .map(TaskLink.class::cast)
                            .findFirst()
                            .orElse(null);
                    final StringBuilder taskLinks = new StringBuilder("[");
                    boolean firstTaskLink = true;
                    for (final TaskLink taskLink : concept.taskLinks) {
                        if (!firstTaskLink) {
                            taskLinks.append(", ");
                        }
                        firstTaskLink = false;
                        taskLinks.append(taskLink.getTarget().sentence.term)
                                .append(" keyHash=").append(taskLink.name().hashCode())
                                .append(" equalsFocus=")
                                .append(focusedTaskLink == null ? "n/a" : taskLink.name().equals(focusedTaskLink.name()))
                                .append(" sentenceHash=").append(taskLink.getTarget().sentence.hashCode())
                                .append(" punctuation=").append(taskLink.getTarget().sentence.punctuation)
                                .append(" occurrence=").append(taskLink.getTarget().sentence.stamp.getOccurrenceTime())
                                .append(" truth=").append(taskLink.getTarget().sentence.truth)
                                .append(" records=")
                                .append(taskLink.records.stream()
                                        .map(record -> record.link.target + "@" + record.getTime())
                                        .toList());
                    }
                    return "concept=" + concept.getTerm() + "|taskLinks=" + taskLinks.append(']');
                }
                if (!(value instanceof DerivationContext context)) {
                    continue;
                }
                final Concept concept = context.getCurrentConcept();
                final TaskLink link = context.getCurrentTaskLink();
                final String conceptText = concept == null ? "null" : concept.getTerm().toString();
                if (link == null) {
                    return "concept=" + conceptText + "|taskLink=null";
                }
                String summary = "time=" + context.getTime()
                        + "|noveltyHorizon=" + context.narParameters.NOVELTY_HORIZON
                        + "|concept=" + conceptText
                        + "|taskLink=" + link.getTarget().sentence.term
                        + "|type=" + link.type
                        + "|index=" + Arrays.toString(link.index)
                        + "|priority=" + link.getPriority()
                        + "|durability=" + link.getDurability()
                        + "|quality=" + link.getQuality()
                        + "|conceptPriority=" + concept.getPriority()
                        + "|conceptDurability=" + concept.getDurability()
                        + "|conceptQuality=" + concept.getQuality();
                if ("(^left,{SELF})".equals(conceptText)) {
                    final StringBuilder termLinks = new StringBuilder("[");
                    boolean firstTermLink = true;
                    for (final TermLink termLink : concept.termLinks) {
                        if (!firstTermLink) {
                            termLinks.append(", ");
                        }
                        firstTermLink = false;
                        termLinks.append(termLink.target).append("|type=").append(termLink.type)
                                .append("|index=").append(Arrays.toString(termLink.index));
                    }
                    termLinks.append(']');
                    summary += "|records=" + link.records.stream()
                            .map(record -> record.link.target + "@" + record.getTime())
                            .toList()
                            + "|termLinks=" + termLinks;
                }
                return summary;
            }
            return null;
        }

        private void write(final String event, final List<String> args, final String context) {
            output.print("{\"seq\":");
            output.print(sequence++);
            output.print(",\"event\":");
            output.print(quote(event));
            output.print(",\"args\":[");
            for (int i = 0; i < args.size(); i++) {
                if (i > 0) {
                    output.print(',');
                }
                output.print(quote(args.get(i)));
            }
            output.print("]");
            if (context != null) {
                output.print(",\"context\":");
                output.print(quote(context));
            }
            output.println("}");
        }

        private String describe(final Object value) {
            if (value == null) {
                return null;
            }
            if (value instanceof Task task) {
                return task.sentence.toString(nar, true) + "|seq=" + task.isElemOfSequenceBuffer()
                        + "|input=" + task.isInput();
            }
            if (value instanceof Sentence sentence) {
                return sentence.toString(nar, true).toString();
            }
            if (value instanceof Concept concept) {
                return concept.getTerm().toString();
            }
            if (value instanceof TaskLink link) {
                return link.getTarget().sentence.term + "|type=" + link.type + "|index=" + Arrays.toString(link.index);
            }
            if (value instanceof TermLink link) {
                return link.target + "|type=" + link.type + "|index=" + Arrays.toString(link.index);
            }
            if (value instanceof DerivationContext context) {
                final Task task = context.getCurrentTask();
                return task == null ? context.toString() : task.sentence.term.toString();
            }
            return String.valueOf(value);
        }

        private static String quote(final String value) {
            if (value == null) {
                return "null";
            }
            return "\"" + value.replace("\\", "\\\\")
                    .replace("\"", "\\\"")
                    .replace("\r", "\\r")
                    .replace("\n", "\\n") + "\"";
        }
    }
}
