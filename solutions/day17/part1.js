const Vacuum = require('./vacuum');

const isIntersection = require('./is-intersection');

const vacuum = new Vacuum();

const memory = vacuum.runDiscovery();

const intersections = [];

for (let rowIndex = 0; rowIndex < memory.length; rowIndex++) {
    const row = memory[rowIndex];

    for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
        const value = row[columnIndex];

        if (isIntersection(memory, rowIndex, columnIndex)) {
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
