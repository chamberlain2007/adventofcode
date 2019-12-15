/**
 * Generate all of the pairs of elements in an array of elements
 * @param {any[]} arr The array of elements
 * @return {Array<number[]>} An array of pairs of elements
 */
const generatePairs = (arr) => {
    const generator = function* (arr) {
        if (arr.length <= 1) {
            return;
        }

        const [first, ...others] = arr;
        for (let i = 0; i < others.length; i++) {
            yield [first, others[i]];
        }

        yield* generator(others);
    };

    return [...generator(arr)];
};

module.exports = generatePairs;
