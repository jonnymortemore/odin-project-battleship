export class Ship {
    constructor(size) {
        this.size = size;
        this.hits = 0
        this.sunk = false
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

    get hits() {
        return this._hits
    }

    set hits(value) {
        this._hits = value
    }

    hit() {
        this.hits += 1
        if (this.hits === this.size) {
            this.sinkShip()
        }
    }

    sinkShip() {
        this.sunk = true;
    }
}