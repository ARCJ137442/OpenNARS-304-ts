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
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.MessageDigest;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/** Low-overhead, windowed stage digest for Java/TypeScript evidence comparison. */
public final class NalStageDigestRunner {
    private static final List<String> STAGES = List.of("input", "concept", "links", "scheduler", "rule", "derivation", "marker");

    private NalStageDigestRunner() {
    }

    public static void main(final String[] args) throws Exception {
        if (args.length < 2) {
            throw new IllegalArgumentException("usage: NalStageDigestRunner <cycles> <nal-file> [--skip-embedded] [--window-size N] [--stream]");
        }
        final int cycles = Integer.parseInt(args[0]);
        final String file = args[1];
        boolean skipEmbedded = false;
        boolean stream = false;
        int windowSize = 1024;
        for (int index = 2; index < args.length; index++) {
            if ("--skip-embedded".equals(args[index])) {
                skipEmbedded = true;
            } else if ("--stream".equals(args[index])) {
                stream = true;
            } else if ("--window-size".equals(args[index])) {
                windowSize = Integer.parseInt(args[++index]);
            } else {
                throw new IllegalArgumentException("unknown argument: " + args[index]);
            }
        }
        if (cycles < 1 || windowSize < 1) throw new IllegalArgumentException("cycles and window size must be positive");

        Debug.TEST = true;
        final PrintStream output = System.out;
        final PrintStream quiet = new PrintStream(new ByteArrayOutputStream());
        System.setOut(quiet);
        final Nar nar = new Nar();
        final DigestTrace trace = new DigestTrace(nar, windowSize, output, stream);
        if (stream) {
            output.println("{\"kind\":\"meta\",\"format_version\":1,\"window_cycles\":"
                    + windowSize + ",\"requested_cycles\":" + cycles + ",\"skip_embedded\":" + skipEmbedded + "}");
        }
        nar.event(trace, true,
                Events.CycleStart.class,
                Events.CycleEnd.class,
                Events.TaskAdd.class,
                Events.ConceptNew.class,
                Events.ConceptDirectProcessedTask.class,
                Events.TaskImmediateProcess.class,
                Events.TermLinkAdd.class,
                Events.TaskLinkAdd.class,
                Events.ConceptFire.class,
                Events.TermLinkSelect.class,
                Events.BeliefSelect.class,
                Events.BeliefReason.class,
                Events.TaskDerive.class,
                Events.NewTaskExecution.class,
                OutputHandler.OUT.class,
                OutputHandler.EXE.class);
        try {
            for (final String raw : Files.readAllLines(Path.of(file))) {
                final String line = raw.trim();
                if (line.isEmpty() || line.startsWith("'")) continue;
                if (line.matches("[0-9]+")) {
                    if (!skipEmbedded) nar.cycles(Integer.parseInt(line));
                } else {
                    nar.addInput(line);
                }
            }
            nar.cycles(cycles);
        } finally {
            System.setOut(output);
        }
        System.out.println(trace.render(cycles, skipEmbedded));
    }

    private static final class StageStats {
        int eventCount;
        int cyclesWithEvents;
        String firstEvent;
        String lastEvent;
        final MessageDigest digest = sha256();

        void addToken(final String token) {
            eventCount++;
            if (firstEvent == null) firstEvent = token.trim();
            lastEvent = token.trim();
            digest.update(token.getBytes(StandardCharsets.UTF_8));
        }

        String digestHex() {
            return hex(digest.digest());
        }
    }

    private static final class DigestTrace implements EventObserver {
        private final Nar nar;
        private final int windowSize;
        private final PrintStream streamOutput;
        private final boolean stream;
        private Map<String, StageStats> pre = emptyStages();
        private final List<String> records = new ArrayList<>();
        private Map<String, StageStats> current = emptyStages();
        private Map<String, StageStats> windowStages = emptyStages();
        private int preEvents;
        private int preEventsTotal;
        private int currentCycle;
        private int windowStart = 1;
        private int windowCycles;
        private int windowEvents;
        private int totalEvents;
        private int windows;
        private boolean active;
        private boolean preFlushed;

        DigestTrace(final Nar nar, final int windowSize, final PrintStream streamOutput, final boolean stream) {
            this.nar = nar;
            this.windowSize = windowSize;
            this.streamOutput = streamOutput;
            this.stream = stream;
        }

        @Override
        public void event(final Class<?> event, final Object[] args) {
            final String name = event.getSimpleName();
            if ("CycleStart".equals(name)) {
                if (!active && !preFlushed) flushPre();
                active = true;
                currentCycle++;
                return;
            }
            if ("CycleEnd".equals(name)) {
                finishCycle();
                active = false;
                preFlushed = false;
                return;
            }
            final String stage = stageFor(name);
            if (stage == null) return;
            final String token = token(name, args);
            totalEvents++;
            if (active) add(current, stage, token);
            else {
                preEvents++;
                add(pre, stage, token);
            }
        }

        private void flushPre() {
            preFlushed = true;
            if (preEvents > 0) {
                preEventsTotal += preEvents;
                emitRecord("{\"kind\":\"pre\",\"total_events\":" + preEvents + ",\"stages\":" + stagesJson(pre) + "}");
            }
            pre = emptyStages();
            preEvents = 0;
        }

        private void finishCycle() {
            if (windowCycles == 0) windowStart = currentCycle;
            windowCycles++;
            for (final String stage : STAGES) {
                final StageStats source = current.get(stage);
                final StageStats target = windowStages.get(stage);
                if (source.eventCount > 0) target.cyclesWithEvents++;
                target.eventCount += source.eventCount;
                if (target.firstEvent == null) target.firstEvent = source.firstEvent;
                if (source.lastEvent != null) target.lastEvent = source.lastEvent;
                if (source.eventCount > 0) {
                    final String cycleDigest = source.digestHex() + "\n";
                    target.digest.update(cycleDigest.getBytes(StandardCharsets.UTF_8));
                }
                windowEvents += source.eventCount;
            }
            current = emptyStages();
            if (windowCycles >= windowSize) flushWindow();
        }

        private void flushWindow() {
            if (windowCycles == 0) return;
            final int end = windowStart + windowCycles - 1;
            emitRecord("{\"kind\":\"window\",\"start_cycle\":" + windowStart
                    + ",\"end_cycle\":" + end
                    + ",\"cycle_count\":" + windowCycles
                    + ",\"total_events\":" + windowEvents
                    + ",\"stages\":" + stagesJson(windowStages) + "}");
            windows++;
            windowStart = end + 1;
            windowCycles = 0;
            windowEvents = 0;
            windowStages = emptyStages();
        }

        String render(final int requestedCycles, final boolean skipEmbedded) {
            flushWindow();
            final StringBuilder result = new StringBuilder();
            result.append("{\"kind\":\"summary\",\"format_version\":1,\"window_cycles\":")
                    .append(windowSize)
                    .append(",\"requested_cycles\":").append(requestedCycles)
                    .append(",\"skip_embedded\":").append(skipEmbedded)
                    .append(",\"pre_events\":").append(preEventsTotal)
                    .append(",\"cycles_observed\":").append(currentCycle)
                    .append(",\"windows\":").append(windows)
                    .append(",\"total_events\":").append(totalEvents)
                    .append(",\"incomplete\":false,\"records\":[");
            for (int index = 0; !stream && index < records.size(); index++) {
                if (index > 0) result.append(',');
                result.append(records.get(index));
            }
            return result.append("]}").toString();
        }

        private void emitRecord(final String record) {
            if (stream) streamOutput.println(record);
            else records.add(record);
        }

        private String token(final String name, final Object[] args) {
            final Object value = switch (name) {
                case "ConceptFire", "NewTaskExecution", "OUT", "EXE" -> null;
                default -> args.length == 0 ? null : args[0];
            };
            return name + "|" + normalizeStable(describe(value)) + "\n";
        }

        private String describe(final Object value) {
            if (value == null) return "";
            if (value instanceof Task task) return String.valueOf(task.sentence.toString(nar, true));
            if (value instanceof Sentence sentence) return String.valueOf(sentence.toString(nar, true));
            if (value instanceof Concept concept) return concept.getTerm().toString();
            if (value instanceof TaskLink link) return link.getTarget().sentence.term + "|type=" + link.type
                    + "|index=" + indexText(link.index);
            if (value instanceof TermLink link) return link.target + "|type=" + link.type
                    + "|index=" + indexText(link.index);
            if (value instanceof DerivationContext context) {
                final Task task = context.getCurrentTask();
                return task == null ? "" : task.sentence.term.toString();
            }
            return "";
        }

        private String normalizeStable(final String value) {
            return value.replaceAll("\\((-?[0-9]{10,}),", "(#,");
        }
    }

    private static Map<String, StageStats> emptyStages() {
        final Map<String, StageStats> stages = new LinkedHashMap<>();
        for (final String stage : STAGES) stages.put(stage, new StageStats());
        return stages;
    }

    private static void add(final Map<String, StageStats> stages, final String stage, final String token) {
        stages.get(stage).addToken(token);
    }

    private static String stageFor(final String event) {
        return switch (event) {
            case "TaskAdd" -> "input";
            case "ConceptNew", "ConceptDirectProcessedTask", "TaskImmediateProcess" -> "concept";
            case "TermLinkAdd", "TaskLinkAdd" -> "links";
            case "ConceptFire", "TermLinkSelect", "BeliefSelect" -> "scheduler";
            case "BeliefReason" -> "rule";
            case "TaskDerive" -> "derivation";
            case "NewTaskExecution", "OUT", "EXE" -> "marker";
            default -> null;
        };
    }

    private static String indexText(final short[] index) {
        if (index == null) return "null";
        return Arrays.toString(index).replace(", ", ",");
    }

    private static String stagesJson(final Map<String, StageStats> stages) {
        final StringBuilder result = new StringBuilder("{");
        for (int index = 0; index < STAGES.size(); index++) {
            if (index > 0) result.append(',');
            final String stage = STAGES.get(index);
            final StageStats stats = stages.get(stage);
            result.append(quote(stage)).append(":{\"event_count\":").append(stats.eventCount)
                    .append(",\"cycles_with_events\":").append(stats.cyclesWithEvents)
                    .append(",\"first_event\":").append(quote(stats.firstEvent))
                    .append(",\"last_event\":").append(quote(stats.lastEvent))
                    .append(",\"digest\":").append(quote(stats.digestHex())).append('}');
        }
        return result.append('}').toString();
    }

    private static MessageDigest sha256() {
        try {
            return MessageDigest.getInstance("SHA-256");
        } catch (Exception error) {
            throw new IllegalStateException(error);
        }
    }

    private static String hex(final byte[] bytes) {
        final StringBuilder result = new StringBuilder();
        for (final byte value : bytes) result.append(String.format("%02X", value));
        return result.toString();
    }

    private static String quote(final String value) {
        if (value == null) return "null";
        return "\"" + value.replace("\\", "\\\\").replace("\"", "\\\"")
                .replace("\r", "\\r").replace("\n", "\\n") + "\"";
    }
}
