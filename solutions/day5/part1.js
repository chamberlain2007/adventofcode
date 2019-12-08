const readlineSync = require('readline-sync');

/**
 * Handle an operation at a given index
 * @param {number[]} array The memory array
 * @param {number} index The operation index
 * @param {number} immediateModeSettings The immediate mode settings
 * @param {function(...number): number} operation The operation to execute
 */
const handleOperation = (array, index, immediateModeSettings, operation) => {
    const parameterCount = operation.length;
    const parameters = [];
    for (let i = 0; i < parameterCount; i++) {
        let operand = 0;

        const immediateMode = i < immediateModeSettings.length ?
            immediateModeSettings[i] :
            false;

        if (immediateMode) {
            operand = array[index+i+1];
        } else {
            const location = array[index+i+1];
            operand = array[location];
        }
        parameters.push(operand);
    }
    const result = operation(...parameters);
    if (result === undefined) {
        return;
    }
    const resultIndex = array[index+parameterCount+1];
    array[resultIndex] = result;
};

/**
 * Generate the add function
 * @param {number[]} array The array of instructions
 * @param {number} index The index to add
 * @param {number[]} immediateModeSettings The immediate mode settings
 * @return {function(number,number): number} The add function
 */
const add = (array, index, immediateModeSettings) => handleOperation(array, index, immediateModeSettings, (operand1, operand2) => operand1 + operand2);

/**
 * Generate the multiply function
 * @param {number[]} array The array of instructions
 * @param {number} index The index to multiply
 * @param {number[]} immediateModeSettings The immediate mode settings
 * @return {function(number,number): number} The multiply function
 */
const multiply = (array, index, immediateModeSettings) => handleOperation(array, index, immediateModeSettings, (operand1, operand2) => operand1 * operand2);

/**
 * Generate the read function
 * @param {number[]} array The array of instructions
 * @param {number} index The index
 * @param {number[]} immediateModeSettings The immediate mode settings
 * @return {function(): number} The read function
 */
const read = (array, index, immediateModeSettings) => handleOperation(array, index, immediateModeSettings, () => {
    const input = readlineSync.questionInt('Enter a number: ');
    return input;
});

/**
 * Generate the save function
 * @param {number[]} array The array of instructions
 * @param {number} index The index
 * @param {number[]} immediateModeSettings The immediate mode settings
 * @return {function(number): void} The save function
 */
const save = (array, index, immediateModeSettings) => handleOperation(array, index, immediateModeSettings, (operand1) => {
    console.log(operand1);
});

/**
 * Parse the opCode for an instruction
 * @param {number} instruction The instruction to parse
 * @return {(number|number[])} The opCode an immediate mode settings
 */
const parseOpcode = (instruction) => {
    if (instruction < 100) {
        return [instruction, []];
    }
    const instructionStr = instruction.toString();
    const opCode = parseInt(instructionStr.slice(-2));

    const immediateModeSettings = instructionStr
        .substr(0, instructionStr.length - 2)
        .split('')
        .reverse()
        .map((x) => x === '1');

    return [opCode, immediateModeSettings];
};

/**
 * Parse the instruction at a given index
 * @param {number[]} array The instruction list
 * @param {number} index The index to parse
 * @return {(boolean|number)[]} Whether to stop, and the number to step
 */
const parseInstruction = (array, index) => {
    const [opCode, immediateModeSettings] = parseOpcode(array[index]);

    switch (opCode) {
        case 1:
            add(array, index, immediateModeSettings);
            return [false, 4];
        case 2:
            multiply(array, index, immediateModeSettings);
            return [false, 4];
        case 3:
            read(array, index, immediateModeSettings);
            return [false, 2];
        case 4:
            save(array, index, immediateModeSettings);
            return [false, 2];
        case 99:
        default:
            return [true, 1];
    }
};

/**
 * Parse an array of instructions to completion
 * @param {number[]} array The array of instructions
 * @return {number[]} The final resulting array
 */
const parseArray = (array) => {
    const result = [...array];
    let index = 0;
    while (index < result.length) {
        const [shouldBreak, step] = parseInstruction(result, index);
        if (shouldBreak) {
            break;
        }
        index += step;
    }
    return result;
};

module.exports = parseArray;

if (require.main === module) {
    const readFileToArray = require('../../utils/read-file').readFileToArray;
    const input = readFileToArray('day5input.txt', ',');
    parseArray(input);
}
