import { java, JavaObject, type int } from "jree";



/**
 * Access to library of examples/unit tests
 */
export class ExampleFileInput extends JavaObject {

    public static load(/* final */  path: java.lang.String | null): java.lang.String | null {
        let sb: java.lang.StringBuilder = new java.lang.StringBuilder();
        let line: java.lang.String;
        let fp: java.io.File = new java.io.File(path);
        let br: java.io.BufferedReader = new java.io.BufferedReader(new java.io.FileReader(fp));
        while ((line = br.readLine()) !== null) {
            sb.append(line).append("\n");
        }
        br.close();
        return sb.toString();
    }

    /** narsese source code, one instruction per line */
    private readonly source: java.lang.String | null;

    protected constructor(/* final */  input: java.lang.String | null) {
        super();
        this.source = input;
    }

    public static get(/* final */  id: java.lang.String | null): ExampleFileInput | null {
        return new ExampleFileInput(ExampleFileInput.load("./nal/" + id + ".nal"));
    }

    public enableConditions(/* final */  n: Nar | null, /* final */  similarResultsToSave: int): java.util.List<OutputCondition> | null {
        return OutputCondition.getConditions(n, this.source, similarResultsToSave);
    }

    public static getUnitTests(/* final */  directories: java.lang.String[] | null): java.util.Map<java.lang.String, java.lang.Object> | null {
        let l: java.util.Map<java.lang.String, java.lang.Object> = new java.util.TreeMap();

        for (let dir of directories) {

            let folder: java.io.File = null;
            try {
                folder = new java.io.File(Nar.class.getResource(dir).toURI());
            } catch (e) {
                if (e instanceof java.net.URISyntaxException) {
                    throw new java.lang.IllegalStateException("Could not resolve path to nal tests in reosources.", e);
                } else {
                    throw e;
                }
            }

            if (folder.listFiles() !== null) {
                for (let file of folder.listFiles()) {
                    if (file.getName().equals("README.txt") || file.getName().contains(".png"))
                        continue;
                    if (!("extra".equals(file.getName()))) {
                        l.put(file.getName(), [file.getAbsolutePath()]);
                    }
                }
            }

        }
        return l;
    }

    public getSource(): java.lang.String | null {
        return this.source;
    }

}
