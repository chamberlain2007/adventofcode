const Vacuum = require('./vacuum');

const compressPath = require('./compress-path');
const groupPath = require('./group-path');
const getPotentialPatterns = require('./get-potential-patterns');
const getPatterns = require('./get-patterns');
const findPath = require('./find-path');

const discoveryVacuum = new Vacuum();

const memory = discoveryVacuum.runDiscovery();

const path = findPath(memory);

const compressedPath = compressPath(path);

const groupedPath = groupPath(compressedPath);

const potentialPatterns = getPotentialPatterns(groupedPath);

const [, foundPatterns, foundCommands] = getPatterns(potentialPatterns, groupedPath);

const dustVacuum = new Vacuum();

const dustCollected = dustVacuum.runDustCollection(foundCommands, foundPatterns);

console.log(dustCollected);
