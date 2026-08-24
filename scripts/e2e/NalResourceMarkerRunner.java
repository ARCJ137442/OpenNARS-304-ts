import org.opennars.entity.Task;
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

/** Low-output, single-thread marker probe that stops as soon as all markers match. */
public final class NalResourceMarkerRunner {
    private NalResourceMarkerRunner() {
    }

    public static void main(final String[] args) throws Exception {
        if (args.length < 3) {
            throw new IllegalArgumentException("usage: NalResourceMarkerRunner <max-cycles> <chunk> <nal-file>");
        }
        final int maxCycles = Integer.parseInt(args[0]);
        final int chunk = Integer.parseInt(args[1]);
        final Path file = Path.of(args[2]);
        if (maxCycles < 1 || chunk < 1) throw new IllegalArgumentException("max-cycles and chunk must be positive");

        final String source = Files.readString(file);
        final List<String> inputs = new ArrayList<>();
        int embeddedCycles = 0;
        final List<String> expectations = new ArrayList<>();
        final String marker = "''outputMustContain('";
        for (final String rawLine : source.split("\\R")) {
            final String line = rawLine.trim();
            if (line.startsWith(marker) && line.endsWith("')")) {
                expectations.add(line.substring(marker.length(), line.length() - 2));
                continue;
            }
            if (line.isEmpty() || line.startsWith("'") || line.startsWith("//")) continue;
            if (line.matches("[0-9]+")) {
                embeddedCycles += Integer.parseInt(line);
            } else {
                inputs.add(line);
            }
        }

        Debug.TEST = true;
        final PrintStream output = System.out;
        final PrintStream quiet = new PrintStream(new ByteArrayOutputStream());
        final List<String> samples = new ArrayList<>();
        System.setOut(quiet);
        final Nar nar;
        final Capture capture;
        try {
            nar = new Nar();
            nar.narParameters.THREADS_AMOUNT = 1;
            nar.setThreadYield(false);
            capture = new Capture(nar, expectations);
            nar.event(capture, true, Events.CycleEnd.class, OutputHandler.OUT.class, OutputHandler.EXE.class);
            for (final String input : inputs) nar.addInput(input);
        } finally {
            System.setOut(output);
        }

        final long startedAt = System.nanoTime();
        int cycles = 0;
        String stoppedReason = "completed";
        while (cycles < Math.min(maxCycles, embeddedCycles)) {
            final int next = Math.min(chunk, Math.min(maxCycles, embeddedCycles) - cycles);
            final long chunkStartedAt = System.nanoTime();
            System.setOut(quiet);
            try {
                nar.cycles(next);
            } finally {
                System.setOut(output);
            }
            cycles += next;
            final String sample = "{\"type\":\"sample\",\"cycle\":" + cycles
                    + ",\"chunk_cycles\":" + next
                    + ",\"chunk_duration_ms\":" + ((System.nanoTime() - chunkStartedAt) / 1_000_000.0)
                    + ",\"elapsed_ms\":" + ((System.nanoTime() - startedAt) / 1_000_000.0)
                    + ",\"matched\":" + booleanArray(capture.matched())
                    + ",\"marker_time_ms\":" + numberArray(capture.markerTimeMs())
                    + ",\"out_events\":" + capture.outEvents
                    + ",\"exe_events\":" + capture.exeEvents + "}";
            samples.add(sample);
            output.println(sample);
            if (capture.passedCount() == expectations.size() && !expectations.isEmpty()) {
                stoppedReason = "markers_reached";
                break;
            }
        }
        output.println("{\"type\":\"result\",\"file\":" + quote(file.toString())
                + ",\"thread_mode\":\"single\",\"embedded_cycles\":" + embeddedCycles
                + ",\"target_cycles\":" + Math.min(maxCycles, embeddedCycles)
                + ",\"observed_cycles\":" + cycles
                + ",\"stopped_reason\":" + quote(stoppedReason)
                + ",\"expected_markers\":" + stringArray(expectations)
                + ",\"matched\":" + booleanArray(capture.matched())
                + ",\"marker_time_ms\":" + numberArray(capture.markerTimeMs())
                + ",\"sample_count\":" + samples.size() + "}");
    }

    private static final class Capture implements EventObserver {
        private final Nar nar;
        private final List<String> expectations;
        private final boolean[] matched;
        private final double[] markerTimeMs;
        private long startedAt;
        private int outEvents;
        private int exeEvents;
        private int cycleEnds;

        private Capture(final Nar nar, final List<String> expectations) {
            this.nar = nar;
            this.expectations = expectations;
            this.matched = new boolean[expectations.size()];
            this.markerTimeMs = new double[expectations.size()];
            Arrays.fill(this.markerTimeMs, Double.NaN);
            this.startedAt = System.nanoTime();
        }

        @Override
        public void event(final Class<?> channel, final Object[] args) {
            if (channel == Events.CycleEnd.class) {
                cycleEnds++;
                return;
            }
            if (channel != OutputHandler.OUT.class && channel != OutputHandler.EXE.class) return;
            if (channel == OutputHandler.OUT.class) outEvents++;
            if (channel == OutputHandler.EXE.class) exeEvents++;
            final Object signal = args[0];
            final String text = signal instanceof Task
                    ? ((Task) signal).sentence.toString(nar, true).toString()
                    : String.valueOf(signal);
            for (int index = 0; index < expectations.size(); index++) {
                if (!matched[index] && text.contains(expectations.get(index))) {
                    matched[index] = true;
                    markerTimeMs[index] = (System.nanoTime() - startedAt) / 1_000_000.0;
                }
            }
        }

        private int passedCount() {
            int count = 0;
            for (final boolean value : matched) if (value) count++;
            return count;
        }

        private boolean[] matched() { return matched; }
        private double[] markerTimeMs() { return markerTimeMs; }
    }

    private static String booleanArray(final boolean[] values) {
        final StringBuilder result = new StringBuilder("[");
        for (int index = 0; index < values.length; index++) {
            if (index > 0) result.append(',');
            result.append(values[index]);
        }
        return result.append(']').toString();
    }

    private static String numberArray(final double[] values) {
        final StringBuilder result = new StringBuilder("[");
        for (int index = 0; index < values.length; index++) {
            if (index > 0) result.append(',');
            result.append(Double.isNaN(values[index]) ? "null" : values[index]);
        }
        return result.append(']').toString();
    }

    private static String stringArray(final List<String> values) {
        final StringBuilder result = new StringBuilder("[");
        for (int index = 0; index < values.size(); index++) {
            if (index > 0) result.append(',');
            result.append(quote(values.get(index)));
        }
        return result.append(']').toString();
    }

    private static String quote(final String value) {
        return "\"" + value.replace("\\", "\\\\").replace("\"", "\\\"")
                .replace("\r", "\\r").replace("\n", "\\n") + "\"";
    }
}
