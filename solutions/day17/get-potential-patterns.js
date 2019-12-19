/**
 * Get all of the potential patterns in the array
 * @param {string[]} array The array to check
 * @return {Array.<string[]>} The array of potential patterns
 */
const getPotentialPatterns = (array) => {
    const generator = function* (array) {
        for (let i = 0; i < array.length; i++) {
            for (let len = 1; len <= array.length - i; len++) {
                yield array.slice(i, i + len);
            }
        }
    };

    const allPatterns = [...generator(array)].map((x) => x.join(','));

    const uniquePatterns = [...new Set(allPatterns)].map((pattern) => pattern.split(','));

    return uniquePatterns;
};

module.exports = getPotentialPatterns;
