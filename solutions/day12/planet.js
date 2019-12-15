const Moon = require('./moon');

const generatePairs = require('../../utils/generate-pairs');

/**
 * Represents a planet with a set of moons
 */
const Planet = class {
    /**
     * Default constructor
     */
    constructor() {
        this.moons = [];
    }

    /**
     * Parse a list of definitions of moons
     * @param {string} moonDefinitions The list of definitions in the form of three numbers
     */
    addDefinitions(moonDefinitions) {
        moonDefinitions.forEach((moonDefinition) => {
            const match = moonDefinition.match(/([^-\d]*)([-\d]+)([^-\d]*)([-\d]+)([^-\d]*)([-\d]+)(.*)/);
            const x = parseInt(match[2]);
            const y = parseInt(match[4]);
            const z = parseInt(match[6]);

            this.moons.push(new Moon(x, y, z));
        });

        this.generatePairs();
    }

    /**
     * Generate all of the pairs of moons
     */
    generatePairs() {
        this.pairs = [...generatePairs(this.moons)];
    }

    /**
     * Run an individual time step
     */
    runStep() {
        this.applyGravity();
        this.applyVelocity();
    }

    /**
     * Apply the gravity to all of the moons
     */
    applyGravity() {
        this.pairs.forEach((pair) => {
            const [moon, otherMoon] = pair;

            if (moon.x < otherMoon.x) {
                moon.xVelocity++;
                otherMoon.xVelocity--;
            } else if (moon.x > otherMoon.x) {
                moon.xVelocity--;
                otherMoon.xVelocity++;
            }

            if (moon.y < otherMoon.y) {
                moon.yVelocity++;
                otherMoon.yVelocity--;
            } else if (moon.y > otherMoon.y) {
                moon.yVelocity--;
                otherMoon.yVelocity++;
            }

            if (moon.z < otherMoon.z) {
                moon.zVelocity++;
                otherMoon.zVelocity--;
            } else if (moon.z > otherMoon.z) {
                moon.zVelocity--;
                otherMoon.zVelocity++;
            }
        });
    }

    /**
     * Apply the velocity to all the moons
     */
    applyVelocity() {
        this.moons.forEach((moon) => {
            moon.x += moon.xVelocity;
            moon.y += moon.yVelocity;
            moon.z += moon.zVelocity;
        });
    }

    /**
     * Calculate the total energy of the system
     * @return {number} The total energy
     */
    calculateTotalEnergy() {
        return this.moons.reduce((totalEnergy, moon) => totalEnergy + moon.calculateEnergy(), 0);
    }
};

module.exports = Planet;
