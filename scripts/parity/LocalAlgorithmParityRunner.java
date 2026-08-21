import org.opennars.entity.BudgetValue;
import org.opennars.entity.TruthValue;
import org.opennars.inference.BudgetFunctions;
import org.opennars.inference.TruthFunctions;
import org.opennars.inference.UtilityFunctions;
import org.opennars.parameter.Parameters;

/**
 * Emits deterministic local-algorithm fixtures from the Java reference.
 * The TypeScript runner consumes the same JSON shape and compares numeric
 * values with an explicit tolerance.
 */
public final class LocalAlgorithmParityRunner {
    private LocalAlgorithmParityRunner() {
    }

    public static void main(final String[] args) {
        final Parameters parameters = new Parameters();
        final TruthValue a = new TruthValue(0.7f, 0.6, parameters);
        final TruthValue b = new TruthValue(0.3f, 0.4, parameters);

        final StringBuilder out = new StringBuilder();
        out.append("{\"truth\":{");
        appendTruth(out, "a", a, true);
        appendTruth(out, "b", b, false);
        appendTruth(out, "negation", TruthFunctions.negation(a, parameters), false);
        appendTruth(out, "conversion", TruthFunctions.conversion(a, parameters), false);
        appendTruth(out, "contraposition", TruthFunctions.contraposition(a, parameters), false);
        appendTruth(out, "revision", TruthFunctions.revision(a, b, parameters), false);
        appendTruth(out, "deduction", TruthFunctions.deduction(a, b, parameters), false);
        appendTruth(out, "induction", TruthFunctions.induction(a, b, parameters), false);
        appendTruth(out, "abduction", TruthFunctions.abduction(a, b, parameters), false);
        appendTruth(out, "analogy", TruthFunctions.analogy(a, b, parameters), false);
        appendTruth(out, "resemblance", TruthFunctions.resemblance(a, b, parameters), false);
        appendTruth(out, "exemplification", TruthFunctions.exemplification(a, b, parameters), false);
        appendTruth(out, "comparison", TruthFunctions.comparison(a, b, parameters), false);
        appendTruth(out, "desireStrong", TruthFunctions.desireStrong(a, b, parameters), false);
        appendTruth(out, "desireWeak", TruthFunctions.desireWeak(a, b, parameters), false);
        appendTruth(out, "desireDed", TruthFunctions.desireDed(a, b, parameters), false);
        appendTruth(out, "desireInd", TruthFunctions.desireInd(a, b, parameters), false);
        appendTruth(out, "union", TruthFunctions.union(a, b, parameters), false);
        appendTruth(out, "intersection", TruthFunctions.intersection(a, b, parameters), false);
        appendTruth(out, "anonymousAnalogy", TruthFunctions.anonymousAnalogy(a, b, parameters), false);
        appendTruth(out, "reduceDisjunction", TruthFunctions.reduceDisjunction(a, b, parameters), false);
        appendTruth(out, "reduceConjunction", TruthFunctions.reduceConjunction(a, b, parameters), false);
        appendTruth(out, "reduceConjunctionNeg", TruthFunctions.reduceConjunctionNeg(a, b, parameters), false);
        out.append("},\"budget\":{");

        appendBudget(out, "normal", new BudgetValue(0.4f, 0.6f, 0.8f, parameters), true);
        appendBudget(out, "fromTruth", new BudgetValue(0.4f, 0.6f, a, parameters), false);
        appendBudget(out, "bounded", new BudgetValue(1.2f, 1.1f, 0.2f, parameters), false);

        final BudgetValue mutated = new BudgetValue(0.4f, 0.6f, 0.8f, parameters);
        mutated.incPriority(0.2f);
        mutated.decDurability(0.5f);
        mutated.incQuality(0.1f);
        appendBudget(out, "mutated", mutated, false);

        final BudgetValue merged = new BudgetValue(0.4f, 0.6f, 0.8f, parameters);
        merged.merge(new BudgetValue(0.7f, 0.2f, 0.3f, parameters));
        appendBudget(out, "merged", merged, false);
        out.append("},\"utility\":{");
        out.append("\"and\":").append(UtilityFunctions.and(0.7, 0.4));
        out.append(",\"or\":").append(UtilityFunctions.or(0.7f, 0.4f));
        out.append(",\"aveGeo\":").append(UtilityFunctions.aveGeo(0.4f, 0.6f, 0.8f));
        out.append(",\"truthToQuality\":").append(BudgetFunctions.truthToQuality(a));
        out.append("}}\n");
        System.out.print(out);
    }

    private static void appendTruth(final StringBuilder out, final String name,
            final TruthValue value, final boolean first) {
        if (!first) {
            out.append(',');
        }
        out.append(quote(name)).append(":{")
                .append("\"frequency\":").append(value.getFrequency())
                .append(",\"confidence\":").append(value.getConfidence())
                .append(",\"expectation\":").append(value.getExpectation())
                .append(",\"analytic\":").append(value.getAnalytic())
                .append(",\"external\":").append(quote(value.toStringExternal().toString()))
                .append('}');
    }

    private static void appendBudget(final StringBuilder out, final String name,
            final BudgetValue value, final boolean first) {
        if (!first) {
            out.append(',');
        }
        out.append(quote(name)).append(":{")
                .append("\"priority\":").append(value.getPriority())
                .append(",\"durability\":").append(value.getDurability())
                .append(",\"quality\":").append(value.getQuality())
                .append(",\"summary\":").append(value.summary())
                .append(",\"external\":").append(quote(value.toStringExternal()))
                .append('}');
    }

    private static String quote(final String value) {
        return "\"" + value.replace("\\", "\\\\").replace("\"", "\\\"") + "\"";
    }
}
