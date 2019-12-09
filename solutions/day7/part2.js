const Computer = require('./computer');
const generatePermutations = require('../../utils/generate-permutations');

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
