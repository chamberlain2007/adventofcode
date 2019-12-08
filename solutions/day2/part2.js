const parseArray = require('./part1');

if (require.main === module) {
    const readFileToArray = require('../../utils/read-file').readFileToArray;
    const testArray = readFileToArray('day2input.txt', ',');

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
