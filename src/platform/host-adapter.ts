/**
 * Build-time host selection point for the platform-neutral reasoner core.
 * Node entry points use the Node implementation; browser bundlers alias this
 * module to `platform/browser/native-host-adapter.ts`.
 */
export {
    java,
    isJavaException,
    isJavaThrowable,
    toJavaString,
} from "./node/native-host-adapter.ts";
export type { JavaStringInput } from "./node/native-host-adapter.ts";
