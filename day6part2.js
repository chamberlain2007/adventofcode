const OrbitingObject = class {
    constructor(name, orbiting) {
        this.directOrbits = [];
        this.orbiting = orbiting;
        this.name = name;
        this.minimumDistanceCache = {};
        this.visited = false;
        this.distance = 0;
    }

    locateOrbitingObject(name) {
        if (this.name === name) {
            return this;
        }

        for (var i = 0; i < this.directOrbits.length; i++) {
            let directOrbitOrbitingObject = this.directOrbits[i];
            let locatedOrbitingObject = directOrbitOrbitingObject.locateOrbitingObject(name);

            if (locatedOrbitingObject) {
                return locatedOrbitingObject;
            }
        }
    }

    addOrbit(orbitingObject) {
        this.directOrbits.push(orbitingObject);
    }
    
    calculateMinimumDistance(name) {
        this.visited = true;

        const potentialNeighbors = this.orbiting ? [this.orbiting, ...this.directOrbits] : this.directOrbits;
        const nonVisitedNeighbors = potentialNeighbors.filter(potentialNeighbor => !potentialNeighbor.visited);

        const newDistance = this.distance + 1;

        for (let i = 0; i < nonVisitedNeighbors.length; i++) {
            let neighbor = nonVisitedNeighbors[i];
            neighbor.distance = newDistance;

            let [located, finalDistance] = neighbor.calculateMinimumDistance(name) || [];

            if (located) {
                return [true, finalDistance];
            }

            if (neighbor.name === name) {
                return [true, newDistance];
            }
        }
    }
}

const OrbitMap = class {
    constructor() {
        this.COM = new OrbitingObject('COM');
    }

    addOrbit(definition) {
        const [lhs, rhs] = definition.split(')');

        const newOrbitingObject = new OrbitingObject(rhs);

        if (lhs === 'COM') {
            newOrbitingObject.orbiting = this.COM;
            this.COM.directOrbits.push(newOrbitingObject);
            return true;
        }
        else {
            const lhsOrbitingObject = this.COM.locateOrbitingObject(lhs);
            if (lhsOrbitingObject) {
                newOrbitingObject.orbiting = lhsOrbitingObject;
                lhsOrbitingObject.addOrbit(newOrbitingObject);
                return true;
            }
            else {
                return false;
            }
        }
    }

    countOrbits() {
        return this.COM.countOrbits(-1) + 1;
    }

    calculateMinimumDistance(start, end) {
        const startOrbitingObject = this.COM.locateOrbitingObject(start);
        const [_, distance] = startOrbitingObject.calculateMinimumDistance(end);
        return distance - 2;
    }
}

const fs = require('fs');
const input = fs.readFileSync('day6input.txt', 'utf8');
const orbitMap = new OrbitMap();
let valuesToParse = [...input.split('\n').filter(x => !!x)];

while (true) {
    let valuesStillToParse = [];
    valuesToParse.forEach(val => {
        let addedSuccessfully = orbitMap.addOrbit(val);
        if (!addedSuccessfully) {
            valuesStillToParse.push(val);
        }
    });
    if (!valuesStillToParse.length || valuesStillToParse.length === valuesToParse.length) {
        break;
    }
    valuesToParse = valuesStillToParse;
}

console.log(orbitMap.calculateMinimumDistance('YOU', 'SAN'));