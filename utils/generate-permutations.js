/**
 * Generate all of the permutations of a list of numbers
 * @param {number[]} options The numbers to permute
 * @param {number=} k The current k value (for Heap's algorithm, used internally)
 * @returns {number[][]} The list of permutations
 */
const generatePermutations = (options, k) => {
    if (k === 1) {
        return [[...options]];
    }

    k = k || options.length;

    let results = generatePermutations(options, k - 1);

    for (let i = 0; i < k - 1; i++) {
        if (k % 2 === 0) {
            [options[i], options[k-1]] = [options[k-1], options[i]];
        }
        else {
            [options[0], options[k-1]] = [options[k-1], options[0]];
        }

        Array.prototype.push.apply(results, generatePermutations(options, k - 1));
    }

    return results;
};

module.exports = generatePermutations;