const readlineSync = require('readline-sync');

const getOperands = (instructionList, startIndex, immediateModeSettings, parameterCount) => {
    const operands = [];
    for (let i = 0; i < parameterCount; i++) {
        let operand = 0;
        let immediateMode = !!immediateModeSettings[i];
        if (immediateMode) {
            operand = instructionList[startIndex+i+1];
        }
        else {
            let location = instructionList[startIndex+i+1];
            operand = instructionList[location];
        }
        operands.push(operand);
    }
    return operands;
}

const jumpOperation = operation => (instructionList, startIndex, immediateModeSettings) => {
    const operands = getOperands(instructionList, startIndex, immediateModeSettings, operation.length);
    const newIndex = operation.apply(null, operands);
    if (newIndex === undefined) {
        return operation.length+1;
    }
    else {
        return newIndex - startIndex;
    }
};

const normalOperation = operation => (instructionList, startIndex, immediateModeSettings) => {
    const operands = getOperands(instructionList, startIndex, immediateModeSettings, operation.length);
    const result = operation.apply(null, operands);
    if (result === undefined) {
        return operation.length+1;
    }
    const resultIndex = instructionList[startIndex+operation.length+1];
    instructionList[resultIndex] = result;
    return operation.length+1;
};

const add = normalOperation((operand1, operand2) => operand1 + operand2);

const multiply = normalOperation((operand1, operand2) => operand1 * operand2);

const read = normalOperation(() => readlineSync.questionInt("Enter a number: "));

const save = normalOperation(operand1 => console.log(operand1));

const lessThan = normalOperation((operand1, operand2) => operand1 < operand2 ? 1 : 0);

const equals = normalOperation((operand1, operand2) => operand1 === operand2 ? 1 : 0);

const jumpIfTrue = jumpOperation((operand1, operand2) => operand1 !== 0 ? operand2 : undefined);

const jumpIfFalse = jumpOperation((operand1, operand2) => operand1 === 0 ? operand2 : undefined);

const parseOpCode = instruction => {
    if (instruction < 100) {
        return [instruction, []];
    }
    const instructionStr = instruction.toString();
    const opCode = parseInt(instructionStr.slice(-2));
    const immediateModeSettings = instructionStr.substr(0, instructionStr.length - 2).split('').reverse().map(x => x === '1');
    return [opCode, immediateModeSettings];
};

const operations = {
    1: [add, 4],
    2: [multiply, 4],
    3: [read, 2],
    4: [save, 2],
    5: [jumpIfTrue],
    6: [jumpIfFalse],
    7: [lessThan, 4],
    8: [equals, 4],
    99: []
}

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

const parseInstructionList = instructionList => {
    const newInstructionList = [...instructionList];
    let index = 0;
    while (index < newInstructionList.length) {
        let [shouldBreak, step] = parseInstruction(newInstructionList, index);
        if (shouldBreak) {
            break;
        }
        index += step;
    }
    return newInstructionList;
}

let instructionList = [3,225,1,225,6,6,1100,1,238,225,104,0,1101,90,64,225,1101,15,56,225,1,14,153,224,101,-147,224,224,4,224,1002,223,8,223,1001,224,3,224,1,224,223,223,2,162,188,224,101,-2014,224,224,4,224,1002,223,8,223,101,6,224,224,1,223,224,223,1001,18,81,224,1001,224,-137,224,4,224,1002,223,8,223,1001,224,3,224,1,223,224,223,1102,16,16,224,101,-256,224,224,4,224,1002,223,8,223,1001,224,6,224,1,223,224,223,101,48,217,224,1001,224,-125,224,4,224,1002,223,8,223,1001,224,3,224,1,224,223,223,1002,158,22,224,1001,224,-1540,224,4,224,1002,223,8,223,101,2,224,224,1,223,224,223,1101,83,31,225,1101,56,70,225,1101,13,38,225,102,36,192,224,1001,224,-3312,224,4,224,1002,223,8,223,1001,224,4,224,1,224,223,223,1102,75,53,225,1101,14,92,225,1101,7,66,224,101,-73,224,224,4,224,102,8,223,223,101,3,224,224,1,224,223,223,1101,77,60,225,4,223,99,0,0,0,677,0,0,0,0,0,0,0,0,0,0,0,1105,0,99999,1105,227,247,1105,1,99999,1005,227,99999,1005,0,256,1105,1,99999,1106,227,99999,1106,0,265,1105,1,99999,1006,0,99999,1006,227,274,1105,1,99999,1105,1,280,1105,1,99999,1,225,225,225,1101,294,0,0,105,1,0,1105,1,99999,1106,0,300,1105,1,99999,1,225,225,225,1101,314,0,0,106,0,0,1105,1,99999,7,226,677,224,1002,223,2,223,1005,224,329,1001,223,1,223,1007,226,677,224,1002,223,2,223,1005,224,344,101,1,223,223,108,226,226,224,1002,223,2,223,1006,224,359,101,1,223,223,7,226,226,224,102,2,223,223,1005,224,374,101,1,223,223,8,677,677,224,1002,223,2,223,1005,224,389,1001,223,1,223,107,677,677,224,102,2,223,223,1006,224,404,101,1,223,223,1107,677,226,224,102,2,223,223,1006,224,419,1001,223,1,223,1008,226,226,224,1002,223,2,223,1005,224,434,1001,223,1,223,7,677,226,224,102,2,223,223,1006,224,449,1001,223,1,223,1107,226,226,224,1002,223,2,223,1005,224,464,101,1,223,223,1108,226,677,224,102,2,223,223,1005,224,479,101,1,223,223,1007,677,677,224,102,2,223,223,1006,224,494,1001,223,1,223,1107,226,677,224,1002,223,2,223,1005,224,509,101,1,223,223,1007,226,226,224,1002,223,2,223,1006,224,524,101,1,223,223,107,226,226,224,1002,223,2,223,1005,224,539,1001,223,1,223,1108,677,677,224,1002,223,2,223,1005,224,554,101,1,223,223,1008,677,226,224,102,2,223,223,1006,224,569,1001,223,1,223,8,226,677,224,102,2,223,223,1005,224,584,1001,223,1,223,1008,677,677,224,1002,223,2,223,1006,224,599,1001,223,1,223,108,677,677,224,102,2,223,223,1006,224,614,1001,223,1,223,108,226,677,224,102,2,223,223,1005,224,629,101,1,223,223,8,677,226,224,102,2,223,223,1005,224,644,101,1,223,223,107,677,226,224,1002,223,2,223,1005,224,659,101,1,223,223,1108,677,226,224,102,2,223,223,1005,224,674,1001,223,1,223,4,223,99,226];
//let instructionList = [3,9,8,9,10,9,4,9,99,-1,8];

parseInstructionList(instructionList);