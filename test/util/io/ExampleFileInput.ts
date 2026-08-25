import { readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { java, JavaObject, type int } from "jree";
import { javaStringValue } from "../../../src/runtime/jree-compat.ts";
import type { Nar } from "../../../src/main/Nar.ts";
import { OutputCondition } from "../test/OutputCondition.ts";
import "../test/OutputConditionImplementations.ts";



/**
 * Access to library of examples/unit tests
 */
export class ExampleFileInput extends JavaObject {

    public static load(path: java.lang.String): java.lang.String {
        let sb: java.lang.StringBuilder = new java.lang.StringBuilder();
        let line: java.lang.String | null;
        let fp: java.io.File = new java.io.File(path);
        let br: java.io.BufferedReader = new java.io.BufferedReader(new java.io.FileReader(fp));
        while ((line = br.readLine()) !== null) {
            sb.append(line).append("\n");
        }
        br.close();
        return sb.toString();
    }

    /** narsese source code, one instruction per line */
    private readonly source: java.lang.String;

    protected constructor(input: java.lang.String) {
        super();
        this.source = input;
    }

    public static get(id: java.lang.String): ExampleFileInput {
        return new ExampleFileInput(ExampleFileInput.load(new java.lang.String("./nal/" + id + ".nal")));
    }

    public enableConditions(n: Nar, similarResultsToSave: int): java.util.List<OutputCondition> {
        return OutputCondition.getConditions(n, this.source, similarResultsToSave);
    }

    public static getUnitTests(directories: java.lang.String[]): java.util.Map<java.lang.String, JavaObject[]> {
        // Java resolves these through the classpath.  Node has no equivalent classpath,
        // so keep the resource lookup at this test-only adapter and preserve TreeMap order.
        const resourceRoot = fileURLToPath(new URL("../../../java-master/src/main/resources/", import.meta.url));
        const unitTests: java.util.Map<java.lang.String, JavaObject[]> =
            new java.util.LinkedHashMap<java.lang.String, JavaObject[]>();

        for (const directory of directories) {
            const relativeDirectory = javaStringValue(directory).replace(/^[/\\]+/, "");
            const folder = join(resourceRoot, relativeDirectory);
            const entries = readdirSync(folder, { withFileTypes: true })
                .filter((entry) => entry.isFile())
                .map((entry) => entry.name)
                .sort();

            for (const name of entries) {
                if (name === "README.txt" || name.includes(".png") || name === "extra")
                    continue;
                const absolutePath = join(folder, name);
                const argumentsForTest: JavaObject[] = [new java.lang.String(absolutePath)];
                unitTests.put(new java.lang.String(name), argumentsForTest);
            }
        }
        return unitTests;
    }

    public getSource(): java.lang.String {
        return this.source;
    }

}
