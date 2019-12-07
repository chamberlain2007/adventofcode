const readlineSync = require('readline-sync');

const Computer = class {
    constructor(stdin, stdout, instructionList) {
        this.stdin = stdin;
        this.stdout = stdout;
        this.instructionList = instructionList;
        this.running = false;
        this.index = 0;

        this.operations = {
            1: [this.add(), 4],
            2: [this.multiply(), 4],
            3: [this.read(), 2],
            4: [this.save(), 2],
            5: [this.jumpIfTrue()],
            6: [this.jumpIfFalse()],
            7: [this.lessThan(), 4],
            8: [this.equals(), 4],
            99: []
        };
    }

    getOperands(startIndex, immediateModeSettings, parameterCount) {
        const operands = [];

        for (let i = 0; i < parameterCount; i++) {
            let operand = 0;
            let immediateMode = !!immediateModeSettings[i];
            if (immediateMode) {
                operand = this.activeInstructionList[startIndex+i+1];
            }
            else {
                let location = this.activeInstructionList[startIndex+i+1];
                operand = this.activeInstructionList[location];
            }
            operands.push(operand);
        }
        return operands;
    }

    jumpOperation(operation) {
        return (startIndex, immediateModeSettings) => {
            const operands = this.getOperands(startIndex, immediateModeSettings, operation.length);
            const newIndex = operation.apply(this, operands);
            if (newIndex === undefined) {
                return operation.length+1;
            }
            else {
                return newIndex - startIndex;
            }
        }
    }
    
    normalOperation(operation) {
        return (startIndex, immediateModeSettings) => {
            const operands = this.getOperands(startIndex, immediateModeSettings, operation.length);
            const result = operation.apply(this, operands);
            if (result === undefined) {
                return operation.length+1;
            }
            const resultIndex = this.activeInstructionList[startIndex+operation.length+1];
            this.activeInstructionList[resultIndex] = result;
            return operation.length+1;
        }
    }
    
    add() {
        return this.normalOperation((operand1, operand2) => operand1 + operand2);
    }
    
    multiply() {
        return this.normalOperation((operand1, operand2) => operand1 * operand2);
    }
    
    read() {
        return this.normalOperation(() => this.stdin());
    }
    
    save() {
        return this.normalOperation(operand1 => this.stdout(operand1));
    }
    
    lessThan() {
        return this.normalOperation((operand1, operand2) => operand1 < operand2 ? 1 : 0);
    }
    
    equals() {
        return this.normalOperation((operand1, operand2) => operand1 === operand2 ? 1 : 0);
    }
    
    jumpIfTrue() {
        return this.jumpOperation((operand1, operand2) => operand1 !== 0 ? operand2 : undefined);
    }
    
    jumpIfFalse() {
        return this.jumpOperation((operand1, operand2) => operand1 === 0 ? operand2 : undefined);
    }

    parseOpCode(instruction) {
        if (instruction < 100) {
            return [instruction, []];
        }
        const instructionStr = instruction.toString();
        const opCode = parseInt(instructionStr.slice(-2));
        const immediateModeSettings = instructionStr.substr(0, instructionStr.length - 2).split('').reverse().map(x => x === '1');
        return [opCode, immediateModeSettings];
    }

    parseInstruction(index) {
        const [opCode, immediateModeSettings] = this.parseOpCode(this.activeInstructionList[index]);
        const instruction = this.operations[opCode] || [];
        const [operation, skip] = instruction;
    
        if (!operation) {
            return [true, 1];
        }
    
        const result = operation(index, immediateModeSettings);
    
        return [false, skip === undefined ? result : skip];
    }

    run() {
        this.running = true;
        this.activeInstructionList = [...this.instructionList];

        while (this.index < this.activeInstructionList.length) {
            if (!this.running) {
                break;
            }
            let [shouldBreak, step] = this.parseInstruction(this.index);
            if (shouldBreak) {
                break;
            }
            this.index += step;
        }
    }

    pause() {
        this.running = false;
    }
};

const AmplifierCircuit = class {
    constructor(phaseSettings) {
        this.phaseSettings = phaseSettings;
        this.instructionList = [3,8,1001,8,10,8,105,1,0,0,21,42,51,60,77,94,175,256,337,418,99999,3,9,1001,9,4,9,102,5,9,9,1001,9,3,9,102,5,9,9,4,9,99,3,9,102,2,9,9,4,9,99,3,9,1001,9,3,9,4,9,99,3,9,101,4,9,9,1002,9,4,9,101,5,9,9,4,9,99,3,9,1002,9,5,9,101,3,9,9,102,2,9,9,4,9,99,3,9,1001,9,1,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,1,9,9,4,9,99,3,9,1001,9,2,9,4,9,3,9,101,1,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,1,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,1002,9,2,9,4,9,99,3,9,101,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,101,2,9,9,4,9,99,3,9,101,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,1,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,1,9,9,4,9,3,9,102,2,9,9,4,9,3,9,101,2,9,9,4,9,99,3,9,1001,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,1,9,9,4,9,99];
    }

    run(input) {
        let currentValue = input;
        const computers = this.phaseSettings.map(phaseSetting => {
            let hasUsedPhaseSetting = false;
            const computer = new Computer(
                () => {
                    if (!hasUsedPhaseSetting) {
                        hasUsedPhaseSetting = true;
                        return phaseSetting;
                    }
                    else {
                        return currentValue;
                    }
                },
                val => {
                    computer.pause();
                    currentValue = val;
                },
                this.instructionList
            );
            return computer;
        });

        while (true) {
            const previousCurrentValue = currentValue;
            computers.forEach(computer => {
                computer.run();
            });
            if (currentValue === previousCurrentValue) {
                break;
            }
        }

        return currentValue;
    }
};

const generatePermutations = (options, k) => {
    if (k === 1) {
        return [[...options]];
    }

    k = k || options.length;

    let results = generatePermutations(options, k - 1);

    for (let i = 0; i < k - 1; i++) {
        if (k % 2 === 0) {
            [options[i], options[k-1]] = [options[k-1], options[i]];
        }
        else {
            [options[0], options[k-1]] = [options[k-1], options[0]];
        }

        Array.prototype.push.apply(results, generatePermutations(options, k - 1));
    }

    return results;
};

let maxThrustOutput = 0;
let bestPhaseSettings = [];

generatePermutations([5,6,7,8,9]).forEach(phaseSettings => {
    let amplifierCircuit = new AmplifierCircuit(phaseSettings);
    let thrustOutput = amplifierCircuit.run(0);

    if (thrustOutput > maxThrustOutput) {
        maxThrustOutput = thrustOutput;
        bestPhaseSettings = phaseSettings;
    }
});

console.log(maxThrustOutput, bestPhaseSettings);