import { java, JavaObject, type int } from "jree";



/**
 * A pseudo-random number generator, used in Bag.
 */
export class Distributor {

    /** Shuffled sequence of index numbers */
    public order: int[];
    /** Capacity of the array */
    private capacity: int;

    /**
     * For any number N < range, there is N+1 copies of it in the array,
     * distributed as evenly as possible
     *
     * @param range Range of valid numbers
     */
    public constructor(range: int) {
        let index: int;
        let rank: int;
        let time: int;
        this.capacity = (range * (range + 1)) / 2;
        this.order = new /* Int32 */Array(this.capacity);
        for (index = 0; index < this.capacity; index++) {
            this.order[index] = -1;
        }
        for (rank = range; rank > 0; rank--) {
            for (time = 0; time < rank; time++) {
                index = (Math.floor(this.capacity / rank) + index) % this.capacity;
                while (this.order[index] >= 0) {
                    index = (index + 1) % this.capacity;
                }
                this.order[index] = rank - 1;
            }
        }
    }

    /**
     * Get the next number according to the given index
     *
     * @param index The current index
     * @return the random value
     */
    public pick(index: int): int {
        return this.order[index];
    }

    /**
     * Advance the index
     *
     * @param index The current index
     * @return the next index
     */
    public next(index: int): int {
        return (index + 1) % this.capacity;
    }
}

const d = new Distributor(1000);
console.log(d.order);
let j = 0
for (let i = 0; i < 50; i++) {
    console.log(d.pick(j));
    j = d.next(j);
}
