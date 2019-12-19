/**
 * Compress an array of rotations and individual steps. For example,
 * R11111L11R11L111 -> R5L2R2L3
 * @param {any[]} path The path
 * @return {any[]} The compressed path
 */
const compressPath = (path) => {
    const finalPath = [];
    let stepCount = 0;

    path.forEach((current, index) => {
        if (Number.isInteger(current)) {
            stepCount++;
        } else {
            if (stepCount > 0) {
                finalPath.push(stepCount);
                stepCount = 0;
            }
            finalPath.push(current);
        }

        if (index === path.length - 1) {
            finalPath.push(stepCount);
        }
    });

    return finalPath;
};

module.exports = compressPath;
