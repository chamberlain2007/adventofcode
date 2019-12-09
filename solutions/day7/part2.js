const generatePermutations = require('../../utils/generate-permutations');

/**
 * Represents an opCode with immediate mode settings
 * @param {number} opCode The opCode
 * @param {number[]} immediateModeSettings The immediate mode settings
 */
const OpCodeParsingResult = class {
    /**
     * Default constructor
     * @param {number} opCode The opCode
     * @param {number[]} immediateModeSettings The immediate mode settings
     */
    constructor(opCode, immediateModeSettings) {
        this.opCode = opCode;
        this.immediateModeSettings = immediateModeSettings;
    }
};

/**
 * Represents the results of an instruction
 * @param {boolean} shouldBreak Whether the computer should break execution
 * @param {number} step The number of pointers to step
 */
const InstructionParsingResult = class {
    /**
     * Default constructor
     * @param {boolean} shouldBreak Whether the computer should break execution
     * @param {number} step The number of pointers to step
     */
    constructor(shouldBreak, step) {
        this.shouldBreak = shouldBreak;
        this.step = step;
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
            99: [],
        };
    }

    /**
     * Retrieves the operands for an instruction.
     * @param {number} startIndex The index of the instruction to retrieve the operands for
     * @param {number[]} immediateModeSettings The immediate mode settings for the instruction
     * @param {number} parameterCount The number of parameters for the instruction
     * @return {number[]} The operands in the instruction
     */
    getOperands(startIndex, immediateModeSettings, parameterCount) {
        const operands = [];

        for (let i = 0; i < parameterCount; i++) {
            let operand = 0;
            const immediateMode = !!immediateModeSettings[i];
            if (immediateMode) {
                operand = this.activeInstructionList[startIndex+i+1];
            } else {
                const location = this.activeInstructionList[startIndex+i+1];
                operand = this.activeInstructionList[location];
            }
            operands.push(operand);
        }
        return operands;
    }

    /**
     * Generate a function for a jump operation.
     * @param {function(...number): number} operation The operation to execute which returns the number of steps to move.
     * @return {function(number, number[]): number} The number of steps to jump
     */
    jumpOperation(operation) {
        return (startIndex, immediateModeSettings) => {
            const operands = this.getOperands(startIndex, immediateModeSettings, operation.length);
            const newIndex = operation.apply(this, operands);
            if (newIndex === undefined) {
                return operation.length+1;
            } else {
                return newIndex - startIndex;
            }
        };
    }

    /**
     * Generate a normal operation which returns a value.
     * @param {function(...number): number} operation The operation to execute which returns a value
     * @return {function(number, number[]): number} The returned value of the operation
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
        };
    }

    /**
     * Add two operands
     * @return {function(...number): number} The add function
     */
    add() {
        return this.normalOperation((operand1, operand2) => operand1 + operand2);
    }

    /**
     * Multiply two operands
     * @return {function(...number): number} The multiply function
     */
    multiply() {
        return this.normalOperation((operand1, operand2) => operand1 * operand2);
    }

    /**
     * Read a value from stdin
     * @return {function(...number): number} The read function
     */
    read() {
        return this.normalOperation(() => this.stdin());
    }

    /**
     * Write a value to stdout
     * @return {function(...number): number} The save function
     */
    save() {
        return this.normalOperation((operand1) => this.stdout(operand1));
    }

    /**
     * Compare two operands, returning 1 if the first is less than the second, otherwise 0
     * @return {function(...number): number} The less than function
     */
    lessThan() {
        return this.normalOperation((operand1, operand2) => operand1 < operand2 ? 1 : 0);
    }

    /**
     * Compare two operands, returning 1 if the two are equal, otherwise 0
     * @return {function(...number): number} The equals function
     */
    equals() {
        return this.normalOperation((operand1, operand2) => operand1 === operand2 ? 1 : 0);
    }

    /**
     * If the first operand isn't 0, jump by the second operand
     * @return {function(...number): number} The jump function
     */
    jumpIfTrue() {
        return this.jumpOperation((operand1, operand2) => operand1 !== 0 ? operand2 : undefined);
    }

    /**
     * If the first operand is 0, jump by the second operand
     * @return {function(...number): number} The jump function
     */
    jumpIfFalse() {
        return this.jumpOperation((operand1, operand2) => operand1 === 0 ? operand2 : undefined);
    }

    /**
     * Parse an instruction into its opCode and list of immediate mode settings
     * @param {number} instruction The instruction to parse
     * @return {OpCodeParsingResult} The opCode and list of immediate mode settings
     */
    parseOpCode(instruction) {
        if (instruction < 100) {
            return new OpCodeParsingResult(instruction, []);
        }
        const instructionStr = instruction.toString();
        const opCode = parseInt(instructionStr.slice(-2));
        const immediateModeSettings = instructionStr.substr(0, instructionStr.length - 2).split('').reverse().map((x) => x === '1');
        return new OpCodeParsingResult(opCode, immediateModeSettings);
    }

    /**
     * Parse the instruction in the instruction list at the given index
     * @param {number} index The instruction index
     * @return {InstructionParsingResult} The results of the parsing
     */
    parseInstruction(index) {
        const parsedOpCode = this.parseOpCode(this.activeInstructionList[index]);
        const instruction = this.operations[parsedOpCode.opCode] || [];
        const [operation, skip] = instruction;

        if (!operation) {
            return new InstructionParsingResult(true, 1);
        }

        const result = operation(index, parsedOpCode.immediateModeSettings);

        return new InstructionParsingResult(false, skip === undefined ? result : skip);
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
            const parseInstructionResult = this.parseInstruction(this.index);
            if (parseInstructionResult.shouldBreak) {
                break;
            }
            this.index += parseInstructionResult.step;
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
 * @param {number[]} instructionList The instruction list
 */
const AmplifierCircuit = class {
    /**
     * Default constructor
     * @param {number[]} phaseSettings The initial values to pass to the computers
     * @param {number[]} instructionList The instruction list
     */
    constructor(phaseSettings, instructionList) {
        this.phaseSettings = phaseSettings;
        this.instructionList = instructionList;
    }

    /**
     * Run the amplifier circuit
     * @param {number} input The initial value to pass to the first computer
     * @return {number} The thrust output value
     */
    run(input) {
        let currentValue = input;
        const computers = this.phaseSettings.map((phaseSetting) => {
            let hasUsedPhaseSetting = false;
            const computer = new Computer(
                () => {
                    if (!hasUsedPhaseSetting) {
                        hasUsedPhaseSetting = true;
                        return phaseSetting;
                    } else {
                        return currentValue;
                    }
                },
                (val) => {
                    computer.pause();
                    currentValue = val;
                },
                this.instructionList,
            );
            return computer;
        });

        let isRound1 = true;

        while (true) {
            const previousCurrentValue = currentValue;
            computers.forEach((computer) => {
                if (isRound1) {
                    computer.runFromBeginning();
                } else {
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

const readFileToArray = require('../../utils/read-file').readFileToArray;
const instructionList = readFileToArray('amplifiercircuitinput.txt', ',');

let maxThrustOutput = 0;
let bestPhaseSettings = [];

generatePermutations([5, 6, 7, 8, 9]).forEach((phaseSettings) => {
    const amplifierCircuit = new AmplifierCircuit(phaseSettings, instructionList);
    const thrustOutput = amplifierCircuit.run(0);

    if (thrustOutput > maxThrustOutput) {
        maxThrustOutput = thrustOutput;
        bestPhaseSettings = phaseSettings;
    }
});

console.log(maxThrustOutput, bestPhaseSettings);
