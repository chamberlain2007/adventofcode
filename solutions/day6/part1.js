const OrbitMap = require('./orbit-map');

const readFileToArrayRaw = require('../../utils/read-file').readFileToArrayRaw;
const valuesToParse = readFileToArrayRaw('day6input.txt', '\n');

const orbitMap = new OrbitMap();

orbitMap.addOrbits(valuesToParse);

console.log(orbitMap.countOrbits());
