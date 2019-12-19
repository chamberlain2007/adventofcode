const Vacuum = require('./vacuum');

const isIntersection = require('./is-intersection');
const getValidPositions = require('./get-valid-positions');
const getPathAndDirection = require('./get-path-and-direction');
const compressPath = require('./compress-path');
const groupPath = require('./group-path');
const getPotentialPatterns = require('./get-potential-patterns');
const getPatterns = require('./get-patterns');

const {RIGHT} = require('./constants');

const discoveryVacuum = new Vacuum();

const memory = discoveryVacuum.runDiscovery();

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

const potentialPatterns = getPotentialPatterns(groupedPath);

const [, foundPatterns, foundCommands] = getPatterns(potentialPatterns, groupedPath);

const dustVacuum = new Vacuum();

const dustCollected = dustVacuum.runDustCollection(foundCommands, foundPatterns);

console.log(dustCollected);