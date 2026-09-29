/** Node-only process termination capability used by the CLI shell. */
export const javaSystemExit = (status: number): never => {
    if (typeof process !== "undefined" && typeof process.exit === "function") process.exit(status);
    throw new Error(`Process exit requested with status ${status}`);
};
