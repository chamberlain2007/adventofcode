/**
 * Get the digits of a number
 * @param {number} number The number to get the digits for
 * @return {number[]} The digits
 */
const getDigits = (number) => {
    if (number < 0) {
        return getDigits(-number);
    }
    
    if (number === 0) {
        return [0];
    }

    const digits = [];
    while (number > 0) {
        const digit = number % 10;
        digits.push(digit);
        number -= digit;
        number /= 10;
    }
    return digits.reverse();
};

module.exports = getDigits;