/*
 * The MIT License
 *
 * Copyright 2018 The OpenNARS authors.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUF WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */import { java, JavaObject, type long } from "jree";
import { Stamp } from "../../src/entity/Stamp.ts";
import { assertTrue } from "../util/junit-assert.ts";

const BaseEntry = Stamp.BaseEntry;
type BaseEntry = InstanceType<typeof Stamp.BaseEntry>;
const toSetArray = Stamp.toSetArray;



/**
 * Tests the correct functionality of stamps
 *
 */
export class TestStamp extends JavaObject {
    private narid: long = 0;

    protected entry(inputId: long): BaseEntry {
        return new BaseEntry(this.narid, inputId);
    }

    public testStampToSetArray(): void {

        assertTrue(toSetArray([this.entry(1), this.entry(2), this.entry(3)]).length === 3);
        assertTrue(toSetArray([this.entry(1), this.entry(1), this.entry(3)]).length === 2);
        assertTrue(toSetArray([this.entry(1)]).length === 1);
        assertTrue(toSetArray([]).length === 0);
        assertTrue(
            java.util.Arrays.hashCode(toSetArray([this.entry(3), this.entry(2), this.entry(1)])) === java.util.Arrays
                .hashCode(toSetArray([this.entry(2), this.entry(3), this.entry(1)])));
        assertTrue(
            java.util.Arrays.hashCode(toSetArray([this.entry(1), this.entry(2), this.entry(3)])) !== java.util.Arrays
                .hashCode(toSetArray([this.entry(1), this.entry(1), this.entry(3)])));
    }
}
