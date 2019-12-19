const Vacuum = require('./vacuum');

const vacuum = new Vacuum();

const memory = vacuum.runDiscovery();

const intersections = [];

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

        if (isIntersection) {
            intersections.push([rowIndex, columnIndex]);

            process.stdout.write('O');
        } else {
            process.stdout.write(value);
        }
    }

    process.stdout.write('\n');
}

const sum = intersections.reduce((sum, intersection) => {
    return sum + intersection[0] * intersection[1];
}, 0);

console.log(sum);
