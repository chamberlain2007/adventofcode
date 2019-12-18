const Vacuum = require('./vacuum');

require('colors');

const isIntersection = require('./is-intersection');
const getValidPositions = require('./get-valid-positions');
const getPathAndDirection = require('./get-path-and-direction');
const compressPath = require('./compress-path');
const groupPath = require('./group-path');
const attemptPatternMatch = require('./attempt-pattern-match');

const {RIGHT} = require('./constants');

const vacuum = new Vacuum();

const memory = vacuum.runDiscovery();

const [[ , startRowIndex, startColumnIndex ]] = memory.flatMap((row, rowIndex) => row.map((value, columnIndex) => [value, rowIndex, columnIndex]).filter((x) => x[0] === '^' || x[0] === 'V' || x[0] === '<' || x[0] === '>'));

let seen = new Set();

let currentRowIndex = startRowIndex;
let currentColumnIndex = startColumnIndex;
let previousRowIndex = startRowIndex;
let previousColumnIndex = startColumnIndex;

let path = ['R'];

let currentDirection = RIGHT;

while (true) {
    let rowDiff, columnDiff;

    if (isIntersection(memory, currentRowIndex, currentColumnIndex)) {
        if (previousRowIndex === currentRowIndex) {
            if (previousColumnIndex < currentColumnIndex) {
                columnDiff = 1;
            }
            else {
                columnDiff = -1;
            }

            rowDiff = 0;
        }
        else {
            if (previousRowIndex < currentRowIndex) {
                rowDiff = 1;
            }
            else {
                rowDiff = -1;
            }

            columnDiff = 0;
        }
    }
    else {
        let validPositions = getValidPositions(memory, currentRowIndex, currentColumnIndex);
        let found = false;
        for (let i = 0; i < validPositions.length; i++) {
            const [tempRowDiff, tempColumnDiff] = validPositions[i];
            const whatWouldRowBe = currentRowIndex + tempRowDiff;
            const whatWouldColumnBe = currentColumnIndex + tempColumnDiff;

            if (!seen.has(whatWouldRowBe + ',' + whatWouldColumnBe)) {
                rowDiff = tempRowDiff;
                columnDiff = tempColumnDiff;
                found = true;
                break;
            }
        }
        if (!found) {
            validPositions = getValidPositions(memory, currentRowIndex, currentColumnIndex);
            for (let i = 0; i < validPositions.length; i++) {
                const [tempRowDiff, tempColumnDiff] = validPositions[i];
                const whatWouldRowBe = currentRowIndex + tempRowDiff;
                const whatWouldColumnBe = currentColumnIndex + tempColumnDiff;
    
                if (isIntersection(memory, whatWouldRowBe, whatWouldColumnBe)) {
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

    const newRowIndex = currentRowIndex + rowDiff;
    const newColumnIndex = currentColumnIndex + columnDiff;

    previousRowIndex = currentRowIndex;
    previousColumnIndex = currentColumnIndex;

    currentRowIndex = newRowIndex;
    currentColumnIndex = newColumnIndex;

    seen.add(currentRowIndex + ',' + currentColumnIndex);
}

const compressedPath = compressPath(path);

const groupedPath = groupPath(compressedPath);

// TODO: Figure out how to get these values. Suffix tree?
const pattern1 = ['R8', 'L12', 'R8'];
const pattern2 = ['L10', 'L10', 'R8'];
const pattern3 = ['L12', 'L12', 'L10', 'R10'];

const patterns = [pattern1, pattern2, pattern3];

const [matched, result] = attemptPatternMatch(patterns, groupedPath);

if (!matched) {
    console.log('Pattern match failed');
    return;
}

const dustVacuum = new Vacuum();

const dustCollected = dustVacuum.runDustCollection(result, patterns);

console.log(dustCollected);