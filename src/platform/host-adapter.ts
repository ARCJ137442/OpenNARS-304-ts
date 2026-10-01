/**
 * Platform-neutral host contract.
 *
 * The reasoner consumes these capability types; Node and browser modules
 * provide concrete implementations. There is intentionally no Java namespace
 * or reflection facade at this boundary.
 */
export type {
    CurrentTimeMillis,
    MessageTransportCapability,
    RuntimeCapabilities,
    TextWriter,
} from "./RuntimeCapabilities.ts";
export { defaultCurrentTimeMillis, MissingRuntimeCapabilityError } from "./RuntimeCapabilities.ts";
