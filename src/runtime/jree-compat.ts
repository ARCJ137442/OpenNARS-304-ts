import { Class, JavaObject } from "jree";

// jree 1.3.0's published JavaObject.class getter passes Function instead of
// the receiver class to Class.fromConstructor(). That collapses every
// translated Java class literal to one token and breaks event dispatch.
const descriptor = Object.getOwnPropertyDescriptor(JavaObject, "class");
if (descriptor?.configurable && descriptor.get) {
    const javaObjectClass = Class.fromConstructor(JavaObject);
    if (JavaObject.class !== javaObjectClass) {
        Object.defineProperty(JavaObject, "class", {
            configurable: true,
            get(this: typeof JavaObject) {
                return Class.fromConstructor(this);
            },
        });
    }
}
