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

    setupShipStartingPositions() {
        const presetShips = [
            { name: "Carrier", size: 5 },
            { name: "Battleship", size: 4 },
            { name: "Cruiser", size: 3 },
            { name: "Submarine", size: 3 },
            { name: "Destroyer", size: 2 }
        ];

        //setup random ship positions
        for (const shipDetails of presetShips) {
            const ship = new Ship(shipDetails.size, shipDetails.name)

            while (true) {
                //randomly pick an angle
                const angle = (() => {
                    const angles = [0, 90, 180, 270]
                    const randomIndex = Math.floor(Math.random() * angles.length)
                    return angles[randomIndex]
                })()

                //randomly pick X and Y 
                const x = Math.floor(Math.random() * this.boardsize)
                const y = Math.floor(Math.random() * this.boardsize)

                //check X and Y (with ship length) isn't out of bounds or overlapping any other ship - if position found break out of while loop
                if(this.#shipFits(ship, x, y, angle)) {
                    this.addShip(ship, x, y, angle)
                    break
                }
            }
        }
        console.table(this.gameboard)
    }

    receiveAttack(x, y) {
        const hitPoint = this.gameboard[x][y];

        if (hitPoint.ship === null) {
            hitPoint.state = this.states.miss
            return false
        }

        hitPoint.state = this.states.hit
        hitPoint.ship.hit()
        return true
    }

    #shipFits(ship, x, y, angle) {
        let extraX = 0;
        let extraY = 0;
       
        switch (angle) {
            case 0:   extraX = 1; break;
            case 180: extraX = -1; break;
            case 90:  extraY = 1; break;
            case 270: extraY = -1; break;
        }

        for(let i = 0; i < ship.size; i++) {
            const newX = x + (extraX * i)
            const newY = y + (extraY * i)

            if (newX >= this.boardsize || newX < 0 || newY >= this.boardsize || newY < 0) {
                return false
            }
            if (this.gameboard[newX][newY].state !== this.states.empty) {
                return false
            }
        }

        return true
    }
   
}

class BoardSquare {
    constructor(ship = null, state = 0) {
        this.ship = ship;
        this.state = state;
    }
}
