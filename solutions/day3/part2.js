/**
 * Parse a definition to a direction and distance
 * @param {string} definition The definition to parse
 * @return {(string|number)} The direction and distance from the definition
 */
const parseDefinition = (definition) => {
    const direction = definition[0];
    const distance = parseInt(definition.substr(1));
    return [direction, distance];
};

/**
 * Parse the defition for a line and add its points the list
 * @param {Set<number>} points The current list of points
 * @param {string} definition The definition for the line
 * @param {number} x The X position
 * @param {number} y The Y position
 * @return {number[]} The new ending X,Y position
 */
const addLinePoints = (points, definition, x, y) => {
    const [direction, distance] = parseDefinition(definition);

    let xModifier;
    let yModifier;

    switch (direction) {
        case 'L':
            xModifier = (x) => x - 1;
            yModifier = (y) => y;
            break;
        case 'R':
            xModifier = (x) => x + 1;
            yModifier = (y) => y;
            break;
        case 'U':
            xModifier = (x) => x;
            yModifier = (y) => y + 1;
            break;
        case 'D':
            xModifier = (x) => x;
            yModifier = (y) => y - 1;
            break;
    }
    for (let i = 0; i < distance; i++) {
        x = xModifier(x);
        y = yModifier(y);
        points.add(x+','+y);
    }

    return [x, y];
};

/**
 * Parse a list of line definitions for a wire
 * @param {string[]} definitions The list of line definitions
 * @return {Set<number>} The points in the line
 */
const parseWire = (definitions) => {
    let x = 0;
    let y = 0;
    const points = new Set();

    definitions.split(',').forEach((definition) => {
        [x, y] = addLinePoints(points, definition, x, y);
    });

    return points;
};

/**
 * Find the distance to a given point on a wire
 * @param {string} definitions The definition of the wire
 * @param {number} targetX The target X position
 * @param {number} targetY The target Y position
 * @return {number} The distance
 */
const findDistanceToPoint = (definitions, targetX, targetY) => {
    let x = 0;
    let y = 0;
    const points = new Set();

    let distance = 0;

    const targetPoint = targetX+','+targetY;

    definitions.split(',').some((definition) => {
        const previousX = x;
        const previousY = y;

        [x, y] = addLinePoints(points, definition, x, y);

        if (points.has(targetPoint)) {
            if (previousX != targetX) {
                distance += Math.abs(previousX - targetX);
            } else {
                distance += Math.abs(previousY - targetY);
            }

            return true;
        } else {
            const [, lineDistance] = parseDefinition(definition);
            distance += lineDistance;
            return false;
        }
    });

    return distance;
};

/**
 * Calculate the minimum number of steps to the intersection between the
 * two wires
 * @param {string} wire1Definition The definition of the first wire
 * @param {string} wire2Definition The definition of the second wire
 * @return {number} The minimum number of steps to the intersection
 */
const calculateMinmumNumberOfSteps = (wire1Definition, wire2Definition) => {
    const wire1Points = parseWire(wire1Definition);
    const wire2Points = parseWire(wire2Definition);

    const intersections = Array
        .from(wire1Points)
        .filter((value) => wire2Points.has(value));

    const closestDistance = intersections.map((intersection) => {
        const [x, y] = intersection.split(',');
        const distance1 = findDistanceToPoint(wire1Definition, x, y);
        const distance2 = findDistanceToPoint(wire2Definition, x, y);

        return distance1 + distance2;
    }).sort((x, y) => x - y)[0];

    return closestDistance;
};

module.exports = calculateMinmumNumberOfSteps;

if (require.main === module) {
    const fs = require('fs');
    const path = require('path');

    const input = fs.readFileSync(path.join(__dirname, '/day3input.txt'), 'utf8');

    const [wire1, wire2] = input.split('\n');

    const minmumNumberOfSteps = calculateMinmumNumberOfSteps(wire1, wire2);

    console.log(minmumNumberOfSteps);
}
