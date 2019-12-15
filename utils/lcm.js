const gcd = require('./gcd');

/**
 * Calculate the lowest common multiple of an array of numbers
 * @param  {...number} elems The numbers
 * @return {number} The lowest common multiple
 */
const lcm = (...elems) => {
    const [first, ...rest] = elems;
    return rest.reduce((curr, elem) => {
        return curr * elem / gcd(curr, elem);
    }, first);
};

module.exports = lcm;
