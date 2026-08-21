import org.opennars.main.Nar;
import org.opennars.entity.Task;
import org.opennars.io.events.EventEmitter;
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
            throw new IllegalArgumentException("usage: NalParityRunner <cycles> <nal-file>...");
        }

        final int cycles = Integer.parseInt(args[0]);
        // Match java-master's NALTest static setup: deterministic occurrence times.
        Debug.TEST = true;
        final PrintStream output = System.out;
        final PrintStream quiet = new PrintStream(new ByteArrayOutputStream());

        for (int i = 1; i < args.length; i++) {
            final String file = args[i];
            boolean ok = false;
            String error = null;
            int expectedCount = 0;
            int passedCount = 0;
            Capture capture = null;

            try {
                System.setOut(quiet);
                final String source = Files.readString(Path.of(file));
                final Nar nar = new Nar();
                final List<String> expectations = expectations(source);
                capture = new Capture(nar, expectations);
                expectedCount = expectations.size();
                nar.addInputFile(file);
                nar.cycles(cycles);
                passedCount = capture.passedCount();
                ok = expectedCount == passedCount;
            } catch (final Throwable failure) {
                error = failure.toString();
            } finally {
                System.setOut(output);
            }

            output.println("{\"file\":" + quote(file)
                    + ",\"cycles\":" + cycles
                    + ",\"expected\":" + expectedCount
                    + ",\"passed\":" + passedCount
                    + ",\"matched\":" + booleanArray(capture == null ? new boolean[expectedCount] : capture.matched())
                    + ",\"ok\":" + ok
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

    private static final class Capture extends OutputHandler {
        private final Nar nar;
        private final List<String> expectations;
        private final boolean[] matched;

        private Capture(final Nar nar, final List<String> expectations) {
            super(nar);
            this.nar = nar;
            this.expectations = expectations;
            this.matched = new boolean[expectations.size()];
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
    }

    private static String booleanArray(final boolean[] values) {
        final StringBuilder out = new StringBuilder("[");
        for (int i = 0; i < values.length; i++) {
            if (i > 0) out.append(',');
            out.append(values[i]);
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
