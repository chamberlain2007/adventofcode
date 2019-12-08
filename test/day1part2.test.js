const assert = require('assert');
const day1part2 = require('../day1part2');

describe('Day 1 Part 2', () => {
    it('Should generate 2 for 14', () => {
        let sum = day1part2(14);
        assert.equal(sum, 2);
    });

    it('Should generate 966 for 1969', () => {
        let sum = day1part2(1969);
        assert.equal(sum, 966);
    });

    it('Should generate 50346 for 100756', () => {
        let sum = day1part2(100756);
        assert.equal(sum, 50346);
    });
})