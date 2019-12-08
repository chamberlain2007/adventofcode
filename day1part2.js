/**
 * Calculate the fuel for a given fuel quantity
 * @param {number} fuel The amount of fuel to calculate the fuel for
 */
const calculateFuelFuel = fuel => Math.floor(fuel / 3.0) - 2;

/**
 * Calculate the fuel for a given mass
 * @param {number} mass The mass to calculate the fuel for
 */
const calculateFuel = mass => {
    const massFuel = Math.floor(mass / 3.0) - 2;
    let currentFuel = massFuel;
    let currentFuelFuel = calculateFuelFuel(massFuel);
    while(currentFuelFuel > 0) {
        currentFuel += currentFuelFuel;
        currentFuelFuel = calculateFuelFuel(currentFuelFuel);
    }
    return currentFuel;
};

module.exports = calculateFuel;

if (require.main === module) {
    const fs = require('fs');

    const input = fs.readFileSync('day1input.txt', 'utf8');

    const sum = input.split('\n').map((val) => parseInt(val)).filter((val) => !!val).map(calculateFuel).reduce((prev, cur) => prev + cur, 0);
    
    console.log(sum);
}