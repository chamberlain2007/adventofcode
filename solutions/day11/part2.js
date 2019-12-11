const Robot = require('./robot');

const robot = new Robot();

const output = robot.run(1);

for (let i = 0; i < output.length; i++) {
    const row = output[i];
    for (let j = 0; j < row.length; j++) {
        const value = row[j];
        process.stdout.write(value === 1 ? '\u25A0' : ' ');
    }
    process.stdout.write('\n');
}
