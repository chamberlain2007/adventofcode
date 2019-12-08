/**
 * Validates whether all of the digits are greater than the previous
 * @param {number} number The number to check
 * @return {boolean} True if all of the digits are valid
 */
const validateAscendingDigits = (number) => {
    let previous = -1;
    let isValid = true;

    number.toString().split('').map((x) => parseInt(x)).forEach((current) => {
        if (current < previous) {
            isValid = false;
        }
        previous = current;
    });

    return isValid;
};

/**
 * Validate whether there is at least one set of duplicate digits
 * @param {number} number The number to check
 * @return {boolean} True if there is a set of duplicate digits
 */
const validateHasAdjacentDigits = (number) => {
    let previous = -1;
    let isValid = false;

    number.toString().split('').map((x) => parseInt(x)).forEach((current) => {
        if (current === previous) {
            isValid = true;
        }
        previous = current;
    });

    return isValid;
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
const validateNumber = (number) => validateRange(number) && validateAscendingDigits(number) && validateHasAdjacentDigits(number); // eslint-disable-line max-len

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
