const Robot = require('./robot');
const outputArray = require('../../utils/output-array');

const robot = new Robot();

const output = robot.run(1);

outputArray(output, (value) => value === 1 ? '\u25A0' : ' ');
