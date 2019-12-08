/**
 * Handle the operation at a given index
 * @param {number[]} array The array of instructions
 * @param {number} index The index to handle
 * @param {function(number,number): number} operation The operation
 */
const handleOperation = (array, index, operation) => {
    const location1 = array[index+1];
    const operand1 = array[location1];
    const location2 = array[index+2];
    const operand2 = array[location2];
    const result = operation(operand1, operand2);
    const resultIndex = array[index+3];
    array[resultIndex] = result;
};

/**
 * Generate the add function
 * @param {number[]} array The array of instructions
 * @param {number} index The index to add
 * @return {function(number,number): number} The add function
 */
const add = (array, index) => handleOperation(array, index, (operand1, operand2) => operand1 + operand2);

/**
 * Generate the multiply function
 * @param {number[]} array The array of instructions
 * @param {number} index The index to multiply
 * @return {function(number,number): number} The multiply function
 */
const multiply = (array, index) => handleOperation(array, index, (operand1, operand2) => operand1 * operand2);

/**
 * Parse the opCode at a given index
 * @param {number[]} array The array of instructions
 * @param {number} index The index to parse
 * @return {boolean} Whether the computer should stop
 */
const parseOpCode = (array, index) => {
    const opCode = array[index];
    switch (opCode) {
        case 1:
            add(array, index);
            return false;
        case 2:
            multiply(array, index);
            return false;
        case 99:
            return true;
        default:
            return false;
    }
};

/**
 * Parse the array of instructions
 * @param {number[]} array The array of instructions
 * @return {number[]} The computed value based on the instructions in the array
 */
const parseArray = (array) => {
    const result = [...array];
    let index = 0;
    while (index < result.length) {
        if (parseOpCode(result, index)) {
            break;
        }
        index += 4;
    }
    return result;
};

module.exports = parseArray;

if (require.main === module) {
    const readFileToArray = require('../../utils/read-file').readFileToArray;
    const testArray = readFileToArray('day2input.txt', ',');

    testArray[1] = 12;
    testArray[2] = 2;
    const resultArray = parseArray(testArray);

    console.log(resultArray[0]);
}
