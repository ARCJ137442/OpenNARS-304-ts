import org.opennars.main.Nar;
import org.opennars.entity.Task;
import org.opennars.io.events.EventEmitter;
import org.opennars.io.events.EventEmitter.EventObserver;
import org.opennars.io.events.Events;
import org.opennars.io.events.OutputHandler;
import org.opennars.parameter.Debug;

import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

/**
 * Machine-readable adapter around the Java NAL test semantics.
 *
 * The TypeScript runner will implement the same line-oriented JSON contract.
 * The process suppresses OpenNARS diagnostic output so stdout remains JSONL.
 */
public final class NalParityRunner {
    private NalParityRunner() {
    }

    public static void main(final String[] args) throws Exception {
        if (args.length < 2) {
            throw new IllegalArgumentException("usage: NalParityRunner <cycles> <nal-file>... [--progress-interval N]");
        }

        final int cycles = Integer.parseInt(args[0]);
        int progressInterval = 0;
        final List<String> files = new ArrayList<>();
        for (int i = 1; i < args.length; i++) {
            if ("--progress-interval".equals(args[i])) {
                progressInterval = Integer.parseInt(args[++i]);
            } else {
                files.add(args[i]);
            }
        }
        if (progressInterval < 0) {
            throw new IllegalArgumentException("--progress-interval must be non-negative");
        }
        // Match java-master's NALTest static setup: deterministic occurrence times.
        Debug.TEST = true;
        final PrintStream output = System.out;
        final PrintStream quiet = new PrintStream(new ByteArrayOutputStream());

        for (final String file : files) {
            boolean ok = false;
            String error = null;
            int expectedCount = 0;
            int passedCount = 0;
            Capture capture = null;

            try {
                System.setOut(quiet);
                final String source = Files.readString(Path.of(file));
                final Nar nar = new Nar();
                // Keep parity runs synchronous and independent of Nar.start() thread scheduling.
                nar.narParameters.THREADS_AMOUNT = 1;
                nar.setThreadYield(false);
                if (progressInterval > 0) {
                    nar.event(new ProgressObserver(file, progressInterval), true,
                            Events.CycleEnd.class, OutputHandler.OUT.class, OutputHandler.EXE.class);
                }
                final List<String> expectations = expectations(source);
                capture = new Capture(nar, expectations);
                expectedCount = expectations.size();
                capture.start(System.nanoTime());
                nar.addInputFile(file);
                nar.cycles(cycles);
                passedCount = capture.passedCount();
                ok = expectedCount == passedCount;
            } catch (final Throwable failure) {
                error = failureText(failure);
            } finally {
                System.setOut(output);
            }

            passedCount = capture == null ? 0 : capture.passedCount();
            ok = error == null && expectedCount == passedCount;

            output.println("{\"file\":" + quote(file)
                    + ",\"cycles\":" + cycles
                    + ",\"expected\":" + expectedCount
                    + ",\"passed\":" + passedCount
                    + ",\"matched\":" + booleanArray(capture == null ? new boolean[expectedCount] : capture.matched())
                    + ",\"ok\":" + ok
                    + ",\"error_type\":" + quote(error == null ? "none" : "exception")
                    + ",\"exception\":" + (error != null)
                    + ",\"timed_out\":false"
                    + ",\"thread_mode\":\"single\""
                    + ",\"marker_missing\":" + (expectedCount != passedCount)
                    + ",\"marker_missing_count\":" + (expectedCount - passedCount)
                    + ",\"marker_time_ms\":" + numberArray(capture == null ? new double[expectedCount] : capture.markerTimeMs())
                    + (error == null ? "" : ",\"error\":" + quote(error))
                    + "}");
        }
    }

    private static List<String> expectations(final String source) {
        final List<String> values = new ArrayList<>();
        final String marker = "''outputMustContain('";
        for (final String rawLine : source.split("\\R")) {
            final String line = rawLine.trim();
            if (line.startsWith(marker) && line.endsWith("')")) {
                values.add(line.substring(marker.length(), line.length() - 2));
            }
        }
        return values;
    }

    private static String failureText(final Throwable failure) {
        final String className = failure.getClass().getName();
        final String message = failure.getMessage();
        return message == null || message.isEmpty() ? className : className + ": " + message;
    }

    private static final class Capture extends OutputHandler {
        private final Nar nar;
        private final List<String> expectations;
        private final boolean[] matched;
        private final double[] markerTimeMs;
        private long startNanos;

        private Capture(final Nar nar, final List<String> expectations) {
            super(nar);
            this.nar = nar;
            this.expectations = expectations;
            this.matched = new boolean[expectations.size()];
            this.markerTimeMs = new double[expectations.size()];
            java.util.Arrays.fill(this.markerTimeMs, Double.NaN);
        }

        private void start(final long startNanos) {
            this.startNanos = startNanos;
        }

        @Override
        public void event(final Class<?> channel, final Object[] args) {
            if (channel != OUT.class && channel != EXE.class) {
                return;
            }
            final Object signal = args[0];
            final String text;
            if (signal instanceof Task) {
                text = ((Task) signal).sentence.toString(nar, true).toString();
            } else {
                text = String.valueOf(signal);
            }
            for (int i = 0; i < expectations.size(); i++) {
                if (!matched[i] && text.contains(expectations.get(i))) {
                    matched[i] = true;
                    markerTimeMs[i] = (System.nanoTime() - startNanos) / 1_000_000.0;
                }
            }
        }

        private int passedCount() {
            int count = 0;
            for (final boolean value : matched) {
                if (value) count++;
            }
            return count;
        }

        private boolean[] matched() {
            return matched;
        }

        private double[] markerTimeMs() {
            return markerTimeMs;
        }
    }

    private static final class ProgressObserver implements EventObserver {
        private final String file;
        private final int interval;
        private int cycles;
        private int lastCommandCycle = -1;

        private ProgressObserver(final String file, final int interval) {
            this.file = file;
            this.interval = interval;
        }

        @Override
        public void event(final Class<?> channel, final Object[] args) {
            if (channel == Events.CycleEnd.class) {
                cycles++;
                if (cycles % interval == 0) {
                    System.err.println("@progress {\"file\":" + quote(file)
                            + ",\"cycle\":" + cycles + ",\"kind\":\"cycle\"}");
                    System.err.flush();
                }
                return;
            }
            if (lastCommandCycle != cycles) {
                lastCommandCycle = cycles;
                System.err.println("@progress {\"file\":" + quote(file)
                        + ",\"cycle\":" + cycles + ",\"kind\":\"command\"}");
                System.err.flush();
            }
        }
    }

    private static String booleanArray(final boolean[] values) {
        final StringBuilder out = new StringBuilder("[");
        for (int i = 0; i < values.length; i++) {
            if (i > 0) out.append(',');
            out.append(values[i]);
        }
        return out.append(']').toString();
    }

    private static String numberArray(final double[] values) {
        final StringBuilder out = new StringBuilder("[");
        for (int i = 0; i < values.length; i++) {
            if (i > 0) out.append(',');
            if (Double.isNaN(values[i])) out.append("null");
            else out.append(values[i]);
        }
        return out.append(']').toString();
    }

    private static String quote(final String value) {
        return "\"" + value.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\r", "\\r")
                .replace("\n", "\\n") + "\"";
    }
}
