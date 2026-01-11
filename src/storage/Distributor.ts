/**
 * A pseudo-random number generator, used in Bag.
 */
export class Distributor {
    /** Shuffled sequence of index numbers */
    public order: number[];
    /** Capacity of the array */
    private readonly capacity: number;

    /**
     * For any number N < range, there is N+1 copies of it in the array,
     * distributed as evenly as possible
     *
     * @param range Range of valid numbers
     */
    public constructor(range: number) {
        if (range <= 0) {
            throw new RangeError("Distributor range must be >= 1");
        }

        this.capacity = (range * (range + 1)) / 2;
        this.order = new Array<number>(this.capacity);

        for (let arrayIndex: number = 0; arrayIndex < this.capacity; arrayIndex++) {
            this.order[arrayIndex] = -1;
        }

        let index: number = 0;
        for (let rank: number = range; rank > 0; rank--) {
            for (let time: number = 0; time < rank; time++) {
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
    public pick(index: number): number {
        return this.order[index];
    }

    /**
     * Advance the index
     *
     * @param index The current index
     * @return the next index
     */
    public next(index: number): number {
        return (index + 1) % this.capacity;
    }
}
