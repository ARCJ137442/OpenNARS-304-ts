import { java, JavaObject } from "../support/legacy-runtime-facade.ts";
import { NALTest } from "./NALTest.ts";
import { ExampleFileInput } from "../util/io/ExampleFileInput.ts";



/**
 * runs a subset of the test cases, selected by the boolean include(filename)
 * function
 */
export class NALTestSome extends NALTest {

    static {
        NALTest.showOutput = true;
        NALTest.showSuccess = NALTest.showOutput;
    }

    public static include(filename: java.lang.String): boolean {
        // return true; //filename.startsWith("nal6.8.nal");
        return filename.startsWith(new java.lang.String("nal4"));
    }

    public static params(): java.util.Collection<JavaObject[]> {
        const allTests = ExampleFileInput.getUnitTests([
            new java.lang.String("/nal/multi_step/")
        ]);
        const selected: java.util.List<JavaObject[]> = new java.util.LinkedList<JavaObject[]>();
        for (const name of allTests.keySet()) {
            if (!NALTestSome.include(name))
                continue;
            const argumentsForTest = allTests.get(name);
            if (argumentsForTest !== null)
                selected.add(argumentsForTest);
        }
        return selected;
    }

    public static main(args: java.lang.String[]): void {
        NALTest.tests.clear();
        NALTest.scores.clear();
        NALTest.runSerialTests(NALTestSome.params(), path => new NALTestSome(path));
    }

    public constructor(scriptPath: java.lang.String) {
        super(scriptPath);// , true);

    }

}
