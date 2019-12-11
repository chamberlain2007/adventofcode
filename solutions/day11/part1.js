const Robot = require('./robot');

const robot = new Robot();

const output = robot.run();

const paintedCellCount = output.reduce((count, row) => {
    return count + row.reduce((rowCount, val) => rowCount + (val != 2), 0);
}, 0);

console.log(paintedCellCount);
