const Computer = require('./computer');

const {readFileToArray} = require('../../utils/read-file');
const input = readFileToArray('day9input.txt', ',');

const testComputer = new Computer(input);

testComputer.run();
