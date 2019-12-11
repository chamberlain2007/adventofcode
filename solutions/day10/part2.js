const AsteroidMap = require('./asteroid-map');

const readFile = require('../../utils/read-file').readFile;
const input = readFile('day10input.txt', ',');

const testAsteroidMap = new AsteroidMap();
testAsteroidMap.parseMap(input);

testAsteroidMap.setStation(31, 20);
const vaporizedAsteroids = testAsteroidMap.vaporizeAll();
const twoHundredth = vaporizedAsteroids[199];

console.log(twoHundredth.x * 100 + twoHundredth.y);
