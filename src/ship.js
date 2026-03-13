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
        this.states = {
            undetected: 1,
            miss: -1,
            empty: 0,
            hit: 2
        }
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
        //can't use .fill to fill a array with objects!
        const boardArray = Array.from({ length: size }, () =>
            Array.from({ length: size }, () => new BoardSquare())
        );
        return boardArray;
    }

    addShip(ship, x, y, angle) {
        let extraX = 0;
        let extraY = 0;

        switch (angle) {
            case 0:   extraX = 1; break;
            case 180: extraX = -1; break;
            case 90:  extraY = 1; break;
            case 270: extraY = -1; break;
        }

        for(let i = 0; i < ship.size; i++) {
            const bg = this.gameboard[x + (extraX * i)][y + (extraY * i)]
            bg.ship = ship
            bg.state = this.states.undetected
        }
    }
   
}

class BoardSquare {
    constructor(ship = null, state = 0) {
        this.ship = ship;
        this.state = state;
    }
}
