const assert = require('assert');
const generatePermutations = require('../utils/generate-permutations');

describe('Generate Permutations', () => {
    it('Should generate no results for an empty array', () => {
        assert.equal(generatePermutations([]).length, 0);
    });

    it('Should generate the same array for an array of one entry', () => {
        const testArray = [1];
        const permutation = generatePermutations(testArray);
        assert.equal(permutation.length, 1);
    });

    it('Should generate two permutations for an array of two entries', () => {
        const testArray = [1, 2];
        const permutation = generatePermutations(testArray);
        assert.equal(permutation.length, 2);
    });

    it('Should generate 6 permutations for an array of three entries', () => {
        const testArray = [1, 2, 3];
        const permutation = generatePermutations(testArray);
        assert.equal(permutation.length, 6);
    });

    it('Should generate 24 permutations for an array of three entries', () => {
        const testArray = [1, 2, 3, 4];
        const permutation = generatePermutations(testArray);
        assert.equal(permutation.length, 24);
    });
})