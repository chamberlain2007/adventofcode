const {MAXIMUM_PATTERN_LENGTH} = require('./constants');

const attemptPatternMatch = require('./attempt-pattern-match');

/**
 * Find the correct pattern to use to general the path
 * @param {Array.<string[]>} potentialPatterns The patterns to check
 * @param {string[]} groupedPath The path
 * @return {any[]} Whether the pattern was found, the patterns and the patterns to use
 */
const getPatterns = (potentialPatterns, groupedPath) => {
    const characterLength = (arr) => {
        return (arr.length - 1) + arr.reduce((sum, elem) => {
            return sum + elem.toString().length;
        }, 0);
    };

    let found = false;
    let foundPatterns = [];
    let foundCommands = [];

    for (let i = 0; i < potentialPatterns.length; i++) {
        const pattern1 = potentialPatterns[i];

        if (pattern1.length === 1) {
            continue;
        }

        for (let j = 0; j < potentialPatterns.length; j++) {
            const pattern2 = potentialPatterns[j];

            if (pattern2.length === 1) {
                continue;
            }

            for (let k = 0; k < potentialPatterns.length; k++) {
                if (i === j || i === k || j === k) {
                    continue;
                }

                const pattern3 = potentialPatterns[k];

                if (pattern3.length === 1) {
                    continue;
                }

                if (characterLength(pattern1) > MAXIMUM_PATTERN_LENGTH || characterLength(pattern2) > MAXIMUM_PATTERN_LENGTH || characterLength(pattern3) > MAXIMUM_PATTERN_LENGTH) {
                    continue;
                }

                const patterns = [pattern1, pattern2, pattern3];

                const [matched, commands] = attemptPatternMatch(patterns, groupedPath);

                if (matched) {
                    found = true;
                    foundPatterns = patterns;
                    foundCommands = commands;
                    break;
                }
            }

            if (found) {
                break;
            }
        }

        if (found) {
            break;
        }
    }

    return [found, foundPatterns, foundCommands];
};

module.exports = getPatterns;
