//! Java source: opennars/plugin/Plugin.java
import type { Nar } from "../main/Nar.ts";
import type { JavaCharSequenceInput } from "../runtime/jree-compat.ts";



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
    name?(): JavaCharSequenceInput;
}
