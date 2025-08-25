import { java } from "jree";



/**
 * Implementation can have plugins
 *
 * @author Robert Wünsche
 */
interface Pluggable {
    /**
     * adds/registers a plugin
     *
     * @param plugin plugin to be registered
     */
    addPlugin(/* final */  plugin: Plugin | null): void;

    /**
     * removes a plugin
     *
     * @param pluginState plugin to be removed
     */
    removePlugin(/* final */  pluginState: Nar.PluginState | null): void;

    /**
     * returns all plugins which were added
     *
     * @return plugins
     */
    getPlugins(): java.util.List<unknown>;
}
