const readlineSync = require('readline-sync');

/**
 * Get the operands for an instruction
 * @param {number[]} instructionList The list of instructions
 * @param {number} startIndex The start index of the instruction
 * @param {number[]} immediateModeSettings The immediate mode settings
 * @param {number} parameterCount The number of parameters
 * @return {number[]} The operands
 */
const getOperands = (instructionList, startIndex, immediateModeSettings, parameterCount) => {
    const operands = [];
    for (let i = 0; i < parameterCount; i++) {
        let operand = 0;
        const immediateMode = !!immediateModeSettings[i];
        if (immediateMode) {
            operand = instructionList[startIndex+i+1];
        } else {
            const location = instructionList[startIndex+i+1];
            operand = instructionList[location];
        }
        operands.push(operand);
    }
    return operands;
};

/**
 * Handle a jump operation, in which an inner operation returns the number
 * to step
 * @param {function(...number): number} operation The operation to execute
 * @return {number} The number to step
 */
const jumpOperation = (operation) => (instructionList, startIndex, immediateModeSettings) => {
    const operands = getOperands(instructionList,
        startIndex,
        immediateModeSettings,
        operation.length,
    );

    const newIndex = operation(...operands);
    if (newIndex === undefined) {
        return operation.length+1;
    } else {
        return newIndex - startIndex;
    }
};

/**
 * Handle a normal operation
 * @param {function(...number): number} operation The operation to execute
 * @return {number} The number to step
 */
const normalOperation = (operation) => (instructionList, startIndex, immediateModeSettings) => {
    const operands = getOperands(instructionList,
        startIndex,
        immediateModeSettings,
        operation.length,
    );

    const result = operation(...operands);
    if (result === undefined) {
        return operation.length+1;
    }
    const resultIndex = instructionList[startIndex+operation.length+1];
    instructionList[resultIndex] = result;
    return operation.length+1;
};

const add = normalOperation((operand1, operand2) => operand1 + operand2);

const multiply = normalOperation((operand1, operand2) => operand1 * operand2);

const read = normalOperation(() => readlineSync.questionInt('Enter a number: '));

const save = normalOperation((operand1) => console.log(operand1));

const lessThan = normalOperation((operand1, operand2) => operand1 < operand2 ? 1 : 0);

const equals = normalOperation((operand1, operand2) => operand1 === operand2 ? 1 : 0);

const jumpIfTrue = jumpOperation((operand1, operand2) => operand1 !== 0 ? operand2 : undefined);

const jumpIfFalse = jumpOperation((operand1, operand2) => operand1 === 0 ? operand2 : undefined);

const operations = {
    1: [add, 4],
    2: [multiply, 4],
    3: [read, 2],
    4: [save, 2],
    5: [jumpIfTrue],
    6: [jumpIfFalse],
    7: [lessThan, 4],
    8: [equals, 4],
    99: [],
};

/**
 * Parse the opCode for an instruction
 * @param {number} instruction The instruction to parse
 * @return {(number|number[])} The opCode an immediate mode settings
 */
const parseOpCode = (instruction) => {
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
 * @param {number[]} instructionList The instruction list
 * @param {number} index The index to parse
 * @return {(boolean|number)[]} Whether to stop, and the number to step
 */
const parseInstruction = (instructionList, index) => {
    const [opCode, immediateModeSettings] = parseOpCode(instructionList[index]);
    const instruction = operations[opCode] || [];
    const [operation, skip] = instruction;

    if (!operation) {
        return [true, 1];
    }

    const result = operation(instructionList, index, immediateModeSettings);

    return [false, skip === undefined ? result : skip];
};

/**
 * Parse a list of instructions to completion
 * @param {number[]} instructionList The list of instructions
 * @return {number[]} The final resulting array
 */
const parseInstructionList = (instructionList) => {
    const newInstructionList = [...instructionList];
    let index = 0;
    while (index < newInstructionList.length) {
        const [shouldBreak, step] = parseInstruction(newInstructionList, index);
        if (shouldBreak) {
            break;
        }
        index += step;
    }
    return newInstructionList;
};

if (require.main === module) {
    const readFile = require('../../utils/read-file');
    const input = readFile('day5input.txt', ',');
    parseInstructionList(input);
}
