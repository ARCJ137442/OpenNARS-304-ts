import { java, S } from "jree";



/**
 * A class used as a template for Operator definition.
 */
export class NullOperator extends Operator {

    public constructor();

    public constructor(/* final */  name: java.lang.String | null);
    public constructor(...args: unknown[]) {
        switch (args.length) {
            case 0: {

                this("^sample");


                break;
            }

            case 1: {
                const [name] = args as [java.lang.String];


                super(name);


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    /** called from Operator */
    protected execute(/* final */  operation: Operation | null, /* final */  args: Term[] | null, /* final */  memory: Memory | null,
            /* final */  time: Timable | null): java.util.List<Task> | null {
        if (Debug.DETAILED) {
            memory.emit(java.lang.Object.getClass(), args as java.lang.Object[]);
        }
        return null;
    }

}
