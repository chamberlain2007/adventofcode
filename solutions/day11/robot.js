const Computer = require('./computer');

/**
 * Represents an emergency hull painting robot
 */
const Robot = class {
    /**
     * Default constructor
     */
    constructor() {
        const readFileToArray = require('../../utils/read-file').readFileToArray;
        const brainInput = readFileToArray('braininput.txt', ',');

        this.brain = new Computer(brainInput);
    }

    /**
     * Run the painting program.
     * @param {number} initialVal The value to initialize the memory with. 0 is black,
     * 1 is white. Anything else will be read as black.
     * @return {number[]} The painting result. A two dimensional array of where the
     * robot painted, with 0 as black, 1 as white, 2 as unpainted.
     */
    run(initialVal) {
        let currentX = 0;
        let currentY = 0;
        let direction = 0;
        const memory = [[initialVal]];

        this.brain.stdin = () => {
            let val = memory[currentY][currentX];
            if (val !== 1 && val !== 0) {
                val = 0;
            }
            return val;
        };

        let writeMode = 0;

        this.brain.stdout = (val) => {
            if (writeMode === 0) {
                memory[currentY][currentX] = val;

                writeMode = 1;
            } else if (writeMode === 1) {
                if (val === 0) {
                    direction -= 90;
                } else if (val === 1) {
                    direction += 90;
                }

                if (direction < 0) {
                    direction += 360;
                }

                if (direction >= 360) {
                    direction -= 360;
                }

                switch (direction) {
                    case 0:
                        currentY--;
                        break;
                    case 90:
                        currentX++;
                        break;
                    case 180:
                        currentY++;
                        break;
                    case 270:
                        currentX--;
                        break;
                }

                if (currentY < 0) {
                    const newArray = new Array(memory[0].length).fill(2);
                    memory.unshift(newArray);
                    currentY++;
                } else if (currentY >= memory.length) {
                    const newArray = new Array(memory[0].length).fill(2);
                    memory.push(newArray);
                }

                if (currentX < 0) {
                    memory.forEach((array) => {
                        array.unshift(2);
                    });
                    currentX++;
                } else if (currentX >= memory[0].length) {
                    memory.forEach((array) => {
                        array.push(2);
                    });
                }

                writeMode = 0;
            }
        };

        this.brain.run();

        return memory;
    }
};

module.exports = Robot;
