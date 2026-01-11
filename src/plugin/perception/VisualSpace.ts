//! Java source: opennars/plugin/perception/VisualSpace.java
import { java, JavaObject, type int, type double, type float } from "jree";



/**
 *
 * @author Patrick
 */
export class VisualSpace extends JavaObject implements ImaginationSpace {

    public readonly source: Float64Array[]; // assumed to be set from outside
    public readonly cropped: Float64Array[]; // all elements assumed to be in [0,1] range
    public readonly height: int;
    public readonly width: int;
    public px: int = 0;
    public py: int = 0;

    // those are the same for each instance:
    public static readonly move: NullOperator = new NullOperator("^move");
    public static readonly zoom: NullOperator = new NullOperator("^zoom");
    private readonly nar: Nar;

    public constructor(nar: Nar, source: Float64Array[], py: int, px: int, height: int,
        width: int) {
        super();
        this.nar = nar;
        this.height = height;
        this.width = width;
        this.cropped = new [[]];
        this.source = new [[]];
        this.py = py;
        this.px = px;
        for (let i: int = 0; i < source.length; i++) { // "snapshot" from source
            java.lang.System.arraycopy(source[i], 0, this.source[i], 0, source[0].length);
        }
        // now copy into data
        for (let i: int = 0; i < height; i++) {
            let relIndexY: int = 0; // was py, px but sensory device already does the shifting
            let relIndexX: int = 0;
            java.lang.System.arraycopy(source[relIndexY + i], relIndexX + 0, this.cropped[i], 0, width);
        }
        nar.addPlugin(VisualSpace.move);
        nar.addPlugin(VisualSpace.zoom);
    }

    public AbductionOrComparisonTo(obj: ImaginationSpace, comparison: boolean): TruthValue {
        if (!(obj instanceof VisualSpace)) {
            return TruthValue.fromFrequencyConfidence(1.0, 0.0, this.nar.narParameters);
        }
        let other: VisualSpace = obj as VisualSpace;
        let kh: double = (other.height as float) / (this.height as double);
        let kw: double = (other.width as float) / (this.width as double);
        let bestShiftTruth: TruthValue = TruthValue.fromFrequencyConfidence(0.5, 0.01, this.nar.narParameters);
        for (let oj: int = -this.height; oj < this.height; oj++) {
            for (let oi: int = -this.width; oi < this.width; oi++) {
                let sim: TruthValue = TruthValue.fromFrequencyConfidence(0.5, 0.01, this.nar.narParameters);
                for (let i: int = 0; i < this.height; i++) {
                    for (let j: int = 0; j < this.width; j++) {
                        let transi: int = i + oi;
                        let transj: int = j + oj;
                        if (transi >= this.width || transj >= this.height || transi < 0 || transj < 0) {
                            continue;
                        }
                        let i2: int = ((i as double) * kh) as int;
                        let j2: int = ((j as double) * kw) as int;
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

    public ConstructSpace(program: Conjunction): ImaginationSpace {
        if (program.isSpatial || program.getTemporalOrder() !== TemporalRules.ORDER_FORWARD) {
            return null; // would be a strange program :)
        }
        let beginning: Term = program.term[0];
        if (beginning.imagination === null) {
            return null;
        }
        let cur: ImaginationSpace = beginning.imagination;
        // "execute program":
        for (let i: int = 1; i < program.term.length; i += 1) {
            if (!(program.term[i] instanceof Operation)) {
                return null;
            }
            let oper: Operation = program.term[i] as Operation;
            if (!this.IsOperationInSpace(oper)) {
                return null;
            }
            cur = cur.ProgressSpace(oper, cur);
            i++;
        }
        return null;
    }

    public ProgressSpace(op: Operation, b: ImaginationSpace): ImaginationSpace {
        if (!(b instanceof VisualSpace)) {
            return null; // incompatible
        }
        let B: VisualSpace = b as VisualSpace;
        // construct a space which focus is on both of the focuses of the previous
        // copying the necessary part of source into data and setting width and height
        // for visual space the operation doesn't matter for constructing the compound
        // imagination
        let minPX: int = java.lang.Math.min(this.px, B.px);
        let maxPX: int = java.lang.Math.min(this.px + this.width, B.px + B.width);
        let minPY: int = java.lang.Math.min(this.py, B.py);
        let maxPY: int = java.lang.Math.min(this.py + this.height, B.py + B.height);
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
