const fs = require('fs');
const path = require('path');
const OrbitMap = require('./orbit-map');

const input = fs.readFileSync(path.join(__dirname, '/day6input.txt'), 'utf8');

const orbitMap = new OrbitMap();

const valuesToParse = [...input.split('\n').filter((x) => !!x)];

orbitMap.addOrbits(valuesToParse);

console.log(orbitMap.countOrbits());
