import { java, JavaObject } from "jree";



export class TextsTest extends JavaObject {

    public testN2(): void {
        assertEquals("1.00", Texts.n2(1.00));
        assertEquals("0.50", Texts.n2(0.5));
        assertEquals("0.09", Texts.n2(0.09));
        assertEquals("0.10", Texts.n2(0.1));
        assertEquals("0.01", Texts.n2(0.009));
        assertEquals("0.00", Texts.n2(0.001));
        assertEquals("0.01", Texts.n2(0.01));
        assertEquals("0.00", Texts.n2(0));
    }
}
