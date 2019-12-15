const Planet = require('./planet');

const jupiter = new Planet();

const {readFileToArrayRaw} = require('../../utils/read-file');
const moonDefinitions = readFileToArrayRaw('day12input.txt', '\n');

jupiter.addDefinitions(moonDefinitions);

for (let i = 1; i <= 1000; i++) {
    jupiter.runStep();
}

console.log(jupiter.calculateTotalEnergy());
