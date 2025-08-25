


import { java, type int } from "jree";



/**
 * Count the number of elements in a set
 */
export class Add extends FunctionOperator {

    public constructor() {
        super("^add");
    }

    protected function(/* final */  memory: Memory | null, /* final */  x: Term[] | null): Term | null {
        if (x.length !== 2) {
            throw new java.lang.IllegalStateException("Requires 2 arguments");
        }

        let n1: int;
        let n2: int;

        if (StringUtils.isNumeric(x[0].name())) {
            n1 = java.lang.Integer.parseInt(java.lang.String.valueOf(x[0].name()));
        } else {
            throw new java.lang.IllegalArgumentException("1st parameter not an integer");
        }

        if (StringUtils.isNumeric((x[1].name()))) {
            n2 = java.lang.Integer.parseInt(java.lang.String.valueOf(x[1].name()));
        } else {
            throw new java.lang.IllegalArgumentException("2nd parameter not an integer");
        }

        return new Term(java.lang.String.valueOf(n1 + n2));
    }

    protected getRange(): Term | null {
        return Term.get("added");
    }

}
