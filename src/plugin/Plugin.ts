//! Java source: opennars/plugin/Plugin.java
import type { Nar } from "../main/Nar.ts";

export type PluginName = string | {
    charAt(index: number): number | null;
    length(): number;
    subSequence(start: number, end: number): unknown;
    toString(): unknown;
};



/**
 * Nar plugin interface
 */
export interface Plugin {

    /**
     * called when plugin is activated (enabled = true) / deactivated
     * (enabled=false)
     */
    setEnabled(n: Nar, enabled: boolean): boolean;

    // Java source return type: CharSequence. Keep the boundary broad enough for
    // boxed Java strings and native strings without exposing jree here.
    name?(): PluginName;
}
