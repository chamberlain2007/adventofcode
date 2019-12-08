/**
 * Representing an orbiting object
 * @param {string} name The name of the orbiting object
 * @param {OrbitingObject} orbiting The object that it is orbiting
 */
const OrbitingObject = class {
    /**
     * Default constructor
     * @param {string} name The name of the orbiting object
     * @param {OrbitingObject} orbiting The object that it is orbiting
     */
    constructor(name, orbiting) {
        this.directOrbits = [];
        this.orbiting = orbiting;
        this.name = name;
        this.minimumDistanceCache = {};
        this.visited = false;
        this.distance = 0;
    }

    /**
     * Locate an orbiting object by name
     * @param {string} name The name of the orbiting object to locate
     * @return {OrbitingObject} The located orbiting object, if found
     */
    locateOrbitingObject(name) {
        if (this.name === name) {
            return this;
        }

        for (let i = 0; i < this.directOrbits.length; i++) {
            const directOrbitingObject = this.directOrbits[i];
            const located = directOrbitingObject.locateOrbitingObject(name);

            if (located) {
                return located;
            }
        }
    }

    /**
     * Add an orbiting object
     * @param {OrbitingObject} orbitingObject An orbiting object
     */
    addOrbit(orbitingObject) {
        this.directOrbits.push(orbitingObject);
    }

    /**
     * Count the number of orbits under this orbiting object
     * @param {number} recursionDepth The current recursion depth
     * @return {number} The number of orbits
     */
    countOrbits(recursionDepth) {
        const directOrbitCount = this.directOrbits.length;
        const descendentOrbitCount = this.directOrbits
            .reduce((c, item) => c + item.countOrbits(recursionDepth + 1), 0);
        return directOrbitCount + descendentOrbitCount + recursionDepth;
    }

    /**
     * Calculate the minimum distance to an object by name using
     * Dijkstra's Algorithm
     * @param {string} name The name of the other object
     * @return {number} The minimum distance
     */
    calculateMinimumDistance(name) {
        this.visited = true;

        const potentialNeighbors = this.orbiting ?
            [this.orbiting, ...this.directOrbits] :
            this.directOrbits;

        const nonVisitedNeighbors = potentialNeighbors
            .filter((potentialNeighbor) => !potentialNeighbor.visited);

        const newDistance = this.distance + 1;

        for (let i = 0; i < nonVisitedNeighbors.length; i++) {
            const neighbor = nonVisitedNeighbors[i];
            neighbor.distance = newDistance;

            const [located, finalDistance] = neighbor.calculateMinimumDistance(name) || []; // eslint-disable-line max-len

            if (located) {
                return [true, finalDistance];
            }

            if (neighbor.name === name) {
                return [true, newDistance];
            }
        }
    }
};

module.exports = OrbitingObject;
