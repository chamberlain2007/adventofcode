const readlineSync = require('readline-sync');

const handleOperation = (array, index, immediateModeSettings, operation) => {
    const parameterCount = operation.length;
    const parameters = [];
    for (let i = 0; i < parameterCount; i++) {
        let operand = 0;
        let immediateMode = i < immediateModeSettings.length ? immediateModeSettings[i] : false;
        if (immediateMode) {
            operand = array[index+i+1];
        }
        else {
            let location = array[index+i+1];
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

const add = (array, index, immediateModeSettings) => handleOperation(array, index, immediateModeSettings, (operand1, operand2) => operand1 + operand2);

const multiply = (array, index, immediateModeSettings) => handleOperation(array, index, immediateModeSettings, (operand1, operand2) => operand1 * operand2);

const read = (array, index, immediateModeSettings) => handleOperation(array, index, immediateModeSettings, () => {
    let input = readlineSync.questionInt("Enter a number: ");
    return input;
});

const save = (array, index, immediateModeSettings) => handleOperation(array, index, immediateModeSettings, operand1 => {
    console.log(operand1);
    return undefined;
});

const parseOpcode = instruction => {
    if (instruction < 100) {
        return [instruction, []];
    }
    const instructionStr = instruction.toString();
    const opCode = parseInt(instructionStr.slice(-2));
    const immediateModeSettings = instructionStr.substr(0, instructionStr.length - 2).split('').reverse().map(x => x === '1');
    return [opCode, immediateModeSettings];
};

const parseInstruction = (array, index) => {
    const [opCode, immediateModeSettings] = parseOpcode(array[index]);

    switch(opCode) {
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

const parseArray = (array) => {
    const result = [...array];
    let index = 0;
    while (index < result.length) {
        let [shouldBreak, step] = parseInstruction(result, index);
        if (shouldBreak) {
            break;
        }
        index += step;
    }
    return result;
}

let testArray = [3,225,1,225,6,6,1100,1,238,225,104,0,1101,90,64,225,1101,15,56,225,1,14,153,224,101,-147,224,224,4,224,1002,223,8,223,1001,224,3,224,1,224,223,223,2,162,188,224,101,-2014,224,224,4,224,1002,223,8,223,101,6,224,224,1,223,224,223,1001,18,81,224,1001,224,-137,224,4,224,1002,223,8,223,1001,224,3,224,1,223,224,223,1102,16,16,224,101,-256,224,224,4,224,1002,223,8,223,1001,224,6,224,1,223,224,223,101,48,217,224,1001,224,-125,224,4,224,1002,223,8,223,1001,224,3,224,1,224,223,223,1002,158,22,224,1001,224,-1540,224,4,224,1002,223,8,223,101,2,224,224,1,223,224,223,1101,83,31,225,1101,56,70,225,1101,13,38,225,102,36,192,224,1001,224,-3312,224,4,224,1002,223,8,223,1001,224,4,224,1,224,223,223,1102,75,53,225,1101,14,92,225,1101,7,66,224,101,-73,224,224,4,224,102,8,223,223,101,3,224,224,1,224,223,223,1101,77,60,225,4,223,99,0,0,0,677,0,0,0,0,0,0,0,0,0,0,0,1105,0,99999,1105,227,247,1105,1,99999,1005,227,99999,1005,0,256,1105,1,99999,1106,227,99999,1106,0,265,1105,1,99999,1006,0,99999,1006,227,274,1105,1,99999,1105,1,280,1105,1,99999,1,225,225,225,1101,294,0,0,105,1,0,1105,1,99999,1106,0,300,1105,1,99999,1,225,225,225,1101,314,0,0,106,0,0,1105,1,99999,7,226,677,224,1002,223,2,223,1005,224,329,1001,223,1,223,1007,226,677,224,1002,223,2,223,1005,224,344,101,1,223,223,108,226,226,224,1002,223,2,223,1006,224,359,101,1,223,223,7,226,226,224,102,2,223,223,1005,224,374,101,1,223,223,8,677,677,224,1002,223,2,223,1005,224,389,1001,223,1,223,107,677,677,224,102,2,223,223,1006,224,404,101,1,223,223,1107,677,226,224,102,2,223,223,1006,224,419,1001,223,1,223,1008,226,226,224,1002,223,2,223,1005,224,434,1001,223,1,223,7,677,226,224,102,2,223,223,1006,224,449,1001,223,1,223,1107,226,226,224,1002,223,2,223,1005,224,464,101,1,223,223,1108,226,677,224,102,2,223,223,1005,224,479,101,1,223,223,1007,677,677,224,102,2,223,223,1006,224,494,1001,223,1,223,1107,226,677,224,1002,223,2,223,1005,224,509,101,1,223,223,1007,226,226,224,1002,223,2,223,1006,224,524,101,1,223,223,107,226,226,224,1002,223,2,223,1005,224,539,1001,223,1,223,1108,677,677,224,1002,223,2,223,1005,224,554,101,1,223,223,1008,677,226,224,102,2,223,223,1006,224,569,1001,223,1,223,8,226,677,224,102,2,223,223,1005,224,584,1001,223,1,223,1008,677,677,224,1002,223,2,223,1006,224,599,1001,223,1,223,108,677,677,224,102,2,223,223,1006,224,614,1001,223,1,223,108,226,677,224,102,2,223,223,1005,224,629,101,1,223,223,8,677,226,224,102,2,223,223,1005,224,644,101,1,223,223,107,677,226,224,1002,223,2,223,1005,224,659,101,1,223,223,1108,677,226,224,102,2,223,223,1005,224,674,1001,223,1,223,4,223,99,226];

parseArray(testArray);