const getDigits = require('../../utils/get-digits');

/**
 * Validates whether all of the digits are greater than the previous
 * @param {digits} digits The digits to check
 * @return {boolean} True if all of the digits are valid
 */
const validateAscendingDigits = (digits) => {
    let previous = -1;
    let isValid = true;

    digits.forEach((current) => {
        if (current < previous) {
            isValid = false;
        }
        previous = current;
    });

    return isValid;
};

/**
 * Validate whether there is at least one set of duplicate digits
 * @param {digits} digits The digits to check
 * @return {boolean} True if there is a set of duplicate digits
 */
const validateHasAdjacentDigits = (digits) => {
    let previous = -1;
    const chunks = [];
    let activeChunk = [];

    digits.forEach((current) => {
        if (previous === -1 || current === previous) {
            activeChunk.push(current);
        } else {
            chunks.push(activeChunk);
            activeChunk = [current];
        }
        previous = current;
    });

    chunks.push(activeChunk);

    return chunks.some((x) => x.length === 2);
};

/**
 * Validates that the number is 6 digits long
 * @param {number} number The number to validate
 * @return {boolean} True if the number is 6 digits long
 */
const validateRange = (number) => number >= 100000 && number <= 999999;

/**
 * Validates a number
 * @param {number} number The number to validate
 * @return {boolean} True if the number is valid
 */
const validateNumber = (number) => {
    if (!validateRange(number)) {
        return false;
    }
    const digits = getDigits(number);
    return validateAscendingDigits(digits) && validateHasAdjacentDigits(digits);
};

module.exports = validateNumber;

if (require.main === module) {
    const min = 156218;
    const max = 652527;

    const validCount = [...Array(max-min).keys()]
        .map((val) => val + min)
        .reduce((cur, val) => {
            return cur + validateNumber(val);
        }, 0);

    console.log(validCount);
}
