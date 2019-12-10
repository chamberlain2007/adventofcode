/**
 * Resize an array. Taken from https://stackoverflow.com/a/32055229/2507211
 * @param {any[]} arr The array to resize
 * @param {number} newSize The new size
 * @param {any} defaultValue The default value to fill
 * @return The resized array
 */
const resize = (arr, newSize, defaultValue) => {
    return [ ...arr, ...Array(Math.max(newSize - arr.length, 0)).fill(defaultValue)];
}

module.exports = resize;