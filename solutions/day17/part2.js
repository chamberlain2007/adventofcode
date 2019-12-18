const Vacuum = require('./vacuum');

const isIntersection = (memory, rowIndex, columnIndex) => {
    return rowIndex > 0 && 
        rowIndex < memory.length - 1 && 
        columnIndex > 0 && 
        columnIndex < memory[rowIndex].length - 1 &&
        memory[rowIndex][columnIndex] === '#' &&
        memory[rowIndex][columnIndex - 1] === '#' &&
        memory[rowIndex][columnIndex + 1] === '#' &&
        memory[rowIndex - 1][columnIndex] === '#' &&
        memory[rowIndex + 1][columnIndex] === '#';
};

const validPositions = (memory, rowIndex, columnIndex) => {
    const validPositions = [];
    if (rowIndex > 0 && memory[rowIndex - 1][columnIndex] === '#') {
        validPositions.push([rowIndex - 1, columnIndex]);
    }
    if (rowIndex < memory.length - 1 && memory[rowIndex + 1][columnIndex] === '#') {
        validPositions.push([rowIndex + 1, columnIndex]);
    }
    if (columnIndex > 0 && memory[rowIndex][columnIndex - 1] === '#') {
        validPositions.push([rowIndex, columnIndex - 1]);
    }
    if (columnIndex < memory[rowIndex].length - 1 && memory[rowIndex][columnIndex + 1] === '#') {
        validPositions.push([rowIndex, columnIndex + 1]);
    }
    return validPositions;
};

const validPositions2 = (memory, rowIndex, columnIndex) => {
    const validPositions = [];
    if (rowIndex > 0 && memory[rowIndex - 1][columnIndex] === '#') {
        validPositions.push([-1, 0]);
    }
    if (rowIndex < memory.length - 1 && memory[rowIndex + 1][columnIndex] === '#') {
        validPositions.push([1, 0]);
    }
    if (columnIndex > 0 && memory[rowIndex][columnIndex - 1] === '#') {
        validPositions.push([0, -1]);
    }
    if (columnIndex < memory[rowIndex].length - 1 && memory[rowIndex][columnIndex + 1] === '#') {
        validPositions.push([0, 1]);
    }
    return validPositions;
};

const vacuum = new Vacuum();

const memory = vacuum.runDiscovery();

const [[ , startRowIndex, startColumnIndex ]] = memory.flatMap((row, rowIndex) => row.map((value, columnIndex) => [value, rowIndex, columnIndex]).filter((x) => x[0] === '^' || x[0] === 'V' || x[0] === '<' || x[0] === '>'));

let seen = new Set();

let currentRowIndex = startRowIndex;
let currentColumnIndex = startColumnIndex;
let previousRowIndex = startRowIndex;
let previousColumnIndex = startColumnIndex;

const path = ['R'];
const UP = 0;
const RIGHT = 1;
const DOWN = 2;
const LEFT = 3;

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
        let validPositions = validPositions2(memory, currentRowIndex, currentColumnIndex);
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
            validPositions = validPositions2(memory, currentRowIndex, currentColumnIndex);
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


    if (columnDiff === 1) {
        if (currentDirection === LEFT) {
            path.push('R');
            path.push('R');
        }
        else if (currentDirection === UP) {
            path.push('R');
        }
        else if (currentDirection === DOWN) {
            path.push('L');
        }

        currentDirection = RIGHT;
    }
    else if (columnDiff === -1) {
        if (currentDirection === RIGHT) {
            path.push('L');
            path.push('L');
        }
        else if (currentDirection === UP) {
            path.push('L');
        }
        else if (currentDirection === DOWN) {
            path.push('R');
        }

        currentDirection = LEFT;
    }
    else if (rowDiff === 1) {
        if (currentDirection === UP) {
            path.push('R');
            path.push('R');
        }
        else if (currentDirection === RIGHT) {
            path.push('R');
        }
        else if (currentDirection === LEFT) {
            path.push('L');
        }

        currentDirection = DOWN;
    }
    else if (rowDiff === -1) {
        if (currentDirection === DOWN) {
            path.push('L');
            path.push('L');
        }
        else if (currentDirection === LEFT) {
            path.push('R');
        }
        else if (currentDirection === RIGHT) {
            path.push('L');
        }
        
        currentDirection = UP;
    }

    path.push(1);

    const newRowIndex = currentRowIndex + rowDiff;
    const newColumnIndex = currentColumnIndex + columnDiff;

    previousRowIndex = currentRowIndex;
    previousColumnIndex = currentColumnIndex;

    currentRowIndex = newRowIndex;
    currentColumnIndex = newColumnIndex;

    seen.add(currentRowIndex + ',' + currentColumnIndex);
}

require('colors');

for (let rowIndex = 0; rowIndex < memory.length; rowIndex++) {
    const row = memory[rowIndex];

    for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
        const value = row[columnIndex];

        const isIntersection = 
            rowIndex > 0 && 
            rowIndex < memory.length - 1 && 
            columnIndex > 0 && 
            columnIndex < row.length - 1 &&
            value === '#' &&
            row[columnIndex - 1] === '#' &&
            row[columnIndex + 1] === '#' &&
            memory[rowIndex - 1][columnIndex] === '#' &&
            memory[rowIndex + 1][columnIndex] === '#';

        let displayValue = isIntersection ? 'O' : value.toString();

        if (seen.has(rowIndex + ',' + columnIndex)) {
            process.stdout.write(displayValue.red);
        }
        else {
            process.stdout.write(displayValue);
        }
    }

    process.stdout.write('\n');
}

const finalPath = [];
let stepCount = 0;

for (let i = 0; i < path.length; i++) {
    const current = path[i];
    if (Number.isInteger(current)) {
        stepCount++;
    }
    else {
        if (stepCount > 0) {
            finalPath.push(stepCount);
            stepCount = 0;
        }
        finalPath.push(current);
    }
}

finalPath.push(stepCount);

console.log(finalPath);

const groupedPath = [];
for (let i = 0; i < finalPath.length; i += 2) {
    groupedPath[i / 2] = finalPath[i] + finalPath[i+1];
}

const mappings = {};

let p = 0;

for (let i = 0; i < groupedPath.length; i++) {
    const pathItem = groupedPath[i];
    if (!(pathItem in mappings)) {
        let newVal = String.fromCharCode(p + 87);
        mappings[pathItem] = newVal;
        p++;
    }
}

const pattern1 = ['R8', 'L12', 'R8'];
const pattern2 = ['L10', 'L10', 'R8'];
const pattern3 = ['L12', 'L12', 'L10', 'R10'];

const patterns = [pattern1, pattern2, pattern3];

const arrayStartsWith = (array1, array2) => {
    for (let i = 0; i < array2.length; i++) {
        if (array1[i] !== array2[i]) {
            return false;
        }
    }
    return true;
}

const result = [];
let current = groupedPath;
let i = 0;
while (current.length && i <= 10) {
    console.log(current);

    for (let i = 0; i < patterns.length; i++) {
        const pattern = patterns[i];
        if (arrayStartsWith(current, pattern)) {
            result.push(String.fromCharCode(65 + i));
            current = current.slice(pattern.length, current.length);
            console.log(current);
        }
    }

    i++;
}

console.log(result);

const finalVacuum = new Vacuum();

const dustCollected = finalVacuum.runDustCollection(result, patterns);

console.log(dustCollected);