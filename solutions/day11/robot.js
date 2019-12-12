const Computer = require('./computer');

const BLACK = 0;
const WHITE = 1;
const UNPAINTED = 2;

const TURN_LEFT = 0;
const TURN_RIGHT = 1;

const COLOR_WRITE_MODE = 0;
const DIRECTION_WRITE_MODE = 1;

/**
 * Represents an emergency hull painting robot
 */
const Robot = class {
    /**
     * Default constructor
     */
    constructor() {
        const {readFileToArray} = require('../../utils/read-file');
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
            if (val !== BLACK && val !== WHITE) {
                val = BLACK;
            }
            return val;
        };

        let writeMode = COLOR_WRITE_MODE;

        this.brain.stdout = (val) => {
            if (writeMode === COLOR_WRITE_MODE) {
                memory[currentY][currentX] = val;

                writeMode = DIRECTION_WRITE_MODE;
            } else if (writeMode === DIRECTION_WRITE_MODE) {
                if (val === TURN_LEFT) {
                    direction -= 90;
                } else if (val === TURN_RIGHT) {
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
                    const newArray = new Array(memory[0].length).fill(UNPAINTED);
                    memory.unshift(newArray);
                    currentY++;
                } else if (currentY >= memory.length) {
                    const newArray = new Array(memory[0].length).fill(UNPAINTED);
                    memory.push(newArray);
                }

                if (currentX < 0) {
                    memory.forEach((array) => {
                        array.unshift(UNPAINTED);
                    });
                    currentX++;
                } else if (currentX >= memory[0].length) {
                    memory.forEach((array) => {
                        array.push(UNPAINTED);
                    });
                }

                writeMode = COLOR_WRITE_MODE;
            }
        };

        this.brain.run();

        return memory;
    }
};

module.exports = Robot;
