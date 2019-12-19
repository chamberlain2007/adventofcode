/**
 * Check if a location is an intersection
 * @param {Array.<string[]>} memory The vacuum memory
 * @param {number} rowIndex The row to check
 * @param {number} columnIndex The column to check
 * @return {boolean} Whether the location is an intersection
 */
const isIntersection = (memory, rowIndex, columnIndex) => {
    return rowIndex > 0 &&
        rowIndex < memory.length - 1 &&
        columnIndex > 0 &&
        columnIndex < memory[rowIndex].length - 1 &&
        memory[rowIndex][columnIndex] === '#' &&
        memory[rowIndex][columnIndex - 1] === '#' &&
        memory[rowIndex][columnIndex + 1] === '#' &&
        memory[rowIndex - 1][columnIndex] === '#' &&
        memory[rowIndex + 1][columnIndex] === '#';
};

module.exports = isIntersection;
