const AsteroidMap = require('./asteroid-map');

const readFile = require('../../utils/read-file').readFile;
const input = readFile('day10input.txt', ',');

const testAsteroidMap = new AsteroidMap();
testAsteroidMap.parseMap(input);

testAsteroidMap.setStation(31, 20);
console.log(testAsteroidMap.vaporizeAll()[199]);
