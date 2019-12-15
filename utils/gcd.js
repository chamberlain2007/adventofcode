/**
 * Calculate the greatest common denominator of two numbers
 * @param {number} a The first number
 * @param {number} b The second number
 * @return {number} The greatest common denominator
 */
const gcd = (a, b) => {
    if (b === 0) {
        return a;
    }

    return gcd(b, a % b);
};

module.exports = gcd;
