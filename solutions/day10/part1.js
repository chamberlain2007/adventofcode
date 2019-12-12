const AsteroidMap = require('./asteroid-map');

const {readFile} = require('../../utils/read-file');
const input = readFile('day10input.txt', ',');

const testAsteroidMap = new AsteroidMap();
testAsteroidMap.parseMap(input);
testAsteroidMap.calculateVisibleCount();

const bestAsteroid = testAsteroidMap.asteroids.sort((a, b) => b.visibleCount - a.visibleCount)[0];
console.log(bestAsteroid);
