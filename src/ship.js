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

export class Gameboard {
    constructor(size) {
        this.boardsize = size
        this.gameboard = this.createboard(this.boardsize)
    }

    get boardsize() {
        return this._boardsize
    }

    set boardsize(size) {
        this._boardsize = size
    }

    set gameboard(board) {
        this._gameboard = board
    }

    get gameboard() {
        return this._gameboard
    }

    createboard(size) {
        const boardArray = Array.from({ length: size }, () =>
        Array(size).fill(0)
        );
        return boardArray

    }
}