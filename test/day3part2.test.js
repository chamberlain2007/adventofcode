const assert = require('assert');
const day3part2 = require('../solutions/day3/part2');

describe('Day 3 Part 2', () => {
    it('Should generate correct values for 610 for combination 2', () => {
        let wire1 = 'R75,D30,R83,U83,L12,D49,R71,U7,L72';
        let wire2 = 'U62,R66,U55,R34,D71,R55,D58,R83';
        let distance = day3part2(wire1, wire2);
        assert.equal(distance, 610);
    });

    it('Should generate correct values for 410 for combination 2', () => {
        let wire1 = 'R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51';
        let wire2 = 'U98,R91,D20,R16,D67,R40,U7,R15,U6,R7';
        let distance = day3part2(wire1, wire2);
        assert.equal(distance, 410);
    });
})