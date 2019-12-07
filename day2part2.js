const handleOperation = (array, index, operation) => {
    const location1 = array[index+1];
    const operand1 = array[location1];
    const location2 = array[index+2];
    const operand2 = array[location2];
    const result = operation(operand1, operand2);
    const resultIndex = array[index+3];
    array[resultIndex] = result;
};

const add = (array, index) => handleOperation(array, index, (operand1, operand2) => operand1 + operand2);

const multiply = (array, index) => handleOperation(array, index, (operand1, operand2) => operand1 * operand2);

const parseOpCode = (array, index) => {
    const opCode = array[index];
    switch(opCode) {
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
}

let testArray = [1,0,0,3,1,1,2,3,1,3,4,3,1,5,0,3,2,10,1,19,1,19,9,23,1,23,13,27,1,10,27,31,2,31,13,35,1,10,35,39,2,9,39,43,2,43,9,47,1,6,47,51,1,10,51,55,2,55,13,59,1,59,10,63,2,63,13,67,2,67,9,71,1,6,71,75,2,75,9,79,1,79,5,83,2,83,13,87,1,9,87,91,1,13,91,95,1,2,95,99,1,99,6,0,99,2,14,0,0];

testArray[1] = 12;
testArray[2] = 2;

const maxAttempt = 100;
const targetValue = 19690720;

for (let i = 1; i < maxAttempt; i++) {
    for (let j = 1; j < maxAttempt; j++) {
        let testArrayClone = [...testArray];
        testArrayClone[1] = i;
        testArrayClone[2] = j;
        let resultArray = parseArray(testArrayClone);
        let result = resultArray[0];

        if (result === targetValue) {
            console.log(i, j, 100 * i + j);
            return;
        }
    }
}