/**
 * Generate all of the permutations of a list of numbers
 * @param {number[]} options The numbers to permute
 * @param {number=} k The current k value (used internally by Heap's algorithm)
 * @return {Array.<string[]>} The list of permutations
 */
const generatePermutations = (options, k) => {
    if (options.length === 0) {
        return [];
    }

    if (options.length === 1) {
        return [[...options]];
    }

    if (k === 1) {
        return [[...options]];
    }

    k = k || options.length;

    const results = generatePermutations(options, k - 1);

    for (let i = 0; i < k - 1; i++) {
        if (k % 2 === 0) {
            [options[i], options[k-1]] = [options[k-1], options[i]];
        } else {
            [options[0], options[k-1]] = [options[k-1], options[0]];
        }

        Array.prototype.push.apply(results, generatePermutations(options, k-1));
    }

    return results;
};

module.exports = generatePermutations;
