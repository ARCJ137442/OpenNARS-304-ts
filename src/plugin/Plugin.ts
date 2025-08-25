import { java } from "jree";



/**
 * Nar plugin interface
 */
abstract class Plugin extends java.io.Serializable {

    /**
     * called when plugin is activated (enabled = true) / deactivated
     * (enabled=false)
     */
    protected abstract setEnabled(n: Nar | null, enabled: boolean): boolean {
        return true;
    }

    protected abstract name(): java.lang.CharSequence {
        return this.getClass().getSimpleName();
    }
}
