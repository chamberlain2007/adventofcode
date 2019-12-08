const OrbitingObject = require('./orbiting-object');

/**
 * Represents a map of orbiting objects
 */
const OrbitMap = class {
    /**
     * Default constructor
     */
    constructor() {
        this.COM = new OrbitingObject('COM');
    }

    /**
     * Add a new orbit to the map
     * @param {string} definition A definition of an object to orbit
     * and an orbiting object
     * @return {boolean} Whether the orbit was added succesfully
     */
    addOrbit(definition) {
        const [lhs, rhs] = definition.split(')');

        const newOrbitingObject = new OrbitingObject(rhs);

        if (lhs === 'COM') {
            newOrbitingObject.orbiting = this.COM;
            this.COM.directOrbits.push(newOrbitingObject);
            return true;
        } else {
            const lhsOrbitingObject = this.COM.locateOrbitingObject(lhs);
            if (lhsOrbitingObject) {
                newOrbitingObject.orbiting = lhsOrbitingObject;
                lhsOrbitingObject.addOrbit(newOrbitingObject);
                return true;
            } else {
                return false;
            }
        }
    }

    /**
     * Add multiple new orbit to the map
     * @param {string[]} orbits A list of definition of orbits
     * to add to the map
     */
    addOrbits(orbits) {
        let valuesToParse = [...orbits];
        while (true) {
            const valuesStillToParse = [];
            valuesToParse.forEach((val) => {
                const addedSuccessfully = this.addOrbit(val);
                if (!addedSuccessfully) {
                    valuesStillToParse.push(val);
                }
            });
            if (!valuesStillToParse.length) {
                break;
            }
            if (valuesStillToParse.length === valuesToParse.length) {
                break;
            }
            valuesToParse = valuesStillToParse;
        }
    }

    /**
     * Count the number of orbits in the map
     * @return {number} The number of orbits
     */
    countOrbits() {
        return this.COM.countOrbits(-1) + 1;
    }

    /**
     * Calculate the minimum distance between two objects using
     * Dijkstra's Algorithm
     * @param {string} start The name of the start object
     * @param {string} end The name of the end object
     * @return {number} The minimum distance
     */
    calculateMinimumDistance(start, end) {
        const startOrbitingObject = this.COM.locateOrbitingObject(start);
        const [, distance] = startOrbitingObject.calculateMinimumDistance(end);
        return distance - 2;
    }
};

module.exports = OrbitMap;
