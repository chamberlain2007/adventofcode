const assert = require('assert');
const day1part1 = require('../day1part1');

describe('Day 1 Part 1', () => {
    it('Should generate 2 for 12', () => {
        let sum = day1part1(12);
        assert.equal(sum, 2);
    });

    it('Should generate 2 for 14', () => {
        let sum = day1part1(14);
        assert.equal(sum, 2);
    });

    it('Should generate 654 for 1969', () => {
        let sum = day1part1(1969);
        assert.equal(sum, 654);
    });

    it('Should generate 33583 for 100756', () => {
        let sum = day1part1(100756);
        assert.equal(sum, 33583);
    });
})