const readlineSync = require('readline-sync');

const Computer = require('./computer');

const readFileToArray = require('../../utils/read-file').readFileToArray;
const input = readFileToArray('day9input.txt', ',');

const testComputer = new Computer(
    () => readlineSync.questionInt('Enter a number: '),
    (val) => console.log(val),
    input,
);

testComputer.run();
