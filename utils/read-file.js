const fs = require('fs');
const path = require('path');

/**
 * Read the contents of a file
 * @param {string} filename The filename to read from
 * @return {number[]} The contents of the file
 */
const readFile = (filename) => {
    const directory = path.dirname(require.main.filename);

    const rawContents = fs.readFileSync(path.join(directory, filename), 'utf8');

    return rawContents;
};

/**
 * Read a file to a list of raw strings
 * @param {string} filename The filename to read from
 * @param {string} delimiter The delimiter to split on
 * @return {number[]} The list of raw strings from the file
 */
const readFileToArrayRaw = (filename, delimiter) => {
    const rawContents = readFile(filename);

    return [...rawContents.split(delimiter)];
};

/**
 * Read a file to a list of numbers
 * @param {string} filename The filename to read from
 * @param {string} delimiter The delimiter to split on
 * @return {number[]} The list of numbers from the file
 */
const readFileToArray = (filename, delimiter) => {
    const rawContents = readFile(filename);

    return [...rawContents
        .split(delimiter)
        .map((val) => parseInt(val))
        .filter((val) => !isNaN(val))];
};

module.exports = {
    readFile: readFile,
    readFileToArrayRaw: readFileToArrayRaw,
    readFileToArray: readFileToArray,
};
