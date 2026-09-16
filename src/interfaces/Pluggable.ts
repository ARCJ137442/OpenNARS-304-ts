//! Java source: opennars/interfaces/Pluggable.java
import type { Plugin } from "../plugin/Plugin.ts";
import type { Nar } from "../main/Nar.ts";
import type { NativeReadOnlyList } from "../runtime/NativeList.ts";



/**
 * Implementation can have plugins
 *
 * @author Robert Wünsche
 */
export interface Pluggable {
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
    getPlugins(): NativeReadOnlyList<unknown>;
}
