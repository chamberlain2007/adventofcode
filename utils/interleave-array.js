const interleaveArray = function* (array, interleave) {
    for (let i = 0; i < array.length; i++) {
        yield array[i];
        if (i < array.length - 1) {
            yield interleave;
        }
    }
};

module.exports = interleaveArray;