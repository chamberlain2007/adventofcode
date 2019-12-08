const parseArray = require('./day2part1');

if (require.main === module) {
    const fs = require('fs');
    const path = require('path');

    const input = fs.readFileSync(path.join(__dirname, '/day2input.txt'), 'utf8');

    const testArray = [...input
        .split(',')
        .map((val) => parseInt(val))
        .filter((val) => !isNaN(val))];

    const maxAttempt = 100;
    const targetValue = 19690720;

    for (let i = 1; i < maxAttempt; i++) {
        for (let j = 1; j < maxAttempt; j++) {
            const testArrayClone = [...testArray];
            testArrayClone[1] = i;
            testArrayClone[2] = j;
            const resultArray = parseArray(testArrayClone);
            const result = resultArray[0];

            if (result === targetValue) {
                console.log(100 * i + j);
                return;
            }
        }
    }
}
