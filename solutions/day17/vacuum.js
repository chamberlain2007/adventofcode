const Computer = require('./computer');

const interleaveArray = require('../../utils/interleave-array');
const arrayToCharCodes = require('../../utils/array-to-char-codes');

/**
 * Represents the vacuum for cleaning the ship
 */
const Vacuum = class {
    /**
     * Default constructor
     */
    constructor() {
        const {readFileToArray} = require('../../utils/read-file');
        const computerInput = readFileToArray('computerinput.txt', ',');

        this.computer = new Computer(computerInput);
    }

    /**
     * Run the discovery step which discovers all of the structure
     * that the vacuum will need to subsequently clean.
     * @return {Array.<string[]>} The two dimensional array of the camera output
     */
    runDiscovery() {
        const memory = [[]];

        this.computer.stdout = (value) => {
            if (value === 10) {
                memory.push([]);
            } else {
                memory[memory.length - 1].push(String.fromCharCode(value));
            }
        };

        this.computer.run();

        return memory;
    }

    /**
     * Run the dust collection function which takes the commands
     * and functions to run in order to navigate the structure to
     * collect all the dust, and returns the amount of dust collected.
     * @param {string[]} commands The commands to run
     * @param {Array.<string[]>} functions The function definitions
     * @return {number} The amount of dust collected
     */
    runDustCollection(commands, functions) {
        this.computer.activeInstructionList[0] = 2;

        const input = [...interleaveArray(arrayToCharCodes(commands), ','.charCodeAt(0))];
        input.push('\n'.charCodeAt(0));

        functions.forEach((functionList) => {
            functionList.forEach((func, index) => {
                const [letter, ...numbers] = func.toString().split('');

                input.push(letter.charCodeAt(0));
                input.push(','.charCodeAt(0));

                numbers.map((number) => number.charCodeAt(0)).forEach((number) => {
                    input.push(number);
                });

                if (index < functionList.length - 1) {
                    input.push(','.charCodeAt(0));
                }
            });

            input.push('\n'.charCodeAt(0));
        });

        input.push('n'.charCodeAt(0));
        input.push('\n'.charCodeAt(0));

        let inputIndex = 0;

        this.computer.stdin = () => {
            const value = input[inputIndex++];
            return value;
        };

        let returnValue;

        this.computer.stdout = (value) => {
            returnValue = value;
        };

        this.computer.run();

        return returnValue;
    }
};

module.exports = Vacuum;
