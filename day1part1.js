/**
 * Calculate the fuel for a given mass
 * @param {number} mass The mass to calculate the fuel for
 */
const calculateFuel = mass => Math.floor(mass / 3.0) - 2;

module.exports = calculateFuel;

if (require.main === module) {
    const fs = require('fs');

    const input = fs.readFileSync('day1input.txt', 'utf8');

    const sum = input.split('\n').map((val) => parseInt(val)).filter((val) => !!val).map(calculateFuel).reduce((prev, cur) => prev + cur, 0);
    
    console.log(sum);
}