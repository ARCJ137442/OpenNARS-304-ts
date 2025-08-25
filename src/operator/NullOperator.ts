import { java, S } from "jree";



/**
 * A class used as a template for Operator definition.
 */
export class NullOperator extends Operator {

    public constructor();

    public constructor(/* final */  name: java.lang.String);
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
    protected execute(/* final */  operation: Operation, /* final */  args: Term[], /* final */  memory: Memory,
            /* final */  time: Timable): java.util.List<Task> {
        if (Debug.DETAILED) {
            memory.emit(java.lang.Object.getClass(), args as java.lang.Object[]);
        }
        return null;
    }

}
