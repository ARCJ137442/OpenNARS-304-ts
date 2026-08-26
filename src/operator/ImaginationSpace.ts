//! Java source: opennars/operator/ImaginationSpace.java
import type { TruthValue } from "../entity/TruthValue.ts";
import type { Conjunction } from "../language/Conjunction.ts";
import type { Operation } from "./Operation.ts";



/**
 * ImaginationSpace: A group of operations that when executed in a certain
 * sequence
 * add up to a certain declarative "picture". This "picture" might be different
 * than the feedback of
 * the last operation in the sequence: for instance in case of eye movements,
 * each movement
 * feedback corresponds to a sampling result, where each adds its part of
 * information.
 *
 * @author Patrick
 */
export interface ImaginationSpace {
    //
    AbductionOrComparisonTo(obj: ImaginationSpace, comparison: boolean): TruthValue;

    // attaches an imagination space to the conjunction that is constructed
    // by starting with the leftmost element of the conjunction
    // and then gradually moving to the right
    ConstructSpace(program: Conjunction): ImaginationSpace | null;

    // Has to return a new instance, not changing "this"!
    ProgressSpace(op: Operation, B: ImaginationSpace): ImaginationSpace | null;

    // Check whether the operation is part of the space:
    IsOperationInSpace(oper: Operation): boolean;
}
