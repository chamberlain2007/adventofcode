const isIntersection = require('./is-intersection');
const getValidPositions = require('./get-valid-positions');
const getPathAndDirection = require('./get-path-and-direction');

const {LEFT, RIGHT, UP, DOWN} = require('./constants');

const ARROWS = {
    '<': LEFT,
    '>': RIGHT,
    '^': UP,
    'v': DOWN,
};

/**
 * Find the path the vacuum should follow
 * @param {Array.<string[]>} memory The vacuum memory
 * @return {string[]} The path
 */
const findPath = (memory) => {
    const [[, startRowIndex, startColumnIndex]] = memory.flatMap((row, rowIndex) => row.map((value, columnIndex) => [value, rowIndex, columnIndex]).filter(((value) => value[0] in ARROWS)));

    const seen = new Set();

    let currentRowIndex = startRowIndex;
    let currentColumnIndex = startColumnIndex;
    let previousRowIndex = startRowIndex;
    let previousColumnIndex = startColumnIndex;

    const validPositions = getValidPositions(memory, currentRowIndex, currentColumnIndex);
    let [path, currentDirection] = getPathAndDirection(validPositions[0][1], validPositions[0][0], ARROWS[memory[startRowIndex][startColumnIndex]]);

    while (true) {
        let rowDiff;
        let columnDiff;

        if (isIntersection(memory, currentRowIndex, currentColumnIndex)) {
            if (previousRowIndex === currentRowIndex) {
                columnDiff = previousColumnIndex < currentColumnIndex ? 1 : -1;
                rowDiff = 0;
            } else {
                rowDiff = previousRowIndex < currentRowIndex ? 1 : -1;
                columnDiff = 0;
            }
        } else {
            const validPositions = getValidPositions(memory, currentRowIndex, currentColumnIndex);
            let found = false;

            for (let i = 0; i < validPositions.length; i++) {
                const [tempRowDiff, tempColumnDiff] = validPositions[i];
                const newRowIndex = currentRowIndex + tempRowDiff;
                const newColumnIndex = currentColumnIndex + tempColumnDiff;

                if (!seen.has(newRowIndex + ',' + newColumnIndex)) {
                    rowDiff = tempRowDiff;
                    columnDiff = tempColumnDiff;
                    found = true;
                    break;
                }
            }

            if (!found) {
                for (let i = 0; i < validPositions.length; i++) {
                    const [tempRowDiff, tempColumnDiff] = validPositions[i];
                    const newRowIndex = currentRowIndex + tempRowDiff;
                    const newColumnIndex = currentColumnIndex + tempColumnDiff;

                    if (isIntersection(memory, newRowIndex, newColumnIndex)) {
                        rowDiff = tempRowDiff;
                        columnDiff = tempColumnDiff;
                        found = true;
                        break;
                    }
                }

                if (!found) {
                    break;
                }
            }
        }

        const [pathsToAdd, newDirection] = getPathAndDirection(columnDiff, rowDiff, currentDirection);

        path = path.concat(pathsToAdd);
        currentDirection = newDirection;

        path.push(1);

        previousRowIndex = currentRowIndex;
        previousColumnIndex = currentColumnIndex;

        currentRowIndex += rowDiff;
        currentColumnIndex += columnDiff;

        seen.add(currentRowIndex + ',' + currentColumnIndex);
    }

    return path;
};

module.exports = findPath;
