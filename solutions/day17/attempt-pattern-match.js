/**
 * Attempt to find a pattern match in the path, if possible
 * @param {Array.<string[]>} patterns The patterns
 * @param {string[]} groupedPath The path
 * @return {any[]} Whether the match was found and the resulting pattern sequence
 */
const attemptPatternMatch = (patterns, groupedPath) => {
    const arrayStartsWith = (array1, array2) => {
        for (let i = 0; i < array2.length; i++) {
            if (array1[i] !== array2[i]) {
                return false;
            }
        }
        return true;
    };

    const result = [];
    let current = groupedPath;

    let failed = false;

    while (current.length && !failed) {
        failed = true;

        for (let i = 0; i < patterns.length; i++) {
            const pattern = patterns[i];

            if (arrayStartsWith(current, pattern)) {
                result.push(String.fromCharCode(65 + i));
                current = current.slice(pattern.length, current.length);

                failed = false;
            }
        }
    }

    return [!current.length, result];
};

module.exports = attemptPatternMatch;
