//! Java source: opennars/plugin/Plugin.java
import type { java } from "jree";
import type { Nar } from "../main/Nar.ts";



/**
 * Nar plugin interface
 */
export interface Plugin {

    /**
     * called when plugin is activated (enabled = true) / deactivated
     * (enabled=false)
     */
    setEnabled(n: Nar, enabled: boolean): boolean;

    name?(): java.lang.CharSequence;
}
