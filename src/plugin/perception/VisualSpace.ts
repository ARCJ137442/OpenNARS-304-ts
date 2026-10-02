//! Java source: opennars/plugin/perception/VisualSpace.java
import type { IntNumber, DoubleNumber } from "../../types.ts"; // Java primitive aliases formerly imported from jree; runtime narrowing is separate.
import { Float32Math } from "../../runtime/Float32.ts";
import { TruthFunctions } from "../../inference/TruthFunctions.ts";
import { TemporalRules } from "../../inference/TemporalRules.ts";
import { TruthValue } from "../../entity/TruthValue.ts";
import { NullOperator } from "../../operator/NullOperator.ts";
import { Operation } from "../../operator/Operation.ts";
import { Operator } from "../../operator/Operator.ts";
import { Conjunction } from "../../language/Conjunction.ts";
import type { ImaginationSpace } from "../../operator/ImaginationSpace.ts";
import type { Nar } from "../../main/Nar.ts";
import type { Term } from "../../language/Term.ts";

/**
 *
 * @author Patrick
 */
// Java 原类型：普通 public class VisualSpace implements ImaginationSpace；无 JavaObject 继承。
export class VisualSpace implements ImaginationSpace {

    public readonly source: Float64Array[]; // assumed to be set from outside
    public readonly cropped: Float64Array[]; // all elements assumed to be in [0,1] range
    public readonly height: IntNumber;
    public readonly width: IntNumber;
    public px: IntNumber = 0;
    public py: IntNumber = 0;

    // those are the same for each instance:
    public static readonly move: NullOperator = new NullOperator("^move");
    public static readonly zoom: NullOperator = new NullOperator("^zoom");
    private readonly nar: Nar;

    public constructor(nar: Nar, source: Float64Array[], py: IntNumber, px: IntNumber, height: IntNumber,
        width: IntNumber) {
        this.nar = nar;
        this.height = height;
        this.width = width;
        this.cropped = Array.from({ length: height }, () => new Float64Array(width));
        this.source = source.map((row) => new Float64Array(row));
        this.py = py;
        this.px = px;
        for (let i: IntNumber = 0; i < source.length; i++) { // "snapshot" from source
            this.source[i].set(source[i]);
        }
        // now copy into data
        for (let i: IntNumber = 0; i < height; i++) {
            let relIndexY: IntNumber = 0; // was py, px but sensory device already does the shifting
            let relIndexX: IntNumber = 0;
            this.cropped[i].set(source[relIndexY + i].subarray(relIndexX, relIndexX + width));
        }
        nar.addPlugin(VisualSpace.move);
        nar.addPlugin(VisualSpace.zoom);
    }

    public AbductionOrComparisonTo(obj: ImaginationSpace, comparison: boolean): TruthValue {
        if (!(obj instanceof VisualSpace)) {
            return TruthValue.fromFrequencyConfidence(1.0, 0.0, this.nar.narParameters);
        }
        let other: VisualSpace = obj as VisualSpace;
        // Java casts the integer dimensions to FloatNumber before promoting them to
        // DoubleNumber for this ratio. A TypeScript `as FloatNumber` is compile-time only.
        let kh: DoubleNumber = Float32Math.from(other.height) / this.height;
        let kw: DoubleNumber = Float32Math.from(other.width) / this.width;
        let bestShiftTruth: TruthValue = TruthValue.fromFrequencyConfidence(0.5, 0.01, this.nar.narParameters);
        for (let oj: IntNumber = -this.height; oj < this.height; oj++) {
            for (let oi: IntNumber = -this.width; oi < this.width; oi++) {
                let sim: TruthValue = TruthValue.fromFrequencyConfidence(0.5, 0.01, this.nar.narParameters);
                for (let i: IntNumber = 0; i < this.height; i++) {
                    for (let j: IntNumber = 0; j < this.width; j++) {
                        let transi: IntNumber = i + oi;
                        let transj: IntNumber = j + oj;
                        if (transi >= this.width || transj >= this.height || transi < 0 || transj < 0) {
                            continue;
                        }
                        let i2: IntNumber = ((i as DoubleNumber) * kh) as IntNumber;
                        let j2: IntNumber = ((j as DoubleNumber) * kw) as IntNumber;
                        let t1: TruthValue = TruthValue.fromFrequencyConfidence(this.cropped[transi][transj],
                            this.nar.narParameters.DEFAULT_JUDGMENT_CONFIDENCE, this.nar.narParameters);
                        let t2: TruthValue = TruthValue.fromFrequencyConfidence(other.cropped[i2][j2],
                            this.nar.narParameters.DEFAULT_JUDGMENT_CONFIDENCE, this.nar.narParameters);
                        let t3: TruthValue = comparison ? TruthFunctions.comparison(t1, t2, this.nar.narParameters)
                            : TruthFunctions.abduction(t1, t2, this.nar.narParameters);
                        sim = TruthFunctions.revision(sim, t3, this.nar.narParameters);
                    }
                }
                if (sim.getExpectation() > bestShiftTruth.getExpectation()) {
                    bestShiftTruth = sim;
                }
            }
        }
        return bestShiftTruth;
    }

    public ConstructSpace(program: Conjunction): ImaginationSpace | null {
        if (program.isSpatial || program.getTemporalOrder() !== TemporalRules.ORDER_FORWARD) {
            return null; // would be a strange program :)
        }
        let beginning: Term = program.term[0];
        if (beginning.imagination === null) {
            return null;
        }
        let cur: ImaginationSpace = beginning.imagination;
        // "execute program":
        for (let i: IntNumber = 1; i < program.term.length; i += 1) {
            if (!(program.term[i] instanceof Operation)) {
                return null;
            }
            let oper: Operation = program.term[i] as Operation;
            if (!this.IsOperationInSpace(oper)) {
                return null;
            }
            const progressed = cur.ProgressSpace(oper, cur);
            if (progressed === null) {
                return null;
            }
            cur = progressed;
            i++;
        }
        return null;
    }

    public ProgressSpace(op: Operation, b: ImaginationSpace): ImaginationSpace | null {
        if (!(b instanceof VisualSpace)) {
            return null; // incompatible
        }
        let B: VisualSpace = b as VisualSpace;
        // construct a space which focus is on both of the focuses of the previous
        // copying the necessary part of source into data and setting width and height
        // for visual space the operation doesn't matter for constructing the compound
        // imagination
        let minPX: IntNumber = Math.min(this.px, B.px) as IntNumber;
        let maxPX: IntNumber = Math.min(this.px + this.width, B.px + B.width) as IntNumber;
        let minPY: IntNumber = Math.min(this.py, B.py) as IntNumber;
        let maxPY: IntNumber = Math.min(this.py + this.height, B.py + B.height) as IntNumber;
        let progressed: VisualSpace = new VisualSpace(this.nar, this.source, minPY, minPX, maxPY, maxPX);
        return progressed;
    }

    public IsOperationInSpace(oper: Operation): boolean {
        let op: Operator = oper.getPredicate() as Operator;
        return op.equals(VisualSpace.move) || op.equals(VisualSpace.zoom);
    }

    // Needs to be resolved:
    // TODO construct imagination space when a &/ "program" is created (sequence
    // seen)
    // TODO when concept is sampled remember last one
    // so that similarity can be computed and a <-> result entered
    // TODO find how to generate motivations from what question
    // TODO make the used operators working on source so that the programs
    // (for example conditional eye movements to identify a face) can be learnt
}
