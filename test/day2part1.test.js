const assert = require('assert');
const day2part1 = require('../day2part1');

describe('Day 2 Part 1', () => {
    it('Should generate correct values for 1 + 1', () => {
        let input = [1,0,0,0,99];
        let output = day2part1(input);
        assert.deepEqual(output, [2,0,0,0,99]);
    });

    it('Should generate correct values for 3 * 2', () => {
        let input = [2,3,0,3,99];
        let output = day2part1(input);
        assert.deepEqual(output, [2,3,0,6,99]);
    });

    it('Should generate correct values for 99 * 99', () => {
        let input = [2,4,4,5,99,0];
        let output = day2part1(input);
        assert.deepEqual(output, [2,4,4,5,99,9801]);
    });

    it('Should generate correct values for 4th example', () => {
        let input = [1,1,1,4,99,5,6,0,99];
        let output = day2part1(input);
        assert.deepEqual(output, [30,1,1,4,2,5,6,0,99]);
    });
})