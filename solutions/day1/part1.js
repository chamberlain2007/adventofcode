/**
 * Calculate the fuel for a given mass
 * @param {number} mass The mass to calculate the fuel for
 * @return {number} The fuel needed for the mass
 */
const calculateFuel = (mass) => Math.floor(mass / 3.0) - 2;

module.exports = calculateFuel;

if (require.main === module) {
    const readFileToArray = require('../../utils/read-file').readFileToArray;
    const input = readFileToArray('day1input.txt', '\n');

    const sum = input
        .map(calculateFuel)
        .reduce((prev, cur) => prev + cur, 0);

    console.log(sum);
}
