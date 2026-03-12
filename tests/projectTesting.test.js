import { Ship } from "../src/ship.js";

test("ship class exists", () => {
    expect(new Ship()).toBeTruthy;
});

test("ship sized correctly", () => {
    expect(new Ship(4).size).toBe(4);
    expect(new Ship(8).size).toBe(8);
    expect(() => new Ship(0)).toThrow(RangeError);
    expect(() => new Ship(-1)).toThrow(RangeError);
});

test("ships should take hits", () => {
    const ship = new Ship(4);
    expect(ship.hits).toBe(0);
    ship.hit();
    expect(ship.hits).toBe(1);
});

test("ships can sink", () => {
    const ship = new Ship(3);
    expect(ship.sunk).toBe(false)
    //direct ship sinking
    ship.sinkShip();
    expect(ship.sunk).toBe(true);
    //ship sinking using hit
    const newShip = new Ship(2);
    newShip.hit()
    newShip.hit()
    expect(ship.sunk).toBe(true)
})
