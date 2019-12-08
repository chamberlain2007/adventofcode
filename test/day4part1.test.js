const assert = require('assert');
const day4part1 = require('../solutions/day4/part1');

describe('Day 4 Part 1', () => {
    it('Should return true for 111111', () => {
        let valid = day4part1(111111);
        assert.equal(valid, true);
    });

    it('Should return false for 223450', () => {
        let valid = day4part1(223450);
        assert.equal(valid, false);
    });

    it('Should return false for 123789', () => {
        let valid = day4part1(123789);
        assert.equal(valid, false);
    });
})