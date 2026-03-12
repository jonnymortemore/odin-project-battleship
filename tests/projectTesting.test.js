import {Ship} from "../src/ship.js"

test('ship class exists', () => {
    expect(new Ship()).toBeTruthy
})

test('ship sized correctly', () => {
    expect(new Ship(4).size).toBe(4),
    expect(new Ship(8).size).toBe(8),
    expect(() => new Ship(0)).toThrow(RangeError)
    expect(() => new Ship(-1)).toThrow(RangeError)
})