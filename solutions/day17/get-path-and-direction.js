const {UP, DOWN, RIGHT, LEFT} = require('./constants');

const getPathAndDirection = (columnDiff, rowDiff, currentDirection) => {
    if (columnDiff === 1) {
        if (currentDirection === LEFT) {
            return [['R', 'R'], RIGHT];
        }
        else if (currentDirection === UP) {
            return [['R'], RIGHT];
        }
        else if (currentDirection === DOWN) {
            return [['L'], RIGHT];
        }
        return [[], RIGHT];
    }
    else if (columnDiff === -1) {
        if (currentDirection === RIGHT) {
            return [['L', 'L'], LEFT];
        }
        else if (currentDirection === UP) {
            return [['L'], LEFT];
        }
        else if (currentDirection === DOWN) {
            return [['R'], LEFT];
        }
        return [[], LEFT];
    }
    else if (rowDiff === 1) {
        if (currentDirection === UP) {
            return [['R', 'R'], DOWN];
        }
        else if (currentDirection === RIGHT) {
            return [['R'], DOWN];
        }
        else if (currentDirection === LEFT) {
            return [['L'], DOWN];
        }

        return [[], DOWN];
    }
    else if (rowDiff === -1) {
        if (currentDirection === DOWN) {
            return [['L', 'L'], UP];
        }
        else if (currentDirection === LEFT) {
            return [['R'], UP];
        }
        else if (currentDirection === RIGHT) {
            return [['L'], UP];
        }
        
        return [[], UP];
    }
}

module.exports = getPathAndDirection;
