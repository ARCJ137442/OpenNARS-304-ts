
import { java, type short, type int, type float } from "jree";



/**
 * @author Pei Wang
 * @author Patrick Hammer
 */
export interface TLink<T> {

    getIndex(i: int): short;

    getTarget(): T;

    getPriority(): float;

}
