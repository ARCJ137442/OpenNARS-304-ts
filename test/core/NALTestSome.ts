


import { java } from "jree";



/**
 * runs a subset of the test cases, selected by the boolean include(filename)
 * function
 */
export class NALTestSome extends NALTest {

    static {
        showOutput = true;
        showSuccess = showOutput;
    }

    public static include(/* final */  filename: java.lang.String | null): boolean {
        // return true; //filename.startsWith("nal6.8.nal");
        return filename.startsWith("nal4");
    }

    public static params(): java.util.Collection<unknown> | null {
        let l: java.util.List<java.lang.Object[]> = new java.util.LinkedList();

        let folder: java.io.File = null;
        try {
            folder = new java.io.File(NALTestSome.class.getResource("/nal/multi_step").toURI());
        } catch (e) {
            if (e instanceof java.net.URISyntaxException) {
                throw new java.lang.IllegalStateException("Could not parse URI to nal test files.", e);
            } else {
                throw e;
            }
        }

        for (let file of folder.listFiles()) {
            if (file.getName().equals("README.txt") || file.getName().contains(".png"))
                continue;
            if (NALTestSome.include(file.getName()))
                l.add([file.getAbsolutePath()]);
        }

        return l;
    }

    public static main(/* final */  args: java.lang.String[] | null): void {
        org.junit.runner.JUnitCore.runClasses(NALTestSome.class);
    }

    public constructor(/* final */  scriptPath: java.lang.String | null) {
        super(scriptPath);// , true);

    }

}
