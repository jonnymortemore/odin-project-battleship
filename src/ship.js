export class Ship {
    constructor(size, name = "ship") {
        this.size = size;
        this.hits = 0;
        this.sunk = false;
        this.name = name;
        this.coordinates = [];
        this.angle = 0;
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
        const boardSquare = this.gameboard[x][y];
        if (boardSquare.ship !== null) {
            return true;
        }
        return false;
    }

    getShipAngle(x, y) {
        return this.gameboard[x][y].ship.angle;
    }

    getShipSection(x, y) {
        return this.gameboard[x][y].shipSection;
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
            const pickedX = x + extraX * i;
            const pickedY = y + extraY * i;
            const boardSquare = this.gameboard[pickedX][pickedY];
            ship.coordinates.push({ x: pickedX, y: pickedY });
            ship.angle = angle;
            boardSquare.ship = ship;
            boardSquare.state = this.states.undetected;
            switch (i) {
                case 0:
                    boardSquare.shipSection = "back";
                    break;
                case ship.size - 1: 
                    boardSquare.shipSection = "front";
                    break;
                default: 
                    boardSquare.shipSection = "middle";
            }
        }
    }

    randomizeShipStartingPositions(presetShips) {
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

    checkAllShipsDestroyed() {
        for (const ship of this.ships) {
            if (ship.sunk === false) {
                return false;
            }
        }
        return true;
    }
}

class BoardSquare {
    // ship type - back / middle / front / none
    constructor(ship = null, state = 0, shipSection = "none") {
        this.ship = ship;
        this.state = state;
        this.shipSection = shipSection;
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
        this.mapSize = 8;
        this.presetShips = [
            { name: "Carrier", size: 5 },
            { name: "Battleship", size: 4 },
            { name: "Cruiser", size: 3 },
            { name: "Submarine", size: 3 },
            { name: "Destroyer", size: 2 },
        ];
        this.turnCounter = 1;

        this.player1 = new Player(1, "You", this.mapSize, "player");
        this.player2 = new Player(2, "Computer", this.mapSize, "cpu");

        //this.setupPlayerShips(this.player1);
        this.setupPlayerShips(this.player2);

        this.activePlayer = this.player1;
        this.combatentPlayer = this.player2;

        this.dom = null;
        this.gameEndState = false;
    }

    addDomController(dom) {
        this.dom = dom;
    }

    setupPlayerShips(player) {
        player.gameboard.randomizeShipStartingPositions(this.presetShips);
    }

    endTurn() {
        [this.activePlayer, this.combatentPlayer] = [
            this.combatentPlayer,
            this.activePlayer,
        ];
        this.turnCounter += 1;
        if (this.dom !== null) {
            this.dom.updateGameDetails(
                this.turnCounter,
                this.activePlayer.name,
            );
        }
        this.startTurn();
    }

    startTurn() {
        if (this.activePlayer.type === "cpu") {
            setTimeout(() => {
                this.cpuAttack();
            }, 1000);
        }
    }

    cpuAttack() {
        let attackCoordinates;
        attackCoordinates = this.cpuTargettedAttack();
        if (!attackCoordinates) {
            attackCoordinates = this.cpuRandomAttack();
        }
        const attackEffect = this.combatentPlayer.gameboard.receiveAttack(
            attackCoordinates.x,
            attackCoordinates.y,
        );

        if (this.dom !== null) {
            this.dom.registerCPUAttack(
                attackCoordinates.x,
                attackCoordinates.y,
                this.combatentPlayer.number,
                attackEffect,
                this.combatentPlayer.gameboard.states,
            );
        }

        if (!this.checkForGameEnd(this.combatentPlayer)) {
            this.endTurn();
        }
    }

    cpuTargettedAttack() {
        //if no hits yet -> return false
        function getHitships(ships) {
            const hitShips = [];
            for (const ship of ships) {
                if (ship.hits !== 0 && !ship.sunk) {
                    hitShips.push(ship);
                }
            }
            return hitShips;
        }

        function shuffle(array) {
            //Fisher–Yates Shuffle

            if (array.length === 0) {
                return array;
            }

            for (let i = array.length - 1; i > 0; i--) {
                // Generate a random index from 0 to i
                const j = Math.floor(Math.random() * (i + 1));

                // Swap elements array[i] and array[j]
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

        function pickHitCoordinate(x, y, angle, gameboard, boardsize) {
            function coordinateInBounds({ x, y }) {
                return x >= 0 && y >= 0 && x < boardsize && y < boardsize;
            }
            if (angle === "any") {
                //pick random orthagonal angle
                const coordinates = shuffle(
                    [
                        { x: x - 1, y: y }, // left
                        { x: x + 1, y: y }, // right
                        { x: x, y: y - 1 }, // up
                        { x: x, y: y + 1 }, // down
                    ].filter(coordinateInBounds),
                );
                for (const coord of coordinates) {
                    const boardSquare = gameboard[coord.x][coord.y];
                    if (
                        boardSquare.state !== states.hit &&
                        boardSquare.state !== states.miss
                    ) {
                        return { x: coord.x, y: coord.y };
                    }
                }
            } else {
                //pick coordinate based on angle
                const coordinates = shuffle(
                    ((x, y, angle) => {
                        if (angle === 0 || angle === 180) {
                            return [
                                { x: x + 1, y: y }, // right,
                                { x: x - 1, y: y }, // left
                            ];
                        } else {
                            return [
                                { x: x, y: y + 1 }, // up,
                                { x: x, y: y - 1 }, // down
                            ];
                        }
                    })(x, y, angle).filter(coordinateInBounds),
                );
                for (const coord of coordinates) {
                    const boardSquare = gameboard[coord.x][coord.y];
                    if (
                        boardSquare.state !== states.hit &&
                        boardSquare.state !== states.miss
                    ) {
                        return { x: coord.x, y: coord.y };
                    }
                }
            }
            return false;
        }

        const states = this.combatentPlayer.gameboard.states;
        const hitShips = shuffle(
            getHitships(this.combatentPlayer.gameboard.ships),
        );
        let attackCoordinates;

        //No hit ships -> return false so can randomAttack
        if (hitShips.length === 0) {
            return false;
        }

        for (const ship of hitShips) {
            let angle;
            if (ship.hits === 1) {
                //single hit - pick any grid square around the point
                angle = "any";
            } else {
                // multiple hits - pick grid square smarter using ship angle
                angle = ship.angle;
            }

            //loop through ship coordinates and check if hit
            for (const { x, y } of ship.coordinates) {
                const boardSquare =
                    this.combatentPlayer.gameboard.gameboard[x][y];
                if (boardSquare.state === states.hit) {
                    attackCoordinates = pickHitCoordinate(
                        x,
                        y,
                        angle,
                        this.combatentPlayer.gameboard.gameboard,
                        this.combatentPlayer.gameboard.boardsize
                    );
                    if (attackCoordinates !== false) {
                        return attackCoordinates;
                    }
                }
            }
        }

        //if couldn't resolve any attacks using above - return false
        return false;
    }

    cpuRandomAttack() {
        const states = this.combatentPlayer.gameboard.states;
        let randomX;
        let randomY;

        while (true) {
            randomX = Math.floor(Math.random() * this.mapSize);
            randomY = Math.floor(Math.random() * this.mapSize);

            const gridSquare =
                this.combatentPlayer.gameboard.gameboard[randomX][randomY];

            if (
                gridSquare.state === states.empty ||
                gridSquare.state === states.undetected
            ) {
                return { x: randomX, y: randomY };
            }
        }
    }

    playerAttack(x, y, player) {
        const attackEffect = player.gameboard.receiveAttack(x, y);
        if (!this.checkForGameEnd(this.combatentPlayer)) {
            this.endTurn();
        }
        return attackEffect;
    }

    checkForGameEnd(player) {
        if (player.gameboard.checkAllShipsDestroyed()) {
            this.endGame();
            return true;
        }
        return false;
    }

    endGame() {
        this.gameEndState = true;
        this.dom.triggerGameEnd(this.activePlayer.name);
    }
}
