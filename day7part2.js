/**
 * Represents an opCode with immediate mode settings
 * @param {number} opCode The opCode
 * @param {number[]} immediateModeSettings The immediate mode settings
 */
const ParsedOpCode = class {
    constructor(opCode, immediateModeSettings) {
        this.opCode = opCode;
        this.immediateModeSettings = immediateModeSettings;
    }
};

/**
 * A class representing a computer.
 * @param {function(): number} stdin A function for retrieving a value from the input
 * @param {function(number): void} stdout A function for writing a value to the output
 * @param {number[]} instructionList A list of instructions
 */
const Computer = class {
    /**
     * Default constructor
     * @param {function(): number} stdin A function for retrieving a value from the input
     * @param {function(number): void} stdout A function for writing a value to the output
     * @param {number[]} instructionList A list of instructions
     */
    constructor(stdin, stdout, instructionList) {
        this.stdin = stdin;
        this.stdout = stdout;
        this.instructionList = instructionList;
        this.activeInstructionList = [...instructionList];
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

    /**
     * Retrieves the operands for an instruction.
     * @param {number} startIndex The index of the instruction to retrieve the operands for
     * @param {number[]} immediateModeSettings The immediate mode settings for the instruction
     * @param {number} parameterCount The number of parameters for the instruction
     * @returns {number[]} The operands in the instruction
     */
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

    /**
     * Generate a function for a jump operation.
     * @param {function(...number): number} operation The operation to execute which returns the number of steps to move.
     * @returns {function(number, number[]): number} The number of steps to jump
     */
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
    
    /**
     * Generate a normal operation which returns a value.
     * @param {function(...number): number} operation The operation to execute which returns a value
     * @returns {function(number, number[]): number} The returned value of the operation
     */
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
    
    /**
     * Add two operands
     */
    add() {
        return this.normalOperation((operand1, operand2) => operand1 + operand2);
    }
    
    /**
     * Multiply two operands
     */
    multiply() {
        return this.normalOperation((operand1, operand2) => operand1 * operand2);
    }
    
    /**
     * Read a value from stdin
     */
    read() {
        return this.normalOperation(() => this.stdin());
    }
    
    /**
     * Write a value to stdout
     */
    save() {
        return this.normalOperation(operand1 => this.stdout(operand1));
    }
    
    /**
     * Compare two operands, returning 1 if the first is less than the second, otherwise 0
     */
    lessThan() {
        return this.normalOperation((operand1, operand2) => operand1 < operand2 ? 1 : 0);
    }
    
    /**
     * Compare two operands, returning 1 if the two are equal, otherwise 0
     */
    equals() {
        return this.normalOperation((operand1, operand2) => operand1 === operand2 ? 1 : 0);
    }
    
    /**
     * If the first operand isn't 0, jump by the second operand
     */
    jumpIfTrue() {
        return this.jumpOperation((operand1, operand2) => operand1 !== 0 ? operand2 : undefined);
    }
    
    /**
     * If the first operand is 0, jump by the second operand
     */
    jumpIfFalse() {
        return this.jumpOperation((operand1, operand2) => operand1 === 0 ? operand2 : undefined);
    }

    /**
     * Parse an instruction into its opCode and list of immediate mode settings
     * @param {number} instruction The instruction to parse
     * @returns {ParsedOpCode} The opCode and list of immediate mode settings
     */
    parseOpCode(instruction) {
        if (instruction < 100) {
            return new ParsedOpCode(instruction, []);
        }
        const instructionStr = instruction.toString();
        const opCode = parseInt(instructionStr.slice(-2));
        const immediateModeSettings = instructionStr.substr(0, instructionStr.length - 2).split('').reverse().map(x => x === '1');
        return new ParsedOpCode(opCode, immediateModeSettings);
    }

    /**
     * Parse the instruction in the instruction list at the given index
     * @param {number} index The instruction index
     */
    parseInstruction(index) {
        const parsedOpCode = this.parseOpCode(this.activeInstructionList[index]);
        const instruction = this.operations[parsedOpCode.opCode] || [];
        const [operation, skip] = instruction;
    
        if (!operation) {
            return [true, 1];
        }
    
        const result = operation(index, parsedOpCode.immediateModeSettings);
    
        return [false, skip === undefined ? result : skip];
    }

    /**
     * Run the computer from the current instruction index
     */
    run() {
        this.running = true;

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

    /**
     * Reset the computer and run from the beginning
     */
    runFromBeginning() {
        this.activeInstructionList = [...this.instructionList];
        this.run();
    }

    /**
     * Pause the execution of the computer at its current state
     */
    pause() {
        this.running = false;
    }
};

/**
 * Represents the amplifier circuit in which there are 5 computers where
 * the output of the first 4 are connected, and the last is connected to the
 * first.
 * @param {number[]} phaseSettings The initial values to pass to the computers
 */
const AmplifierCircuit = class {
    /**
     * Default constructor
     * @param {number[]} phaseSettings The initial values to pass to the computers
     */
    constructor(phaseSettings) {
        this.phaseSettings = phaseSettings;
        this.instructionList = [3,8,1001,8,10,8,105,1,0,0,21,42,51,60,77,94,175,256,337,418,99999,3,9,1001,9,4,9,102,5,9,9,1001,9,3,9,102,5,9,9,4,9,99,3,9,102,2,9,9,4,9,99,3,9,1001,9,3,9,4,9,99,3,9,101,4,9,9,1002,9,4,9,101,5,9,9,4,9,99,3,9,1002,9,5,9,101,3,9,9,102,2,9,9,4,9,99,3,9,1001,9,1,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,1,9,9,4,9,99,3,9,1001,9,2,9,4,9,3,9,101,1,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,1,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,1002,9,2,9,4,9,99,3,9,101,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,101,2,9,9,4,9,99,3,9,101,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,1,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,1,9,9,4,9,3,9,102,2,9,9,4,9,3,9,101,2,9,9,4,9,99,3,9,1001,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,1,9,9,4,9,99];
    }

    /**
     * Run the amplifier circuit
     * @param {number} input The initial value to pass to the first computer
     * @returns {number} The thrust output value
     */
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

        let isRound1 = true;

        while (true) {
            const previousCurrentValue = currentValue;
            computers.forEach(computer => {
                if (isRound1) {
                    computer.runFromBeginning();
                }
                else {
                    computer.run();
                }
            });
            if (currentValue === previousCurrentValue) {
                break;
            }
            isRound1 = false;
        }

        return currentValue;
    }
};

/**
 * Generate all of the permutations of a list of numbers
 * @param {number[]} options The numbers to permute
 * @param {number=} k The current k value (for Heap's algorithm, used internally)
 * @returns {number[][]} The list of permutations
 */
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