import { java, JavaObject, type int, type float, type double } from "jree";



/**
 * Used to read and parse the XML configuration file
 *
 * @author Robert Wünsche
 */
export class ConfigReader extends JavaObject {

    public static loadParamsFromFileAndReturnPlugins(filepath: java.lang.String, reasoner: Reasoner,
        parameters: Parameters): java.util.List<Plugin> {

        java.lang.System.out.println("Got relative path for loading the config: " + filepath);
        let ret: java.util.List<Plugin> = new java.util.ArrayList<Plugin>();
        let file: java.io.File = new java.io.File(filepath);

        let stream: java.io.InputStream = null;
        // if this failed, then load from resources
        if (!file.exists()) {
            file = null;
            let n: java.net.URL = Resources.getResource("config/defaultConfig.xml");
            // System.out.println(n.toURI().toString());
            let connection: java.net.URLConnection = n.openConnection();
            stream = connection.getInputStream();
            java.lang.System.out.println("Loading config " + "config/defaultConfig.xml" + " from resources");
        } else {
            java.lang.System.out.println("Loading config " + file.getName() + " from file");
        }

        let documentBuilderFactory: DocumentBuilderFactory = DocumentBuilderFactory.newInstance();
        let documentBuilder: DocumentBuilder = documentBuilderFactory.newDocumentBuilder();
        let document: Document = stream !== null ? documentBuilder.parse(stream) : documentBuilder.parse(file);
        let config: NodeList = document.getElementsByTagName("config").item(0).getChildNodes();

        for (let iterationConfigIdx: int = 0; iterationConfigIdx < config.getLength(); iterationConfigIdx++) {
            let iConfig: Node = config.item(iterationConfigIdx);

            if (iConfig.getNodeType() !== Node.ELEMENT_NODE) {
                continue;
            }

            let nodeName: java.lang.String = iConfig.getNodeName();
            if (nodeName.equals("plugins")) {
                let plugins: NodeList = iConfig.getChildNodes();

                for (let iterationPluginIdx: int = 0; iterationPluginIdx < plugins.getLength(); iterationPluginIdx++) {
                    let iPlugin: Node = plugins.item(iterationPluginIdx);

                    if (iPlugin.getNodeType() !== Node.ELEMENT_NODE) {
                        continue;
                    }

                    let pluginClassPath: java.lang.String = iPlugin.getAttributes().getNamedItem("classpath").getNodeValue();

                    let arguments: NodeList = iPlugin.getChildNodes();

                    let createdPlugin: Plugin = ConfigReader.createPluginByClassnameAndArguments(pluginClassPath, arguments, reasoner);
                    ret.add(createdPlugin);
                }
            } else {

                let propertyName: java.lang.String = iConfig.getAttributes().getNamedItem("name").getNodeValue();
                let propertyValueAsString: java.lang.String = iConfig.getAttributes().getNamedItem("value").getNodeValue();

                let wasConfigValueAssigned: boolean = false;

                try {
                    let fieldOfProperty: java.lang.reflect.Field = Parameters.class.getField(propertyName);

                    if (fieldOfProperty.getType() === int.class) {
                        fieldOfProperty.set(parameters, java.lang.Integer.parseInt(propertyValueAsString));
                    } else if (fieldOfProperty.getType() === float.class) {
                        fieldOfProperty.set(parameters, java.lang.Float.parseFloat(propertyValueAsString));
                    } else if (fieldOfProperty.getType() === double.class) {
                        fieldOfProperty.set(parameters, java.lang.Double.parseDouble(propertyValueAsString));
                    } else if (fieldOfProperty.getType() === boolean.class) {
                        fieldOfProperty.set(parameters, java.lang.Boolean.parseBoolean(propertyValueAsString));
                    } else {
                        throw new java.text.ParseException("Unknown type", 0);
                    }

                    wasConfigValueAssigned = true;
                } catch (e) {
                    if (e instanceof java.lang.NoSuchFieldException) {
                        java.lang.System.out.println(propertyName + " is not a valid NARS config field");
                    } else {
                        throw e;
                    }
                }

                if (!wasConfigValueAssigned) {
                    try {
                        let fieldOfProperty: java.lang.reflect.Field = Debug.class.getDeclaredField(propertyName);

                        if (fieldOfProperty.getType() === int.class) {
                            fieldOfProperty.set(null, java.lang.Integer.parseInt(propertyValueAsString));
                        } else if (fieldOfProperty.getType() === float.class) {
                            fieldOfProperty.set(null, java.lang.Float.parseFloat(propertyValueAsString));
                        } else {
                            throw new java.text.ParseException("Unknown type", 0);
                        }

                        wasConfigValueAssigned = true;
                    } catch (e) {
                        if (e instanceof java.lang.NoSuchFieldException) {
                            // ignore
                        } else {
                            throw e;
                        }
                    }
                }
            }
        }
        return ret;
    }

    private static createPluginByClassnameAndArguments(pluginClassPath: java.lang.String, arguments: NodeList,
        reasoner: Reasoner): Plugin {
        let types: java.util.List<java.lang.Class<unknown>> = new java.util.ArrayList();
        let values: java.util.List<java.lang.Object> = new java.util.ArrayList();

        for (let parameterIdx: int = 0; parameterIdx < arguments.getLength(); parameterIdx++) {
            let iParameter: Node = arguments.item(parameterIdx);

            if (iParameter.getNodeType() !== Node.ELEMENT_NODE) {
                continue;
            }

            let typeString: java.lang.String = null;
            let valueString: java.lang.String = null;
            let specialIsReasoner: boolean = iParameter.getAttributes().getNamedItem("isReasoner") !== null;

            if (!specialIsReasoner) {
                typeString = iParameter.getAttributes().getNamedItem("type").getNodeValue();
                valueString = iParameter.getAttributes().getNamedItem("value").getNodeValue();
            }

            if (specialIsReasoner) {
                types.add(Reasoner.class);
                values.add(reasoner);
            } else if (typeString === null) {
                throw new java.text.ParseException("No type specified for parameter", 0);
            } else if (typeString.equals("int.class")) {
                types.add(int.class);
                values.add(java.lang.Integer.parseInt(valueString));
            } else if (typeString.equals("float.class")) {
                types.add(float.class);
                values.add(java.lang.Float.parseFloat(valueString));
            } else if (typeString.equals("boolean.class")) {
                types.add(boolean.class);
                values.add(java.lang.Boolean.parseBoolean(valueString));
            } else if (typeString.equals("String.class")) {
                types.add(java.lang.String.class);
                values.add(valueString);
            } else {
                throw new java.text.ParseException("Unknown type", 0);
            }
        }

        let typesAsArr: java.lang.Class<unknown>[] = types.toArray(new Array<java.lang.Class>(types.size()));
        let valuesAsArr: java.lang.Object[] = values.toArray(new Array<java.lang.Object>(values.size()));

        let c: java.lang.Class<unknown> = java.lang.Class.forName(pluginClassPath);

        let createdPlugin: Plugin = c.getConstructor(typesAsArr).newInstance(valuesAsArr) as Plugin;
        return createdPlugin;
    }
}
