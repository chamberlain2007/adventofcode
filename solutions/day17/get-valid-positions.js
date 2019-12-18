const getValidPositions = (memory, rowIndex, columnIndex) => {
    const validPositions = [];
    if (rowIndex > 0 && memory[rowIndex - 1][columnIndex] === '#') {
        validPositions.push([-1, 0]);
    }
    if (rowIndex < memory.length - 1 && memory[rowIndex + 1][columnIndex] === '#') {
        validPositions.push([1, 0]);
    }
    if (columnIndex > 0 && memory[rowIndex][columnIndex - 1] === '#') {
        validPositions.push([0, -1]);
    }
    if (columnIndex < memory[rowIndex].length - 1 && memory[rowIndex][columnIndex + 1] === '#') {
        validPositions.push([0, 1]);
    }
    return validPositions;
};

module.exports = getValidPositions;