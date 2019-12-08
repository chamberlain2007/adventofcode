const assert = require('assert');
const day4part2 = require('../solutions/day4/part2');

describe('Day 4 Part 2', () => {
    it('Should return true for 112233', () => {
        let valid = day4part2(112233);
        assert.equal(valid, true);
    });

    it('Should return false for 123444', () => {
        let valid = day4part2(123444);
        assert.equal(valid, false);
    });

    it('Should return false for 111122', () => {
        let valid = day4part2(111122);
        assert.equal(valid, true);
    });
})