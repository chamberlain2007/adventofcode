const {UP, DOWN, RIGHT, LEFT} = require('./constants');

/**
 * Get the required turns and the new direction to achieve the column and row changes
 * @param {number} columnDiff The column movement
 * @param {number} rowDiff The row movement
 * @param {number} currentDirection The current direction
 * @return {any[]} The required turns and the new direction
 */
const getPathAndDirection = (columnDiff, rowDiff, currentDirection) => {
    if (columnDiff === 1) {
        if (currentDirection === LEFT) {
            return [['R', 'R'], RIGHT];
        } else if (currentDirection === UP) {
            return [['R'], RIGHT];
        } else if (currentDirection === DOWN) {
            return [['L'], RIGHT];
        }
        return [[], RIGHT];
    } else if (columnDiff === -1) {
        if (currentDirection === RIGHT) {
            return [['L', 'L'], LEFT];
        } else if (currentDirection === UP) {
            return [['L'], LEFT];
        } else if (currentDirection === DOWN) {
            return [['R'], LEFT];
        }
        return [[], LEFT];
    } else if (rowDiff === 1) {
        if (currentDirection === UP) {
            return [['R', 'R'], DOWN];
        } else if (currentDirection === RIGHT) {
            return [['R'], DOWN];
        } else if (currentDirection === LEFT) {
            return [['L'], DOWN];
        }
        return [[], DOWN];
    } else if (rowDiff === -1) {
        if (currentDirection === DOWN) {
            return [['L', 'L'], UP];
        } else if (currentDirection === LEFT) {
            return [['R'], UP];
        } else if (currentDirection === RIGHT) {
            return [['L'], UP];
        }
        return [[], UP];
    }
};

module.exports = getPathAndDirection;
