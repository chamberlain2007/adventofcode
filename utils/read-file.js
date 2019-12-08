const fs = require('fs');
const path = require('path');

/**
 * Read a file to a list of numbers
 * @param {string} filename The filename to read from
 * @param {string} delimiter The delimiter to split on
 * @return {number[]} The list of numbers from the file
 */
const readFile = (filename, delimiter) => {
    const directory = path.dirname(require.main.filename);

    return [...fs.readFileSync(path.join(directory, filename), 'utf8')
        .split(delimiter)
        .map((val) => parseInt(val))
        .filter((val) => !isNaN(val))];
};

module.exports = readFile;