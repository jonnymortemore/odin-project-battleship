export class Ship {
    constructor(size, name = "ship") {
        this.size = size;
        this.hits = 0;
        this.sunk = false;
        this.name = name;
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
        this.ships = [];
        this.states = {
            undetected: 1,
            miss: -1,
            empty: 0,
            hit: 2,
        };
        this.gameEndState = true;
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
            Array.from({ length: size }, () => new BoardSquare()),
        );
        return boardArray;
    }

    hasShip(x, y) {
        //used to setup gameboard - returns true if has ship
        if (this.gameboard[x][y].ship !== null) {
            return true;
        }
        return false;
    }

    addShip(ship, x, y, angle) {
        //add ship to ships array
        this.ships.push(ship);

        let extraX = 0;
        let extraY = 0;

        switch (angle) {
            case 0:
                extraX = 1;
                break;
            case 180:
                extraX = -1;
                break;
            case 90:
                extraY = 1;
                break;
            case 270:
                extraY = -1;
                break;
        }

        for (let i = 0; i < ship.size; i++) {
            const bg = this.gameboard[x + extraX * i][y + extraY * i];
            bg.ship = ship;
            bg.state = this.states.undetected;
        }
    }

    setupShipStartingPositions(presetShips) {
        //setup random ship positions
        for (const shipDetails of presetShips) {
            const ship = new Ship(shipDetails.size, shipDetails.name);
            while (true) {
                //randomly pick an angle
                const angle = (() => {
                    const angles = [0, 90, 180, 270];
                    const randomIndex = Math.floor(
                        Math.random() * angles.length,
                    );
                    return angles[randomIndex];
                })();

                //randomly pick X and Y
                const x = Math.floor(Math.random() * this.boardsize);
                const y = Math.floor(Math.random() * this.boardsize);

                //check X and Y (with ship length) isn't out of bounds or overlapping any other ship - if position found break out of while loop
                if (this.#shipFits(ship, x, y, angle)) {
                    this.addShip(ship, x, y, angle);
                    break;
                }
            }
        }
    }

    receiveAttack(x, y) {
        const hitPoint = this.gameboard[x][y];

        if (hitPoint.ship === null) {
            hitPoint.state = this.states.miss;
            return hitPoint.state;
        }

        hitPoint.state = this.states.hit;
        hitPoint.ship.hit();
        this.checkAllShipsDestroyed();
        return hitPoint.state;
    }

    #shipFits(ship, x, y, angle) {
        let extraX = 0;
        let extraY = 0;

        switch (angle) {
            case 0:
                extraX = 1;
                break;
            case 180:
                extraX = -1;
                break;
            case 90:
                extraY = 1;
                break;
            case 270:
                extraY = -1;
                break;
        }

        for (let i = 0; i < ship.size; i++) {
            const newX = x + extraX * i;
            const newY = y + extraY * i;

            if (
                newX >= this.boardsize ||
                newX < 0 ||
                newY >= this.boardsize ||
                newY < 0
            ) {
                return false;
            }
            if (this.gameboard[newX][newY].state !== this.states.empty) {
                return false;
            }
        }

        return true;
    }

    endGame() {
        this.gameEndState = true;
    }

    checkAllShipsDestroyed() {
        for (const ship of this.ships) {
            if (ship.sunk === false) {
                return false;
            }
        }
        this.endGame();
        return true;
    }
}

class BoardSquare {
    constructor(ship = null, state = 0) {
        this.ship = ship;
        this.state = state;
    }
}

export class Player {
    constructor(playerNumber, playerName, gameboardSize, playerType) {
        this.gameboard = new Gameboard(gameboardSize);
        this.number = playerNumber;
        this.name = playerName;
        this.type = playerType;
    }
}

export class Battleships {
    constructor() {
        this.mapSize = 10;
        this.presetShips = [
            { name: "Carrier", size: 5 },
            { name: "Battleship", size: 4 },
            { name: "Cruiser", size: 3 },
            { name: "Submarine", size: 3 },
            { name: "Destroyer", size: 2 },
        ];
        this.turnCounter = 1;

        this.player1 = new Player(1, "player", this.mapSize, "player");
        this.player2 = new Player(2, "CPU", this.mapSize, "cpu");

        this.player1.gameboard.setupShipStartingPositions(this.presetShips);
        this.player2.gameboard.setupShipStartingPositions(this.presetShips);

        this.activePlayer = this.player1;
        this.combatentPlayer = this.player2;

        this.dom = null;
    }

    endTurn() {
        [this.activePlayer, this.combatentPlayer] = [
            this.combatentPlayer,
            this.activePlayer,
        ];
        this.turnCounter += 1;
        this.startTurn()
    }

    startTurn() {
        if (this.activePlayer.type === "cpu") {
            this.cpuRandomAttack()
            this.endTurn()
        }
    }

    cpuRandomAttack() {
        const states = this.combatentPlayer.gameboard.states;
        let attackEffect = null;
        while (attackEffect === null) {
            const randomX = Math.floor(Math.random() * this.mapSize);
            const randomY = Math.floor(Math.random() * this.mapSize);

            const gridSquare =
                this.combatentPlayer.gameboard.gameboard[randomX][randomY];

            console.log(gridSquare)

            if (
                gridSquare.state === states.empty ||
                gridSquare.state === states.undetected
            ) {
                attackEffect = this.combatentPlayer.gameboard.receiveAttack(
                    randomX,
                    randomY,
                );
                this.dom.registerCPUAttack(randomX, randomY, this.combatentPlayer.number, attackEffect, this.combatentPlayer.gameboard.states)
            }
        }
    }

    playerAttack(x, y, player) {
        const attackEffect = player.gameboard.receiveAttack(x, y);
        this.endTurn()
        return attackEffect;
    }
}
