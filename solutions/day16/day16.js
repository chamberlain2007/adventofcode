const {readFileToArray} = require('../../utils/read-file');

let current = readFileToArray('day16input.txt', '');

let isFirst = true;

const ITERATIONS = 100;
const INPUT_REPETITIONS = 1;

const BASE = [0, 1, 0, -1];
const BASE_LENGTH = BASE.length;

for (let j = 0; j < ITERATIONS; j++) {
    const results = [];
    for (let i = 0; i < current.length; i++) {
        const lengthOfOneIteration = BASE_LENGTH * (i + 1);
        for (let k = 0; k < (isFirst ? INPUT_REPETITIONS : 1); k++) {
            let sum = 0;
            for (let currentIndex = 0; currentIndex < current.length; currentIndex++) {
                const indexInBase = Math.floor((currentIndex + 1) * BASE_LENGTH / lengthOfOneIteration) % BASE_LENGTH;

                sum += BASE[indexInBase] * current[currentIndex];
            }
            const output = Math.abs(sum) % 10;
            results.push(output);
        }
    }
    current = results;
    isFirst = false;
}

console.log(current.slice(0, 8).join(''));
