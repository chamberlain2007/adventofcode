const Computer = require('./computer');
const generatePermutations = require('../../utils/generate-permutations');

/**
 * Represents the amplifier circuit in which there are 5 computers where
 * the output of the first 4 are connected, and the last is the thrust output
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
        for (let i = 0; i < this.phaseSettings.length; i++) {
            const phaseSetting = this.phaseSettings[i];
            let inputCount = 0;
            const computer = new Computer(
                () => {
                    if (inputCount++ === 0) {
                        return phaseSetting;
                    } else {
                        return currentValue;
                    }
                },
                (val) => {
                    currentValue = val;
                },
                this.instructionList,
            );
            computer.run();
        }
        return currentValue;
    }
};

const {readFileToArray} = require('../../utils/read-file');
const instructionList = readFileToArray('amplifiercircuitinput.txt', ',');

let maxThrustOutput = 0;
let bestPhaseSettings = [];

generatePermutations([0, 1, 2, 3, 4]).forEach((phaseSettings)=> {
    const amplifierCircuit = new AmplifierCircuit(phaseSettings, instructionList);
    const thrustOutput = amplifierCircuit.run(0);

    if (thrustOutput > maxThrustOutput) {
        maxThrustOutput = thrustOutput;
        bestPhaseSettings = phaseSettings;
    }
});

console.log(maxThrustOutput, bestPhaseSettings);
