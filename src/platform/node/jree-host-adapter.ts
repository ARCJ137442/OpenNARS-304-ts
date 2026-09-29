/**
 * Node/parity-only compatibility entry for translated Java runtime objects.
 *
 * The reasoning core imports project-owned contracts from `runtime`; this
 * module is the single npm-jree boundary retained while the remaining boxed
 * Java I/O and reflection shapes are migrated. Browser builds must replace
 * this entry at the host boundary.
 */
export { Class, JavaObject, java } from "jree";
