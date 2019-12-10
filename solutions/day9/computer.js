const resizeArray = require('../../utils/resize-array');

const POSITION_MODE = 0;
const IMMEDIATE_MODE = 1;
const RELATIVE_MODE = 2;

const HALT_OPCODE = 99;

/**
 * Represents an opCode with immediate mode settings
 * @param {number} opCode The opCode
 * @param {number[]} modeSettings The mode settings
 */
const OpCodeParsingResult = class {
    /**
     * Default constructor
     * @param {number} opCode The opCode
     * @param {number[]} modeSettings The mode settings
     */
    constructor(opCode, modeSettings) {
        this.opCode = opCode;
        this.modeSettings = modeSettings;
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
        this.relativeBase = 0;

        this.operations = {
            1: [this.add(), 4],
            2: [this.multiply(), 4],
            3: [this.read(), 2],
            4: [this.save(), 2],
            5: [this.jumpIfTrue()],
            6: [this.jumpIfFalse()],
            7: [this.lessThan(), 4],
            8: [this.equals(), 4],
            9: [this.adjustRelativeBase(), 2],
        };
    }

    /**
     * Retrieves the operands for an instruction.
     * @param {number} startIndex The index of the instruction to retrieve the operands for
     * @param {number[]} modeSettings The immediate mode settings for the instruction
     * @param {number} parameterCount The number of parameters for the instruction
     * @return {number[]} The operands in the instruction
     */
    getOperands(startIndex, modeSettings, parameterCount) {
        const operands = [];

        for (let i = 0; i < parameterCount; i++) {
            let operand = 0;
            const mode = i >= modeSettings.length ? 0 : modeSettings[i];

            switch (mode) {
                case POSITION_MODE:
                    const location0 = this.activeInstructionList[startIndex+i+1];
                    operand = this.activeInstructionList[location0];
                    break;
                case IMMEDIATE_MODE:
                    operand = this.activeInstructionList[startIndex+i+1];
                    break;
                case RELATIVE_MODE:
                    const location2 = this.relativeBase + this.activeInstructionList[startIndex+i+1];
                    operand = this.activeInstructionList[location2];
                    break;
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
        return (startIndex, modeSettings) => {
            const operands = this.getOperands(startIndex, modeSettings, operation.length);
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
        return (startIndex, modeSettings) => {
            const operands = this.getOperands(startIndex, modeSettings, operation.length);
            const result = operation.apply(this, operands);
            if (result === undefined) {
                return operation.length+1;
            }
            const resultIndexModeSetting = modeSettings.slice(-1)[0];
            let resultIndex = this.activeInstructionList[startIndex+operation.length+1];
            if (resultIndexModeSetting === RELATIVE_MODE) {
                resultIndex += this.relativeBase;
            }
            if (resultIndex >= this.activeInstructionList.length) {
                this.activeInstructionList = resizeArray(this.activeInstructionList, resultIndex + 1, 0);
            }
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
        return (startIndex, modeSettings) => {
            let resultIndex = this.activeInstructionList[startIndex+1];
            if (modeSettings[0] === RELATIVE_MODE) {
                resultIndex += this.relativeBase;
            }
            const result = this.stdin();
            if (resultIndex >= this.activeInstructionList.length) {
                this.activeInstructionList = resizeArray(this.activeInstructionList, resultIndex + 1, 0);
            }
            this.activeInstructionList[resultIndex] = result;
            return 2;
        };
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
     * Modify the relative base by the operand
     * @return {function(...number): number} The adjust function
     */
    adjustRelativeBase() {
        return this.normalOperation((operand1) => {
            this.relativeBase += operand1;
            return undefined;
        });
    }

    /**
     * Parse an instruction into its opCode and list of immediate mode settings
     * @param {number} instruction The instruction to parse
     * @return {OpCodeParsingResult} The opCode and list of immediate mode settings
     */
    parseOpCode(instruction) {
        const instructionStr = instruction.toString();
        const opCode = parseInt(instructionStr.slice(-2));
        let modeSettings = instructionStr.substr(0, instructionStr.length - 2).split('').reverse().map((x) => parseInt(x));

        let [, requiredModeSettingCount] = this.operations[opCode] || [];
        if (requiredModeSettingCount === undefined) {
            requiredModeSettingCount = 2;
        }
        requiredModeSettingCount--;

        modeSettings = resizeArray(modeSettings, requiredModeSettingCount, 0);

        if (instruction < 100) {
            return new OpCodeParsingResult(instruction, []);
        }

        return new OpCodeParsingResult(opCode, modeSettings);
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

        if (!operation || parsedOpCode.opCode === HALT_OPCODE) {
            return new InstructionParsingResult(true, 1);
        }

        const result = operation(index, parsedOpCode.modeSettings);

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

module.exports = Computer;
