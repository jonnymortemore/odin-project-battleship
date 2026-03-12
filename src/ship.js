export class Ship {
    constructor(size) {
        this.size = size;
    }

    get size() {
        return this._size;
    }

    set size(size) {
        if (size < 1 ) {
            throw new RangeError('ship cannot be sized less than 1')
        }
        this._size = size;
    }
}