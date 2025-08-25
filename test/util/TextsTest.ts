


import { java, JavaObject } from "jree";



export class TextsTest extends JavaObject {

    public testN2(): void {
        assertEquals("1.00", Texts.n2(1.00).toString());
        assertEquals("0.50", Texts.n2(0.5).toString());
        assertEquals("0.09", Texts.n2(0.09).toString());
        assertEquals("0.10", Texts.n2(0.1).toString());
        assertEquals("0.01", Texts.n2(0.009).toString());
        assertEquals("0.00", Texts.n2(0.001).toString());
        assertEquals("0.01", Texts.n2(0.01).toString());
        assertEquals("0.00", Texts.n2(0).toString());
    }
}
