export class Ship {
    constructor(size, name = "ship") {
        this.size = size;
        this.hits = 0;
        this.sunk = false;
        this.shipName = name;
    }

    get size() {
        return this._size;
    }

    set size(size) {
        if (size < 1) {
            throw new RangeError("ship cannot be sized less than 1");
        }
        this._size = size;
    }

    get hits() {
        return this._hits;
    }

    set hits(value) {
        this._hits = value;
    }

    hit() {
        this.hits += 1;
        if (this.hits === this.size) {
            this.sinkShip();
        }
    }

    sinkShip() {
        this.sunk = true;
    }
}

export class Gameboard {
    constructor(size) {
        this.boardsize = size;
        this.gameboard = this.createboard(this.boardsize);
    }

    get boardsize() {
        return this._boardsize;
    }

    set boardsize(size) {
        this._boardsize = size;
    }

    set gameboard(board) {
        this._gameboard = board;
    }

    get gameboard() {
        return this._gameboard;
    }

    createboard(size) {
        const boardArray = Array.from({ length: size }, () =>
            Array(size).fill(new BoardSquare()),
        );
        return boardArray;
    }
}

class BoardSquare {
    constructor(ship = null, state = "empty") {
        this.ship = ship;
        this.state = state;
    }

    get state() {
        return this._state;
    }

    set state(state) {
        const STATES = ["empty", "hit", "miss"];
        if (STATES.includes(state)) {
            this._state = state;
        } else {
            throw new TypeError("incorrect board square state");
        }
    }
}
