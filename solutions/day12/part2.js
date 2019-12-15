const Planet = require('./planet');
const lcm = require('../../utils/lcm');

const jupiter = new Planet();

const {readFileToArrayRaw} = require('../../utils/read-file');
const moonDefinitions = readFileToArrayRaw('day12input.txt', '\n');

jupiter.addDefinitions(moonDefinitions);

const seenX = new Set();
const seenY = new Set();
const seenZ = new Set();

let steps = 0;

let minX;
let minY;
let minZ;

while (!minX || !minY || !minZ) {
    jupiter.runStep();

    if (!minX) {
        const xKey = jupiter.moons.map((moon) => moon.x + ':' + moon.xVelocity).join(',');

        if (seenX.has(xKey)) {
            minX = steps;
        }

        seenX.add(xKey);
    }

    if (!minY) {
        const yKey = jupiter.moons.map((moon) => moon.y + ':' + moon.yVelocity).join(',');

        if (seenY.has(yKey)) {
            minY = steps;
        }

        seenY.add(yKey);
    }

    if (!minZ) {
        const zKey = jupiter.moons.map((moon) => moon.z + ':' + moon.zVelocity).join(',');

        if (seenZ.has(zKey)) {
            minZ = steps;
        }

        seenZ.add(zKey);
    }

    steps++;
}

console.log(lcm(minX, minY, minZ));
