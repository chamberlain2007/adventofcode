/**
 * Print out a two dimensional array
 * @param {Array.<number[]>} array
 * @param {function(number): string} getOutputValue
 */
const outputArray = (array, getOutputValue) => {
    for (let i = 0; i < array.length; i++) {
        const row = array[i];
        for (let j = 0; j < row.length; j++) {
            const value = row[j];
            const outputValue = getOutputValue(value);
            process.stdout.write(outputValue);
        }
        process.stdout.write('\n');
    }
};

module.exports = outputArray;
