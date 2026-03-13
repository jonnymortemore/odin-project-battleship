import { Ship, Gameboard } from "../src/ship.js";

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
    expect(new Ship(5).shipName).toBe("ship");
    expect(new Ship(5, "boat").shipName).toBe("boat");
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
    newGameboard.setupShipStartingPositions()
})