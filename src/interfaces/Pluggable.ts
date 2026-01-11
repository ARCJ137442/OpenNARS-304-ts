//! Java source: opennars/interfaces/Pluggable.java
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
    addPlugin(plugin: Plugin): void;

    /**
     * removes a plugin
     *
     * @param pluginState plugin to be removed
     */
    removePlugin(pluginState: Nar.PluginState): void;

    /**
     * returns all plugins which were added
     *
     * @return plugins
     */
    getPlugins(): java.util.List<unknown>;
}
