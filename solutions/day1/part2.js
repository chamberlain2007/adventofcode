/**
 * Calculate the fuel for a given fuel quantity
 * @param {number} fuel The amount of fuel to calculate the fuel for
 * @return {number} The fuel needed for the fuel
 */
const calculateFuelFuel = (fuel) => Math.floor(fuel / 3.0) - 2;

/**
 * Calculate the fuel for a given mass
 * @param {number} mass The mass to calculate the fuel for
 * @return {number} The fuel needed for the mass
 */
const calculateFuel = (mass) => {
    const massFuel = Math.floor(mass / 3.0) - 2;
    let currentFuel = massFuel;
    let currentFuelFuel = calculateFuelFuel(massFuel);
    while (currentFuelFuel > 0) {
        currentFuel += currentFuelFuel;
        currentFuelFuel = calculateFuelFuel(currentFuelFuel);
    }
    return currentFuel;
};

module.exports = calculateFuel;

if (require.main === module) {
    const {readFileToArray} = require('../../utils/read-file');
    const input = readFileToArray('day1input.txt', '\n');

    const sum = input
        .map(calculateFuel)
        .reduce((prev, cur) => prev + cur, 0);

    console.log(sum);
}
