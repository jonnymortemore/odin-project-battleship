import { Ship, Gameboard, Player, Battleships } from "../src/ship.js";

test("ship class exists", () => {
    expect(typeof new Ship()).toBe("object");
});

test("ship sized correctly", () => {
    expect(new Ship(4).size).toBe(4);
    expect(new Ship(8).size).toBe(8);
    expect(() => new Ship(0)).toThrow(RangeError);
    expect(() => new Ship(-1)).toThrow(RangeError);
});

test("ship named correctly", () => {
    expect(new Ship(5).name).toBe("ship");
    expect(new Ship(5, "boat").name).toBe("boat");
});

test("ships should take hits", () => {
    const ship = new Ship(4);
    expect(ship.hits).toBe(0);
    ship.hit();
    expect(ship.hits).toBe(1);
});

test("ships can sink", () => {
    const ship = new Ship(3);
    expect(ship.sunk).toBe(false);
    //direct ship sinking
    ship.sinkShip();
    expect(ship.sunk).toBe(true);
    //ship sinking using hit
    const newShip = new Ship(2);
    newShip.hit();
    newShip.hit();
    expect(ship.sunk).toBe(true);
});

//test gameboard
test("create gameboard object", () => {
    expect(typeof new Gameboard(5)).toBe("object");
    expect(new Gameboard(5).boardsize).toBe(5);
});

test("create gameboard correct in gameboard object", () => {
    expect(typeof new Gameboard(5).gameboard).toBe("object");
    expect(Array.isArray(new Gameboard(5).gameboard)).toBe(true);
    //check array width
    expect(new Gameboard(10).gameboard.length).toBe(10);
    //check array height
    expect(new Gameboard(10).gameboard[0].length).toBe(10);
    //check all the array values are 0
    //.flat creates a linear array removing all sub arrays to make sure every checks all indexes
    const newGameboard = new Gameboard(10);
    expect(
        newGameboard.gameboard
            .flat()
            .every(
                (gridsquare) => gridsquare.state === newGameboard.states.empty,
            ),
    ).toBe(true);
});

test("adding ship to gameboard", () => {
    const newGameboard = new Gameboard(10);
    newGameboard.addShip(new Ship(3), 1, 1, 0);
    expect(newGameboard.gameboard[1][1].state).toBe(
        newGameboard.states.undetected,
    );
    expect(newGameboard.gameboard[2][1].state).toBe(
        newGameboard.states.undetected,
    );
    expect(newGameboard.gameboard[3][1].state).toBe(
        newGameboard.states.undetected,
    );
    expect(newGameboard.gameboard[4][1].state).toBe(newGameboard.states.empty);
    expect(newGameboard.gameboard[5][1].state).toBe(newGameboard.states.empty);
    expect(newGameboard.gameboard[0][1].state).toBe(newGameboard.states.empty);
    expect(newGameboard.gameboard[0][0].state).toBe(newGameboard.states.empty);
    expect(newGameboard.gameboard[1][0].state).toBe(newGameboard.states.empty);
});

test("randomly placing ships", () => {
    const newGameboard = new Gameboard(10);
    const battleships = new Battleships();
    newGameboard.setupShipStartingPositions(battleships.presetShips);
    //write some tests for placing ships - use a mock function to replace the random values with assigned values
});

test("hits on gameboard", () => {
    const gb = new Gameboard(10);
    gb.addShip(new Ship(3, "boat"), 1, 1, 0);
    expect(gb.receiveAttack(1, 1)).toBe(gb.states.hit);
    expect(gb.receiveAttack(2, 1)).toBe(gb.states.hit);
    expect(gb.gameboard[1][1].ship.hits).toBe(2);
    expect(gb.receiveAttack(3, 1)).toBe(gb.states.hit);
    expect(gb.receiveAttack(4, 1)).toBe(gb.states.miss);
    expect(gb.gameboard[1][1].ship.sunk).toBe(true);
    expect(gb.ships[0].name).toBe(gb.gameboard[1][1].ship.name);
    expect(gb.gameEndState).toBe(true);
});

test("player created correctly", () => {
    const player = new Player(1, "player", 10);
    expect(player.name).toBe("player");
});

test("battleship game controller setup correctly", () => {
    const battleships = new Battleships();
    expect(battleships.player1.gameboard.boardsize).toBe(battleships.mapSize);
});

test("battleship game sets players to correct type on start", () => {
    const battleships = new Battleships();
    expect(battleships.activePlayer.number).toBe(1);
    expect(battleships.activePlayer.number).toBe(battleships.player1.number);
    expect(battleships.combatentPlayer.number).toBe(battleships.player2.number);
})

test("battleships end turn switches active and combative players", () => {
    const battleships = new Battleships();
    expect(battleships.activePlayer.number).toBe(battleships.player1.number);
    expect(battleships.combatentPlayer.number).toBe(battleships.player2.number);
    battleships.endTurn()
    expect(battleships.activePlayer.number).toBe(battleships.player2.number);
    expect(battleships.combatentPlayer.number).toBe(battleships.player1.number);
})

test('turn counter', () => {
    const battleships = new Battleships();
    expect(battleships.turnCounter).toBe(1)
    battleships.endTurn()
    expect(battleships.turnCounter).toBe(2)
})

test('cpu random attack', () => {
    const battleships = new Battleships();
    battleships.cpuRandomAttack()
    //figure out how to test the random x/y of this consistently - spy on variables and add values?
})
